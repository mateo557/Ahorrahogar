const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// "1240000" -> "1.240.000"
export const formatMiles = (digitos: string) => digitos.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// 1240000 -> "$1.240.000"
export const formatCOP = (n: number) =>
  (n < 0 ? '-' : '') + '$' + formatMiles(String(Math.abs(Math.round(n))));

// Date -> "27 ago 2026"
export const formatFechaCorta = (d: Date) =>
  `${d.getDate()} ${MESES_CORTOS[d.getMonth()]} ${d.getFullYear()}`;

// "2026-11-18" o "2026-11-18T00:00:00" -> Date en hora local
export const fechaDesdeTexto = (s: string) => new Date(`${s.slice(0, 10)}T00:00:00`);

// Mes actual: nombre para mostrar y prefijo "2026-11" para filtrar fechas de la API
export function mesActual(hoy = new Date()) {
  return {
    nombre: MESES[hoy.getMonth()],
    prefijo: `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`,
  };
}
