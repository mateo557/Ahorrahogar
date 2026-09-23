// src/screens/LoginScreen.tsx
import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';
import { colors, spacing, fontSize } from '../styles/theme';
import { InputBlanck, AmountInput } from '../components/Input';
import { LinkButton } from '../components/Buttons';
import { ScreenProps } from '../types/navigation';

type Props = ScreenProps<'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (

      <View style={[globalStyles.screenContent, { justifyContent: 'center', flex: 1 }]}>
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
        />

        <InputBlanck
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <View style={{ marginTop: spacing.lg }}>
          <LinkButton
            title="Ingresar"
            onPress={() => navigation.navigate('CreatePerfil')}
          />
        </View>
      </View>
  );
}