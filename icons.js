import React from 'react';
import Svg, {
  Circle,
  Line,
  Path,
  Rect,
  Polyline
} from 'react-native-svg';

function Base({
  size = 22,
  color = '#fff',
  children,
  viewBox = '0 0 24 24'
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
    >
      {children}
    </Svg>
  );
}

const common = {
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

export function CalculatorIcon({
  size,
  color
}) {
  return (
    <Base size={size} color={color}>
      <Rect
        x="4"
        y="2.5"
        width="16"
        height="19"
        rx="3"
        stroke={color}
        {...common}
      />

      <Line
        x1="7"
        y1="7"
        x2="17"
        y2="7"
        stroke={color}
        {...common}
      />

      <Line
        x1="8"
        y1="12"
        x2="8"
        y2="12"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <Line
        x1="12"
        y1="12"
        x2="12"
        y2="12"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <Line
        x1="16"
        y1="12"
        x2="16"
        y2="12"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <Line
        x1="8"
        y1="17"
        x2="8"
        y2="17"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <Line
        x1="12"
        y1="17"
        x2="12"
        y2="17"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <Line
        x1="16"
        y1="17"
        x2="16"
        y2="17"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Base>
  );
}

export function ClockIcon({
  size,
  color
}) {
  return (
    <Base size={size}>
      <Circle
        cx="12"
        cy="12"
        r="8.5"
        stroke={color}
        {...common}
      />

      <Line
        x1="12"
        y1="7"
        x2="12"
        y2="12"
        stroke={color}
        {...common}
      />

      <Line
        x1="12"
        y1="12"
        x2="16"
        y2="14"
        stroke={color}
        {...common}
      />
    </Base>
  );
}

export function CounterIcon({
  size,
  color
}) {
  return (
    <Base size={size}>
      <Line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
        stroke={color}
        {...common}
      />

      <Line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke={color}
        {...common}
      />
    </Base>
  );
}

export function HelpIcon({
  size,
  color
}) {
  return (
    <Base size={size}>
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        {...common}
      />

      <Path
        d="M9.7 9a2.5 2.5 0 0 1 4.8 1c0 2-2.5 2.2-2.5 4"
        stroke={color}
        {...common}
      />

      <Circle
        cx="12"
        cy="17.4"
        r=".7"
        fill={color}
      />
    </Base>
  );
}

export function TimerIcon({
  size,
  color
}) {
  return (
    <Base size={size}>
      <Circle
        cx="12"
        cy="13"
        r="7.5"
        stroke={color}
        {...common}
      />

      <Line
        x1="12"
        y1="13"
        x2="15"
        y2="10"
        stroke={color}
        {...common}
      />

      <Line
        x1="9"
        y1="3"
        x2="15"
        y2="3"
        stroke={color}
        {...common}
      />

      <Line
        x1="12"
        y1="3"
        x2="12"
        y2="5.5"
        stroke={color}
        {...common}
      />
    </Base>
  );
}

export function StopwatchIcon({
  size,
  color
}) {
  return (
    <Base size={size}>
      <Circle
        cx="12"
        cy="13"
        r="7.7"
        stroke={color}
        {...common}
      />

      <Line
        x1="12"
        y1="13"
        x2="12"
        y2="8.5"
        stroke={color}
        {...common}
      />

      <Line
        x1="12"
        y1="13"
        x2="15.3"
        y2="15"
        stroke={color}
        {...common}
      />

      <Line
        x1="9"
        y1="2.5"
        x2="15"
        y2="2.5"
        stroke={color}
        {...common}
      />

      <Path
        d="M17.5 6.5l1.5-1.5"
        stroke={color}
        {...common}
      />
    </Base>
  );
}

export function FullscreenIcon({
  size,
  color
}) {
  return (
    <Base size={size}>
      <Path
        d="M8 4H4v4"
        stroke={color}
        {...common}
      />

      <Path
        d="M16 4h4v4"
        stroke={color}
        {...common}
      />

      <Path
        d="M20 16v4h-4"
        stroke={color}
        {...common}
      />

      <Path
        d="M8 20H4v-4"
        stroke={color}
        {...common}
      />
    </Base>
  );
}

export function RotateIcon({
  size,
  color
}) {
  return (
    <Base size={size}>
      <Path
        d="M20 11a8 8 0 0 0-14-5"
        stroke={color}
        {...common}
      />

      <Polyline
        points="6 2 6 7 11 7"
        stroke={color}
        {...common}
      />

      <Path
        d="M4 13a8 8 0 0 0 14 5"
        stroke={color}
        {...common}
      />

      <Polyline
        points="18 22 18 17 13 17"
        stroke={color}
        {...common}
      />
    </Base>
  );
}

export function WallpaperIcon({
  size,
  color
}) {
  return (
    <Base size={size}>
      <Rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2.5"
        stroke={color}
        {...common}
      />

      <Circle
        cx="9"
        cy="9"
        r="1.5"
        stroke={color}
        {...common}
      />

      <Path
        d="M4 18l5-5 3.2 3.2 2.2-2.2L20 19"
        stroke={color}
        {...common}
      />
    </Base>
  );
}

export function GalleryIcon({
  size,
  color
}) {
  return (
    <Base size={size}>
      <Rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke={color}
        {...common}
      />

      <Circle
        cx="9"
        cy="9"
        r="1.4"
        fill={color}
      />

      <Path
        d="M5.5 17l4-4 2.8 2.8 2-2L18.5 18"
        stroke={color}
        {...common}
      />
    </Base>
  );
}

export function BackIcon({
  size,
  color
}) {
  return (
    <Base size={size}>
      <Path
        d="M19 12H5"
        stroke={color}
        {...common}
      />

      <Path
        d="M11 6l-6 6 6 6"
        stroke={color}
        {...common}
      />
    </Base>
  );
}

export function ChevronIcon({
  size,
  color,
  direction = 'down'
}) {
  const rotation = {
    down: '0',
    up: '180',
    left: '90',
    right: '-90'
  }[direction];

  return (
    <Svg
      width={size || 20}
      height={size || 20}
      viewBox="0 0 24 24"
    >
      <Path
        d="M5 9l7 7 7-7"
        fill="none"
        stroke={color}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={`rotate(${rotation} 12 12)`}
      />
    </Svg>
  );
}

export function MenuIcon({
  size = 22,
  color = '#fff'
}) {
  return (
    <Base size={size}>
      <Line
        x1="5"
        y1="7"
        x2="19"
        y2="7"
        stroke={color}
        {...common}
      />

      <Line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke={color}
        {...common}
      />

      <Line
        x1="5"
        y1="17"
        x2="19"
        y2="17"
        stroke={color}
        {...common}
      />
    </Base>
  );
}
