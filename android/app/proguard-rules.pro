# Keep JavaScript Bridge methods intact if R8/ProGuard is enabled later
-keepclassmembers class app.schooly.android.MainActivity$SchoolyWidgetBridge {
    @android.webkit.JavascriptInterface <methods>;
}
