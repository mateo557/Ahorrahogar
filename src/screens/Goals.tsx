import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/GlobalStyles';
import { colors, iconSize, spacing, typography } from '../styles/theme';
import { TabScreenProps } from '../types/navigation';
import { Goal } from '../types/goal';
import { deleteGoal, getGoals } from '../services/api';
import { GoalCard } from '../components/GoalCard';
import { formatCOP } from '../utils/format';

type Props = TabScreenProps<'Goals'>;

export function Goals({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // La carga es una función con nombre para poder repetirla después de eliminar
  const cargar = useCallback(() => {
    getGoals()
      .then((data) => {
        setGoals(data);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Se ejecuta cada vez que la pestaña vuelve a mostrarse
  useFocusEffect(cargar);

  // Pide confirmación, borra y recarga la lista
  const confirmarEliminar = (meta: Goal) => {
    Alert.alert(
      'Eliminar meta',
      `¿Seguro que quieres eliminar "${meta.nombre}" por ${formatCOP(meta.montoobjetivo)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGoal(meta.id);
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
      <View style={[globalStyles.screenHeader, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={globalStyles.h3}>Metas de ahorro</Text>
      </View>

      <ScrollView contentContainerStyle={globalStyles.screenBody}>
        {loading && <ActivityIndicator color={colors.primary} />}

        {error && (
          <Text style={{ color: colors.danger }}>
            No se pudieron cargar las metas. Revisa que la API esté encendida. ({error})
          </Text>
        )}

        {!loading && !error && goals.length === 0 && (
          <Text style={typography.caption}>Aún no tienes metas. Crea la primera con “Nueva meta”.</Text>
        )}

        {goals.map((meta) => (
          <GoalCard
            key={meta.id}
            meta={meta}
            onPress={() => navigation.navigate('CreateGoal', { goal: meta })}
            onLongPress={() => confirmarEliminar(meta)}
          />
        ))}

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('CreateGoal')}
          style={({ pressed }) => [globalStyles.outlineButton, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="add" size={iconSize.lg} color={colors.textPrimary} />
          <Text style={globalStyles.outlineButtonText}>Nueva meta</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
