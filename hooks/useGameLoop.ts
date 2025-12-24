import { baseSpeedValue, buffers, dropColors, dropRadiusValue, livesCount, multiplierThreshold, speedMultiplier, tutorialSequence, tutorialSpeedValue } from "@/constants/gameConfig";
import { GameState } from "@/types/types";
import { triggerHapticSuccess, triggerHapticWarning } from "@/utils/haptics";
import { vec } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { SharedValue, useFrameCallback, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useGameDimensions } from "./useGameDimensions";

export function useGameLoop(
    rotation: SharedValue<number>,
    clock: SharedValue<number>,
    score: SharedValue<number>,
    onGameOver: (finalScore: number) => void,
    gameState: GameState, isTutorialActive: boolean,
    onTutorialComplete: () => void,
    onTutorialStep: () => void,
    tutorialStep: number,
    isPaused: boolean
  ){

    const {centerX, hitZoneY, height} = useGameDimensions();

    const dropY = useSharedValue(-50);
    const dropX = centerX;
    const dropRadius = dropRadiusValue;
    const dropColor = useSharedValue(isTutorialActive ? tutorialSequence[0] : dropColors[Math.floor(Math.random() * 3)]);

    const shakeX = useSharedValue(0);
    const shakeY = useSharedValue(0);

    const splashTrigger = useSharedValue(false);
    const splashPosition = useSharedValue(vec(0, 0));
    const splashColor = useSharedValue("#FF0000")

    const particles = [...Array(15).keys()];

    const multiplier = useSharedValue(1);
    const multiplierGapClock = useSharedValue(0);

    const baseSpeed = useSharedValue(baseSpeedValue)
    const speed = useSharedValue(baseSpeedValue);
    const speedResetDone = useSharedValue(false);

    const lives = useSharedValue(livesCount);

    useEffect(() => {
      if (gameState === 'PLAYING') {
        if (isTutorialActive){
          dropColor.value = tutorialSequence[0];
        } else {
          dropColor.value = dropColors[Math.floor(Math.random() * 3)];
        }
        
        score.value = 0;
        lives.value = livesCount;
        speedResetDone.value = false;
        multiplier.value = 1;
        multiplierGapClock.value = 0;
        dropY.value = -50;
        frameCallback.setActive(true);
      } else{
        frameCallback.setActive(false);
      }

    }, [gameState]);

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

    const frameCallback = useFrameCallback((frameInfo) => {

        'worklet'

        if (gameState !== 'PLAYING' || isPaused) {
          return;
        }

        if (isTutorialActive){
          baseSpeed.value = tutorialSpeedValue;
        } else{
          baseSpeed.value = baseSpeedValue;
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
            speed.value = baseSpeed.value + score.value * speedMultiplier;
          }
        }

        const pxToMove = ((speed.value / 1000) * timeSincePrevFrame) * (height / 900);
    
        dropY.value += pxToMove;
    
        const dropBottom = dropY.value + dropRadius / 1.5;
    
        if(dropBottom >= hitZoneY){
    
          dropY.value = -50;

          let correctHit = false;
    
          buffers.forEach((buffer) => {
            if(buffer.color == dropColor.value){
              const currentRotationDeg = (rotation.value % (2*Math.PI)) * (180/Math.PI);
              const hitAngleDeg = ((270 - currentRotationDeg) % 360 + 360) % 360

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
                if(multiplierGapClock.value === multiplierThreshold){
                  multiplier.value += 1;
                  multiplierGapClock.value = 0;
                }
                splashColor.value = dropColor.value
                splashPosition.value = vec(dropX, hitZoneY);
                splashTrigger.value = true;
                scheduleOnRN(triggerHapticSuccess);
              } else{
                lives.value -= 1;

                if(lives.value === 0){
                  scheduleOnRN(onGameOver, score.value);
                }
                
                triggerBadHitEffect();
                scheduleOnRN(triggerHapticWarning);
              }
            }
          })

          if(isTutorialActive){
            if(correctHit){
              if(tutorialStep < tutorialSequence.length - 1) {
                dropColor.value = tutorialSequence[tutorialStep+1];
                scheduleOnRN(onTutorialStep);
              } else {
                dropColor.value = dropColors[Math.floor(Math.random() * 3)];
                scheduleOnRN(onTutorialComplete);
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