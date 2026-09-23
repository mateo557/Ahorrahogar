import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AppStackParamList ={
    Resume:undefined
    Inputs:undefined
    CreatePerfil:undefined
    Movements:undefined
    Login: undefined; 
    Goals:undefined
}

export type ScreenProps<RouteName extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, RouteName>;