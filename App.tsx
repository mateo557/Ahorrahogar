import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MesProvider } from './src/context/MesContext';
import { AppNavigation } from './src/navigation/AppNavigation';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Texto oscuro por defecto; el Resumen lo cambia a claro porque tiene cabecera verde */}
      <StatusBar style="dark" />
      <MesProvider>
        <AppNavigation />
      </MesProvider>
    </SafeAreaProvider>
  );
}
