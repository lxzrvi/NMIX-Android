import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNMixSettings } from './useNMixSettings';
import { RotateIcon, WallpaperIcon, BackIcon } from './icons';

const FONTS_LIST = ['Poppins', 'Inter', 'Outfit', 'Nunito', 'Quicksand'];
const COLOR_OPTIONS = ['#4ADE80', '#60A5FA', '#C084FC', '#FB923C', '#F43F5E', '#FFFFFF'];

export default function FullscreenClock({ visible, onClose, wallpaperUri, onOpenWallpaperPicker }) {
  const insets = useSafeAreaInsets();
  const { selectedFont, changeSelectedFont, animSpeed } = useNMixSettings();

  const [controlsVisible, setControlsVisible] = useState(true);
  const [clockColor, setClockColor] = useState('#FFFFFF');
  const [currentTime, setCurrentTime] = useState(new Date());

  const controlsOpacity = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleControls = () => {
    const toVal = controlsVisible ? 0 : 1;
    Animated.timing(controlsOpacity, {
      toValue: toVal,
      duration: 300 * animSpeed,
      useNativeDriver: true,
    }).start(() => setControlsVisible(!controlsVisible));
  };

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} style={styles.container} onPress={toggleControls}>
        {/* Wallpaper Layer */}
        {wallpaperUri ? (
          <Image source={{ uri: wallpaperUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#090D16' }]} />
        )}

        {/* Readability Overlay */}
        <View style={styles.darkOverlay} />

        {/* Dynamic Notch / Safe Top Space */}
        <Animated.View style={[styles.headerControls, { paddingTop: insets.top + 10, opacity: controlsOpacity }]}>
          {/* Swipable Font Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carouselScroll}>
            {FONTS_LIST.map((font) => (
              <TouchableOpacity
                key={font}
                style={[styles.carouselChip, selectedFont === font && styles.activeChip]}
                onPress={() => changeSelectedFont(font)}
              >
                <Text style={[styles.chipText, { fontFamily: `${font}-Regular` }]}>{font}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Swipable Color Picker */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carouselScroll}>
            {COLOR_OPTIONS.map((col) => (
              <TouchableOpacity
                key={col}
                style={[styles.colorDot, { backgroundColor: col }, clockColor === col && styles.activeColorDot]}
                onPress={() => setClockColor(col)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Main Clock Content */}
        <View style={styles.centerClock}>
          <Text style={[styles.timeText, { color: clockColor, fontFamily: `${selectedFont}-Bold` }]}>
            {formattedTime}
          </Text>
          <Text style={[styles.dateText, { color: clockColor + 'CC', fontFamily: `${selectedFont}-Regular` }]}>
            {formattedDate}
          </Text>
          <Text style={[styles.brandText, { color: clockColor + '88', fontFamily: 'CinzelDecorative-Bold' }]}>
            NMIX • LOCAL TIME
          </Text>
        </View>

        {/* Bottom Floating Control Buttons */}
        <Animated.View style={[styles.bottomControls, { paddingBottom: insets.bottom + 20, opacity: controlsOpacity }]}>
          <TouchableOpacity style={styles.iconBtn} onPress={onOpenWallpaperPicker}>
            <WallpaperIcon color="#FFF" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
            <BackIcon color="#FFF" size={24} />
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  headerControls: {
    paddingHorizontal: 16,
    gap: 10,
  },
  carouselScroll: {
    flexDirection: 'row',
  },
  carouselChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  chipText: {
    color: '#FFF',
    fontSize: 13,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeColorDot: {
    borderColor: '#FFF',
  },
  centerClock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 56,
    includeFontPadding: false,
  },
  dateText: {
    fontSize: 18,
    marginTop: 8,
  },
  brandText: {
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 16,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
