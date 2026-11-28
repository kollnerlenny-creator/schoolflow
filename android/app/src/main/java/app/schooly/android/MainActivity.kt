package app.schooly.android

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var lastAttemptedUrl: String = BuildConfig.SCHOOLY_APP_URL
    private val baseHost: String by lazy {
        Uri.parse(BuildConfig.SCHOOLY_APP_URL).host.orEmpty()
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this).apply {
            setBackgroundColor(ContextCompat.getColor(this@MainActivity, R.color.schooly_bg))
        }
        setContentView(webView)

        ViewCompat.setOnApplyWindowInsetsListener(webView) { v, insets ->
            val barsAndIme = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.ime()
            )
            v.setPadding(barsAndIme.left, barsAndIme.top, barsAndIme.right, barsAndIme.bottom)
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

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    showOfflineFallback(view)
                }
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
        lastAttemptedUrl = url
        webView.loadUrl(url)
    }

    private fun showOfflineFallback(view: WebView?) {
        val targetView = view ?: return
        val html = """
            <!DOCTYPE html>
            <html lang="de">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <style>
                body {
                  margin: 0;
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: #f2ece1;
                  color: #26231e;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                  padding: 24px;
                  box-sizing: border-box;
                }
                .card {
                  max-width: 360px;
                  width: 100%;
                  background: #f7f2e8;
                  border: 1px solid #ddd4c3;
                  border-radius: 24px;
                  padding: 28px 24px;
                  text-align: center;
                  box-shadow: 0 12px 32px rgba(38, 35, 30, 0.08);
                }
                h1 { margin: 0 0 8px; font-size: 20px; font-weight: 800; }
                p { margin: 0 0 20px; font-size: 14px; line-height: 1.5; color: #5b554b; }
                button {
                  width: 100%;
                  border: 0;
                  border-radius: 999px;
                  background: #2d694c;
                  color: #ffffff;
                  font-size: 15px;
                  font-weight: 700;
                  padding: 14px 20px;
                }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Keine Verbindung zu Schooly</h1>
                <p>Bitte prüfe deine Internetverbindung und versuche es direkt noch einmal.</p>
                <button onclick="window.SchoolyAndroidWidget && window.SchoolyAndroidWidget.retryConnection()">Erneut laden</button>
              </div>
            </body>
            </html>
        """.trimIndent()
        targetView.loadDataWithBaseURL(BuildConfig.SCHOOLY_APP_URL, html, "text/html", "UTF-8", null)
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
        fun retryConnection() {
            runOnUiThread {
                webView.loadUrl(lastAttemptedUrl)
            }
        }

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
