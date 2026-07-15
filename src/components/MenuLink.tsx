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
 * A navigable menu entry with proper Material ripple feedback — replaces
 * the underlined Text-with-onPress pattern, which had no touch feedback
 * at all. First real consumer of the primaryContainer token (ADR-022).
 */
function MenuLink({ label, onPress, testID }: Props) {
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

export default MenuLink;
