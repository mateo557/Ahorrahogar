import { useCallback, useState } from 'react';
import { FlatList, ActivityIndicator, Text, View, Pressable, Alert } from 'react-native'; // NUEVO: Alert
import { useFocusEffect } from '@react-navigation/native';
import { globalStyles } from '../styles/GlobalStyles';
import { ScreenProps } from '../types/navigation';
import { LinkButton } from '../components/Buttons';
import { colors, spacing, typography } from '../styles/theme';
import { getMovements, getCategories, deleteMovement } from '../services/api'; // NUEVO: deleteMovement
import { Movemnts } from '../types/movements';
import { Category } from '../types/category';

type Props = ScreenProps<'Movements'>;

const formatMonto = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);

export function Movements({ navigation }: Props) {
  const [movements, setMovements] = useState<Movemnts[]>([]);
  const [categories, setCategories] = useState<Map<number, Category>>(new Map());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NUEVO: la carga ahora es una función con nombre, para poder repetirla
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

  // Se ejecuta cada vez que la pantalla vuelve a mostrarse
  useFocusEffect(cargar);

  // NUEVO: pide confirmación, borra y recarga la lista
  const confirmarEliminar = (item: Movemnts) => {
    const nombre = categories.get(item.categoria_id)?.nombre ?? 'este movimiento';

    Alert.alert(
      'Eliminar movimiento',
      `¿Seguro que quieres eliminar "${nombre}" por valor de ${formatMonto(item.monto)}? `,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMovement(item.id);
              cargar(); // en vez de goBack(), refresca la lista que ya estás viendo
            } catch (e: any) {
              Alert.alert('No se pudo eliminar', e.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={globalStyles.screenContent}>
      <Text style={globalStyles.h2}>Movimientos</Text>
      <Text style={[globalStyles.body, { marginBottom: spacing.sm }]}>
        Todo lo que ha entrado y salido este mes
      </Text>

      {loading && <ActivityIndicator />}
      {error && <Text style={{ color: colors.danger }}>{error}</Text>}

      <FlatList
        data={movements}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const esGasto = categories.get(item.categoria_id)?.tipo === 'gasto';
          const NombreCategoria = categories.get(item.categoria_id)?.nombre ?? 'Sin categoría';

          return (
            <Pressable
              onPress={() => navigation.navigate('Inputs', { movement: item })}
              onLongPress={() => confirmarEliminar(item)}
            >
              <View
                style={[
                  globalStyles.card,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: spacing.xs,
                  },
                ]}
              >
                <View>
                  <Text style={typography.body}>{NombreCategoria}</Text>
                  <Text style={globalStyles.caption}>{item.fecha}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', marginLeft: spacing.sm }}>
                  <Text style={{ color: esGasto ? colors.danger : colors.success }}>
                    {esGasto ? '-' : ''}
                    {formatMonto(item.monto)}
                  </Text>
                  <Text style={globalStyles.caption}>{item.nota}</Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
        <LinkButton title="Nuevo movimiento" onPress={() => navigation.navigate('Inputs')} />
        <LinkButton title="Ir a Resumen" onPress={() => navigation.navigate('Resume')} />
      </View>
    </View>
  );
}