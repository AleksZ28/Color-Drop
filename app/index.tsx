import { Canvas } from "@shopify/react-native-skia";
import React from "react";
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
import Multiplier from "@/components/Multiplier";

function Game() {
  const [fontLoaded] = useFonts(
    {
      Neonderthaw: Neonderthaw_400Regular
    }
  )

  const {width, height, radius, centerX, centerY} = useGameDimensions();

  const { panGesture, rotation, transform } = useWheelGesture(centerX, centerY);

  const clock = useSharedValue(0);

  const score = useSharedValue(0);

  const {dropY, dropX, dropRadius, dropColor, shakeX, shakeY, splashTrigger, splashPosition, splashColor, particles, multiplier} = useGameLoop(rotation, clock, score);

  const shakeAnimatedStyle = useShakeEffect(shakeX, shakeY);

  return (
    <GestureHandlerRootView style={{ flex: 1, justifyContent: "flex-end", backgroundColor: Colors.dark.background}}>
      {fontLoaded ? (
        <Animated.View style={shakeAnimatedStyle}>
          <ScoreCounter score={score} style={styles.score}/>
          <Multiplier multiplier={multiplier} style={[styles.multiplier, {bottom: radius + 50 - 25}]}/>
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
      color: "white",
      position: "absolute",
      top: "10%",
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 150,
      fontFamily: "Neonderthaw",
      textShadowColor: "cyan",
      textShadowRadius: 20,
    },

    multiplier: {
      color: "white",
      position: "absolute",
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 50,
    }
})

export default Game; 