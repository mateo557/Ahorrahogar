import { leerToken } from './session';
import { SesionExpirada } from './auth';
import { getApiUrl } from './config';


// Llama a la API con el token de la sesión. Si el token ya no sirve lanza SesionExpirada.
export async function authFetch(ruta: string, opciones: RequestInit = {}): Promise<Response> {
  const token = await leerToken();
  const response = await fetch(`${getApiUrl()}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(opciones.headers ?? {}),
      Authorization: `Bearer ${token ?? ''}`,
    },
  });
  if (response.status === 401) throw new SesionExpirada();
  return response;
}

// Los errores de la API llegan como texto plano (a veces entre comillas)
export async function mensajeDeError(response: Response, porDefecto: string): Promise<string> {
  if (response.status === 429) return 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.';
  const texto = await response.text();
  return texto ? texto.replace(/^"|"$/g, '') : porDefecto;
}
