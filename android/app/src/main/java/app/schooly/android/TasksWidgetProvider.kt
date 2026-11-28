package app.schooly.android

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.view.View
import android.widget.RemoteViews

class TasksWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        updateWidgets(context, appWidgetManager, appWidgetIds)
        WidgetSyncWorker.schedulePeriodic(context)
    }

    override fun onEnabled(context: Context) {
        super.onEnabled(context)
        WidgetSyncWorker.schedulePeriodic(context)
        WidgetSyncWorker.triggerImmediate(context)
    }

    companion object {
        private val ROW_IDS = intArrayOf(R.id.task_row_1, R.id.task_row_2, R.id.task_row_3, R.id.task_row_4)
        private val DOT_IDS = intArrayOf(R.id.task_dot_1, R.id.task_dot_2, R.id.task_dot_3, R.id.task_dot_4)
        private val TITLE_IDS = intArrayOf(R.id.task_title_1, R.id.task_title_2, R.id.task_title_3, R.id.task_title_4)
        private val DUE_IDS = intArrayOf(R.id.task_due_1, R.id.task_due_2, R.id.task_due_3, R.id.task_due_4)

        fun updateWidgets(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
            val data = WidgetDataStore.loadSummary(context)
            val theme = WidgetTheme.forMode(context, data.colorMode)
            val openTasks = WidgetDataStore.openTabPendingIntent(context, "tasks", 103)
            val addTaskPi = WidgetDataStore.openTabPendingIntent(context, "add-task", 104)
            val refreshPi = WidgetDataStore.refreshPendingIntent(context, 203)

            for (appWidgetId in appWidgetIds) {
                val views = RemoteViews(context.packageName, R.layout.widget_tasks)

                // Dynamic Schooly theme (light / evening / dim / dark)
                views.setInt(R.id.widget_tasks_root, "setBackgroundResource", theme.cardBgRes)
                views.setInt(R.id.tasks_count_badge, "setBackgroundResource", theme.accentBadgeRes)
                views.setInt(R.id.tasks_add_btn, "setColorFilter", theme.accent)
                views.setInt(R.id.tasks_refresh_btn, "setColorFilter", theme.textMuted)

                views.setTextColor(R.id.tasks_header_title, theme.textPrimary)
                views.setTextColor(R.id.tasks_count_badge, theme.accent)
                views.setTextColor(R.id.tasks_empty_text, theme.textMuted)

                for (i in ROW_IDS.indices) {
                    views.setInt(ROW_IDS[i], "setBackgroundResource", theme.rowBgRes)
                    views.setImageViewResource(DOT_IDS[i], theme.dotRes)
                    views.setInt(DUE_IDS[i], "setBackgroundResource", theme.accentBadgeRes)
                    views.setTextColor(TITLE_IDS[i], theme.textPrimary)
                    views.setTextColor(DUE_IDS[i], theme.accent)
                }

                if (!data.isSignedIn) {
                    views.setTextViewText(R.id.tasks_count_badge, "–")
                    views.setViewVisibility(R.id.tasks_empty_text, View.GONE)
                    views.setViewVisibility(R.id.tasks_list_container, View.VISIBLE)
                    views.setViewVisibility(R.id.task_row_1, View.VISIBLE)
                    views.setTextViewText(R.id.task_title_1, context.getString(R.string.widget_login_hint))
                    views.setTextViewText(R.id.task_due_1, "Tippen")
                    for (i in 1 until ROW_IDS.size) {
                        views.setViewVisibility(ROW_IDS[i], View.GONE)
                    }
                } else {
                    val items = data.tasks.items
                    views.setTextViewText(R.id.tasks_count_badge, data.tasks.openCount.toString())

                    if (items.isEmpty()) {
                        views.setViewVisibility(R.id.tasks_list_container, View.GONE)
                        views.setViewVisibility(R.id.tasks_empty_text, View.VISIBLE)
                        views.setTextViewText(R.id.tasks_empty_text, "Alles erledigt")
                    } else {
                        views.setViewVisibility(R.id.tasks_empty_text, View.GONE)
                        views.setViewVisibility(R.id.tasks_list_container, View.VISIBLE)
                        for (i in ROW_IDS.indices) {
                            if (i < items.size) {
                                val item = items[i]
                                val label = if (item.subjectName.isNotBlank()) {
                                    "${item.subjectName}: ${item.title}"
                                } else {
                                    item.title
                                }
                                val due = item.dueLabel.ifBlank { item.dateFormatted }
                                views.setViewVisibility(ROW_IDS[i], View.VISIBLE)
                                views.setTextViewText(TITLE_IDS[i], label)
                                views.setTextViewText(DUE_IDS[i], due)
                                if (item.daysUntil <= 1) {
                                    views.setTextColor(DUE_IDS[i], theme.urgent)
                                }
                            } else {
                                views.setViewVisibility(ROW_IDS[i], View.GONE)
                            }
                        }
                    }
                }

                views.setOnClickPendingIntent(R.id.widget_tasks_root, openTasks)
                views.setOnClickPendingIntent(R.id.tasks_add_btn, addTaskPi)
                views.setOnClickPendingIntent(R.id.tasks_refresh_btn, refreshPi)
                appWidgetManager.updateAppWidget(appWidgetId, views)
            }
        }
    }
}
