package com.voice.bridge

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

/**
 * Registers every native module under android/app/src/main/java/com/voice/bridge/
 * (ADR-028). One package for the bridge package as a whole; each new
 * TurboModule gets a case in getModule() and an entry in
 * getReactModuleInfoProvider(), not its own ReactPackage.
 */
class BridgePackage : BaseReactPackage() {
    override fun getModule(
        name: String,
        reactContext: ReactApplicationContext,
    ): NativeModule? =
        when (name) {
            NativeBridgeInfoModule.NAME -> NativeBridgeInfoModule(reactContext)
            else -> null
        }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
        ReactModuleInfoProvider {
            mapOf(
                NativeBridgeInfoModule.NAME to
                    ReactModuleInfo(
                        NativeBridgeInfoModule.NAME,
                        NativeBridgeInfoModule.NAME,
                        false, // canOverrideExistingModule
                        false, // needsEagerInit
                        true, // hasConstants
                        true, // isTurboModule
                    ),
            )
        }
}
