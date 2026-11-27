import { Goal } from '../types/goal';
import { Movemnts } from '../types/movements';
import { Category } from '../types/category';
import { Balance } from '../types/balance';
import { CategoryTotal } from '../types/categoryTotal';
import { MesAnio } from '../utils/format';
import { authFetch, mensajeDeError } from './http';


const filtroMes = ({ anio, mes }: MesAnio) => `anio=${anio}&mes=${mes + 1}`;

async function pedir<T>(ruta: string, metodo: string, cuerpo: object | undefined, error: string): Promise<T> {
  const response = await authFetch(ruta, {
    method: metodo,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  if (!response.ok) throw new Error(await mensajeDeError(response, error));
  return response.json();
}

async function pedirSinRespuesta(ruta: string, metodo: string, cuerpo: object | undefined, error: string): Promise<void> {
  const response = await authFetch(ruta, {
    method: metodo,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  if (!response.ok) throw new Error(await mensajeDeError(response, error));
}

// ---- Metas ----
export type NewGoal = Pick<Goal, 'nombre' | 'montoobjetivo' | 'fechalimite'>;

export const getGoals = () => pedir<Goal[]>('/api/Goal', 'GET', undefined, 'No se pudieron obtener las metas');
export const createGoal = (data: NewGoal) => pedir<Goal>('/api/Goal', 'POST', data, 'No se pudo crear la meta');
export const updateGoal = (id: number, data: NewGoal) =>
  pedirSinRespuesta(`/api/Goal/${id}`, 'PUT', { id, ...data }, 'No se pudo actualizar la meta');
export const deleteGoal = (id: number) =>
  pedirSinRespuesta(`/api/Goal/${id}`, 'DELETE', undefined, 'No se pudo eliminar la meta');

// ---- Movimientos ----
export type NewMovement = Omit<Movemnts, 'id' | 'hogar_id' | 'creado_en'>;

export const getMovements = (mes: MesAnio) =>
  pedir<Movemnts[]>(`/api/Movemnts?${filtroMes(mes)}`, 'GET', undefined, 'No se pudieron obtener los movimientos');
export const createMovement = (data: NewMovement) =>
  pedir<Movemnts>('/api/Movemnts', 'POST', data, 'No se pudo guardar el movimiento');
export const updateMovement = (id: number, data: NewMovement) =>
  pedirSinRespuesta(`/api/Movemnts/${id}`, 'PUT', { id, ...data }, 'No se pudo actualizar el movimiento');
export const deleteMovement = (id: number) =>
  pedirSinRespuesta(`/api/Movemnts/${id}`, 'DELETE', undefined, 'No se pudo eliminar el movimiento');

// ---- Categorías ----
export const getCategories = () =>
  pedir<Category[]>('/api/Category', 'GET', undefined, 'No se pudieron obtener las categorías');

// ---- Balance del mes ----
export const getBalance = ({ anio, mes }: MesAnio) =>
  pedir<Balance>(`/api/Balance/${anio}/${mes + 1}`, 'GET', undefined, 'No se pudo obtener el balance');
export const getGastosPorCategoria = ({ anio, mes }: MesAnio) =>
  pedir<CategoryTotal[]>(`/api/Balance/${anio}/${mes + 1}/categorias`, 'GET', undefined, 'No se pudieron obtener los gastos por categoría');
