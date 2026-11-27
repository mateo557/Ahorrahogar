import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { Movemnts } from './movements';
import { Goal } from './goal';

// Pestañas de la barra inferior
export type TabParamList = {
  Resume: undefined;
  Movements: undefined;
  Goals: undefined;
  Profile: undefined;
};

// Pantallas que van por encima de las pestañas (sin barra inferior)
export type AppStackParamList = {
  Login: undefined;
  Register: undefined;
  CreatePerfil: undefined;
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  Inputs: { movement?: Movemnts } | undefined;
  CreateGoal: { goal?: Goal } | undefined;
  CambiarPassword: undefined;
};

// Para pantallas que están en el stack (Login, Register, CreatePerfil, Inputs, CreateGoal)
export type ScreenProps<RouteName extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, RouteName>;

// Para pantallas que están dentro de las pestañas (Resume, Movements, Goals, Profile)
export type TabScreenProps<RouteName extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, RouteName>,
  NativeStackScreenProps<AppStackParamList>
>;
