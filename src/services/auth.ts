import { AuthResponse, Usuario } from '../types/auth';
import { getApiUrl } from './config';

// El token ya no sirve (venció o no es válido): hay que iniciar sesión otra vez
export class SesionExpirada extends Error {
  constructor() {
    super('Tu sesión expiró. Inicia sesión otra vez.');
  }
}

// Convierte la respuesta de error de la API en un mensaje para mostrar
async function mensajeDeError(response: Response, porDefecto: string): Promise<string> {
  if (response.status === 429) return 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.';
  if (response.status === 400) return 'Revisa los datos ingresados. La contraseña debe tener al menos 8 caracteres.';

  const texto = await response.text();
  // Los mensajes de la API llegan como texto plano (a veces entre comillas)
  return texto ? texto.replace(/^"|"$/g, '') : porDefecto;
}

async function enviar(ruta: string, cuerpo: object): Promise<Response> {
  return fetch(`${getApiUrl()}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await enviar('/api/Auth/login', { email, password });
  if (!response.ok) throw new Error(await mensajeDeError(response, 'No se pudo iniciar sesión'));
  return response.json();
}

export async function register(nombre: string, email: string, password: string): Promise<AuthResponse> {
  const response = await enviar('/api/Auth/register', { nombre, email, password });
  if (!response.ok) throw new Error(await mensajeDeError(response, 'No se pudo crear la cuenta'));
  return response.json();
}

// Quién soy y si ya tengo hogar
export async function getMe(token: string): Promise<Usuario> {
  const response = await fetch(`${getApiUrl()}/api/Auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 401) throw new SesionExpirada();
  if (!response.ok) throw new Error(`Error ${response.status} al cargar tu perfil`);
  return response.json();
}
