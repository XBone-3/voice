import { StyleSheet } from 'react-native';
import { Screen, AppText } from '@components';

function DiagnosticsScreen() {
  return (
    <Screen>
      <AppText variant="titleLarge" style={styles.title}>
        Diagnostics
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '600',
  },
});

export default DiagnosticsScreen;
