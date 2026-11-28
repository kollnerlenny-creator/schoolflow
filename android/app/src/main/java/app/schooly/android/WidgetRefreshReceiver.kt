package app.schooly.android

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class WidgetRefreshReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        if (intent?.action == ACTION_REFRESH_WIDGETS) {
            WidgetSyncWorker.triggerImmediate(context)
        }
    }

    companion object {
        const val ACTION_REFRESH_WIDGETS = "app.schooly.android.ACTION_REFRESH_WIDGETS"
    }
}
