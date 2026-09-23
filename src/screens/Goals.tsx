import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';
import { ScreenProps } from '../types/navigation';

type Props = ScreenProps<'Goals'>;

export function Goals ({ navigation }: Props) {
  return (
    <View style={globalStyles.screen}>
      <Text style={globalStyles.h1}>Estas son las metas</Text>
      <StatusBar style="auto" />
      <View style={globalStyles.screen}>
        <Button title="Ir a Home"   onPress={() => navigation.navigate('Inputs')} />
      
    </View> 
    </View>
    
  );
}
