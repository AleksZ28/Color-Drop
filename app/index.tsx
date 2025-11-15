import { Canvas, Group } from "@shopify/react-native-skia";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text } from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedReaction, useSharedValue, withTiming } from "react-native-reanimated";
import Drop from '@/components/Drop';
import Particle from "@/components/Particle";
import ScoreCounter from "@/components/ScoreCounter";
import Wheel from '@/components/Wheel';
import AuroraBackground from "@/components/AuroraBackground";
import GameOver from "@/components/GameOver";
import Multiplier from "@/components/Multiplier";
import { useGameDimensions } from "@/hooks/useGameDimensions";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useMenuTransition } from "@/hooks/useMenuTransition";
import { useNeonFlicker } from "@/hooks/useNeonFlicker";
import { useShakeEffect } from "@/hooks/useShakeEffect";
import { useWheelGesture } from "@/hooks/useWheelGesture";
import { getHighScore, storeHighScore } from '@/utils/highScore';
import { Neonderthaw_400Regular, useFonts } from "@expo-google-fonts/neonderthaw";
import { TiltNeon_400Regular } from "@expo-google-fonts/tilt-neon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TutorialOverlay from "@/components/TutorialOverlay";
import NeonButton from "@/components/NeonButton";
import { createDropPlayer, createFailPlayer } from "@/utils/audio";
import { GameState } from "@/types/types";
import { scheduleOnRN } from "react-native-worklets";

function Game() {
  const [fontLoaded] = useFonts(
    {
      Neonderthaw: Neonderthaw_400Regular,
      TiltNeon: TiltNeon_400Regular
    }
  )

  const [gameState, setGameState] = useState<GameState>('MENU');
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const dropPlayer = createDropPlayer();
  const failPlayer = createFailPlayer();

  useEffect(() => {
    const initApp = async () => {
      try {
        const hasPlayed = await AsyncStorage.getItem('has_played_before');
        if (hasPlayed === null) {
          setIsTutorialActive(true);
          setIsPaused(true)
        }
        const highScoreFromStorage = await getHighScore();
        setHighScore(highScoreFromStorage);
        dropPlayer.volume = 0;
        failPlayer.volume = 0;
      } catch (e) {
        console.error(e)
      }
    }

    initApp();
  }, [])

  const handleTutorialStep = () => {
    setTutorialStep(prev => prev + 1);
    setIsTutorialActive(true);
    setIsPaused(true);
  };

  const {width, height, radius, centerX, centerY} = useGameDimensions();
  const { panGesture, rotation, transform } = useWheelGesture(centerX, centerY, gameState, isPaused);
  const { gameStarted, startGame, wheelPosTransform, titleStyle, startButtonStyle, HUDStyle } = useMenuTransition();
  
  const clock = useSharedValue(0);
  const score = useSharedValue(0);

  const onGameOver = useCallback((newScore: number) => {
    if(newScore > highScore){
      setHighScore(newScore);
      storeHighScore(newScore);
    }
    setGameState('GAME_OVER');
    gameStarted.value = withTiming(0, { duration: 500 });
  }, [highScore, storeHighScore, gameStarted])

  const handleSetIsTutorialActiveToFalse = () => {
    setIsTutorialActive(false);
    AsyncStorage.setItem('has_played_before', 'true');
  }

  const {dropY, dropX, dropRadius, dropColor, shakeX, shakeY, splashTrigger, splashPosition, splashColor, particles, multiplier} = useGameLoop(rotation, clock, score, onGameOver, gameState, isTutorialActive, handleSetIsTutorialActiveToFalse, handleTutorialStep, tutorialStep, isPaused, dropPlayer, failPlayer);

  const shakeAnimatedStyle = useShakeEffect(shakeX, shakeY);
  const flickerStyle = useNeonFlicker();

  const handleStartGame = () => {
    score.value = 0;
    multiplier.value = 1;
    startGame();
  };

  const showMenu = () => {
    setGameState('MENU');
  }

  useAnimatedReaction(
    () => gameStarted.value,
    (currValue, prevValue) => {
      if (currValue === 1 && prevValue !== 1) {
        score.value = 0;
        scheduleOnRN(setGameState, 'PLAYING');
      }
    }
  );

  
  return (
    <GestureHandlerRootView style={[ styles.container, {backgroundColor: "#20202aff"}]}>
        
      {fontLoaded && (
        <Animated.Text style={[styles.title, titleStyle, flickerStyle]}><Text style={[styles.titleLeft]}>Color</Text> <Text style={styles.titleRight}>Drop</Text></Animated.Text>
      )}

      <Animated.View style={[styles.startButtonContainer, startButtonStyle]}>
        <NeonButton onPress={handleStartGame} text={'START'}/>
      </Animated.View>
      
      {fontLoaded ? (
        <Animated.View style={[styles.container, shakeAnimatedStyle]}>
          
          <Animated.View style={[styles.hud, HUDStyle]}>
            <ScoreCounter score={score} style={styles.score}/>
            <Multiplier multiplier={multiplier} style={[styles.multiplier, {top: centerY - radius / 2 + 10 }]}/>
          </Animated.View>

          <GestureDetector gesture={panGesture}>
            <Canvas style={{ width: width, height: height }}>
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

      {isTutorialActive && gameState === 'PLAYING' && isPaused && (
        <TutorialOverlay onHide={() => setIsPaused(false)} step={tutorialStep}/>
      )}

      {gameState === "GAME_OVER" && (
        <GameOver score={score} highScore={highScore} showMenu={showMenu}/>
      )
      }
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
      color: "white",
      zIndex: 20,
      top: 0,
      fontFamily: 'TiltNeon'
    },

    titleLeft: {
      color: "rgba(133, 255, 255, 1)",
      textShadowColor: "rgba(168, 255, 255, 0.75)",
      textShadowRadius: 40,
      fontFamily: 'TiltNeon'
    },

    titleRight: {
      color: "rgba(255, 98, 216, 1)",
      textShadowColor: "rgba(179, 0, 192, 0.75)",
      textShadowRadius: 40,
      fontFamily: 'TiltNeon'
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
      top: 75,
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
      fontFamily: "TiltNeon"
    }
})

export default Game; 