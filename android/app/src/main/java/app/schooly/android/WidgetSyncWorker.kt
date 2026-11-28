package app.schooly.android

import android.content.Context
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.TimeUnit

class WidgetSyncWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : Worker(appContext, workerParams) {

    override fun doWork(): Result {
        val token = WidgetDataStore.getToken(applicationContext)
        if (token.isBlank()) {
            WidgetDataStore.updateAllWidgets(applicationContext)
            return Result.success()
        }

        val apiUrl = WidgetDataStore.getApiUrl(applicationContext)
        if (!apiUrl.startsWith("https://")) {
            return Result.failure()
        }

        var conn: HttpURLConnection? = null
        return try {
            conn = (URL(apiUrl).openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                connectTimeout = 10000
                readTimeout = 10000
                useCaches = false
                setRequestProperty("X-Widget-Token", token)
                setRequestProperty("Accept", "application/json")
            }
            val status = conn.responseCode
            if (status == HttpURLConnection.HTTP_UNAUTHORIZED) {
                WidgetDataStore.clearTokenOnly(applicationContext)
                WidgetDataStore.updateAllWidgets(applicationContext)
                return Result.failure()
            }
            if (status !in 200..299) {
                return Result.retry()
            }

            val body = BufferedReader(InputStreamReader(conn.inputStream)).use { it.readText() }
            val json = JSONObject(body)
            val summary = json.optJSONObject("summary")
            if (summary != null) {
                WidgetDataStore.saveSummaryOnly(applicationContext, summary.toString())
                NotificationHelper.maybeTriggerDueReminders(
                    applicationContext,
                    WidgetDataStore.loadSummary(applicationContext)
                )
            }
            Result.success()
        } catch (_: Exception) {
            Result.retry()
        } finally {
            conn?.disconnect()
        }
    }

    companion object {
        private const val PERIODIC_WORK_NAME = "schooly_widget_periodic_sync"
        private const val IMMEDIATE_WORK_NAME = "schooly_widget_immediate_sync"

        fun schedulePeriodic(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val req = PeriodicWorkRequestBuilder<WidgetSyncWorker>(30, TimeUnit.MINUTES)
                .setConstraints(constraints)
                .build()

            WorkManager.getInstance(context.applicationContext).enqueueUniquePeriodicWork(
                PERIODIC_WORK_NAME,
                ExistingPeriodicWorkPolicy.KEEP,
                req
            )
        }

        fun triggerImmediate(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val req = OneTimeWorkRequestBuilder<WidgetSyncWorker>()
                .setConstraints(constraints)
                .build()

            WorkManager.getInstance(context.applicationContext).enqueueUniqueWork(
                IMMEDIATE_WORK_NAME,
                ExistingWorkPolicy.REPLACE,
                req
            )
        }
    }
}
