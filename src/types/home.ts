export interface Miembro {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'miembro';
}

export interface Hogar {
  id: number;
  nombre: string;
  // Solo viene para el administrador
  codigo_invitacion: string | null;
  miembros: Miembro[];
}

export interface SolicitudHogar {
  id: number;
  integrante_id: number;
  nombre: string;
  email: string;
  creado_en: string;
}
