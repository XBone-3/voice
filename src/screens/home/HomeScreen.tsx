import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import { FEATURES } from '@env';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova</Text>
      <Text style={styles.subtitle}>Home</Text>
      <Text style={styles.link} onPress={() => navigation.navigate('Settings')}>
        Settings
      </Text>
      {FEATURES.developer && (
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Developer')}
        >
          Developer
        </Text>
      )}
      {FEATURES.diagnostics && (
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Diagnostics')}
        >
          Diagnostics
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
  link: {
    fontSize: 16,
    marginTop: 12,
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
