import { useEffect, useState } from 'react';
import { Text, View, Button, Alert, Pressable, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { globalStyles } from '../styles/GlobalStyles';
import { InputBlanck, AmountInput } from '../components/Input';
import { ScreenProps } from '../types/navigation';
import { LinkButton } from '../components/Buttons';
import { colors, spacing, typography } from '../styles/theme';
import { createMovement, updateMovement, getCategories,deleteMovement } from '../services/api'; // NUEVO: updateMovement
import { Category } from '../types/category';

type Props = ScreenProps<'Inputs'>;

// ...aquí siguen ExampleScreen y MensajeBotton sin cambios...

// Para enviar a la API: 2026-11-18
const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Para mostrar al usuario: 18/11/2026
const toDisplay = (d: Date) => d.toLocaleDateString('es-CO');

export function Inputs({ navigation, route }: Props) {   // NUEVO: route
  // NUEVO: si venimos de tocar un movimiento, llega completo; si venimos de
  // "Nuevo movimiento", es undefined
  const editando = route.params?.movement;

  // NUEVO: los estados arrancan con los datos del movimiento si se está editando
  const [Fecha, setFecha] = useState(
    editando ? new Date(`${editando.fecha.slice(0, 10)}T00:00:00`) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);
  const [Nota, setNota] = useState(editando?.nota ?? '');
  const [monto, setMonto] = useState(editando ? String(editando.monto) : '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(
    editando?.categoria_id ?? null
  );
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
    // Quita puntos o símbolos por si AmountInput formatea el texto
    const valor = Number(monto.replace(/[^\d]/g, ''));

    if (categoriaId === null || !valor) {
      Alert.alert('Faltan datos', 'Elige una categoría y escribe un monto.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        hogar_id: 1, // TODO: reemplazar con el hogar del usuario
        categoria_id: categoriaId,
        monto: valor,
        fecha: toYMD(Fecha),
        nota: Nota.trim() === '' ? null : Nota.trim(),
      };

      // NUEVO: si hay un movimiento en edición se actualiza, si no se crea
      if (editando) {
        await updateMovement(editando.id, payload);
        Alert.alert('Movimiento actualizado');
        navigation.goBack();
      } else {
        await createMovement(payload);
        Alert.alert('Movimiento guardado');
        navigation.navigate('Resume');
      }
    } catch (e: any) {
      Alert.alert('No se pudo guardar', e.message);
      console.error('Error al guardar movimiento:', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.screenContent}>
        {/* NUEVO: el título cambia según el modo */}
        <Text style={globalStyles.h1}>
          {editando ? 'Editar Movimiento' : 'Nuevo Movimiento'}
        </Text>
        <Text style={globalStyles.caption}>Registra los ingresos y gastos</Text>

        {/* Categoría */}
        <Text style={[globalStyles.caption, { marginTop: spacing.lg }]}>Categoría</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: spacing.xs }}>
          {categories.map((c) => {
            const selected = categoriaId === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCategoriaId(c.id)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: selected ? colors.success : '#ccc',
                  backgroundColor: selected ? colors.success : 'transparent',
                }}
              >
                <Text style={{ color: selected ? '#fff' : undefined }}>{c.nombre}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Monto */}
        <View style={{ marginTop: spacing.lg }}>
          <AmountInput label="Monto (COP)" value={monto} onChangeText={setMonto} />
        </View>

        {/* Fecha: abre el calendario del teléfono */}
        <Text style={[globalStyles.caption, { marginTop: spacing.lg }]}>Fecha</Text>
        <Pressable
          onPress={() => setShowPicker(true)}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: spacing.sm,
            marginTop: spacing.xs,
          }}
        >
          <Text style={typography.body}>{toDisplay(Fecha)}</Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={Fecha}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onChangeFecha}
          />
        )}

        {/* Nota */}
        <View style={{ marginTop: spacing.lg }}>
          <InputBlanck
            label="Nota (opcional)"
            value={Nota}
            onChangeText={setNota}
            placeholder="Ej. Compra de alimentos"
          />
        </View>

        <View style={{ marginTop: spacing.lg }}>
          {/* NUEVO: el texto del botón cambia según el modo */}
          <LinkButton
            title={saving ? 'Guardando...' : editando ? 'Guardar cambios' : 'Guardar Movimiento'}
            onPress={guardar}
          />
        </View>
      </View>
    </View>
  );
}