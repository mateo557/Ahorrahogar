import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/GlobalStyles';
import { colors, iconSize, spacing, typography } from '../styles/theme';
import { InputBlanck } from '../components/Input';
import { LinkButton } from '../components/Buttons';
import { ScreenProps } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { cambiarPassword } from '../services/count';

type Props = ScreenProps<'CambiarPassword'>;

export function CambiarPassword({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { manejarError } = useAuth();
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    if (guardando) return;

    // Solo lo básico; la API valida todo de nuevo
    if (actual === '' || nueva === '') {
      setError('Completa todos los campos.');
      return;
    }
    if (nueva !== confirmacion) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }

    try {
      setGuardando(true);
      setError(null);
      await cambiarPassword(actual, nueva);
      Alert.alert('Listo', 'Tu contraseña se cambió correctamente.');
      navigation.goBack();
    } catch (e) {
      if (await manejarError(e)) return;
      setError(e instanceof Error ? e.message : 'Ocurrió un error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={globalStyles.sheet}>
      <View style={[globalStyles.formTopBar, { paddingTop: insets.top + spacing.md }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Cerrar">
          <Ionicons name="close" size={iconSize.lg} color={colors.textPrimary} />
        </Pressable>
        <Text style={typography.h3}>Cambiar contraseña</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={globalStyles.formBody} keyboardShouldPersistTaps="handled">
          <InputBlanck
            label="Contraseña actual"
            value={actual}
            onChangeText={setActual}
            secureTextEntry
            autoCapitalize="none"
          />
          <InputBlanck
            label="Contraseña nueva (mínimo 8 caracteres)"
            value={nueva}
            onChangeText={setNueva}
            secureTextEntry
            autoCapitalize="none"
          />
          <InputBlanck
            label="Repite la contraseña nueva"
            value={confirmacion}
            onChangeText={setConfirmacion}
            secureTextEntry
            autoCapitalize="none"
          />
          {error && <Text style={globalStyles.errorText}>{error}</Text>}
        </ScrollView>

        <View style={[globalStyles.formFooter, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <LinkButton title={guardando ? 'Guardando...' : 'Cambiar contraseña'} onPress={guardar} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
