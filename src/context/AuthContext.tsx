import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Usuario } from '../types/auth';
import { getMe, login, register, SesionExpirada } from '../services/auth';
import { borrarToken, guardarToken, leerToken } from '../services/session';
import { cargarApiUrl } from '../services/config';

type AuthContextValue = {
  usuario: Usuario | null;
  token: string | null;
  // true mientras se revisa si hay una sesión guardada al abrir la app
  cargando: boolean;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  registrar: (nombre: string, email: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  // Vuelve a pedir los datos del usuario (por ejemplo, después de crear un hogar)
  refrescarUsuario: () => Promise<void>;
  // Reemplaza los datos del usuario con los que devolvió la API
  actualizarUsuario: (usuario: Usuario) => void;
  // Si el error es de sesión vencida cierra la sesión y devuelve true
  manejarError: (e: unknown) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  // Al abrir la app: si hay un token guardado, se valida con la API
  useEffect(() => {
    let activo = true;

    (async () => {
      try {
        // Primero la dirección de la API guardada, porque getMe ya la usa
        await cargarApiUrl();
        const guardado = await leerToken();
        if (!guardado) return;

        const me = await getMe(guardado);
        if (!activo) return;
        setToken(guardado);
        setUsuario(me);
      } catch (e) {
        // Token vencido o inválido: se descarta. Si solo falló la red, simplemente pide iniciar sesión.
        if (e instanceof SesionExpirada) await borrarToken();
      } finally {
        if (activo) setCargando(false);
      }
    })();

    return () => {
      activo = false;
    };
  }, []);

  const iniciarSesion = useCallback(async (email: string, password: string) => {
    const respuesta = await login(email, password);
    await guardarToken(respuesta.token);
    setToken(respuesta.token);
    setUsuario(respuesta.usuario);
  }, []);

  const registrar = useCallback(async (nombre: string, email: string, password: string) => {
    const respuesta = await register(nombre, email, password);
    await guardarToken(respuesta.token);
    setToken(respuesta.token);
    setUsuario(respuesta.usuario);
  }, []);

  const cerrarSesion = useCallback(async () => {
    await borrarToken();
    setToken(null);
    setUsuario(null);
  }, []);

  const refrescarUsuario = useCallback(async () => {
    if (!token) return;
    try {
      setUsuario(await getMe(token));
    } catch (e) {
      if (e instanceof SesionExpirada) await cerrarSesion();
      else throw e;
    }
  }, [token, cerrarSesion]);

  const actualizarUsuario = useCallback((nuevo: Usuario) => setUsuario(nuevo), []);

  const manejarError = useCallback(async (e: unknown) => {
    if (e instanceof SesionExpirada) {
      await cerrarSesion();
      return true;
    }
    return false;
  }, [cerrarSesion]);

  const value = useMemo(
    () => ({
      usuario, token, cargando, iniciarSesion, registrar, cerrarSesion,
      refrescarUsuario, actualizarUsuario, manejarError,
    }),
    [usuario, token, cargando, iniciarSesion, registrar, cerrarSesion, refrescarUsuario, actualizarUsuario, manejarError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
