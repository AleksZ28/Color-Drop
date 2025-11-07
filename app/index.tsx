import { Canvas, center } from "@shopify/react-native-skia";
import React, { useCallback, useState } from "react";
import { StyleSheet } from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue } from "react-native-reanimated";

import Drop from '@/components/Drop';
import Particle from "@/components/Particle";
import ScoreCounter from "@/components/ScoreCounter";
import Wheel from '@/components/Wheel';

import AuroraBackground from "@/components/AuroraBackground";
import { Colors } from "@/constants/theme";
import { useGameDimensions } from "@/hooks/useGameDimensions";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useShakeEffect } from "@/hooks/useShakeEffect";
import { useWheelGesture } from "@/hooks/useWheelGesture";
import { Neonderthaw_400Regular, useFonts } from "@expo-google-fonts/neonderthaw";

function Game() {
  const [fontLoaded] = useFonts(
    {
      Neonderthaw: Neonderthaw_400Regular
    }
  )

  const {width, height, size, radius, centerX, centerY, hitZoneY} = useGameDimensions();

  const { panGesture, rotation, transform } = useWheelGesture(centerX, centerY);

  const clock = useSharedValue(0);

  const [score, setScore] = useState(0);

  const onScoreUpdate = useCallback((points: number) => {
    if(points === 0){
      setScore(0);
    } else{
      setScore((prev) => prev+1)
    }
  }, [])

  const {dropY, dropX, dropRadius, dropColor, shakeX, shakeY, splashTrigger, splashPosition, splashColor, particles, buffers} = useGameLoop(rotation, clock, onScoreUpdate);

  const shakeAnimatedStyle = useShakeEffect(shakeX, shakeY);

  return (
    <GestureHandlerRootView style={{ flex: 1, justifyContent: "flex-end", backgroundColor: Colors.dark.background}}>
      {fontLoaded ? (
        <Animated.View style={shakeAnimatedStyle}>
          <ScoreCounter score={score} scoreStyle={styles.score} digitStyle={styles.scoreDigit}/>
          <GestureDetector gesture={panGesture}>
            <Canvas style={{ width: width, height: height}}>
              <AuroraBackground clock={clock}/>
              <Wheel
                radius={radius}
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
              {particles.map((i) => (
                <Particle
                  key={i}
                  position={splashPosition}
                  trigger={splashTrigger}
                  color={splashColor}
                />
              ))}
            </Canvas>
          </GestureDetector>
        </Animated.View>
      ) : (
        <></>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
    score: {
      position: "absolute",
      top: "10%",
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
    },

    scoreDigit: {
      color: "white",
      fontSize: 150,
      fontFamily: "Neonderthaw",
      textShadowColor: "cyan",
      textShadowRadius: 20,
      minWidth: 112,
      textAlign: "center",
    }
  })

export default Game; 