import { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme, type Theme } from '@theme';
import AppText from './AppText';

interface Props {
  label: string;
  onPress: () => void;
  testID?: string;
}

/**
 * A generic action button (Pressable + ripple) — distinct from MenuLink,
 * which is specifically for navigation. Its visual implementation
 * necessarily resembles MenuLink's; kept separate rather than refactored
 * to share code, to avoid touching Phase 010's already-verified MenuLink
 * for a small DRY gain (CLAUDE.md: don't redesign previous phases unless
 * required). First real consumer of the long-flagged "no general-purpose
 * Button" gap (ADR-023/024/025).
 */
function Button({ label, onPress, testID }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      style={styles.pressable}
      android_ripple={{ color: theme.colors.primaryContainer }}
      testID={testID}
    >
      <AppText variant="labelLarge" color={theme.colors.primary}>
        {label}
      </AppText>
    </Pressable>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    pressable: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.spacing.xs,
    },
  });
}

export default Button;
