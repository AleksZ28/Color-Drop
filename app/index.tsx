import { Canvas, Group } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { StyleSheet, Text } from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedReaction, useSharedValue } from "react-native-reanimated";

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
import StartButton from "@/components/StartButton";
import { useMenuTransition } from "@/hooks/useMenuTransition";
import { scheduleOnRN } from "react-native-worklets";

function Game() {
  const [fontLoaded] = useFonts(
    {
      Neonderthaw: Neonderthaw_400Regular
    }
  )

  type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER';
  const [gameState, setGameState] = useState<GameState>('MENU');

  const {width, height, radius, centerX, centerY} = useGameDimensions();

  const { panGesture, rotation, transform } = useWheelGesture(centerX, centerY, gameState);

  const { gameStarted, startGame, wheelPosTransform, titleStyle, startButtonStyle, HUDStyle } = useMenuTransition();

  const clock = useSharedValue(0);

  const score = useSharedValue(0);

  const {dropY, dropX, dropRadius, dropColor, shakeX, shakeY, splashTrigger, splashPosition, splashColor, particles, multiplier} = useGameLoop(rotation, clock, score, gameState);

  const shakeAnimatedStyle = useShakeEffect(shakeX, shakeY);

  const handleStartGame = () => {
    startGame();
  };

  useAnimatedReaction(
    () => gameStarted.value,
    (currValue, prevValue) => {
      if (currValue === 1 && prevValue !== 1) {
        runOnJS(setGameState)('PLAYING');
      }
    }
  );

  
  return (
    <GestureHandlerRootView style={[ styles.container, {backgroundColor: Colors.dark.background}]}>

      <Animated.Text style={[styles.title, titleStyle]}><Text style={styles.titleLeft}>Color</Text> <Text style={styles.titleRight}>Drop</Text></Animated.Text>

      <Animated.View style={[styles.startButtonContainer, startButtonStyle]}>
        <StartButton onPress={handleStartGame}/>
      </Animated.View>
      
      {fontLoaded ? (
        <Animated.View style={[styles.container, shakeAnimatedStyle]}>
          
          <Animated.View style={[styles.hud, HUDStyle]}>
            <ScoreCounter score={score} style={styles.score}/>
            <Multiplier multiplier={multiplier} style={[styles.multiplier, {top: centerY - radius + 80 }]}/>
          </Animated.View>

          <GestureDetector gesture={panGesture}>
            <Canvas style={{ width: width, height: height}}>
              <AuroraBackground clock={clock}/>
              <Group transform={wheelPosTransform}>
                <Wheel
                  radius={radius}
                  centerX={centerX}
                  centerY={0}
                  transform={transform}
                />
              </Group>
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
    container: {
      flex: 1
    },

    title: {
      position: 'absolute',
      textAlign: 'center',
      width: "100%",
      fontSize: 60,
      fontWeight: "bold",
      color: "white",
      zIndex: 20,
      top: 0,
    },

    titleLeft: {
      color: "rgba(133, 255, 255, 1)",
      textShadowColor: "rgba(168, 255, 255, 0.75)",
      textShadowRadius: 40,
    },

    titleRight: {
      color: "rgba(255, 98, 216, 1)",
      textShadowColor: "rgba(179, 0, 192, 0.75)",
      textShadowRadius: 40,
    },

    startButtonContainer: {
      position: 'absolute',
      bottom: "10%",
      width: '100%',
      alignItems: 'center',
      zIndex: 30,
    },

    hud: {
      flex: 1,
    },

    score: {
      color: "white",
      position: "absolute",
      top: 50,
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 150,
      fontFamily: "Neonderthaw",
      textShadowColor: "cyan",
      textShadowRadius: 40,
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