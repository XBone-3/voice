import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme, type Theme } from '@theme';
import { useSettingsStore, type ThemeOverride } from '@stores';
import { Screen, AppText, Card } from '@components';

const THEME_OPTIONS: { label: string; value: ThemeOverride }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

function SettingsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const themeOverride = useSettingsStore(state => state.themeOverride);
  const setThemeOverride = useSettingsStore(state => state.setThemeOverride);

  return (
    <Screen center={false}>
      <View style={styles.content}>
        <AppText variant="titleLarge" style={styles.heading}>
          Settings
        </AppText>
        <Card>
          <AppText variant="titleMedium" color={theme.colors.textSecondary}>
            Theme
          </AppText>
          {THEME_OPTIONS.map(option => (
            <ThemeOptionRow
              key={option.value}
              label={option.label}
              selected={themeOverride === option.value}
              onPress={() => setThemeOverride(option.value)}
            />
          ))}
        </Card>
      </View>
    </Screen>
  );
}

interface ThemeOptionRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function ThemeOptionRow({ label, selected, onPress }: ThemeOptionRowProps) {
  const theme = useTheme();
  const styles = useMemo(() => createRowStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      style={styles.row}
      android_ripple={{ color: theme.colors.primaryContainer }}
    >
      <AppText variant="bodyLarge">{label}</AppText>
      {selected && (
        <AppText variant="bodyLarge" color={theme.colors.primary}>
          ✓
        </AppText>
      )}
    </Pressable>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    content: {
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },
    heading: {
      fontWeight: '600',
    },
  });
}

function createRowStyles(theme: Theme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
  });
}

export default SettingsScreen;
