export interface Goal {
  id: number;
  hogar_Id: number;
  nombre: string;
  montoobjetivo: number;
  fechalimite: string;
  creado_En: string;
  // Opcionales: cuando la API los devuelva, la pantalla de Metas muestra la barra de progreso
  montoahorrado?: number;
  porcentaje?: number; // 0 a 100, calculado por la API

}
