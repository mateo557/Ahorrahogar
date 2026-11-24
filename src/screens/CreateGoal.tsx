import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/GlobalStyles';
import { colors, iconSize, spacing, typography } from '../styles/theme';
import { ScreenProps } from '../types/navigation';
import { AmountInput } from '../components/Input';
import { LinkButton } from '../components/Buttons';
import { createGoal, deleteGoal, updateGoal } from '../services/api';
import { fechaDesdeTexto, fechaParaApi, formatFechaCorta, formatMiles } from '../utils/format';

type Props = ScreenProps<'CreateGoal'>;

export function CreateGoal({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  // Si venimos de tocar una meta, llega completa; si venimos de "Nueva meta", es undefined
  const editando = route.params?.goal;

  const [nombre, setNombre] = useState(editando?.nombre ?? '');
  // Solo dígitos ("2000000"); en pantalla se muestra con puntos ("2.000.000")
  const [monto, setMonto] = useState(editando ? String(Math.round(editando.montoobjetivo)) : '');
  const [fechaLimite, setFechaLimite] = useState(
    editando ? fechaDesdeTexto(editando.fechalimite) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const onChangeFecha = (_: DateTimePickerEvent, selected?: Date) => {
    setShowPicker(Platform.OS === 'ios'); // en Android el calendario se cierra solo
    if (selected) setFechaLimite(selected);
  };

  const guardar = async () => {
    if (saving) return;
    const valor = Number(monto);

    if (nombre.trim() === '' || !valor) {
      Alert.alert('Faltan datos', 'Escribe el nombre de la meta y el monto que quieres ahorrar.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        hogar_Id: editando?.hogar_Id ?? 1, // TODO: reemplazar con el hogar del usuario cuando exista el login
        nombre: nombre.trim(),
        montoobjetivo: valor,
        fechalimite: fechaParaApi(fechaLimite),
      };

      if (editando) {
        await updateGoal(editando.id, payload);
      } else {
        await createGoal(payload);
      }
      // Vuelve a Metas; la lista se recarga sola al mostrarse
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('No se pudo guardar', e.message);
    } finally {
      setSaving(false);
    }
  };

  const eliminar = () => {
    if (!editando) return;
    Alert.alert('Eliminar meta', '¿Seguro que quieres eliminarla? No se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            setSaving(true);
            await deleteGoal(editando.id);
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

  const titulo = editando ? 'Editar meta' : 'Nueva meta';
  const textoBoton = saving ? 'Guardando...' : editando ? 'Guardar cambios' : 'Guardar meta';

  return (
    <View style={globalStyles.sheet}>
      <View style={[globalStyles.formTopBar, { paddingTop: insets.top + spacing.md }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
        >
          <Ionicons name="close" size={iconSize.lg} color={colors.textPrimary} />
        </Pressable>
        <Text style={typography.h3}>{titulo}</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={globalStyles.formBody} keyboardShouldPersistTaps="handled">
          <Text style={[globalStyles.formLabel, { marginTop: 0 }]}>Nombre</Text>
          <TextInput
            style={[globalStyles.formField, globalStyles.formInputText]}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Viaje de fin de año"
            placeholderTextColor={colors.textTertiary}
          />

          <Text style={globalStyles.formLabel}>Monto que quieres ahorrar</Text>
          <AmountInput
            label=""
            value={formatMiles(monto)}
            onChangeText={(texto) => setMonto(texto.replace(/\D/g, ''))}
          />

          <Text style={globalStyles.formLabel}>Fecha límite</Text>
          <Pressable style={globalStyles.formField} onPress={() => setShowPicker(true)}>
            <Text style={typography.body}>{formatFechaCorta(fechaLimite)}</Text>
            <Ionicons name="calendar-outline" size={iconSize.md} color={colors.textSecondary} />
          </Pressable>
          {showPicker && (
            <DateTimePicker
              value={fechaLimite}
              mode="date"
              // Al crear no se permite una fecha pasada; al editar sí, por si la meta ya vencía
              minimumDate={editando ? undefined : new Date()}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onChangeFecha}
            />
          )}

          {editando && (
            <Pressable onPress={eliminar} style={globalStyles.dangerLink} accessibilityRole="button">
              <Text style={globalStyles.dangerLinkText}>Eliminar meta</Text>
            </Pressable>
          )}
        </ScrollView>

        <View style={[globalStyles.formFooter, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <LinkButton title={textoBoton} onPress={guardar} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
