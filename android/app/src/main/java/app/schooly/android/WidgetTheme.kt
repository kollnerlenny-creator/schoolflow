package app.schooly.android

import android.content.Context
import android.content.res.Configuration
import android.graphics.Color

data class WidgetTheme(
    val mode: String,
    val cardBgRes: Int,
    val rowBgRes: Int,
    val accentBadgeRes: Int,
    val peachBadgeRes: Int,
    val dotRes: Int,
    val appBgColor: Int,
    val textPrimary: Int,
    val textMuted: Int,
    val accent: Int,
    val peachText: Int,
    val urgent: Int,
    val isLightAppearance: Boolean
) {
    companion object {
        fun normalizeMode(mode: String?): String? {
            return when (mode?.trim()?.lowercase()) {
                "light", "evening", "dim", "dark" -> mode.trim().lowercase()
                else -> null
            }
        }

        fun resolveEffectiveMode(context: Context, explicitMode: String?): String {
            normalizeMode(explicitMode)?.let { return it }
            normalizeMode(WidgetDataStore.getColorMode(context))?.let { return it }
            val nightFlags = context.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
            return if (nightFlags == Configuration.UI_MODE_NIGHT_YES) "dark" else "light"
        }

        fun forMode(context: Context, explicitMode: String? = null): WidgetTheme {
            return when (resolveEffectiveMode(context, explicitMode)) {
                "evening" -> WidgetTheme(
                    mode = "evening",
                    cardBgRes = R.drawable.widget_card_bg_evening,
                    rowBgRes = R.drawable.widget_row_bg_evening,
                    accentBadgeRes = R.drawable.widget_accent_badge_evening,
                    peachBadgeRes = R.drawable.widget_peach_badge_evening,
                    dotRes = R.drawable.widget_dot_light,
                    appBgColor = Color.parseColor("#EADCC7"),
                    textPrimary = Color.parseColor("#2C241C"),
                    textMuted = Color.parseColor("#6B5B47"),
                    accent = Color.parseColor("#2D694C"),
                    peachText = Color.parseColor("#6E4400"),
                    urgent = Color.parseColor("#B91C1C"),
                    isLightAppearance = true
                )
                "dim" -> WidgetTheme(
                    mode = "dim",
                    cardBgRes = R.drawable.widget_card_bg_dim,
                    rowBgRes = R.drawable.widget_row_bg_dim,
                    accentBadgeRes = R.drawable.widget_accent_badge_dim,
                    peachBadgeRes = R.drawable.widget_peach_badge_dim,
                    dotRes = R.drawable.widget_dot_dark,
                    appBgColor = Color.parseColor("#252B28"),
                    textPrimary = Color.parseColor("#F3EFE6"),
                    textMuted = Color.parseColor("#B4AEA2"),
                    accent = Color.parseColor("#5EC28F"),
                    peachText = Color.parseColor("#FFCF87"),
                    urgent = Color.parseColor("#F87171"),
                    isLightAppearance = false
                )
                "dark" -> WidgetTheme(
                    mode = "dark",
                    cardBgRes = R.drawable.widget_card_bg_dark,
                    rowBgRes = R.drawable.widget_row_bg_dark,
                    accentBadgeRes = R.drawable.widget_accent_badge_dark,
                    peachBadgeRes = R.drawable.widget_peach_badge_dark,
                    dotRes = R.drawable.widget_dot_dark,
                    appBgColor = Color.parseColor("#111412"),
                    textPrimary = Color.parseColor("#F5F0E6"),
                    textMuted = Color.parseColor("#ABA396"),
                    accent = Color.parseColor("#5EC28F"),
                    peachText = Color.parseColor("#FFD89C"),
                    urgent = Color.parseColor("#F87171"),
                    isLightAppearance = false
                )
                else -> WidgetTheme(
                    mode = "light",
                    cardBgRes = R.drawable.widget_card_bg_light,
                    rowBgRes = R.drawable.widget_row_bg_light,
                    accentBadgeRes = R.drawable.widget_accent_badge_light,
                    peachBadgeRes = R.drawable.widget_peach_badge_light,
                    dotRes = R.drawable.widget_dot_light,
                    appBgColor = Color.parseColor("#F2ECE1"),
                    textPrimary = Color.parseColor("#26231E"),
                    textMuted = Color.parseColor("#6E665E"),
                    accent = Color.parseColor("#2D694C"),
                    peachText = Color.parseColor("#7A4E00"),
                    urgent = Color.parseColor("#B91C1C"),
                    isLightAppearance = true
                )
            }
        }
    }
}
