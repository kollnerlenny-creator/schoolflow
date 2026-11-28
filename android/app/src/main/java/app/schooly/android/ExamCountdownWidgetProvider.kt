package app.schooly.android

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews

class ExamCountdownWidgetProvider : AppWidgetProvider() {

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
        fun updateWidgets(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
            val data = WidgetDataStore.loadSummary(context)
            val theme = WidgetTheme.forMode(context, data.colorMode)
            val openPlanner = WidgetDataStore.openTabPendingIntent(context, "planner", 102)
            val refreshPi = WidgetDataStore.refreshPendingIntent(context, 202)

            for (appWidgetId in appWidgetIds) {
                val views = RemoteViews(context.packageName, R.layout.widget_exam_countdown)

                // Dynamic Schooly theme (light / evening / dim / dark)
                views.setInt(R.id.widget_exam_root, "setBackgroundResource", theme.cardBgRes)
                views.setInt(R.id.exam_badge_text, "setBackgroundResource", theme.peachBadgeRes)
                views.setInt(R.id.exam_info_box, "setBackgroundResource", theme.rowBgRes)
                views.setInt(R.id.exam_refresh_btn, "setColorFilter", theme.textMuted)

                views.setTextColor(R.id.exam_badge_text, theme.peachText)
                views.setTextColor(R.id.exam_days_text, theme.accent)
                views.setTextColor(R.id.exam_countdown_sub, theme.textMuted)
                views.setTextColor(R.id.exam_title_text, theme.textPrimary)
                views.setTextColor(R.id.exam_meta_text, theme.accent)

                if (!data.isSignedIn) {
                    views.setTextViewText(R.id.exam_badge_text, "Klausur")
                    views.setTextViewText(R.id.exam_days_text, "–")
                    views.setTextViewText(R.id.exam_countdown_sub, "Nicht verknüpft")
                    views.setTextViewText(R.id.exam_title_text, context.getString(R.string.widget_login_hint))
                    views.setTextViewText(R.id.exam_meta_text, "Tippen zum Anmelden")
                } else {
                    val exam = data.nextExam
                    if (exam == null) {
                        views.setTextViewText(R.id.exam_badge_text, "Klausuren")
                        views.setTextViewText(R.id.exam_days_text, "0")
                        views.setTextViewText(R.id.exam_countdown_sub, "Keine offen")
                        views.setTextViewText(R.id.exam_title_text, "Alles frei")
                        views.setTextViewText(R.id.exam_meta_text, "Keine kommende Klausur")
                    } else {
                        val daysStr = if (exam.daysUntil <= 0) "Heute" else "${exam.daysUntil}"
                        val subStr = when {
                            exam.daysUntil <= 0 -> "Heute fällig"
                            exam.daysUntil == 1 -> "Tag übrig"
                            else -> "Tage übrig"
                        }
                        if (exam.daysUntil <= 1) {
                            views.setTextColor(R.id.exam_days_text, theme.urgent)
                        }
                        val subjLabel = exam.subjectName.ifBlank { exam.type }
                        val meta = listOf(subjLabel, exam.dateFormatted).filter { it.isNotBlank() }.joinToString(" · ")

                        views.setTextViewText(R.id.exam_badge_text, exam.type)
                        views.setTextViewText(R.id.exam_days_text, daysStr)
                        views.setTextViewText(R.id.exam_countdown_sub, subStr)
                        views.setTextViewText(R.id.exam_title_text, exam.title)
                        views.setTextViewText(R.id.exam_meta_text, meta)
                    }
                }

                views.setOnClickPendingIntent(R.id.widget_exam_root, openPlanner)
                views.setOnClickPendingIntent(R.id.exam_refresh_btn, refreshPi)
                appWidgetManager.updateAppWidget(appWidgetId, views)
            }
        }
    }
}
