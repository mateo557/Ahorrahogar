import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/GlobalStyles';
import { colors, iconSize, spacing, typography } from '../styles/theme';
import { Goal } from '../types/goal';
import { fechaDesdeTexto, formatCOP, formatFechaCorta } from '../utils/format';
import { ProgressBar } from './ProgressBar';

type Props = { meta: Goal };

// La API no manda un icono: lo elegimos según el nombre de la meta
const iconoMeta = (nombre: string): keyof typeof Ionicons.glyphMap => {
  const n = nombre.toLowerCase();
  if (n.includes('viaje') || n.includes('vacacion')) return 'airplane';
  if (n.includes('emergencia') || n.includes('fondo')) return 'warning-outline';
  return 'flag-outline';
};

// Tarjeta de una meta de ahorro: nombre, % y barra de progreso, ahorrado y objetivo
export function GoalCard({ meta }: Props) {
  const tieneProgreso = meta.montoahorrado !== undefined && meta.porcentaje !== undefined;

  return (
    <View style={[globalStyles.tile, { gap: spacing.md }]}>
      <View style={globalStyles.tileRow}>
        <View style={globalStyles.iconRow}>
          <Ionicons name={iconoMeta(meta.nombre)} size={iconSize.md} color={colors.textPrimary} />
          <Text style={typography.bodyBold}>{meta.nombre}</Text>
        </View>
        {tieneProgreso && <Text style={typography.caption}>{Math.round(meta.porcentaje!)}%</Text>}
      </View>

      {tieneProgreso && <ProgressBar porcentaje={meta.porcentaje!} />}

      {tieneProgreso ? (
        <View style={globalStyles.tileRow}>
          <Text style={typography.bodyBold}>{formatCOP(meta.montoahorrado!)}</Text>
          <Text style={typography.caption}>de {formatCOP(meta.montoobjetivo)}</Text>
        </View>
      ) : (
        <View style={globalStyles.tileRow}>
          <Text style={typography.bodyBold}>{formatCOP(meta.montoobjetivo)}</Text>
          <Text style={typography.caption}>Hasta {formatFechaCorta(fechaDesdeTexto(meta.fechalimite))}</Text>
        </View>
      )}
    </View>
  );
}
