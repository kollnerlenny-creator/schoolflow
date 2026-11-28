package app.schooly.android

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val baseHost: String by lazy {
        Uri.parse(BuildConfig.SCHOOLY_APP_URL).host.orEmpty()
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        ViewCompat.setOnApplyWindowInsetsListener(webView) { v, insets ->
            val sysBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(sysBars.left, sysBars.top, sysBars.right, sysBars.bottom)
            insets
        }

        CookieManager.getInstance().apply {
            setAcceptCookie(true)
            setAcceptThirdPartyCookies(webView, true)
        }

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            cacheMode = WebSettings.LOAD_DEFAULT
            mediaPlaybackRequiresUserGesture = false
            setSupportMultipleWindows(false)
        }

        webView.addJavascriptInterface(SchoolyWidgetBridge(), "SchoolyAndroidWidget")
        webView.webChromeClient = WebChromeClient()
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url ?: return false
                val scheme = url.scheme?.lowercase().orEmpty()
                if (scheme != "http" && scheme != "https") {
                    openExternal(url)
                    return true
                }
                val host = url.host?.lowercase().orEmpty()
                val allowed = host == baseHost.lowercase() ||
                    host.endsWith(".firebaseapp.com") ||
                    host == "accounts.google.com" ||
                    host == "apis.google.com"
                if (!allowed) {
                    openExternal(url)
                    return true
                }
                return false
            }
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (::webView.isInitialized && webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })

        WidgetSyncWorker.schedulePeriodic(this)
        loadTargetUrl(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        loadTargetUrl(intent)
    }

    override fun onResume() {
        super.onResume()
        CookieManager.getInstance().flush()
        WidgetSyncWorker.triggerImmediate(this)
    }

    private fun loadTargetUrl(intent: Intent?) {
        val tab = intent?.getStringExtra(EXTRA_TARGET_TAB)?.trim().orEmpty()
        val url = if (tab.isNotEmpty() && tab.matches(Regex("^[a-z-]+$"))) {
            "${BuildConfig.SCHOOLY_APP_URL}/?tab=$tab"
        } else {
            BuildConfig.SCHOOLY_APP_URL
        }
        webView.loadUrl(url)
    }

    private fun openExternal(uri: Uri) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW, uri))
        } catch (_: Exception) {
        }
    }

    inner class SchoolyWidgetBridge {
        @JavascriptInterface
        fun isNativeAndroid(): Boolean = true

        @JavascriptInterface
        fun syncWidgetData(payloadJson: String) {
            WidgetDataStore.saveFullBridgePayload(applicationContext, payloadJson)
            WidgetSyncWorker.schedulePeriodic(applicationContext)
        }

        @JavascriptInterface
        fun updateSummary(summaryJson: String) {
            WidgetDataStore.saveSummaryOnly(applicationContext, summaryJson)
        }

        @JavascriptInterface
        fun requestImmediateWidgetSync() {
            WidgetSyncWorker.triggerImmediate(applicationContext)
        }

        @JavascriptInterface
        fun clearWidgetData() {
            WidgetDataStore.clearAll(applicationContext)
        }
    }

    companion object {
        const val EXTRA_TARGET_TAB = "schooly_target_tab"
    }
}
