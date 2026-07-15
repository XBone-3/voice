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
import { getAndroidVersion } from '@services/bridgeInfo';

enableScreens();

function App() {
  useEffect(() => {
    logger.info('App', 'Nova started');

    getAndroidVersion().then(androidVersion => {
      if (androidVersion != null) {
        logger.info('App', `Native bridge OK — Android ${androidVersion}`);
      }
    });
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
