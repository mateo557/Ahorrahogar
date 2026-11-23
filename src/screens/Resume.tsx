import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/GlobalStyles';
import { colors, fontFamily, fontSize, fontWeight, radius, spacing, typography } from '../styles/theme';
import { TabScreenProps } from '../types/navigation';
import { Balance } from '../types/balance';
import { Category } from '../types/category';
import { Movemnts } from '../types/movements';
import { getBalance, getCategories, getMovements } from '../services/api';
import { Fab } from '../components/Fab';
import { formatCOP, mesActual } from '../utils/format';

type Props = TabScreenProps<'Resume'>;

const HOGAR_ID = 1; // TODO: vendrá del login

type FilaProps = {
  icono: keyof typeof Ionicons.glyphMap;
  color: string;
  etiqueta: string;
  monto: string;
};

// Fila "Ingresos" / "Gastos": icono, nombre y monto
function FilaTotal({ icono, color, etiqueta, monto }: FilaProps) {
  return (
    <View style={[globalStyles.tile, styles.fila]}>
      <View style={styles.filaIzquierda}>
        <Ionicons name={icono} size={30} color={color} />
        <Text style={typography.body}>{etiqueta}</Text>
      </View>
      <Text style={typography.bodyBold}>{monto}</Text>
    </View>
  );
}

export function Resume({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const mes = mesActual();

  const [balance, setBalance] = useState<Balance | null>(null);
  const [movements, setMovements] = useState<Movemnts[]>([]);
  const [categories, setCategories] = useState<Map<number, Category>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Se recarga cada vez que vuelves a esta pestaña (por ejemplo, tras guardar un movimiento)
  useFocusEffect(
    useCallback(() => {
      let activo = true;
      Promise.all([getBalance(HOGAR_ID), getMovements(), getCategories()])
        .then(([b, movs, cats]) => {
          if (!activo) return;
          setBalance(b);
          setMovements(movs);
          setCategories(new Map(cats.map((c) => [c.id, c])));
          setError(null);
        })
        .catch((e) => activo && setError(e.message))
        .finally(() => activo && setLoading(false));
      return () => {
        activo = false;
      };
    }, [])
  );

  // Gastos del mes actual, sumados por categoría y de mayor a menor
  const gastosPorCategoria = useMemo(() => {
    const totales = new Map<number, number>();
    for (const m of movements) {
      if (!m.fecha.startsWith(mes.prefijo)) continue;
      if (categories.get(m.categoria_id)?.tipo !== 'gasto') continue;
      totales.set(m.categoria_id, (totales.get(m.categoria_id) ?? 0) + m.monto);
    }
    const suma = [...totales.values()].reduce((a, b) => a + b, 0);
    return [...totales.entries()]
      .map(([id, total]) => ({
        id,
        nombre: categories.get(id)?.nombre ?? 'Sin categoría',
        total,
        porcentaje: suma > 0 ? (total / suma) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [movements, categories, mes.prefijo]);

  return (
    <View style={globalStyles.sheet}>
      {/* Texto claro en la barra de estado solo mientras esta pestaña está visible */}
      {isFocused && <StatusBar style="light" />}

      <ScrollView contentContainerStyle={{ paddingBottom: 112 }}>
        <View style={[styles.cabecera, { paddingTop: insets.top + spacing.xl }]}>
          <Text style={styles.cabeceraTitulo}>Resumen · {mes.nombre}</Text>
          <Text style={styles.cabeceraMonto}>{balance ? formatCOP(balance.balance) : '—'}</Text>
          <Text style={styles.cabeceraNota}>disponible para ahorrar</Text>
        </View>

        <View style={styles.cuerpo}>
          {loading && <ActivityIndicator color={colors.primary} />}

          {error && (
            <Text style={{ color: colors.danger }}>
              No se pudo cargar el resumen. Revisa que la API esté encendida. ({error})
            </Text>
          )}

          <FilaTotal
            icono="arrow-down-circle-outline"
            color={colors.success}
            etiqueta="Ingresos"
            monto={balance ? formatCOP(balance.balance_ingreso) : '—'}
          />
          <FilaTotal
            icono="arrow-up-circle-outline"
            color={colors.danger}
            etiqueta="Gastos"
            monto={balance ? formatCOP(balance.balance_gasto) : '—'}
          />

          <Text style={[typography.caption, { marginTop: spacing.md }]}>Gastos por categoría</Text>

          {!loading && gastosPorCategoria.length === 0 && (
            <Text style={typography.caption}>Todavía no hay gastos registrados este mes.</Text>
          )}

          {gastosPorCategoria.map((c) => (
            <View key={c.id} style={{ gap: spacing.xs }}>
              <View style={globalStyles.rowBetween}>
                <Text style={typography.body}>{c.nombre}</Text>
                <Text style={typography.body}>{formatCOP(c.total)}</Text>
              </View>
              <View style={styles.pista}>
                <View
                  style={[styles.barra, { width: `${Math.max(c.porcentaje, 4)}%` as `${number}%` }]}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Fab accessibilityLabel="Nuevo movimiento" onPress={() => navigation.navigate('Inputs')} />
    </View>
  );
}

const styles = StyleSheet.create({
  cabecera: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  cabeceraTitulo: {
    color: colors.primaryLight,
    fontSize: fontSize.md,
  },
  cabeceraMonto: {
    color: colors.textInverse,
    fontFamily: fontFamily.display,
    fontSize: 44,
    fontWeight: fontWeight.bold,
    marginTop: spacing.sm,
  },
  cabeceraNota: {
    color: colors.primaryLight,
    fontSize: fontSize.md,
    marginTop: spacing.xs,
  },
  cuerpo: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filaIzquierda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pista: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.chartTrack,
    overflow: 'hidden',
  },
  barra: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.chart,
  },
});
