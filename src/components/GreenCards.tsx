import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../styles/theme';

type Props = {
  children: React.ReactNode;
  variant?: 'default' | 'primary';
  style?: ViewStyle;
};

export function GreenCard({ children, variant = 'default', style }: Props) {
  return (
    <View
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
});

