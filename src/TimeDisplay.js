import React from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export function getTimeParts(
  date = new Date()
) {
  const hour24 =
    date.getHours();

  const hour12 =
    hour24 % 12 || 12;

  return {
    hour12:
      String(
        hour12
      ).padStart(
        2,
        '0'
      ),

    hour24:
      String(
        hour24
      ).padStart(
        2,
        '0'
      ),

    minute:
      String(
        date.getMinutes()
      ).padStart(
        2,
        '0'
      ),

    second:
      String(
        date.getSeconds()
      ).padStart(
        2,
        '0'
      ),

    period:
      hour24 >= 12
        ? 'PM'
        : 'AM'
  };
}

export default function TimeDisplay({
  value,
  color,
  fontFamily,
  periodFontFamily,
  large = false
}) {
  const parsed =
    parseTime(value);

  if (!parsed) {
    return (
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.3}
        style={[
          styles.normal,
          large &&
            styles.normalLarge,
          {
            color,
            fontFamily
          }
        ]}
      >
        {value}
      </Text>
    );
  }

  return (
    <View
      style={
        styles.row
      }
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.45}
        style={[
          styles.time,
          large &&
            styles.timeLarge,
          {
            color,
            fontFamily
          }
        ]}
      >
        {parsed.time}
      </Text>

      {!!parsed.period && (
        <Text
          style={[
            styles.period,
            large &&
              styles.periodLarge,
            {
              color,
              fontFamily:
                periodFontFamily ||
                fontFamily
            }
          ]}
        >
          {parsed.period}
        </Text>
      )}
    </View>
  );
}

function parseTime(value) {
  const text =
    String(value)
      .trim();

  const match =
    text.match(
      /^(\d{1,2}:\d{2}(?::\d{2})?)\s*(AM|PM)$/i
    );

  if (!match) {
    return null;
  }

  return {
    time:
      match[1],

    period:
      match[2]
        .toUpperCase()
  };
}

const styles =
  StyleSheet.create({
    row: {
      width: '100%',

      flexDirection:
        'row',

      justifyContent:
        'center',

      alignItems:
        'baseline',

      paddingHorizontal: 8
    },

    time: {
      flexShrink: 1,

      fontSize: 40,

      lineHeight: 50,

      textAlign:
        'center',

      includeFontPadding:
        false
    },

    period: {
      marginLeft: 7,

      fontSize: 13,

      lineHeight: 18,

      opacity: 0.72,

      includeFontPadding:
        false
    },

    timeLarge: {
      fontSize: 82,

      lineHeight: 100
    },

    periodLarge: {
      marginLeft: 10,

      marginBottom: 12,

      fontSize: 18,

      lineHeight: 24
    },

    normal: {
      width: '94%',

      fontSize: 40,

      lineHeight: 50,

      textAlign:
        'center',

      includeFontPadding:
        false
    },

    normalLarge: {
      fontSize: 82,

      lineHeight: 100
    }
  });
