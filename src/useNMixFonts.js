import { useFonts } from 'expo-font';

export default function useNMixFonts() {
  const [loaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),

    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),

    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),

    'Nunito-Regular': require('../assets/fonts/Nunito-Regular.ttf'),
    'Nunito-Bold': require('../assets/fonts/Nunito-Bold.ttf'),

    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),

    'CinzelDecorative-Bold':
      require('../assets/fonts/CinzelDecorative-Bold.ttf')
  });

  return loaded;
}

export function fontFamily(name, bold = false) {
  const available = [
    'Poppins',
    'Inter',
    'Outfit',
    'Nunito',
    'Quicksand'
  ];

  const selected = available.includes(name)
    ? name
    : 'Poppins';

  return `${selected}-${bold ? 'Bold' : 'Regular'}`;
}

export const logoFont = 'CinzelDecorative-Bold';
