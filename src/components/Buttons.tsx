// src/components/LinkButton.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, fontSize } from '../styles/theme';

type Props = {
  title: string;
  onPress: () => void;
};

export function LinkButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.chip}
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  text: {
    color: colors.textInverse,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
});