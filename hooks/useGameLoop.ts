import { triggerHapticSuccess, triggerHapticWarning } from "@/utils/haptics";
import { vec } from "@shopify/react-native-skia";
import { runOnJS, SharedValue, useFrameCallback, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useGameDimensions } from "./useGameDimensions";
import { useEffect } from "react";
import { AudioPlayer } from "expo-audio";

export type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER';

const dropColors = ["#FF0000", "#FFFF00", "#0000FF", "#FF8000", "#00FF00", "#FF00FF"];

const tutorialSequence = ["#FF0000", "#FFFF00", "#FF8000", "#0000FF"];

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
  },
  {
    color: "#FF8000",
    fromAngleDeg: 100,
    toAngleDeg: 140
  },
  {
    color: "#00FF00",
    fromAngleDeg: 220,
    toAngleDeg: 260
  },
  {
    color: "#FF00FF",
    fromAngleDeg: 340,
    toAngleDeg: 20
  }
  ]

export function useGameLoop(
    rotation: SharedValue<number>,
    clock: SharedValue<number>,
    score: SharedValue<number>,
    onGameOver: (finalScore: number) => void,
    gameState: GameState, isTutorialActive: boolean,
    onTutorialComplete: () => void,
    onTutorialStep: () => void,
    tutorialStep: number,
    isPaused: boolean,
    dropPlayer: AudioPlayer,
    failPlayer: AudioPlayer
  ){

    const playDropSound = () => {
      if (!dropPlayer) return;
      dropPlayer.seekTo(0);
      dropPlayer.play();
    };

    const playFailSound = () => {
      if (!failPlayer) return;
      failPlayer.seekTo(0);
      failPlayer.play();
    };

    const {centerX, hitZoneY} = useGameDimensions();

    const dropY = useSharedValue(-50);
    const dropX = centerX;
    const dropRadius = 20;

    const dropColor = useSharedValue(isTutorialActive ? tutorialSequence[0] : dropColors[Math.floor(Math.random() * 3)]);

    const hasGameStarted = useSharedValue(false);

    useEffect(() => {
      if (gameState === 'PLAYING') {
        if (isTutorialActive){
          dropColor.value = tutorialSequence[0];
        } else {
          dropColor.value = dropColors[Math.floor(Math.random() * 3)];
        }

        if(!hasGameStarted.value){
          playDropSound();
          playFailSound();
          
          hasGameStarted.value = true;

          dropPlayer.volume = 1;
          failPlayer.volume = 1;
        }
        
        score.value = 0;
        lives.value = 2;
        speedResetDone.value = false;
        multiplier.value = 1;
        multiplierGapClock.value = 0;
        dropY.value = -50;
        frameCallback.setActive(true);
      } else{
        frameCallback.setActive(false);
      }

    }, [gameState]);

    const shakeX = useSharedValue(0);
    const shakeY = useSharedValue(0);

    const splashTrigger = useSharedValue(false);
    const splashPosition = useSharedValue(vec(0, 0));
    const splashColor = useSharedValue("#FF0000")

    const particles = [...Array(15).keys()];

    const multiplier = useSharedValue(1);
    const multiplierGapClock = useSharedValue(0);
    

    const triggerBadHitEffect = () => {
      'worklet';
      shakeX.value = withSequence(
        withTiming(-10, { duration: 30 }),
        withTiming(10, { duration: 30 }),
        withTiming(-10, { duration: 30 }),
        withTiming(10, { duration: 30 }),
        withTiming(0, { duration: 30 })
      );
      shakeY.value = withSequence(
        withTiming(5, { duration: 30 }),
        withTiming(-5, { duration: 30 }),
        withTiming(5, { duration: 30 }),
        withTiming(-5, { duration: 30 }),
        withTiming(0, { duration: 30 })
      );
    };

    const baseSpeed = useSharedValue(300)
    const speed = useSharedValue(300);
    const speedResetDone = useSharedValue(false);

    const lives = useSharedValue(2);

    const frameCallback = useFrameCallback((frameInfo) => {

        'worklet'

        if (gameState !== 'PLAYING' || isPaused) {
          return;
        }

        if (isTutorialActive){
          baseSpeed.value = 150;
        } else{
          baseSpeed.value = 300;
        }

        const timeSincePrevFrame = frameInfo.timeSincePreviousFrame;
    
        if(timeSincePrevFrame == null){
          return;
        }
        
        clock.value += frameInfo.timeSincePreviousFrame ?? frameInfo.timeSinceFirstFrame;

        if (score.value >= 100 && !speedResetDone.value) {
          speed.value = baseSpeed.value - 25;
          speedResetDone.value = true;
        } else {
          if(speedResetDone.value){
            speed.value = baseSpeed.value - 25 + (score.value) / 4;
          } else{
            speed.value = baseSpeed.value + score.value * 2;
          }
        }

        // console.log(speed.value);

        const pxToMove = (speed.value / 1000) * timeSincePrevFrame;
    
        dropY.value += pxToMove;
    
        const dropBottom = dropY.value + dropRadius / 1.5;
    
        if(dropBottom >= hitZoneY){
    
          dropY.value = -50;

          let correctHit = false;
    
          buffers.forEach((buffer) => {
            if(buffer.color == dropColor.value){
              const currentRotationDeg = (rotation.value % (2*Math.PI)) * (180/Math.PI);
              const hitAngleDeg = ((270 - currentRotationDeg) % 360 + 360) % 360
              // console.log(hitAngleDeg);

              const isWrapping = buffer.fromAngleDeg > buffer.toAngleDeg;

              if(!isWrapping){
                if(hitAngleDeg >= buffer.fromAngleDeg && hitAngleDeg < buffer.toAngleDeg){
                  correctHit = true;
                }
              } else{
                if (hitAngleDeg >= buffer.fromAngleDeg || hitAngleDeg < buffer.toAngleDeg) {
                  correctHit = true;
                }
              }
    
              if(correctHit) {
                score.value += 1 * multiplier.value;
                multiplierGapClock.value += 1;
                if(multiplierGapClock.value === 3){
                  multiplier.value += 1;
                  multiplierGapClock.value = 0;
                }
                splashColor.value = dropColor.value
                splashPosition.value = vec(dropX, hitZoneY);
                splashTrigger.value = true;
                runOnJS(playDropSound)();
                scheduleOnRN(triggerHapticSuccess);
              } else{
                lives.value -= 1;

                if(lives.value === 0){
                  runOnJS(onGameOver)(score.value);
                }
                
                runOnJS(playFailSound)()
                triggerBadHitEffect();
                scheduleOnRN(triggerHapticWarning);
              }
            }
          })

          if(isTutorialActive){
            if(correctHit){
              if(tutorialStep < tutorialSequence.length - 1) {
                dropColor.value = tutorialSequence[tutorialStep+1];
                runOnJS(onTutorialStep)();
              } else {
                dropColor.value = dropColors[Math.floor(Math.random() * 3)];
                runOnJS(onTutorialComplete)();
              }
            } else{
              dropColor.value = tutorialSequence[tutorialStep];
              lives.value += 1;
            }
            
          } else{
            if(score.value > 100){
              dropColor.value = dropColors[Math.floor(Math.random() * dropColors.length)];
            } else{
              dropColor.value = dropColors[Math.floor(Math.random() * 3)];
            }
          }
        }
    })

    return {dropY, dropX, dropRadius, dropColor, shakeX, shakeY, splashTrigger, splashPosition, splashColor, particles, buffers, multiplier, triggerBadHitEffect}
} 