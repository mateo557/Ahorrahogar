//Colores de la app
export const colors = {
  // Marca / primario
  primary: '#2e5339',
  primaryLight: '#e3efe4',
  primaryDark: '#1f3b28',

  // Estados (éxito, error, advertencia)
  success: '#2e7d4f',
  successLight: '#e3efe4',
  danger: '#c0523f',
  dangerLight: '#f7e3df',
  warning: '#c98a3e',
  warningLight: '#f7ecd9',
  info: '#3e7ec9',
  infoLight: '#dbe9f7',

  // Fondos
  background: '#f2efe9',
  backgroundAlt: '#f7f5f1',
  card: '#ffffff',

  // Texto
  textPrimary: '#1c1c1c',
  textSecondary: '#888888',
  textTertiary: '#aaaaaa',
  textInverse: '#ffffff',

  // Bordes / líneas
  border: '#eeeeee',
  divider: '#e0e0e0',

  // Utilidad
  overlay: 'rgba(0,0,0,0.4)',
  transparent: 'transparent',
  disabled: '#cccccc',
};

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  base: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  display: 34,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
//Tamaño de los iconos
export const iconSize = {
  sm: 16,
  md: 20,
  lg: 26,
  xl: 32,
};
//Bordes Redondos
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999, // círculos perfectos (avatares, FAB)
};
// Espaciado entre margenes y paddings
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Tipografía
export const typography = {
  h1: { fontSize: fontSize.display, fontWeight: fontWeight.bold, color: colors.textPrimary },
  h2: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.textPrimary },
  h3: { fontSize: fontSize.xl, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  body: { fontSize: fontSize.base, fontWeight: fontWeight.regular, color: colors.textPrimary },
  bodyBold: { fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  caption: { fontSize: fontSize.sm, fontWeight: fontWeight.regular, color: colors.textSecondary },
  label: { fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: colors.textSecondary },
};

export const button = {
  primary: {
    background: colors.primary,
    text: colors.textInverse,
    border: 'transparent',
  },
  secondary: {
    background: colors.primaryLight,
    text: colors.primary,
    border: 'transparent',
  },
  outline: {
    background: 'transparent',
    text: colors.primary,
    border: colors.primary,
  },
  danger: {
    background: colors.danger,
    text: colors.textInverse,
    border: 'transparent',
  },
  disabled: {
    background: colors.disabled,
    text: colors.textTertiary,
    border: 'transparent',
  },
};