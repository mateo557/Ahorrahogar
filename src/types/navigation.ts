import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Movemnts } from './movements';

export type AppStackParamList ={
    Resume:undefined
    Inputs: { movement?: Movemnts } | undefined;
    CreatePerfil:undefined
    NewMovement: undefined;
    Movements:undefined
    Login: undefined; 
    Goals:undefined;
    
}

export type ScreenProps<RouteName extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, RouteName>;