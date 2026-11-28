package app.schooly.android

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var lastAttemptedUrl: String = BuildConfig.SCHOOLY_APP_URL
    private val baseHost: String by lazy {
        Uri.parse(BuildConfig.SCHOOLY_APP_URL).host.orEmpty()
    }

    private val requestNotificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        val effectiveGranted = granted && NotificationHelper.hasPermission(this)
        dispatchNativeNotificationPermissionResult(effectiveGranted)
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        configureFullscreenWindow()
        NotificationHelper.ensureChannel(this)

        val initialTheme = WidgetTheme.forMode(this)
        webView = WebView(this).apply {
            setBackgroundColor(initialTheme.appBgColor)
        }
        setContentView(webView)
        applyFullscreenBars(initialTheme.isLightAppearance)

        ViewCompat.setOnApplyWindowInsetsListener(webView) { v, insets ->
            val cutout = insets.getInsets(WindowInsetsCompat.Type.displayCutout())
            val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
            val bottomPad = if (ime.bottom > 0) ime.bottom else 0
            v.setPadding(cutout.left, cutout.top, cutout.right, bottomPad)
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

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus && ::webView.isInitialized) {
            val theme = WidgetTheme.forMode(this)
            applyFullscreenBars(theme.isLightAppearance)
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        loadTargetUrl(intent)
    }

    override fun onResume() {
        super.onResume()
        CookieManager.getInstance().flush()
        if (::webView.isInitialized) {
            val theme = WidgetTheme.forMode(this)
            applyFullscreenBars(theme.isLightAppearance)
        }
        WidgetSyncWorker.triggerImmediate(this)
    }

    private fun configureFullscreenWindow() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.isNavigationBarContrastEnforced = false
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            window.attributes = window.attributes.apply {
                layoutInDisplayCutoutMode =
                    WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
            }
        }
    }

    private fun applyFullscreenBars(isLightAppearance: Boolean) {
        val controller = WindowCompat.getInsetsController(window, webView)
        controller.systemBarsBehavior =
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        controller.isAppearanceLightStatusBars = isLightAppearance
        controller.isAppearanceLightNavigationBars = isLightAppearance
        controller.hide(WindowInsetsCompat.Type.systemBars())
    }

    private fun applyAppThemeUi(mode: String?) {
        val theme = WidgetTheme.forMode(this, mode)
        webView.setBackgroundColor(theme.appBgColor)
        applyFullscreenBars(theme.isLightAppearance)
    }

    private fun dispatchNativeNotificationPermissionResult(granted: Boolean) {
        runOnUiThread {
            if (::webView.isInitialized) {
                webView.evaluateJavascript(
                    "window.__onNativeNotificationPermissionResult && window.__onNativeNotificationPermissionResult(${if (granted) "true" else "false"});",
                    null
                )
            }
        }
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
        val theme = WidgetTheme.forMode(this)
        val isDark = !theme.isLightAppearance
        val bgHex = if (isDark) "#111412" else "#F2ECE1"
        val cardHex = if (isDark) "#1B211E" else "#FFFDF9"
        val borderHex = if (isDark) "#2F3A34" else "#DDD4C3"
        val textHex = if (isDark) "#F5F0E6" else "#26231E"
        val mutedHex = if (isDark) "#ABA396" else "#5B554B"

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
                  background: $bgHex;
                  color: $textHex;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                  padding: 24px;
                  box-sizing: border-box;
                }
                .card {
                  max-width: 360px;
                  width: 100%;
                  background: $cardHex;
                  border: 1px solid $borderHex;
                  border-radius: 26px;
                  padding: 28px 24px;
                  text-align: center;
                  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14);
                }
                h1 { margin: 0 0 8px; font-size: 20px; font-weight: 800; }
                p { margin: 0 0 20px; font-size: 14px; line-height: 1.5; color: $mutedHex; }
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
        fun setAppColorMode(mode: String) {
            WidgetDataStore.saveColorMode(applicationContext, mode, refreshWidgets = true)
            runOnUiThread {
                applyAppThemeUi(mode)
            }
        }

        @JavascriptInterface
        fun hasNativeNotifications(): Boolean = true

        @JavascriptInterface
        fun areNativeNotificationsEnabled(): Boolean =
            NotificationHelper.hasPermission(applicationContext)

        @JavascriptInterface
        fun requestNativeNotificationPermission() {
            runOnUiThread {
                if (NotificationHelper.hasPermission(this@MainActivity)) {
                    dispatchNativeNotificationPermissionResult(true)
                } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    requestNotificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                } else {
                    dispatchNativeNotificationPermissionResult(false)
                }
            }
        }

        @JavascriptInterface
        fun showNativeNotification(title: String, body: String, tab: String): Boolean {
            return NotificationHelper.showNotification(
                applicationContext,
                title,
                body,
                tab.ifBlank { "planner" }
            )
        }

        @JavascriptInterface
        fun scheduleNativeTestNotification(title: String, body: String, delayMs: Long): Boolean {
            return NotificationHelper.scheduleTestNotification(
                applicationContext,
                title,
                body,
                delayMs.coerceAtLeast(0L)
            )
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
