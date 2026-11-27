import { Usuario } from '../types/auth';
import { Hogar, SolicitudHogar } from '../types/home';
import { authFetch, mensajeDeError } from './http';

async function pedir<T>(ruta: string, metodo: string, cuerpo: object | undefined, error: string): Promise<T> {
  const response = await authFetch(ruta, {
    method: metodo,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  if (!response.ok) throw new Error(await mensajeDeError(response, error));
  return response.json();
}

async function pedirSinRespuesta(ruta: string, metodo: string, error: string): Promise<void> {
  const response = await authFetch(ruta, { method: metodo });
  if (!response.ok) throw new Error(await mensajeDeError(response, error));
}

export const crearHogar = (nombre: string) =>
  pedir<Usuario>('/api/Home', 'POST', { nombre }, 'No se pudo crear el hogar');

export const getMiHogar = () =>
  pedir<Hogar>('/api/Home/mi-hogar', 'GET', undefined, 'No se pudo cargar tu hogar');

export const unirseConCodigo = (codigo: string) =>
  pedir<Usuario>('/api/Home/unirse', 'POST', { codigo }, 'No se pudo enviar la solicitud');

export const cancelarSolicitud = () =>
  pedir<Usuario>('/api/Home/mi-solicitud', 'DELETE', undefined, 'No se pudo cancelar la solicitud');

export const getSolicitudes = () =>
  pedir<SolicitudHogar[]>('/api/Home/solicitudes', 'GET', undefined, 'No se pudieron cargar las solicitudes');

export const resolverSolicitud = (id: number, aceptar: boolean) =>
  pedirSinRespuesta(
    `/api/Home/solicitudes/${id}/${aceptar ? 'aceptar' : 'rechazar'}`,
    'POST',
    'No se pudo responder la solicitud'
  );

export async function regenerarCodigo(): Promise<string> {
  const r = await pedir<{ codigo_invitacion: string }>(
    '/api/Home/codigo/regenerar', 'POST', undefined, 'No se pudo generar el código'
  );
  return r.codigo_invitacion;
}

export const removerMiembro = (id: number) =>
  pedirSinRespuesta(`/api/Home/miembros/${id}`, 'DELETE', 'No se pudo quitar a la persona');

export const salirDelHogar = () =>
  pedir<Usuario>('/api/Home/salir', 'POST', undefined, 'No se pudo salir del hogar');
