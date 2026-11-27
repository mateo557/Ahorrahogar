import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert,TextInput } from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';
import { InputBlanck } from '../components/Input';
import { ScreenProps } from '../types/navigation';
import { LinkButton } from '../components/Buttons';
import { colors,fontSize ,spacing, typography,radius,fontWeight} from '../styles/theme';

type Props = ScreenProps<'CreatePerfil'>;

export function CreatePerfil ({ navigation }: Props) {
    const [nombre, setNombre] = useState('');
    const [metaAhorro, setMetaAhorro] = useState('');
  return (
    <View style={globalStyles.screen}>
    <View style={globalStyles.screenContent}>
    {/* Titulo de la pantalla */}
      <Text style={globalStyles.h1}>Creemos el perfil del hogar</Text>
      <Text style={globalStyles.body}>Completa la siguiente información para crear el perfil del hogar</Text>

      <View style={{marginTop: spacing.lg}}>
      <InputBlanck
        label="Nombre del hogar"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej. Casa Gamboa"
      />
    </View>
    <View style={{marginTop: spacing.lg}}>
      <InputBlanck
        label="Meta de ahorro mensual (opcional)"
        value={metaAhorro}
        onChangeText={setMetaAhorro}
        placeholder="Ej. $1.000.000"
      />
    </View>
    <View style={{marginTop: spacing.lg}}>
       <LinkButton title="Comenzar" onPress={() => {Alert.alert('Datos ingresados con exito'); navigation.navigate('MainTabs')}} />
      </View>
      </View>
      </View>
  );

};