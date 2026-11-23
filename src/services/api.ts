import { Member } from '../types/member';
import { Goal } from '../types/goal';
import { Movemnts } from '../types/movements';
import { Category } from '../types/category';
import { Balance } from '../types/balance';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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

export async function getMovements(): Promise<Movemnts[]> {
  const response = await fetch(`${API_URL}/api/Movemnts`);
  if (!response.ok) {
    throw new Error(`Error ${response.status} al obtener movimientos`);
  }
  return response.json();
}

export async function getBalance(hogar_id: number): Promise<Balance> {
  const response = await fetch(`${API_URL}/api/Balance/${hogar_id}`);
  if (!response.ok) {
    throw new Error(`Error ${response.status} al obtener balance`);
  }
  return response.json();
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