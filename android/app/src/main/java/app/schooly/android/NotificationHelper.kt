package app.schooly.android

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import androidx.work.Data
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters
import java.time.LocalDate
import java.time.LocalTime
import java.util.concurrent.TimeUnit

object NotificationHelper {
    const val CHANNEL_ID = "schooly_reminders"
    private const val PREFS_NAME = "schooly_notification_prefs"
    private const val KEY_SENT_REMINDERS = "sent_reminder_keys"

    fun ensureChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val existing = nm.getNotificationChannel(CHANNEL_ID)
            if (existing == null) {
                val ch = NotificationChannel(
                    CHANNEL_ID,
                    "Klausur- & Aufgaben-Erinnerungen",
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Erinnerungen für anstehende Klausuren, Tests und Aufgaben"
                    enableVibration(true)
                    lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
                }
                nm.createNotificationChannel(ch)
            }
        }
    }

    fun hasPermission(context: Context): Boolean {
        if (!NotificationManagerCompat.from(context).areNotificationsEnabled()) {
            return false
        }
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            true
        }
    }

    fun showNotification(
        context: Context,
        title: String,
        body: String,
        targetTab: String = "planner",
        notifId: Int = (System.currentTimeMillis() % Int.MAX_VALUE).toInt()
    ): Boolean {
        if (!hasPermission(context)) return false
        ensureChannel(context)

        val tapIntent = Intent(context, MainActivity::class.java).apply {
            putExtra(MainActivity.EXTRA_TARGET_TAB, targetTab)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pi = PendingIntent.getActivity(
            context,
            notifId and 0x7FFF,
            tapIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_schooly_notif)
            .setColor(Color.parseColor("#2D694C"))
            .setContentTitle(title.ifBlank { "Schooly" })
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .setAutoCancel(true)
            .setContentIntent(pi)
            .build()

        return try {
            NotificationManagerCompat.from(context).notify(notifId, notification)
            true
        } catch (_: SecurityException) {
            false
        }
    }

    fun scheduleTestNotification(
        context: Context,
        title: String,
        body: String,
        delayMs: Long
    ): Boolean {
        if (!hasPermission(context)) return false
        ensureChannel(context)

        if (delayMs <= 250L) {
            return showNotification(context, title, body, "planner", 4040)
        }

        val input = Data.Builder()
            .putString(TestNotificationWorker.KEY_TITLE, title)
            .putString(TestNotificationWorker.KEY_BODY, body)
            .putString(TestNotificationWorker.KEY_TAB, "planner")
            .build()

        val req = OneTimeWorkRequestBuilder<TestNotificationWorker>()
            .setInitialDelay(delayMs, TimeUnit.MILLISECONDS)
            .setInputData(input)
            .build()

        WorkManager.getInstance(context.applicationContext).enqueue(req)
        return true
    }

    fun maybeTriggerDueReminders(context: Context, summary: SchoolyWidgetSummary) {
        if (!summary.isSignedIn || !summary.reminders.enabled) return
        if (!hasPermission(context)) return

        val parts = summary.reminders.time.split(":")
        val rh = parts.getOrNull(0)?.toIntOrNull() ?: 18
        val rm = parts.getOrNull(1)?.toIntOrNull() ?: 0
        val nowTime = LocalTime.now()
        val reminderMoment = LocalTime.of(rh.coerceIn(0, 23), rm.coerceIn(0, 59))
        if (nowTime.isBefore(reminderMoment)) return

        val todayStr = LocalDate.now().toString()
        val prefs = context.applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val sentSet = (prefs.getStringSet(KEY_SENT_REMINDERS, emptySet()) ?: emptySet())
            .filter { it.endsWith("_$todayStr") }
            .toMutableSet()

        var changed = false
        val candidates = mutableListOf<ExamWidgetData>()
        summary.nextExam?.let { candidates.add(it) }
        for (row in summary.tasks.items) {
            if (row.type == "Klausur" || row.type == "Test") {
                if (candidates.none { it.title == row.title && it.daysUntil == row.daysUntil }) {
                    candidates.add(
                        ExamWidgetData(
                            id = row.id,
                            title = row.title,
                            type = row.type,
                            subjectName = row.subjectName,
                            dateFormatted = row.dateFormatted,
                            daysUntil = row.daysUntil,
                            countdownLabel = row.dueLabel
                        )
                    )
                }
            }
        }

        for (exam in candidates) {
            if (exam.daysUntil !in 0..summary.reminders.daysBefore) continue
            val dedupeKey = "${exam.id.ifBlank { exam.title }}_$todayStr"
            if (sentSet.contains(dedupeKey)) continue

            val dayLabel = when {
                exam.daysUntil <= 0 -> "heute"
                exam.daysUntil == 1 -> "morgen"
                else -> "in ${exam.daysUntil} Tagen"
            }
            val subjPrefix = if (exam.subjectName.isNotBlank()) "${exam.type}: ${exam.subjectName}" else exam.type
            val body = "${exam.title} — $dayLabel"
            val notifId = ("exam_" + dedupeKey).hashCode()
            if (showNotification(context, subjPrefix, body, "planner", notifId)) {
                sentSet.add(dedupeKey)
                changed = true
            }
        }

        if (changed) {
            prefs.edit().putStringSet(KEY_SENT_REMINDERS, sentSet).apply()
        }
    }
}

class TestNotificationWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : Worker(appContext, workerParams) {

    override fun doWork(): Result {
        val title = inputData.getString(KEY_TITLE) ?: "Schooly Test-Push"
        val body = inputData.getString(KEY_BODY) ?: "Benachrichtigungen auf diesem Gerät funktionieren!"
        val tab = inputData.getString(KEY_TAB) ?: "planner"
        NotificationHelper.showNotification(applicationContext, title, body, tab, 4041)
        return Result.success()
    }

    companion object {
        const val KEY_TITLE = "notif_title"
        const val KEY_BODY = "notif_body"
        const val KEY_TAB = "notif_tab"
    }
}
