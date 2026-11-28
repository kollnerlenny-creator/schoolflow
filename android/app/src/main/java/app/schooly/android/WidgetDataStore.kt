package app.schooly.android

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import org.json.JSONObject

data class AverageWidgetData(
    val hasGrades: Boolean = false,
    val displayValue: String = "–",
    val unitLabel: String = "Pkt.",
    val secondaryLabel: String = "Schooly",
    val halfYear: String = ""
)

data class ExamWidgetData(
    val title: String = "",
    val type: String = "Klausur",
    val subjectName: String = "",
    val dateFormatted: String = "",
    val daysUntil: Int = 0,
    val countdownLabel: String = ""
)

data class TaskRowData(
    val title: String = "",
    val subjectName: String = "",
    val dueLabel: String = "",
    val dateFormatted: String = ""
)

data class TasksWidgetData(
    val openCount: Int = 0,
    val items: List<TaskRowData> = emptyList()
)

data class SchoolyWidgetSummary(
    val isSignedIn: Boolean = false,
    val average: AverageWidgetData = AverageWidgetData(),
    val nextExam: ExamWidgetData? = null,
    val tasks: TasksWidgetData = TasksWidgetData(),
    val updatedHm: String = ""
)

object WidgetDataStore {
    private const val PREFS_NAME = "schooly_widget_store"
    private const val KEY_API_URL = "api_url"
    private const val KEY_TOKEN = "widget_token"
    private const val KEY_SUMMARY_JSON = "summary_json"
    private const val KEY_SIGNED_IN = "signed_in"

    private fun prefs(context: Context) =
        context.applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun saveFullBridgePayload(context: Context, rawPayloadJson: String) {
        try {
            val obj = JSONObject(rawPayloadJson)
            val apiUrl = obj.optString("apiUrl", "").trim()
            val token = obj.optString("token", "").trim()
            val summaryObj = obj.optJSONObject("summary")

            val editor = prefs(context).edit()
            if (apiUrl.startsWith("https://")) {
                editor.putString(KEY_API_URL, apiUrl)
            }
            if (token.isNotEmpty()) {
                editor.putString(KEY_TOKEN, token)
            }
            if (summaryObj != null) {
                editor.putString(KEY_SUMMARY_JSON, summaryObj.toString())
            }
            editor.putBoolean(KEY_SIGNED_IN, true)
            editor.apply()

            updateAllWidgets(context)
        } catch (_: Exception) {
        }
    }

    fun saveSummaryOnly(context: Context, summaryJson: String) {
        if (summaryJson.isBlank()) return
        try {
            val validated = JSONObject(summaryJson).toString()
            prefs(context).edit()
                .putString(KEY_SUMMARY_JSON, validated)
                .putBoolean(KEY_SIGNED_IN, true)
                .apply()
            updateAllWidgets(context)
        } catch (_: Exception) {
        }
    }

    fun clearTokenOnly(context: Context) {
        prefs(context).edit()
            .remove(KEY_TOKEN)
            .apply()
    }

    fun clearAll(context: Context) {
        prefs(context).edit()
            .remove(KEY_TOKEN)
            .remove(KEY_SUMMARY_JSON)
            .putBoolean(KEY_SIGNED_IN, false)
            .apply()
        updateAllWidgets(context)
    }

    fun getApiUrl(context: Context): String {
        val stored = prefs(context).getString(KEY_API_URL, "") ?: ""
        return if (stored.startsWith("https://")) stored else "${BuildConfig.SCHOOLY_APP_URL}/api/widget-summary"
    }

    fun getToken(context: Context): String =
        prefs(context).getString(KEY_TOKEN, "") ?: ""

