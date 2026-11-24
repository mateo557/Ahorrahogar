// Lo que devuelve la API: cuánto se gastó en cada categoría en el mes pedido
export interface CategoryTotal {
  categoria_id: number;
  nombre: string;
  total: number;
  porcentaje: number;
}
