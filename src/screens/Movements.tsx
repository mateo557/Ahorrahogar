import { useCallback, useState } from 'react';
import { FlatList, ActivityIndicator, Text, View, Pressable, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/GlobalStyles';
import { TabScreenProps } from '../types/navigation';
import { colors, spacing, typography } from '../styles/theme';
import { getMovements, getCategories, deleteMovement } from '../services/api';
import { Movemnts } from '../types/movements';
import { Category } from '../types/category';
import { Fab } from '../components/Fab';
import { formatCOP } from '../utils/format';

type Props = TabScreenProps<'Movements'>;

export function Movements({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [movements, setMovements] = useState<Movemnts[]>([]);
  const [categories, setCategories] = useState<Map<number, Category>>(new Map());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // La carga es una función con nombre para poder repetirla después de eliminar
  const cargar = useCallback(() => {
    Promise.all([getMovements(), getCategories()])
      .then(([movs, cats]) => {
        setMovements([...movs].sort((a, b) => b.fecha.localeCompare(a.fecha)));
        setCategories(new Map(cats.map((c) => [c.id, c])));
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Se ejecuta cada vez que la pestaña vuelve a mostrarse
  useFocusEffect(cargar);

  // Pide confirmación, borra y recarga la lista
  const confirmarEliminar = (item: Movemnts) => {
    const nombre = categories.get(item.categoria_id)?.nombre ?? 'este movimiento';

    Alert.alert(
      'Eliminar movimiento',
      `¿Seguro que quieres eliminar "${nombre}" por valor de ${formatCOP(item.monto)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMovement(item.id);
              cargar();
            } catch (e: any) {
              Alert.alert('No se pudo eliminar', e.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={globalStyles.sheet}>
      <View style={[styles.cabecera, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={globalStyles.h2}>Movimientos</Text>
        <Text style={[globalStyles.body, { marginTop: spacing.xs }]}>
          Todo lo que ha entrado y salido este mes
        </Text>
        {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.md }} />}
        {error && (
          <Text style={{ color: colors.danger, marginTop: spacing.md }}>
            No se pudieron cargar los movimientos. Revisa que la API esté encendida. ({error})
          </Text>
        )}
      </View>

      <FlatList
        data={movements}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={({ item }) => {
          const esGasto = categories.get(item.categoria_id)?.tipo === 'gasto';
          const NombreCategoria = categories.get(item.categoria_id)?.nombre ?? 'Sin categoría';

          return (
            <Pressable
              onPress={() => navigation.navigate('Inputs', { movement: item })}
              onLongPress={() => confirmarEliminar(item)}
            >
              <View style={[globalStyles.tile, styles.fila]}>
                <View>
                  <Text style={typography.body}>{NombreCategoria}</Text>
                  <Text style={globalStyles.caption}>{item.fecha}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', marginLeft: spacing.sm }}>
                  <Text style={{ color: esGasto ? colors.danger : colors.success }}>
                    {esGasto ? '-' : ''}
                    {formatCOP(item.monto)}
                  </Text>
                  <Text style={globalStyles.caption}>{item.nota}</Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />

      <Fab accessibilityLabel="Nuevo movimiento" onPress={() => navigation.navigate('Inputs')} />
    </View>
  );
}

const styles = StyleSheet.create({
  cabecera: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  lista: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 112, // deja libre el botón "+" para que no tape el último movimiento
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
