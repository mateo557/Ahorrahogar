import { View } from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';

type Props = {
  // 0 a 100, ya calculado por la API
  porcentaje: number;
  // 'meta': verde oscuro sobre un tile gris. 'categoria': verde claro sobre fondo blanco
  variante?: 'meta' | 'categoria';
};

// Barra de progreso. Solo dibuja; no calcula nada.
export function ProgressBar({ porcentaje, variante = 'meta' }: Props) {
  const esMeta = variante === 'meta';
  // Mínimo visible para que una categoría pequeña no desaparezca
  const ancho = Math.min(100, Math.max(porcentaje, esMeta ? 0 : 4));

  return (
    <View
      style={esMeta ? globalStyles.progressTrack : globalStyles.progressTrackOnWhite}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(porcentaje) }}
    >
      <View
        style={[
          esMeta ? globalStyles.progressFill : globalStyles.progressFillLight,
          { width: `${ancho}%` as `${number}%` },
        ]}
      />
    </View>
  );
}
