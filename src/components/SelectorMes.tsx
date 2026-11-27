import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight } from '../styles/theme';
import { useMes } from '../context/MesContext';
import { nombreMes } from '../utils/format';

type Props = {
  titulo: string;
  // true cuando va sobre fondo verde (texto blanco)
  claro?: boolean;
};

type FlechaProps = {
  direccion: 'anterior' | 'siguiente';
  deshabilitada: boolean;
  color: string;
  onPress: () => void;
};

function Flecha({ direccion, deshabilitada, color, onPress }: FlechaProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitada}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={direccion === 'anterior' ? 'Mes anterior' : 'Mes siguiente'}
      accessibilityState={{ disabled: deshabilitada }}
      style={deshabilitada && styles.apagada}
    >
      <Ionicons name={direccion === 'anterior' ? 'chevron-back' : 'chevron-forward'} size={22} color={color} />
    </Pressable>
  );
}

// Selector de mes compartido por Resumen y Movimientos
export function SelectorMes({ titulo, claro = false }: Props) {
  const { mes, esMesActual, anterior, siguiente } = useMes();
  const color = claro ? colors.textInverse : colors.textPrimary;

  return (
    <View style={styles.fila}>
      <Flecha direccion="anterior" deshabilitada={false} color={color} onPress={anterior} />
      <Text style={[styles.titulo, { color: claro ? colors.primaryLight : colors.textPrimary }]} accessibilityRole="header">
        {titulo} · {nombreMes(mes)}
      </Text>
      <Flecha direccion="siguiente" deshabilitada={esMesActual} color={color} onPress={siguiente} />
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titulo: { fontSize: fontSize.md, fontWeight: fontWeight.bold, textTransform: 'capitalize' },
  apagada: { opacity: 0.3 },
});
