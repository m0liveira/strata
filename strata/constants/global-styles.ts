import { StyleSheet } from 'react-native';

export const Colors = {
  coral100: 'hsl(13, 91%, 95%)',
  coral200: 'hsl(13, 91%, 92%)',
  coral300: 'hsl(14, 91%, 87%)',
  coral400: 'hsl(14, 91%, 77%)',
  coral500: 'hsl(14, 91%, 67%)',
  coral900: 'hsl(14, 91%, 37%)',

  blue100: 'hsl(206, 92%, 95%)',
  blue200: 'hsl(206, 92%, 92%)',
  blue300: 'hsl(206, 92%, 87%)',
  blue400: 'hsl(205, 92%, 77%)',
  blue500: 'hsl(205, 92%, 67%)',
  blue900: 'hsl(205, 92%, 37%)',

  grey100: 'hsl(0, 0%, 97%)',
  grey200: 'hsl(0, 0%, 94%)',
  grey300: 'hsl(0, 0%, 87%)',
  grey400: 'hsl(0, 0%, 75%)',
  grey600: 'hsl(0, 0%, 40%)',

  secondaryDark: 'hsl(0, 0%, 16%)',
  primaryDark: 'hsl(30, 6%, 7%)',

  gold: 'hsl(53, 80%, 54%)',

  white: 'hsl(0, 0%, 100%)',
  white70: 'hsla(0, 0%, 100%, 0.7)',
  white40: 'hsla(0, 0%, 100%, 0.4)'
};

export const Theme = {
  light: { ...Colors },
  dark: { ...Colors }
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

export const Fonts = {
  manrope100: 'Manrope100',
  manrope200: 'Manrope200',
  manrope300: 'Manrope300',
  manrope400: 'Manrope400',
  manrope500: 'Manrope500',
  manrope600: 'Manrope600',
  manrope700: 'Manrope700',
};

export const FontSizes = {
  xxs: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  displayL: 32,
  displayXL: 40,
};

export const Typography = StyleSheet.create({
  displayXL: {
    fontFamily: Fonts.manrope700,
    fontSize: FontSizes.displayXL,
    lineHeight: FontSizes.displayXL * 1.2,
  },
  displayL: {
    fontFamily: Fonts.manrope600,
    fontSize: FontSizes.displayL,
    lineHeight: FontSizes.displayL * 1.25,
  },
  h1: {
    fontFamily: Fonts.manrope600,
    fontSize: FontSizes.xxl,
    lineHeight: FontSizes.xxl * 1.33,
  },
  h2: {
    fontFamily: Fonts.manrope500,
    fontSize: FontSizes.xl,
    lineHeight: FontSizes.xl * 1.4,
  },
  h3: {
    fontFamily: Fonts.manrope500,
    fontSize: FontSizes.lg,
    lineHeight: FontSizes.lg * 1.44,
  },
  bodyL: {
    fontFamily: Fonts.manrope400,
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * 1.5,

  },
  bodyM: {
    fontFamily: Fonts.manrope400,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.42,
  },
  bodyS: {
    fontFamily: Fonts.manrope400,
    fontSize: FontSizes.xs,
    lineHeight: FontSizes.xs * 1.4,
  },
  labelL: {
    fontFamily: Fonts.manrope600,
    fontSize: FontSizes.xs,
    lineHeight: FontSizes.xs * 1.33,
    letterSpacing: FontSizes.xs * 0.04,
  },
  labelM: {
    fontFamily: Fonts.manrope500,
    fontSize: FontSizes.xs,
    lineHeight: FontSizes.xs * 1.33,
  },
  labelS: {
    fontFamily: Fonts.manrope500,
    fontSize: FontSizes.xxs,
    lineHeight: FontSizes.xxs * 1.4,
  },
  cta: {
    fontFamily: Fonts.manrope500,
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * 1.5,
  }
});

export const CommonStyles = StyleSheet.create({
  page: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.coral100,
    paddingHorizontal: 40,
    paddingVertical: 55,
  },
  scrollView: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  glow: {
    position: "absolute",
    top: '15%',
    left: '20%',
    zIndex: 0,
    filter: 'blur(25px)',
  },
});