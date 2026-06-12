export const Colors = {
  primary: '#1A5C45',
  primaryMid: '#2E7D60',
  primaryLight: '#4CAF82',
  primaryPale: '#D6EDE5',
  primaryMint: '#E8F5F0',
  bgMain: '#F0F0EC',
  bgDark: '#1A4035',
  bgWhite: '#FFFFFF',
  textDark: '#1A2E25',
  textBody: '#3D3D3D',
  textMuted: '#7A8C84',
  textLight: '#FFFFFF',
  textGreen: '#1A5C45',
  accentOrange: '#E07050',
  accentCheck: '#2E7D60',
  border: '#E0E0DA',
  shadow: 'rgba(26,92,69,0.12)',
  overlay: 'rgba(0,0,0,0.4)',
};

// Font family constants — use these everywhere instead of fontFamily:'serif'
export const Fonts = {
  regular: 'PlayfairDisplay_400Regular',
  bold: 'PlayfairDisplay_700Bold',
  regularItalic: 'PlayfairDisplay_400Regular_Italic',
  boldItalic: 'PlayfairDisplay_700Bold_Italic',
};

export const Typography = {
  displayLarge: {
    fontFamily: 'PlayfairDisplay_700Bold_Italic',
    fontSize: 32,
    color: Colors.textLight,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontFamily: 'PlayfairDisplay_700Bold_Italic',
    fontSize: 26,
    color: Colors.textDark,
    letterSpacing: -0.3,
  },
  heading: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: Colors.textDark,
    letterSpacing: -0.2,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textDark,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textBody,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.textMuted,
    lineHeight: 17,
  },
  label: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.textDark,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Image paths — update these when you add your real assets
export const Images = {
  logo: require('../assets/images/logo.png'),
  logoIcon: require('../assets/images/logo-icon.png'),
  checkmark: require('../assets/images/checkmark.png'),
  onboardingHero: require('../assets/images/onboarding-hero.png'),
  incidents: {
    violence: require('../assets/images/incident-violence.png'),
    harassment: require('../assets/images/incident-harassment.png'),
    suspicious: require('../assets/images/incident-suspicious.png'),
    domestic: require('../assets/images/incident-domestic.png'),
    child: require('../assets/images/incident-child.png'),
    threat: require('../assets/images/incident-threat.png'),
    stalking: require('../assets/images/incident-stalking.png'),
    control: require('../assets/images/incident-control.png'),
    disturbance: require('../assets/images/incident-disturbance.png'),
    other: require('../assets/images/incident-other.png'),
  },
};
