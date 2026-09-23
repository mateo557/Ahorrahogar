import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinkButton } from '../components/Buttons';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from "../types/navigation";
import { globalStyles } from '../styles/GlobalStyles';
import { colors,fontSize ,spacing, typography,radius,fontWeight} from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { ScreenProps } from '../types/navigation';
import {GreenCard} from '../components/GreenCards';

type Props = ScreenProps<'Resume'>;


export function Resume ({ navigation }: Props) {
    const insets = useSafeAreaInsets();
    return (

<View style={globalStyles.screen}>
  <View style={globalStyles.screenContent}>

{/* Titulo de la pantalla */}
   <Text style={globalStyles.h2}>Resumen</Text>

{/* Balance disponible */}
<GreenCard variant="primary" style={{ marginTop: spacing.xl,marginBottom: spacing.xs }}>
  <Text style={{ color: colors.primaryLight, fontSize: fontSize.sm }}>
    Balance disponible
  </Text>
  <Text style={{ color: colors.textInverse, fontSize: fontSize.display, fontWeight: fontWeight.bold, marginTop: spacing.xs }}>
    $1.240.000
  </Text>
</GreenCard>

{/* Balance de ingresos y gastos */}
<View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs }}>
<View style={[globalStyles.card, { flex: 1,  flexBasis: 0 }]}>
    <Text style={typography.caption}>Ingresos</Text>
    <Text style={{ color: colors.success }}>$3.200.000</Text>
    </View>

<View style={[globalStyles.card, { flex: 1}]}>
    <Text style={typography.caption}>Gastos</Text>
    <Text style={{ color: colors.danger }}>$1.960.000</Text>
    </View>
</View>

{/* Boton para ir a la pantalla de Movimientos*/}
<View style={{gap: spacing.sm, marginTop: spacing.lg }}>
<View style={[globalStyles.card]}>
<View style={{ width: 7, height: 7, borderRadius: radius.full, backgroundColor: colors.success }} />
    <Text style={typography.caption}>Ahorro del mes</Text>
    <Text style={{ color: colors.warning }}>$1.240.000</Text>
    </View>
    <View>
<Text style={typography.h3}>Registro de movimientos</Text>
</View>
<View style={{flexDirection: 'row',gap: spacing.sm, marginTop: spacing.xs }}>
    
<View style={[{ flex: 1}]}>
 <LinkButton title="Ingresar" onPress={() => navigation.navigate('Inputs')} />
</View>
<View style={[{ flex: 1}]}>
 <LinkButton title="Ver todos" onPress={() => navigation.navigate('Movements')} />
</View>
</View>
</View>
</View>
</View>

  );
};