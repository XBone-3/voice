package com.voice.permissions

import android.app.Activity
import android.content.Context
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener

/**
 * Plain Android permission logic (ADR-028's permissions/ package) — no
 * React Native or bridge concerns here, so any future native engine can
 * call this directly, not just through the TurboModule wrapper in
 * bridge/PermissionManagerModule.kt (ADR-008: the bridge stays thin,
 * business/Android logic lives here).
 */
object PermissionManager {
    fun isGranted(context: Context, permission: String): Boolean =
        ContextCompat.checkSelfPermission(context, permission) == PackageManager.PERMISSION_GRANTED

    /**
     * Requests a single permission and delivers the granted/denied result
     * via [onResult]. No-op with a `false` result if [activity] isn't a
     * [PermissionAwareActivity] (e.g. app backgrounded mid-request) —
     * ReactActivity (MainActivity's base class) already implements this,
     * so no MainActivity changes were needed.
     */
    fun request(
        activity: Activity?,
        permission: String,
        requestCode: Int,
        onResult: (granted: Boolean) -> Unit,
    ) {
        if (activity !is PermissionAwareActivity) {
            onResult(false)
            return
        }
        activity.requestPermissions(
            arrayOf(permission),
            requestCode,
            PermissionListener { code, _, grantResults ->
                if (code != requestCode) return@PermissionListener false
                val granted = grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED
                onResult(granted)
                true
            },
        )
    }
}
