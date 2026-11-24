import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppStackParamList, TabParamList } from '../types/navigation';
import { colors } from '../styles/theme';
import { Resume } from '../screens/Resume';
import { Movements } from '../screens/Movements';
import { Goals } from '../screens/Goals';
import { Profile } from '../screens/Profile';
import { Inputs } from '../screens/Inputs';
import { CreateGoal } from '../screens/CreateGoal';
import { CreatePerfil } from '../screens/CreatePerfil';
import { LoginScreen } from '../screens/Login';

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
  return (
    <NavigationContainer>
      {/* TODO: cuando el login funcione, cambiar initialRouteName a "Login" */}
      <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreatePerfil" component={CreatePerfil} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        {/* "Nuevo gasto": se abre encima de las pestañas, sin la barra inferior */}
        <Stack.Screen name="Inputs" component={Inputs} options={{ presentation: 'modal' }} />
        {/* "Nueva meta": también encima de las pestañas */}
        <Stack.Screen name="CreateGoal" component={CreateGoal} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
