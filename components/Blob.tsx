import { Circle, vec } from '@shopify/react-native-skia';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

interface BlobProps {
  clock: SharedValue<number>;
  shift: number;
  color: string;
  baseRadius: number;
}

export default function Blob({ clock, shift, color, baseRadius }: BlobProps) {
  const { width, height } = useWindowDimensions();
  const center = vec(width / 2, height / 2);

  const animatedC = useDerivedValue(() => {
    'worklet';
    const timeX = clock.value * 0.00015 * shift;
    const timeY = clock.value * 0.0003 * shift;
    return vec(
      center.x + Math.sin(timeX) * (width / 3),
      center.y + Math.cos(timeY) * (height / 3)
    )
  }, [clock, center, shift, width, height])

  const animatedR = useDerivedValue(() => {
    'worklet';
    const time = clock.value * 0.001 * shift;
    return baseRadius + Math.sin(time) * 50;
  }, [clock, shift, baseRadius])

  return (
    <Circle c={animatedC} r={animatedR} color={color} />
  )
}