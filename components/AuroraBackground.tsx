import { Blur, Group } from '@shopify/react-native-skia';
import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import Blob from './Blob';


interface AuroraBackgroundProps {
  clock: SharedValue<number>;
}

const red = "#FF0000C0";
const yellow = "#ffff00C0";
const blue = "#0000FFC0";

export default function AuroraBackground({ clock }: AuroraBackgroundProps) {
  return (
    <Group>
      <Blur blur={100}/> 
      <Blob clock={clock} shift={1} color={red} baseRadius={50}/>
      <Blob clock={clock} shift={1.3} color={yellow} baseRadius={100}/>
      <Blob clock={clock} shift={0.8} color={blue} baseRadius={80}/>
    </Group>
  )
}