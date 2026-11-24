import { Member } from '../types/member';
import { Goal } from '../types/goal';
import { Movemnts } from '../types/movements';
import { Category } from '../types/category';
import { Balance } from '../types/balance';
import { CategoryTotal } from '../types/categoryTotal';
import { MesAnio } from '../utils/format';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// El mes se manda a la API como ?anio=2026&mes=11 (mes de 1 a 12). La API es quien filtra.
const filtroMes = ({ anio, mes }: MesAnio) => `anio=${anio}&mes=${mes + 1}`;

// Una sola ruta para todo lo de movimien//const MOVEMENTS_PATH = '/api/Movemnts';

export async function getMembers(): Promise<Member[]> {
  const response = await fetch(`${API_URL}/api/Members`);
  if (!response.ok) {
    throw new Error(`Error ${response.status} al obtener miembros`);
  }
  return response.json();
}

export async function getGoals(): Promise<Goal[]> {
  const response = await fetch(`${API_URL}/api/Goals`);
  if (!response.ok) {
    throw new Error(`Error ${response.status} al obtener objetivos`);
  }
  return response.json();
}


export type NewMovement = Omit<Movemnts, 'id' | 'creado_en'>;

export async function createMovement(data: NewMovement): Promise<Movemnts> {
  console.log('createMovement', JSON.stringify(data));
  const response = await fetch(`${API_URL}/api/Movemnts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Error ${response.status}: ${detail}`);
    
  }
  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/api/Category`);
  if (!response.ok) {
    throw new Error(`Error ${response.status} al obtener categorías`);
  }
  return response.json();
}

export async function getMovements(mes: MesAnio): Promise<Movemnts[]> {
  const response = await fetch(`${API_URL}/api/Movemnts?${filtroMes(mes)}`);
  if (!response.ok) {
    throw new Error(`Error ${response.status} al obtener movimientos`);
  }
  return response.json();
}

export async function getBalance(hogar_id: number, { anio, mes }: MesAnio): Promise<Balance> {
  const url = `${API_URL}/api/Balance/${anio}/${mes + 1}?hogarId=${hogar_id}`;
  console.log('GET', url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error ${response.status} al obtener balance`);
  }
  const data = await response.json();
  console.log('balance', response.status, JSON.stringify(data));
  return data;
}

export async function getGastosPorCategoria(hogar_id: number, { anio, mes }: MesAnio): Promise<CategoryTotal[]> {
  const url = `${API_URL}/api/Balance/${anio}/${mes + 1}/categorias?hogarId=${hogar_id}`;
  console.log('GET', url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error ${response.status} al obtener gastos por categoría`);
  }
  const data = await response.json();
  console.log('gastos por categoría', response.status, JSON.stringify(data));
  return data;
}

export async function updateMovement(id: number, data: NewMovement): Promise<void> {
  const response = await fetch(`${API_URL}/api/Movemnts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...data }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Error ${response.status}: ${detail}`);
  }
}
export async function deleteMovement(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/Movemnts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status} al eliminar el movimiento`);
  }
}