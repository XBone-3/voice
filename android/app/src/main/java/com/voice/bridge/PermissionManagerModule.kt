package com.voice.bridge

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.voice.permissions.PermissionManager

/**
 * Thin TurboModule wrapper (ADR-008) over permissions/PermissionManager's
 * real Android logic — this class only translates JS calls, no
 * permission logic of its own. Generic over any permission string; no
 * specific permission is requested automatically from app startup
 * (NON_FUNCTIONAL_REQUIREMENTS.md: never request permissions before
 * needed) — see ADR-031 for how this phase verified the flow anyway.
 */
@ReactModule(name = PermissionManagerModule.NAME)
class PermissionManagerModule(
    reactContext: ReactApplicationContext,
) : NativePermissionManagerSpec(reactContext) {
    override fun getName(): String = NAME

    override fun checkPermission(
        permission: String,
        promise: Promise,
    ) {
        promise.resolve(PermissionManager.isGranted(reactApplicationContext, permission))
    }

    override fun requestPermission(
        permission: String,
        promise: Promise,
    ) {
        PermissionManager.request(
            reactApplicationContext.currentActivity,
            permission,
            REQUEST_CODE,
        ) { granted ->
            promise.resolve(granted)
        }
    }

    companion object {
        const val NAME = "PermissionManager"
        private const val REQUEST_CODE = 4201
    }
}
