package app.schooly.android

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
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
            val openSubjects = WidgetDataStore.openTabPendingIntent(context, "subjects", 101)
            val refreshPi = WidgetDataStore.refreshPendingIntent(context, 201)

            for (appWidgetId in appWidgetIds) {
                val views = RemoteViews(context.packageName, R.layout.widget_grade_average)

                if (!data.isSignedIn) {
                    views.setTextViewText(R.id.avg_header_title, "Schnitt")
                    views.setTextViewText(R.id.avg_value_text, "–")
                    views.setTextViewText(R.id.avg_unit_text, "")
                    views.setTextViewText(R.id.avg_secondary_text, context.getString(R.string.widget_login_hint))
                } else {
                    val hy = if (data.average.halfYear.isNotBlank()) "Schnitt · ${data.average.halfYear}" else "Schnitt"
                    views.setTextViewText(R.id.avg_header_title, hy)
                    views.setTextViewText(R.id.avg_value_text, data.average.displayValue)
                    views.setTextViewText(R.id.avg_unit_text, if (data.average.hasGrades) data.average.unitLabel else "")
                    views.setTextViewText(
                        R.id.avg_secondary_text,
                        if (data.average.hasGrades) data.average.secondaryLabel else "Noch keine Noten"
                    )
                }

                views.setOnClickPendingIntent(R.id.widget_avg_root, openSubjects)
                views.setOnClickPendingIntent(R.id.avg_refresh_btn, refreshPi)
                appWidgetManager.updateAppWidget(appWidgetId, views)
            }
        }
    }
}
