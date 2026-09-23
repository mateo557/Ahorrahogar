import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert,TextInput } from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';
import { InputBlanck, AmountInput } from '../components/Input';
import { ScreenProps } from '../types/navigation';
import { LinkButton } from '../components/Buttons';
import { colors,fontSize ,spacing, typography,radius,fontWeight} from '../styles/theme';

type Props = ScreenProps<'Inputs'>;

export function ExampleScreen () {
  return (
     <View style={[globalStyles.screen, { marginTop: spacing.xl }]}>
      <View style={globalStyles.screenContent}>

        <Text style={globalStyles.h1}>Resumen</Text>

        <View style={[globalStyles.card, { marginTop: spacing.lg }]}>
          <Text style={typography.h3}>Balance</Text>
          <Text style={{ color: colors.success }}>$1.240.000</Text>
        </View>

      </View>
    </View>
  );
}

export function MensajeBotton ({ navigation }: Props) {
  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.screenContent}>
    <Text style={globalStyles.h3}>Mi amor si quieres ver algo hermoso</Text>
    <Text style={globalStyles.h3}>Preciona el botón</Text>
    <Button title="Algo hermoso" onPress={() => Alert.alert('Para ti mi amor 🌷')}/> 
    </View> 
          </View>
  );
  }
  export function Inputs ({ navigation }: Props) {
    const [Fecha, setFecha] = useState('');
    const [Nota, setNota] = useState('');
    const [monto, setMonto] = useState('');

  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.screenContent}>
    <Text style={globalStyles.h1}>Nuevo Movimiento</Text>
    <Text style={globalStyles.caption}>Registra los ingresos y gastos</Text>

      <AmountInput
        label="Monto (COP)"
        value={monto}
        onChangeText={setMonto}
      />

     <View style={{marginTop: spacing.lg}}>
      <InputBlanck
        label="Fecha"
        value={Fecha}
        onChangeText={setFecha}
        placeholder="Ej. 01/01/2023"
      />
    </View>
    <View style={{marginTop: spacing.lg}}>
      <InputBlanck
        label="Nota (opcional)"
        value={Nota}
        onChangeText={setNota}
        placeholder="Ej. Compra de alimentos"
      />
    </View>
    <View style={{marginTop: spacing.lg}}>
       <LinkButton title="Guardar Movimiento" onPress={() => {Alert.alert('Datos ingresados con exito'); navigation.navigate('Resume')}} />
      </View>

   
     
          </View>
    </View>
  );
}
