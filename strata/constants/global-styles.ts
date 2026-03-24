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

  dark700: 'hsl(0, 0%, 16%)',
  dark900: 'hsl(30, 6%, 7%)',

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
  font: 'Manrope',
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
    fontFamily: Fonts.font,
    fontSize: FontSizes.displayXL,
    fontWeight: 700,
    lineHeight: FontSizes.displayXL * 1.2,
  },
  displayL: {
    fontFamily: Fonts.font,
    fontSize: FontSizes.displayL,
    fontWeight: 600,
    lineHeight: FontSizes.displayL * 1.25,
  },
  h1: {
    fontFamily: Fonts.font,
    fontSize: FontSizes.xxl,
    fontWeight: 600,
    lineHeight: FontSizes.xxl * 1.33,
  },
  h2: {
    fontFamily: Fonts.font,
    fontSize: FontSizes.xl,
    fontWeight: 500,
    lineHeight: FontSizes.xl * 1.4,
  },
  h3: {
    fontFamily: Fonts.font,
    fontSize: FontSizes.lg,
    fontWeight: 500,
    lineHeight: FontSizes.lg * 1.44,
  },
  bodyL: {
    fontFamily: Fonts.font,
    fontSize: FontSizes.md,
    fontWeight: 400,
    lineHeight: FontSizes.md * 1.5,

  },
  bodyM: {
    fontFamily: Fonts.font,
    fontSize: FontSizes.sm,
    fontWeight: 400,
    lineHeight: FontSizes.sm * 1.42,
  },
  bodyS: {
    fontFamily: Fonts.font,
    fontSize: FontSizes.xs,
    fontWeight: 400,
    lineHeight: FontSizes.xs * 1.4,
  },
  labelL: {
    fontFamily: Fonts.font,
    fontSize: FontSizes.xs,
    fontWeight: 600,
    lineHeight: FontSizes.xs * 1.33,
    letterSpacing: FontSizes.xs * 0.04,
  },
  labelM: {
    fontFamily: Fonts.font,
    fontSize: FontSizes.xs,
    fontWeight: 500,
    lineHeight: FontSizes.xs * 1.33,
  },
  labelS: {
    fontFamily: Fonts.font,
    fontSize: FontSizes.xxs,
    fontWeight: 500,
    lineHeight: FontSizes.xxs * 1.4,
  },
  cta: {
    fontFamily: Fonts.font,
    fontSize: FontSizes.md,
    fontWeight: 500,
    lineHeight: FontSizes.md * 1.5,
  }
});

export const CommonStyles = StyleSheet.create({

});