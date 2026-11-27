import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/GlobalStyles';
import { spacing } from '../styles/theme';
import { LinkButton } from '../components/Buttons';
import { TabScreenProps } from '../types/navigation';

type Props = TabScreenProps<'Profile'>;

// Pantalla provisional: aquí irán los datos del usuario y el cierre de sesión real
export function Profile({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[globalStyles.sheet, { paddingTop: insets.top + spacing.lg, paddingHorizontal: spacing.xl }]}>
      <Text style={globalStyles.h2}>Perfil</Text>
      <Text style={[globalStyles.body, { marginTop: spacing.sm, marginBottom: spacing.xl }]}>
        Aquí van los datos de tu hogar y tu cuenta.
      </Text>
      {/* TODO: cuando exista el login, aquí se borra el token antes de salir */}
      <LinkButton title="Cerrar sesión" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
