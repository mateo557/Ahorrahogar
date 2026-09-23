// src/components/Input.tsx
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, spacing, radius, fontSize,fontWeight  } from '../styles/theme';

type PropsBlank = TextInputProps & {
  label?: string;
};

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
};

export function InputBlanck({ label, ...props }: PropsBlank) {
  return (
    <View style={stylesblanck.container}>
      {label && <Text style={stylesblanck.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={colors.textTertiary}
        style={stylesblanck.input}
        {...props}
      />
    </View>
  );
}
const stylesblanck = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginBottom: spacing.xs,
    fontWeight: fontWeight.bold,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
});

export function AmountInput({ label, value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Text style={styles.symbol}>$</Text>
        <TextInput
          value={value.toString()}
          onChangeText={onChangeText}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  label: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbol: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginRight: spacing.xs,
  },
  input: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    minWidth: 80,
    padding: 0, // quita el padding por defecto de TextInput
  },
});





