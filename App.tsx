import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigation } from './src/navigation/AppNavigation';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Texto oscuro por defecto; el Resumen lo cambia a claro porque tiene cabecera verde */}
      <StatusBar style="dark" />
      <AppNavigation />
    </SafeAreaProvider>
  );
}