    fun loadSummary(context: Context): SchoolyWidgetSummary {
        val p = prefs(context)
        val signedIn = p.getBoolean(KEY_SIGNED_IN, false)
        val rawJson = p.getString(KEY_SUMMARY_JSON, "") ?: ""
        if (!signedIn || rawJson.isBlank()) {
            return SchoolyWidgetSummary(isSignedIn = false)
        }

        return try {
            val root = JSONObject(rawJson)
            val avgObj = root.optJSONObject("average")
            val average = if (avgObj != null) {
                AverageWidgetData(
                    hasGrades = avgObj.optBoolean("hasGrades", false),
                    displayValue = avgObj.optString("displayValue", "–"),
                    unitLabel = avgObj.optString("unitLabel", "Pkt."),
                    secondaryLabel = avgObj.optString("secondaryLabel", "Schooly"),
                    halfYear = avgObj.optString("halfYear", "")
                )
            } else {
                AverageWidgetData()
            }

            val examObj = root.optJSONObject("nextExam")
            val nextExam = if (examObj != null && !root.isNull("nextExam")) {
                ExamWidgetData(
                    title = examObj.optString("title", "Klausur"),
                    type = examObj.optString("type", "Klausur"),
                    subjectName = examObj.optString("subjectName", ""),
                    dateFormatted = examObj.optString("dateFormatted", ""),
                    daysUntil = examObj.optInt("daysUntil", 0),
                    countdownLabel = examObj.optString("countdownLabel", "")
                )
            } else {
                null
            }

            val tasksObj = root.optJSONObject("tasks")
            val taskItems = mutableListOf<TaskRowData>()
            if (tasksObj != null) {
                val arr = tasksObj.optJSONArray("items")
                if (arr != null) {
                    for (i in 0 until minOf(arr.length(), 4)) {
                        val item = arr.optJSONObject(i) ?: continue
                        taskItems.add(
                            TaskRowData(
                                title = item.optString("title", "Aufgabe"),
                                subjectName = item.optString("subjectName", ""),
                                dueLabel = item.optString("dueLabel", ""),
                                dateFormatted = item.optString("dateFormatted", "")
                            )
                        )
                    }
                }
            }
            val tasks = TasksWidgetData(
                openCount = tasksObj?.optInt("openCount", taskItems.size) ?: 0,
                items = taskItems
            )

            SchoolyWidgetSummary(
                isSignedIn = true,
                average = average,
                nextExam = nextExam,
                tasks = tasks,
                updatedHm = root.optString("updatedHm", "")
            )
        } catch (_: Exception) {
            SchoolyWidgetSummary(isSignedIn = signedIn)
        }
    }

    fun updateAllWidgets(context: Context) {
        val appContext = context.applicationContext
        val manager = AppWidgetManager.getInstance(appContext)

        val avgIds = manager.getAppWidgetIds(ComponentName(appContext, GradeAverageWidgetProvider::class.java))
        if (avgIds.isNotEmpty()) {
            GradeAverageWidgetProvider.updateWidgets(appContext, manager, avgIds)
        }

        val examIds = manager.getAppWidgetIds(ComponentName(appContext, ExamCountdownWidgetProvider::class.java))
        if (examIds.isNotEmpty()) {
            ExamCountdownWidgetProvider.updateWidgets(appContext, manager, examIds)
        }

        val taskIds = manager.getAppWidgetIds(ComponentName(appContext, TasksWidgetProvider::class.java))
        if (taskIds.isNotEmpty()) {
            TasksWidgetProvider.updateWidgets(appContext, manager, taskIds)
        }
    }

    fun openTabPendingIntent(context: Context, tab: String, requestCode: Int): PendingIntent {
        val intent = Intent(context, MainActivity::class.java).apply {
            putExtra(MainActivity.EXTRA_TARGET_TAB, tab)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        return PendingIntent.getActivity(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    fun refreshPendingIntent(context: Context, requestCode: Int): PendingIntent {
        val intent = Intent(context, WidgetRefreshReceiver::class.java).apply {
            action = WidgetRefreshReceiver.ACTION_REFRESH_WIDGETS
        }
        return PendingIntent.getBroadcast(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }
}
