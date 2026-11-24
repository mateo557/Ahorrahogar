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
import { createGoal } from '../services/api';
import { fechaParaApi, formatFechaCorta, formatMiles } from '../utils/format';

type Props = ScreenProps<'CreateGoal'>;

export function CreateGoal({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [nombre, setNombre] = useState('');
  // Solo dígitos ("2000000"); en pantalla se muestra con puntos ("2.000.000")
  const [monto, setMonto] = useState('');
  const [fechaLimite, setFechaLimite] = useState(new Date());
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
      await createGoal({
        hogar_Id: 1, // TODO: reemplazar con el hogar del usuario cuando exista el login
        nombre: nombre.trim(),
        montoobjetivo: valor,
        fechalimite: fechaParaApi(fechaLimite),
      });
      // Vuelve a Metas; la lista se recarga sola al mostrarse
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('No se pudo guardar', e.message);
    } finally {
      setSaving(false);
    }
  };

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
        <Text style={typography.h3}>Nueva meta</Text>
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
              minimumDate={new Date()}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onChangeFecha}
            />
          )}
        </ScrollView>

        <View style={[globalStyles.formFooter, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <LinkButton title={saving ? 'Guardando...' : 'Guardar meta'} onPress={guardar} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
