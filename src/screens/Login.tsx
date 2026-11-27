import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';
import { spacing } from '../styles/theme';
import { InputBlanck } from '../components/Input';
import { LinkButton } from '../components/Buttons';
import { ScreenProps } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { ServidorConfig } from '../components/ServidorConfig';

type Props = ScreenProps<'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { iniciarSesion } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const ingresar = async () => {
    if (enviando) return;
    if (email.trim() === '' || password === '') {
      setError('Escribe tu correo y tu contraseña.');
      return;
    }

    try {
      setEnviando(true);
      setError(null);
      await iniciarSesion(email.trim(), password);
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
        <Text style={[globalStyles.h1, { textAlign: 'center' }]}>Bienvenido</Text>
        <Text style={[globalStyles.body, { textAlign: 'center', marginBottom: spacing.xxl }]}>
          Inicia sesión para continuar
        </Text>

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
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
        />

        {error && <Text style={globalStyles.errorText}>{error}</Text>}

        <View style={{ marginTop: spacing.lg }}>
          <LinkButton title={enviando ? 'Ingresando...' : 'Ingresar'} onPress={ingresar} />
        </View>

        <Pressable onPress={() => navigation.navigate('Register')} accessibilityRole="link">
          <Text style={globalStyles.linkText}>¿No tienes cuenta? Regístrate</Text>
        </Pressable>

        <ServidorConfig />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
