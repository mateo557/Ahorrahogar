import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppStackParamList, TabParamList } from '../types/navigation';
import { colors } from '../styles/theme';
import { globalStyles } from '../styles/GlobalStyles';
import { useAuth } from '../context/AuthContext';
import { Resume } from '../screens/Resume';
import { Movements } from '../screens/Movements';
import { Goals } from '../screens/Goals';
import { Profile } from '../screens/Profile';
import { Inputs } from '../screens/Inputs';
import { CreateGoal } from '../screens/CreateGoal';
import { CreatePerfil } from '../screens/CreatePerfil';
import { LoginScreen } from '../screens/Login';
import { Register } from '../screens/Register';
import { CambiarPassword } from '../screens/CambiarPassword';

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

type IconName = React.ComponentProps<typeof Ionicons>['name'];

// Icono de cada pestaña: relleno cuando está activa, solo contorno cuando no
const TAB_ICONS: Record<keyof TabParamList, { activo: IconName; inactivo: IconName }> = {
  Resume: { activo: 'home', inactivo: 'home-outline' },
  Movements: { activo: 'stats-chart', inactivo: 'stats-chart-outline' },
  Goals: { activo: 'radio-button-on', inactivo: 'radio-button-on-outline' },
  Profile: { activo: 'person', inactivo: 'person-outline' },
};

// Barra inferior con los 4 iconos
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // el diseño solo lleva iconos
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? TAB_ICONS[route.name].activo : TAB_ICONS[route.name].inactivo}
            size={size + 2}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Resume" component={Resume} options={{ tabBarAccessibilityLabel: 'Resumen' }} />
      <Tab.Screen name="Movements" component={Movements} options={{ tabBarAccessibilityLabel: 'Movimientos' }} />
      <Tab.Screen name="Goals" component={Goals} options={{ tabBarAccessibilityLabel: 'Metas' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarAccessibilityLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export function AppNavigation() {
  const { usuario, cargando } = useAuth();

  // Mientras se revisa si hay una sesión guardada
  if (cargando) {
    return (
      <View style={[globalStyles.screen, globalStyles.centered]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!usuario ? (
          // Sin sesión: solo se puede iniciar sesión o crear cuenta
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={Register} />
          </>
        ) : !usuario.tiene_hogar ? (
          // Con sesión pero sin hogar: hay que crear uno o unirse a otro
          <Stack.Screen name="CreatePerfil" component={CreatePerfil} />
        ) : (
          // Con sesión y con hogar: la app completa
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            {/* "Nuevo gasto" y "Nueva meta": se abren encima de las pestañas, sin la barra inferior */}
            <Stack.Screen name="Inputs" component={Inputs} options={{ presentation: 'modal' }} />
            <Stack.Screen name="CreateGoal" component={CreateGoal} options={{ presentation: 'modal' }} />
            <Stack.Screen name="CambiarPassword" component={CambiarPassword} options={{ presentation: 'modal' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
