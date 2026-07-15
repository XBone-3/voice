import { StyleSheet } from 'react-native';
import { Screen, AppText } from '@components';

function SettingsScreen() {
  return (
    <Screen>
      <AppText variant="titleLarge" style={styles.title}>
        Settings
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '600',
  },
});

export default SettingsScreen;
