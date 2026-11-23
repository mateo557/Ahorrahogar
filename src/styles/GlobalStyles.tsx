import { StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from './theme';

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
});