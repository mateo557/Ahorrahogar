import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/GlobalStyles';
import { colors, radius, spacing, typography } from '../styles/theme';
import { TabScreenProps } from '../types/navigation';
import { Goal } from '../types/goal';
import { getGoals } from '../services/api';
import { fechaDesdeTexto, formatCOP, formatFechaCorta } from '../utils/format';

type Props = TabScreenProps<'Goals'>;

// La API no manda un icono: lo elegimos según el nombre de la meta
const iconoMeta = (nombre: string): keyof typeof Ionicons.glyphMap => {
  const n = nombre.toLowerCase();
  if (n.includes('viaje') || n.includes('vacacion')) return 'airplane';
  if (n.includes('emergencia') || n.includes('fondo')) return 'warning-outline';
  return 'flag-outline';
};

export function Goals(_: Props) {
  const insets = useSafeAreaInsets();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      getGoals()
        .then((data) => {
          if (!activo) return;
          setGoals(data);
          setError(null);
        })
        .catch((e) => activo && setError(e.message))
        .finally(() => activo && setLoading(false));
      return () => {
        activo = false;
      };
    }, [])
  );

  return (
    <View style={globalStyles.sheet}>
      <View style={[styles.cabecera, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={globalStyles.h3}>Metas de ahorro</Text>
      </View>

      <ScrollView contentContainerStyle={styles.cuerpo}>
        {loading && <ActivityIndicator color={colors.primary} />}

        {error && (
          <Text style={{ color: colors.danger }}>
            No se pudieron cargar las metas. Revisa que la API esté encendida. ({error})
          </Text>
        )}

        {!loading && !error && goals.length === 0 && (
          <Text style={typography.caption}>Aún no tienes metas. Crea la primera con “Nueva meta”.</Text>
        )}

        {goals.map((meta, i) => {
          const objetivo = meta.montoobjetivo;
          const ahorrado = meta.montoahorrado;
          const porcentaje =
            ahorrado !== undefined && objetivo > 0
              ? Math.min(100, Math.round((ahorrado / objetivo) * 100))
              : null;

          return (
            <View key={`${meta.nombre}-${i}`} style={[globalStyles.tile, { gap: spacing.md }]}>
              <View style={globalStyles.rowBetween}>
                <View style={styles.titulo}>
                  <Ionicons name={iconoMeta(meta.nombre)} size={22} color={colors.textPrimary} />
                  <Text style={typography.bodyBold}>{meta.nombre}</Text>
                </View>
                {porcentaje !== null && <Text style={typography.caption}>{porcentaje}%</Text>}
              </View>

              {porcentaje !== null && (
                <View style={styles.pista}>
                  <View style={[styles.relleno, { width: `${porcentaje}%` as `${number}%` }]} />
                </View>
              )}

              {ahorrado !== undefined ? (
                <View style={globalStyles.rowBetween}>
                  <Text style={typography.body}>{formatCOP(ahorrado)}</Text>
                  <Text style={typography.caption}>de {formatCOP(objetivo)}</Text>
                </View>
              ) : (
                <View style={globalStyles.rowBetween}>
                  <Text style={typography.body}>{formatCOP(objetivo)}</Text>
                  <Text style={typography.caption}>
                    Hasta {formatFechaCorta(fechaDesdeTexto(meta.fechalimite))}
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            // TODO: pantalla para crear metas (siguiente módulo)
            Alert.alert('Nueva meta', 'La creación de metas se agrega en el siguiente módulo.')
          }
          style={({ pressed }) => [styles.nueva, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={styles.nuevaTexto}>Nueva meta</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cabecera: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cuerpo: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  titulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pista: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  relleno: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  nueva: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.card,
  },
  nuevaTexto: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
});
