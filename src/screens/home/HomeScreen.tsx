import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import { FEATURES } from '@env';
import { useTheme, type Theme } from '@theme';
import { Screen, AppText, MenuLink } from '@components';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Screen>
      <View style={styles.stack}>
        <AppText variant="headlineMedium" style={styles.title}>
          Nova
        </AppText>
        <AppText variant="bodyLarge" color={theme.colors.textSecondary}>
          Home
        </AppText>
        <MenuLink
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
        {FEATURES.developer && (
          <MenuLink
            label="Developer"
            onPress={() => navigation.navigate('Developer')}
          />
        )}
        {FEATURES.diagnostics && (
          <MenuLink
            label="Diagnostics"
            onPress={() => navigation.navigate('Diagnostics')}
          />
        )}
      </View>
    </Screen>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    stack: {
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    title: {
      fontWeight: '700',
    },
  });
}

export default HomeScreen;
