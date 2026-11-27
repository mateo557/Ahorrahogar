import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/GlobalStyles';
import { AmountInput } from '../components/Input';
import { ScreenProps } from '../types/navigation';
import { LinkButton } from '../components/Buttons';
import { colors, fontSize, radius, spacing, typography } from '../styles/theme';
import { createMovement, updateMovement, deleteMovement, getCategories } from '../services/api';
import { Category } from '../types/category';
import { formatFechaCorta, formatMiles } from '../utils/format';

type Props = ScreenProps<'Inputs'>;

// Para enviar a la API: 2026-11-18
const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Icono del chip de categoría (se muestra solo en la categoría elegida)
const iconoCategoria = (nombre: string): keyof typeof Ionicons.glyphMap => {
  const n = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
  if (n.includes('comida') || n.includes('mercado')) return 'cart-outline';
  if (n.includes('transporte')) return 'bus-outline';
  if (n.includes('servicio')) return 'flash-outline';
  if (n.includes('salario') || n.includes('ingreso')) return 'cash-outline';
  return 'pricetag-outline';
};

export function Inputs({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  // Si venimos de tocar un movimiento, llega completo; si venimos del "+", es undefined
  const editando = route.params?.movement;

  const [Fecha, setFecha] = useState(
    editando ? new Date(`${editando.fecha.slice(0, 10)}T00:00:00`) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);
  const [Nota, setNota] = useState(editando?.nota ?? '');
  // Se guarda solo con dígitos ("45000"); en pantalla se muestra con puntos ("45.000")
  const [monto, setMonto] = useState(editando ? String(Math.round(editando.monto)) : '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(editando?.categoria_id ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((e) => Alert.alert('No se cargaron las categorías', e.message));
  }, []);

  const onChangeFecha = (_: DateTimePickerEvent, selected?: Date) => {
    setShowPicker(Platform.OS === 'ios'); // en Android el calendario se cierra solo
    if (selected) setFecha(selected);
  };

  const guardar = async () => {
    if (saving) return;
    const valor = Number(monto);

    if (categoriaId === null || !valor) {
      Alert.alert('Faltan datos', 'Elige una categoría y escribe un monto.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        hogar_id: 1, // TODO: reemplazar con el hogar del usuario cuando exista el login
        categoria_id: categoriaId,
        monto: valor,
        fecha: toYMD(Fecha),
        nota: Nota.trim() === '' ? null : Nota.trim(),
      };

      if (editando) {
        await updateMovement(editando.id, payload);
      } else {
        await createMovement(payload);
      }
      // Vuelve a la pestaña de donde viniste; ahí la lista se recarga sola
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('No se pudo guardar', e.message);
    } finally {
      setSaving(false);
    }
  };

  const eliminar = () => {
    if (!editando) return;
    Alert.alert('Eliminar movimiento', '¿Seguro que quieres eliminarlo? No se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            setSaving(true);
            await deleteMovement(editando.id);
            navigation.goBack();
          } catch (e: any) {
            Alert.alert('No se pudo eliminar', e.message);
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  // El título y el botón dicen "gasto" o "ingreso" según la categoría elegida
  const seleccionada = categories.find((c) => c.id === categoriaId);
  const tipo = seleccionada ? seleccionada.tipo : 'movimiento';
  const titulo = editando ? 'Editar movimiento' : `Nuevo ${tipo}`;
  const textoBoton = saving ? 'Guardando...' : editando ? 'Guardar cambios' : `Guardar ${tipo}`;

  return (
    <View style={globalStyles.sheet}>
      <View style={[styles.barraSuperior, { paddingTop: insets.top + spacing.md }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
        >
          <Ionicons name="close" size={26} color={colors.textPrimary} />
        </Pressable>
        <Text style={typography.h3}>{titulo}</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.cuerpo} keyboardShouldPersistTaps="handled">
          <AmountInput
            label="Monto"
            value={formatMiles(monto)}
            onChangeText={(texto) => setMonto(texto.replace(/\D/g, ''))}
          />

          <Text style={styles.etiqueta}>Categoría</Text>
          <View style={styles.chips}>
            {categories.map((c) => {
              const elegida = categoriaId === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCategoriaId(c.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: elegida }}
                  style={[styles.chip, elegida && styles.chipElegida]}
                >
                  {elegida && (
                    <Ionicons name={iconoCategoria(c.nombre)} size={18} color={colors.primary} />
                  )}
                  <Text style={[styles.chipTexto, elegida && styles.chipTextoElegida]}>
                    {c.nombre}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.etiqueta}>Fecha</Text>
          <Pressable style={styles.campo} onPress={() => setShowPicker(true)}>
            <Text style={typography.body}>{formatFechaCorta(Fecha)}</Text>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
          </Pressable>
          {showPicker && (
            <DateTimePicker
              value={Fecha}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onChangeFecha}
            />
          )}

          <Text style={styles.etiqueta}>Nota</Text>
          <TextInput
            style={[styles.campo, styles.notaInput]}
            value={Nota}
            onChangeText={setNota}
            placeholder="Ej. Mercado de la semana"
            placeholderTextColor={colors.textTertiary}
          />

          {editando && (
            <Pressable onPress={eliminar} style={styles.eliminar} accessibilityRole="button">
              <Text style={styles.eliminarTexto}>Eliminar movimiento</Text>
            </Pressable>
          )}
        </ScrollView>

        <View style={[styles.pie, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <LinkButton title={textoBoton} onPress={guardar} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  barraSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cuerpo: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  etiqueta: {
    ...typography.caption,
    marginTop: spacing.xl,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.background,
  },
  chipElegida: {
    backgroundColor: colors.primaryLight,
  },
  chipTexto: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  chipTextoElegida: {
    color: colors.primary,
    fontWeight: '600',
  },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  notaInput: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  eliminar: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.xl,
  },
  eliminarTexto: {
    color: colors.danger,
    fontWeight: '600',
    fontSize: fontSize.base,
  },
  pie: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
});
