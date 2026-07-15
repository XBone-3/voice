import { Text, type TextProps } from 'react-native';
import { useTheme, type Theme } from '@theme';

interface Props extends TextProps {
  variant: keyof Theme['typography'];
  color?: string;
}

/**
 * Themed Text bound to the Material 3 type scale (theme.typography.*).
 * Replaces each screen manually spreading a typography style by hand.
 */
function AppText({ variant, color, style, ...rest }: Props) {
  const theme = useTheme();

  return (
    <Text
      style={[
        theme.typography[variant],
        { color: color ?? theme.colors.text },
        style,
      ]}
      {...rest}
    />
  );
}

export default AppText;
