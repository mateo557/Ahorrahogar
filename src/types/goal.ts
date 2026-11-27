export interface Goal {
  hogar_Id: number;
  nombre: string;
  montoobjetivo: number;
  fechalimite: string;
  creado_En: string;
  // Opcional: cuando la API lo devuelva, la pantalla de Metas muestra la barra de progreso
  montoahorrado?: number;
}
