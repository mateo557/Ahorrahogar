import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { globalStyles } from '../styles/GlobalStyles';
import { InputBlanck } from '../components/Input';
import { ScreenProps } from '../types/navigation';
import { LinkButton } from '../components/Buttons';
import { colors, spacing } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import { cancelarSolicitud, crearHogar, unirseConCodigo } from '../services/home';

type Props = ScreenProps<'CreatePerfil'>;
type Modo = 'crear' | 'unirse';

const SEGUNDOS_REVISION = 10;

// Se muestra cuando el usuario ya inició sesión pero todavía no tiene hogar
export function CreatePerfil(_: Props) {
  const { usuario, cerrarSesion, actualizarUsuario, refrescarUsuario, manejarError } = useAuth();
  const [modo, setModo] = useState<Modo>('crear');
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const esperando = usuario?.solicitud_pendiente_hogar != null;

  // Mientras espera respuesta, revisa cada pocos segundos si ya lo aceptaron
  useEffect(() => {
    if (!esperando) return;
    const id = setInterval(() => {
      refrescarUsuario().catch(() => undefined);
    }, SEGUNDOS_REVISION * 1000);
    return () => clearInterval(id);
  }, [esperando, refrescarUsuario]);

  // Ejecuta una acción mostrando el error en pantalla (o saliendo si la sesión venció)
  const ejecutar = async (accion: () => Promise<void>) => {
    setError(null);
    setEnviando(true);
    try {
      await accion();
    } catch (e) {
      if (await manejarError(e)) return;
      setError(e instanceof Error ? e.message : 'Ocurrió un error');
    } finally {
      setEnviando(false);
    }
  };

  const onCrear = () => ejecutar(async () => actualizarUsuario(await crearHogar(nombre.trim())));
  const onUnirse = () => ejecutar(async () => actualizarUsuario(await unirseConCodigo(codigo.trim())));
  const onCancelar = () => ejecutar(async () => actualizarUsuario(await cancelarSolicitud()));
  const onActualizar = () => ejecutar(refrescarUsuario);

  if (esperando) {
    return (
      <View style={globalStyles.screen}>
        <View style={globalStyles.screenContent}>
          <Text style={globalStyles.h1}>Solicitud enviada</Text>
          <Text style={globalStyles.body}>
            Esperando que el administrador de “{usuario?.solicitud_pendiente_hogar}” te acepte.
            Esta pantalla se actualiza sola.
          </Text>

          {error && <Text style={globalStyles.errorText}>{error}</Text>}

          <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
            {enviando ? <ActivityIndicator color={colors.primary} /> : (
              <>
                <LinkButton title="Actualizar" onPress={onActualizar} />
                <Pressable onPress={onCancelar} accessibilityRole="button">
                  <Text style={globalStyles.dangerLinkText}>Cancelar solicitud</Text>
                </Pressable>
              </>
            )}
          </View>

          <Pressable onPress={cerrarSesion} accessibilityRole="button">
            <Text style={globalStyles.linkText}>Cerrar sesión</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const puedeEnviar = modo === 'crear' ? nombre.trim().length >= 2 : codigo.trim().length >= 4;

  return (
    <View style={globalStyles.screen}>
      <View style={globalStyles.screenContent}>
        <Text style={globalStyles.h1}>Hola, {usuario?.nombre}</Text>
        <Text style={globalStyles.body}>Para empezar crea un hogar o únete al de alguien más.</Text>

        <View style={globalStyles.segment}>
          {(['crear', 'unirse'] as Modo[]).map(m => (
            <Pressable
              key={m}
              style={[globalStyles.segmentItem, modo === m && globalStyles.segmentItemActive]}
              onPress={() => { setModo(m); setError(null); }}
              accessibilityRole="button">
              <Text style={[globalStyles.segmentText, modo === m && globalStyles.segmentTextActive]}>
                {m === 'crear' ? 'Crear hogar' : 'Unirme con código'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: spacing.lg }}>
          {modo === 'crear' ? (
            <InputBlanck
              label="Nombre del hogar"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej. Casa Gamboa"
            />
          ) : (
            <InputBlanck
              label="Código de invitación"
              value={codigo}
              onChangeText={t => setCodigo(t.toUpperCase())}
              placeholder="Ej. K7M2QX"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={8}
            />
          )}
          {error && <Text style={globalStyles.errorText}>{error}</Text>}
        </View>

        <View style={{ marginTop: spacing.lg }}>
          {enviando ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <LinkButton
              title={modo === 'crear' ? 'Crear hogar' : 'Enviar solicitud'}
              onPress={puedeEnviar ? (modo === 'crear' ? onCrear : onUnirse) : () => undefined}
            />
          )}
        </View>

        <Pressable onPress={cerrarSesion} accessibilityRole="button">
          <Text style={globalStyles.linkText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}
