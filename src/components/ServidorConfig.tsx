import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';
import { InputBlanck } from './Input';
import {
  getApiUrl, guardarApiUrl, normalizarUrl, probarServidor, restablecerApiUrl, servidorEditable,
} from '../services/config';

// Enlace "Servidor: ..." que abre un campo para cambiar la dirección de la API
export function ServidorConfig() {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState(getApiUrl());
  const [actual, setActual] = useState(getApiUrl());
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  if (!servidorEditable) return null;

  const abrir = () => {
    setTexto(getApiUrl());
    setMensaje(null);
    setAbierto(true);
  };

  const guardar = async () => {
    const url = normalizarUrl(texto);
    if (!url) {
      setMensaje('Escribe una dirección válida, por ejemplo http://192.168.1.10:5000');
      return;
    }
    await guardarApiUrl(url);
    setActual(url);
    setTexto(url);
    setMensaje('Guardada.');
  };

  const probar = async () => {
    const url = normalizarUrl(texto);
    if (!url) {
      setMensaje('Escribe una dirección válida, por ejemplo http://192.168.1.10:5000');
      return;
    }
    setOcupado(true);
    setMensaje('Probando...');
    setMensaje(await probarServidor(url));
    setOcupado(false);
  };

  const restablecer = async () => {
    await restablecerApiUrl();
    setActual(getApiUrl());
    setTexto(getApiUrl());
    setMensaje('Se restableció la dirección original.');
  };

  if (!abierto) {
    return (
      <Pressable style={globalStyles.serverLink} onPress={abrir} accessibilityRole="button">
        <Text style={globalStyles.serverLinkText}>Servidor: {actual || 'sin configurar'}</Text>
      </Pressable>
    );
  }

  return (
    <View style={globalStyles.serverBox}>
      <InputBlanck
        label="Dirección de la API"
        value={texto}
        onChangeText={setTexto}
        placeholder="http://192.168.1.10:5000"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />
      {mensaje && <Text style={globalStyles.caption}>{mensaje}</Text>}
      <View style={globalStyles.rowActions}>
        <Pressable style={globalStyles.smallButton} onPress={guardar}>
          <Text style={globalStyles.smallButtonText}>Guardar</Text>
        </Pressable>
        <Pressable style={globalStyles.smallButton} onPress={probar} disabled={ocupado}>
          <Text style={globalStyles.smallButtonText}>Probar</Text>
        </Pressable>
        <Pressable style={globalStyles.smallButtonOutline} onPress={restablecer}>
          <Text style={globalStyles.smallButtonOutlineText}>Restablecer</Text>
        </Pressable>
        <Pressable style={globalStyles.smallButtonOutline} onPress={() => setAbierto(false)}>
          <Text style={globalStyles.smallButtonOutlineText}>Cerrar</Text>
        </Pressable>
      </View>
    </View>
  );
}
