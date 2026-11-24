import { StyleSheet } from 'react-native';
import { colors, fontFamily, fontSize, fontWeight, radius, sizes, spacing, typography } from './theme';

export const globalStyles = StyleSheet.create({
  // Pantalla completa
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Pantalla blanca, como en los mockups
  sheet: {
    flex: 1,
    backgroundColor: colors.card,
  },
  // Bloque gris claro dentro de una pantalla blanca
  tile: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  screenContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    padding: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
  },

  // Card genérica
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },

  // Filas comunes
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Texto (usa los mismos nombres que `typography`)
  h1: typography.h1,
  h2: typography.h2,
  h3: typography.h3,
  body: typography.body,
  caption: typography.caption,

  // Separador
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },

  // Botón circular (avatar, FAB)
  circle: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ---- Estructura de pantalla ----
  // Cabecera blanca con línea inferior (Metas)
  screenHeader: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  // Cabecera sin línea (Movimientos)
  listHeader: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  // Contenido que se desplaza, con aire alrededor y entre bloques
  screenBody: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  // Contenido de una lista (FlatList)
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: sizes.fabClearance,
  },
  // Cabecera verde grande (Resumen)
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  heroAmount: {
    color: colors.textInverse,
    fontFamily: fontFamily.display,
    fontSize: 44,
    fontWeight: fontWeight.bold,
    marginTop: spacing.sm,
  },
  heroNote: {
    color: colors.primaryLight,
    fontSize: fontSize.md,
    marginTop: spacing.xs,
  },

  // ---- Filas ----
  // Fila dentro de un tile: contenido a los lados
  tileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Icono + texto alineados con espacio entre ellos
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconRowWide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  // ---- Barras de progreso ----
  // Pista blanca: para usarla sobre un tile gris
  progressTrack: {
    height: sizes.progressBar,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  // Pista gris: para usarla sobre fondo blanco
  progressTrackOnWhite: {
    height: sizes.progressBar,
    borderRadius: radius.full,
    backgroundColor: colors.chartTrack,
    overflow: 'hidden',
  },
  progressFill: {
    height: sizes.progressBar,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  progressFillLight: {
    height: sizes.progressBar,
    borderRadius: radius.full,
    backgroundColor: colors.chart,
  },

  // ---- Botón con borde ("Nueva meta") ----
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.card,
  },
  outlineButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },

  // ---- Formularios (pantallas que se abren encima de las pestañas) ----
  formTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  formBody: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  formLabel: {
    ...typography.caption,
    marginTop: spacing.xl,
  },
  // Campo con línea inferior (texto, fecha)
  formField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  formInputText: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  formFooter: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },

  // Texto de acción destructiva ("Eliminar ...") al final de un formulario
  dangerLink: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.xl,
  },
  dangerLinkText: {
    color: colors.danger,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});
