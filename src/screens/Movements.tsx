import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';
import { ScreenProps } from '../types/navigation';
import { LinkButton } from '../components/Buttons';
import { colors,fontSize ,spacing, typography,radius,fontWeight} from '../styles/theme';

type Props = ScreenProps<'Movements'>;

export function Movements ({ navigation }: Props) {
  return (
    <View style={globalStyles.screenContent}>
      {/* Titulo de la pantalla */}
      <Text style={globalStyles.h2}>Movimientos</Text>
      
      {/* Descripcion de la pantalla */}
      <Text style={[globalStyles.body, { marginBottom: spacing.sm }]}>Todo lo que ha entrado y salido este mes</Text>
      
      {/* Ingresos */}
      <Text style={[globalStyles.caption, { marginTop: spacing.sm }]}>Hoy, 22 Sep</Text>
      <View style={[globalStyles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs, marginBottom: spacing.sm }]}>
    <Text style={typography.body}>Salario</Text>
    <Text style={{ color: colors.success }}>$2.100.000</Text>
    </View>
    {/* Gastos */}
     <View style={[globalStyles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs }]}>
    <Text style={typography.body}>Mercado</Text>
    <Text style={{ color: colors.danger }}>-$1.000.000</Text>
    </View>

     {/* Transporte */}
     <View style={[globalStyles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs }]}>
    <Text style={typography.body}>Transporte</Text>
    <Text style={{ color: colors.danger }}>-$280.000</Text>
    </View>

    {/* Servicios */}
     <View style={[globalStyles.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs }]}>
    <Text style={typography.body}>Servicios</Text>
    <Text style={{ color: colors.danger }}>-$350.000</Text>
    </View>





      <View style={{flexDirection: 'row', gap: 10, marginTop: 20}}>
       <LinkButton title="Ir a Resumen" onPress={() => navigation.navigate('Resume')} />
      </View>
    
    </View>
  );
}