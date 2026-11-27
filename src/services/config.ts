import * as SecureStore from 'expo-secure-store';

// Dirección de la API. Por defecto sale del build (EXPO_PUBLIC_API_URL en eas.json),
// pero se puede cambiar desde la pantalla de inicio de sesión sin volver a compilar.
const CLAVE_URL = 'api_url';
const POR_DEFECTO = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

// Solo se permite cambiarla en desarrollo o en builds que lo activen en eas.json
export const servidorEditable =
  __DEV__ || process.env.EXPO_PUBLIC_SERVIDOR_EDITABLE === 'true';

let actual = POR_DEFECTO;

export const getApiUrl = () => actual;
export const getApiUrlPorDefecto = () => POR_DEFECTO;

// Se llama una vez al abrir la app, antes de cualquier petición
export async function cargarApiUrl(): Promise<void> {
  if (!servidorEditable) return;
  try {
    const guardada = await SecureStore.getItemAsync(CLAVE_URL);
    if (guardada) actual = guardada;
  } catch {
    // Si no se puede leer, se queda con la dirección del build
  }
}

// Devuelve la dirección limpia (sin espacios ni "/" final) o null si no parece una URL
export function normalizarUrl(texto: string): string | null {
  const limpia = texto.trim().replace(/\/+$/, '');
  return /^https?:\/\/[^\s/]+(\/\S*)?$/i.test(limpia) ? limpia : null;
}

export async function guardarApiUrl(url: string): Promise<void> {
  actual = url;
  await SecureStore.setItemAsync(CLAVE_URL, url);
}

export async function restablecerApiUrl(): Promise<void> {
  actual = POR_DEFECTO;
  await SecureStore.deleteItemAsync(CLAVE_URL);
}

// Revisa si la dirección responde. /api/Auth/me exige sesión, así que un 401 significa
// "llegué a la API" sin necesidad de enviar ningún dato.
export async function probarServidor(url: string): Promise<string> {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 6000);
  try {
    const response = await fetch(`${url}/api/Auth/me`, { signal: controlador.signal });
    return response.status === 401 || response.ok
      ? 'Conexión correcta.'
      : `Responde, pero no parece la API (código ${response.status}).`;
  } catch {
    return 'No se pudo conectar. Revisa la dirección, la red y que la API esté encendida.';
  } finally {
    clearTimeout(temporizador);
  }
}
