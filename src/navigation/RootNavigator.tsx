import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FEATURES } from '@env';
import HomeScreen from '@screens/home';
import SettingsScreen from '@screens/settings';
import DeveloperScreen from '@screens/developer';
import DiagnosticsScreen from '@screens/diagnostics';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Home and Settings are unconditional shell screens. Every other screen is
 * only registered once its FEATURES flag (src/env, ADR-019) is on, so the
 * navigator never links to a screen with no engine behind it yet.
 */
function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      {FEATURES.developer && (
        <Stack.Screen name="Developer" component={DeveloperScreen} />
      )}
      {FEATURES.diagnostics && (
        <Stack.Screen name="Diagnostics" component={DiagnosticsScreen} />
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
