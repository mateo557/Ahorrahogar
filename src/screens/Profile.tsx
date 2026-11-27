import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/GlobalStyles';
import { colors, spacing, typography } from '../styles/theme';
import { LinkButton } from '../components/Buttons';
import { TabScreenProps } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { Hogar, SolicitudHogar } from '../types/home';
import {
  getMiHogar, getSolicitudes, regenerarCodigo, removerMiembro, resolverSolicitud, salirDelHogar,
} from '../services/home';

type Props = TabScreenProps<'Profile'>;

export function Profile({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { usuario, cerrarSesion, actualizarUsuario, manejarError } = useAuth();
  const [hogar, setHogar] = useState<Hogar | null>(null);
  const [solicitudes, setSolicitudes] = useState<SolicitudHogar[]>([]);
  const [cargando, setCargando] = useState(true);

  const esAdmin = usuario?.rol === 'admin';

  const mostrarError = async (e: unknown) => {
    if (await manejarError(e)) return;
    Alert.alert('Error', e instanceof Error ? e.message : 'Ocurrió un error');
  };

  const cargar = useCallback(async () => {
    try {
      const h = await getMiHogar();
      setHogar(h);
      setSolicitudes(usuario?.rol === 'admin' ? await getSolicitudes() : []);
    } catch (e) {
      await mostrarError(e);
    } finally {
      setCargando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.rol]);

  // Cada vez que se abre la pestaña se recarga (aparecen solicitudes nuevas)
  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const accion = async (fn: () => Promise<void>) => {
    try {
      await fn();
      await cargar();
    } catch (e) {
      await mostrarError(e);
    }
  };

  const confirmar = (titulo: string, mensaje: string, textoBoton: string, fn: () => Promise<void>) =>
    Alert.alert(titulo, mensaje, [
      { text: 'Cancelar', style: 'cancel' },
      { text: textoBoton, style: 'destructive', onPress: () => { fn(); } },
    ]);

  const compartirCodigo = () =>
    Share.share({ message: `Únete a mi hogar “${hogar?.nombre}” en Ahorrahogar con el código: ${hogar?.codigo_invitacion}` });

  const onRegenerar = () =>
    confirmar('Nuevo código', 'El código anterior dejará de funcionar. ¿Continuar?', 'Generar',
      () => accion(async () => { await regenerarCodigo(); }));

  const onQuitar = (id: number, nombre: string) =>
    confirmar('Quitar del hogar', `¿Quitar a ${nombre}?`, 'Quitar', () => accion(() => removerMiembro(id)));

  const onSalir = () =>
    confirmar('Salir del hogar', 'Perderás el acceso a los movimientos del hogar.', 'Salir',
      async () => {
        try {
          actualizarUsuario(await salirDelHogar());
        } catch (e) {
          await mostrarError(e);
        }
      });

  return (
    <View style={[globalStyles.sheet, { paddingTop: insets.top + spacing.lg }]}>
      <ScrollView
        contentContainerStyle={[globalStyles.scrollPad, { paddingHorizontal: spacing.xl }]}
        showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.h2}>Perfil</Text>

        <View style={[globalStyles.tile, { marginTop: spacing.xl, gap: spacing.xs }]}>
          <Text style={typography.bodyBold}>{usuario?.nombre}</Text>
          <Text style={typography.caption}>{usuario?.email}</Text>
          <Text style={[typography.caption, { marginTop: spacing.sm }]}>
            {usuario?.hogar_nombre} · {esAdmin ? 'Administrador' : 'Miembro'}
          </Text>
        </View>

        {cargando && <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />}

        {esAdmin && hogar?.codigo_invitacion && (
          <>
            <Text style={globalStyles.sectionTitle}>Código de invitación</Text>
            <View style={globalStyles.tile}>
              <Text style={globalStyles.codeText}>{hogar.codigo_invitacion}</Text>
              <View style={[globalStyles.rowActions, { justifyContent: 'center' }]}>
                <Pressable style={globalStyles.smallButton} onPress={compartirCodigo}>
                  <Text style={globalStyles.smallButtonText}>Compartir</Text>
                </Pressable>
                <Pressable style={globalStyles.smallButtonOutline} onPress={onRegenerar}>
                  <Text style={globalStyles.smallButtonOutlineText}>Cambiar código</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}

        {esAdmin && solicitudes.length > 0 && (
          <>
            <Text style={globalStyles.sectionTitle}>Solicitudes pendientes</Text>
            <View style={globalStyles.tile}>
              {solicitudes.map(s => (
                <View key={s.id} style={globalStyles.memberRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={typography.bodyBold}>{s.nombre}</Text>
                    <Text style={typography.caption}>{s.email}</Text>
                  </View>
                  <View style={globalStyles.rowActions}>
                    <Pressable style={globalStyles.smallButton}
                      onPress={() => accion(() => resolverSolicitud(s.id, true))}>
                      <Text style={globalStyles.smallButtonText}>Aceptar</Text>
                    </Pressable>
                    <Pressable style={globalStyles.smallButtonOutline}
                      onPress={() => accion(() => resolverSolicitud(s.id, false))}>
                      <Text style={globalStyles.smallButtonOutlineText}>Rechazar</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {hogar && (
          <>
            <Text style={globalStyles.sectionTitle}>Miembros ({hogar.miembros.length})</Text>
            <View style={globalStyles.tile}>
              {hogar.miembros.map(m => (
                <View key={m.id} style={globalStyles.memberRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={typography.bodyBold}>{m.nombre}</Text>
                    <Text style={typography.caption}>
                      {m.rol === 'admin' ? 'Administrador' : 'Miembro'}
                    </Text>
                  </View>
                  {esAdmin && m.id !== usuario?.id && m.rol !== 'admin' && (
                    <Pressable style={globalStyles.smallButtonOutline} onPress={() => onQuitar(m.id, m.nombre)}>
                      <Text style={globalStyles.smallButtonOutlineText}>Quitar</Text>
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        <Pressable onPress={() => navigation.navigate('CambiarPassword')} accessibilityRole="button">
          <Text style={globalStyles.linkText}>Cambiar contraseña</Text>
        </Pressable>

        <View style={{ marginTop: spacing.sm }}>
          <LinkButton title="Cerrar sesión" onPress={cerrarSesion} />
        </View>

        {!esAdmin && (
          <Pressable style={globalStyles.dangerLink} onPress={onSalir} accessibilityRole="button">
            <Text style={globalStyles.dangerLinkText}>Salir del hogar</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
