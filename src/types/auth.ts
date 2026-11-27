export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'miembro';
  hogar_id: number | null;
  hogar_nombre: string | null;
  tiene_hogar: boolean;
  solicitud_pendiente_hogar: string | null;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}
