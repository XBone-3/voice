import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme, type Theme } from '@theme';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * A raised surface grouping related content — first real consumer of the
 * elevation token (ADR-022), which had gone unused since Phase 009.
 */
function Card({ children, style }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return <View style={[styles.card, style]}>{children}</View>;
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.spacing.sm,
      elevation: theme.elevation.level1,
      padding: theme.spacing.md,
      gap: theme.spacing.xs,
    },
  });
}

export default Card;
