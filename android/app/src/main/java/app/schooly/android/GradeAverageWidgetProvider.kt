package app.schooly.android

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.view.View
import android.widget.RemoteViews

class GradeAverageWidgetProvider : AppWidgetProvider() {

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
            val openSubjects = WidgetDataStore.openTabPendingIntent(context, "subjects", 101)
            val refreshPi = WidgetDataStore.refreshPendingIntent(context, 201)

            for (appWidgetId in appWidgetIds) {
                val views = RemoteViews(context.packageName, R.layout.widget_grade_average)

                // Dynamic Schooly theme (light / evening / dim / dark)
                views.setInt(R.id.widget_avg_root, "setBackgroundResource", theme.cardBgRes)
                views.setInt(R.id.avg_halfyear_badge, "setBackgroundResource", theme.accentBadgeRes)
                views.setInt(R.id.avg_footer_box, "setBackgroundResource", theme.rowBgRes)
                views.setInt(R.id.avg_refresh_btn, "setColorFilter", theme.textMuted)

                views.setTextColor(R.id.avg_header_title, theme.textPrimary)
                views.setTextColor(R.id.avg_halfyear_badge, theme.accent)
                views.setTextColor(R.id.avg_value_text, theme.accent)
                views.setTextColor(R.id.avg_unit_text, theme.textMuted)
                views.setTextColor(R.id.avg_secondary_text, theme.textPrimary)
                views.setTextColor(R.id.avg_subjects_text, theme.accent)

                if (!data.isSignedIn) {
                    views.setTextViewText(R.id.avg_header_title, "Schnitt")
                    views.setViewVisibility(R.id.avg_halfyear_badge, View.GONE)
                    views.setTextViewText(R.id.avg_value_text, "–")
                    views.setTextViewText(R.id.avg_unit_text, "")
                    views.setTextViewText(R.id.avg_secondary_text, context.getString(R.string.widget_login_hint))
                    views.setTextViewText(R.id.avg_subjects_text, "")
                } else {
                    views.setTextViewText(R.id.avg_header_title, "Schnitt")
                    if (data.average.halfYear.isNotBlank()) {
                        views.setViewVisibility(R.id.avg_halfyear_badge, View.VISIBLE)
                        views.setTextViewText(R.id.avg_halfyear_badge, data.average.halfYear)
                    } else {
                        views.setViewVisibility(R.id.avg_halfyear_badge, View.GONE)
                    }

                    views.setTextViewText(R.id.avg_value_text, data.average.displayValue)
                    views.setTextViewText(R.id.avg_unit_text, if (data.average.hasGrades) data.average.unitLabel else "")

                    val subjCount = data.average.activeSubjectsCount
                    val subjText = if (subjCount > 0) "$subjCount ${if (subjCount == 1) "Fach" else "Fächer"}" else ""
                    if (data.average.hasGrades) {
                        val sec = data.average.secondaryLabel
                        views.setTextViewText(R.id.avg_secondary_text, sec)
                        views.setTextViewText(
                            R.id.avg_subjects_text,
                            if (sec == subjText) "" else subjText
                        )
                    } else {
                        views.setTextViewText(R.id.avg_secondary_text, "Noch keine Noten")
                        views.setTextViewText(R.id.avg_subjects_text, "")
                    }
                }

                views.setOnClickPendingIntent(R.id.widget_avg_root, openSubjects)
                views.setOnClickPendingIntent(R.id.avg_refresh_btn, refreshPi)
                appWidgetManager.updateAppWidget(appWidgetId, views)
            }
        }
    }
}
