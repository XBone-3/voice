import { StyleSheet, Text, View } from 'react-native';

function DiagnosticsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diagnostics</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default DiagnosticsScreen;
