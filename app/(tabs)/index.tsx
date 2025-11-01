import React from "react";
import { useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import {useSharedValue, useDerivedValue} from "react-native-reanimated";
import { Canvas } from "@shopify/react-native-skia";

import Wheel from '../../components/Wheel'

export default function Game() {
  const { width, height } = useWindowDimensions();
  const size = width;
  const radius = size / 2;
  const holeRadius = radius / 2;
  const centerX = size / 2;
  const centerY = height - radius;

  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const startAngleRef = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      startAngleRef.value = Math.atan2(e.y - centerY, e.x - centerX);
      console.log('Pan started: ', startAngleRef.value * (180/Math.PI));
    })
    .onUpdate((e) => {
      const currentAngle = Math.atan2(e.y - centerY, e.x - centerX);
      const delta = currentAngle - startAngleRef.value;
      rotation.value = savedRotation.value + delta
      console.log('Rotation:', rotation.value * (180/Math.PI));
    })
    .onEnd(() => {
      savedRotation.value = rotation.value % (2*Math.PI);
      console.log('Saved: ', savedRotation.value * (180/Math.PI));
    })

  const transform = useDerivedValue(() => {
    return [{ rotate: rotation.value }]
  })


  return (
    <GestureHandlerRootView style={{ flex: 1, justifyContent: "flex-end", marginBlockEnd: 10 }}>
      <GestureDetector gesture={panGesture}>
        <Canvas style={{ width: width, height: height }}>
            <Wheel
              radius={radius}
              holeRadius={holeRadius}
              centerX={centerX}
              centerY={centerY}
              transform={transform}
            />
        </Canvas>
        
      </GestureDetector>
    </GestureHandlerRootView>
  );

  
}