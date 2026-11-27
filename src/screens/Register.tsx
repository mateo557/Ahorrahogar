import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';
import { spacing } from '../styles/theme';
import { InputBlanck } from '../components/Input';
import { LinkButton } from '../components/Buttons';
import { ScreenProps } from '../types/navigation';
import { useAuth } from '../context/AuthContext';

type Props = ScreenProps<'Register'>;

export function Register({ navigation }: Props) {
  const { registrar } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const crearCuenta = async () => {
    if (enviando) return;

    // Solo se revisa lo básico; la API valida todo de nuevo
    if (nombre.trim() === '' || email.trim() === '' || password === '') {
      setError('Completa todos los campos.');
      return;
    }
    if (password !== confirmacion) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setEnviando(true);
      setError(null);
      await registrar(nombre.trim(), email.trim(), password);
      // Al haber sesión, la navegación cambia sola de pantalla
    } catch (e: any) {
      setError(e.message);
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={globalStyles.authContent} keyboardShouldPersistTaps="handled">
        <Text style={[globalStyles.h1, { textAlign: 'center' }]}>Crea tu cuenta</Text>
        <Text style={[globalStyles.body, { textAlign: 'center', marginBottom: spacing.xxl }]}>
          Después podrás crear tu hogar o unirte a uno
        </Text>

        <InputBlanck label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Tu nombre" />

        <InputBlanck
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          placeholder="tucorreo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <InputBlanck
          label="Contraseña (mínimo 8 caracteres)"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
        />

        <InputBlanck
          label="Repite la contraseña"
          value={confirmacion}
          onChangeText={setConfirmacion}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
        />

        {error && <Text style={globalStyles.errorText}>{error}</Text>}

        <View style={{ marginTop: spacing.lg }}>
          <LinkButton title={enviando ? 'Creando cuenta...' : 'Crear cuenta'} onPress={crearCuenta} />
        </View>

        <Pressable onPress={() => navigation.navigate('Login')} accessibilityRole="link">
          <Text style={globalStyles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
