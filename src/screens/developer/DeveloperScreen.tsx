import { StyleSheet } from 'react-native';
import { Screen, AppText } from '@components';

function DeveloperScreen() {
  return (
    <Screen>
      <AppText variant="titleLarge" style={styles.title}>
        Developer
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '600',
  },
});

export default DeveloperScreen;
