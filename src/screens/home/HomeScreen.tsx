import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import { FEATURES } from '@env';
import { useTheme, type Theme } from '@theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

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

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    link: {
      fontSize: 16,
      marginTop: 12,
      textDecorationLine: 'underline',
      color: theme.colors.primary,
    },
  });
}

export default HomeScreen;
