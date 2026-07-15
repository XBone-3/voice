/**
 * Nova
 * @format
 */

import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@navigation/RootNavigator';
import { toNavigationTheme } from '@navigation/theme';
import { ThemeProvider, useTheme } from '@theme';
import { logger } from '@logger';
import {
  getAndroidVersion,
  subscribeToMemoryPressure,
} from '@services/bridgeInfo';
import { checkPermission } from '@services/permissions';
import { isInForeground, subscribeToLifecycle } from '@services/lifecycle';

enableScreens();

function App() {
  useEffect(() => {
    logger.info('App', 'Nova started');

    getAndroidVersion().then(androidVersion => {
      if (androidVersion != null) {
        logger.info('App', `Native bridge OK — Android ${androidVersion}`);
      }
    });

    const unsubscribeMemoryPressure = subscribeToMemoryPressure(level => {
      logger.warn('App', `Memory pressure signaled — level ${level}`);
    });

    const unsubscribeLifecycle = subscribeToLifecycle(foreground => {
      logger.info('App', `App ${foreground ? 'foregrounded' : 'backgrounded'}`);
    });

    isInForeground().then(foreground => {
      if (foreground != null) {
        logger.info(
          'App',
          `Lifecycle Manager OK — isInForeground: ${foreground}`,
        );
      }
    });

    // Status check only — never a request. Requesting RECORD_AUDIO here
    // would prompt every user on every launch for a permission nothing
    // uses yet (see ADR-031).
    checkPermission('android.permission.RECORD_AUDIO').then(granted => {
      logger.info(
        'App',
        `Microphone permission — ${granted ? 'granted' : 'denied'}`,
      );
    });

    return () => {
      unsubscribeMemoryPressure();
      unsubscribeLifecycle();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const theme = useTheme();

  return (
    <>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer theme={toNavigationTheme(theme)}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

export default App;
