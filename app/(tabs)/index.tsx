import React from "react";
import { useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useDerivedValue, useFrameCallback } from "react-native-reanimated";
import { Canvas } from "@shopify/react-native-skia";

import Wheel from '../../components/Wheel'
import Drop from '../../components/Drop'

export default function Game() {
  const { width, height } = useWindowDimensions();
  const size = width;
  const radius = size / 2;
  const holeRadius = radius / 2;
  const centerX = size / 2;
  const centerY = height - radius;

  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const startAngle = useSharedValue(0);

  let dropColor = "#FF0000"

  const buffers = [
    {
      color: "#FF0000",
      fromAngleDeg: 0,
      toAngleDeg: 120
    },
    {
      color: "#FFFF00",
      fromAngleDeg: 120,
      toAngleDeg: 240
    },
    {
      color: "#0000FF",
      fromAngleDeg: 240,
      toAngleDeg: 360
    }
    
  ]

  const dropY = useSharedValue(0);
  const dropX = centerX;
  const dropRadius = 20;

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      startAngle.value = Math.atan2(e.y - centerY, e.x - centerX);
      console.log('Pan started: ', startAngle.value * (180/Math.PI));
    })
    .onUpdate((e) => {
      const currentAngle = Math.atan2(e.y - centerY, e.x - centerX);
      const delta = currentAngle - startAngle.value;
      rotation.value = savedRotation.value + delta
      // console.log('Rotation:', rotation.value * (180/Math.PI));
    })
    .onEnd(() => {
      savedRotation.value = rotation.value % (2*Math.PI);
      console.log('Saved: ', savedRotation.value * (180/Math.PI));
    })

  const transform = useDerivedValue(() => {
    return [{ rotate: rotation.value }]
  })

  useFrameCallback((frameInfo) => {
    const timeSincePrevFrame = frameInfo.timeSincePreviousFrame;

    if(timeSincePrevFrame == null){
      return;
    }

    const pxToMove = (200 / 1000) * timeSincePrevFrame;

    dropY.value += pxToMove;

    const dropBottom = dropY.value + dropRadius / 1.5;
    const hitZoneY = height - size;

    if(dropBottom >= hitZoneY){
      buffers.forEach((buffer) => {
        if(buffer.color == dropColor){
          const currentRotationDeg = (rotation.value % (2*Math.PI)) * (180/Math.PI);
          const hitAngleDeg = (270 - currentRotationDeg) % 360
          console.log(hitAngleDeg);

          if(hitAngleDeg >= buffer.fromAngleDeg && hitAngleDeg <= buffer.toAngleDeg) {
            console.log("OK")
          } else{
            console.log(":(")
          }
        }
      })
      dropY.value = 0;

    }
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
            <Drop
              dropX={dropX}
              dropY={dropY}
              dropRadius={dropRadius}
              dropColor={dropColor}
            />
        </Canvas>
        
      </GestureDetector>
    </GestureHandlerRootView>
  );

  
}