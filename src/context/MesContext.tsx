import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { compararMes, MesAnio, mesDeHoy, moverMes } from '../utils/format';

type MesContextValue = {
  mes: MesAnio;
  esMesActual: boolean;
  anterior: () => void;
  siguiente: () => void;
};

const MesContext = createContext<MesContextValue | null>(null);

// Guarda SOLO qué mes está elegido. Los datos de ese mes los filtra la API.
// Al estar aquí arriba, Resumen y Movimientos comparten el mismo mes.
export function MesProvider({ children }: { children: ReactNode }) {
  const [mes, setMes] = useState<MesAnio>(mesDeHoy());

  const anterior = useCallback(() => setMes((m) => moverMes(m, -1)), []);
  const siguiente = useCallback(() => setMes((m) => moverMes(m, 1)), []);

  const value = useMemo(
    () => ({ mes, esMesActual: compararMes(mes, mesDeHoy()) >= 0, anterior, siguiente }),
    [mes, anterior, siguiente]
  );

  return <MesContext.Provider value={value}>{children}</MesContext.Provider>;
}

export function useMes() {
  const ctx = useContext(MesContext);
  if (!ctx) throw new Error('useMes debe usarse dentro de <MesProvider>');
  return ctx;
}
