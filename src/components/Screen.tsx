import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, type Theme } from '@theme';

interface Props {
  children: ReactNode;
  /** Centers content both axes. Default true — matches every current screen. */
  center?: boolean;
}

/**
 * Themed full-bleed container. Replaces the identical
 * flex:1/backgroundColor wrapper every screen previously duplicated.
 */
function Screen({ children, center = true }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, center), [theme, center]);

  return <View style={styles.container}>{children}</View>;
}

function createStyles(theme: Theme, center: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      ...(center ? { alignItems: 'center', justifyContent: 'center' } : null),
    },
  });
}

export default Screen;
