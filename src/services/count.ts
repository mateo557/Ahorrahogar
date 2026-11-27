import { authFetch, mensajeDeError } from './http';

export async function cambiarPassword(passwordActual: string, passwordNueva: string): Promise<void> {
  const response = await authFetch('/api/Auth/cambiar-password', {
    method: 'POST',
    body: JSON.stringify({ password_actual: passwordActual, password_nueva: passwordNueva }),
  });
  if (response.status === 400) {
    // Puede ser "contraseña actual incorrecta" (texto) o un error de validación (JSON)
    const texto = await response.text();
    const esJson = texto.trim().startsWith('{');
    throw new Error(
      esJson ? 'La nueva contraseña debe tener entre 8 y 72 caracteres.' : texto.replace(/^"|"$/g, '')
    );
  }
  if (!response.ok) throw new Error(await mensajeDeError(response, 'No se pudo cambiar la contraseña'));
}
