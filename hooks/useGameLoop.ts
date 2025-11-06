import { triggerHapticSuccess, triggerHapticWarning } from "@/utils/haptics";
import { vec } from "@shopify/react-native-skia";
import { SharedValue, useFrameCallback, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useGameDimensions } from "./useGameDimensions";

export function useGameLoop(rotation: SharedValue<number>, clock: SharedValue<number>){

    const {centerX, hitZoneY} = useGameDimensions();

    const score = useSharedValue(0);
    const dropY = useSharedValue(0);
    const dropX = centerX;
    const dropRadius = 20;

    const dropColors = ["#FF0000", "#FFFF00", "#0000FF"];

    const dropColor = useSharedValue(dropColors[Math.floor(Math.random() * dropColors.length)]);
    console.log(dropColor);

    const shakeX = useSharedValue(0);
    const shakeY = useSharedValue(0);

    const splashTrigger = useSharedValue(false);
    const splashPosition = useSharedValue(vec(0, 0));
    const splashColor = useSharedValue("#FF0000")

    const particles = [...Array(15).keys()];

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

    useFrameCallback((frameInfo) => {
        'worklet'
        const timeSincePrevFrame = frameInfo.timeSincePreviousFrame;
    
        if(timeSincePrevFrame == null){
          return;
        }
        
        clock.value = frameInfo.timeSinceFirstFrame;
    
        const pxToMove = (333 / 1000) * timeSincePrevFrame;
    
        dropY.value += pxToMove;
    
        const dropBottom = dropY.value + dropRadius / 1.5;
    
        if(dropBottom >= hitZoneY){
    
          dropY.value = 0;
    
          buffers.forEach((buffer) => {
            if(buffer.color == dropColor.value){
              const currentRotationDeg = (rotation.value % (2*Math.PI)) * (180/Math.PI);
              const hitAngleDeg = (270 - currentRotationDeg) % 360
              console.log(hitAngleDeg);
    
              if(hitAngleDeg >= buffer.fromAngleDeg && hitAngleDeg <= buffer.toAngleDeg) {
                console.log("OK")
                score.value = score.value + 1;
                splashColor.value = dropColor.value
                splashPosition.value = vec(dropX, hitZoneY);
                splashTrigger.value = true;
                scheduleOnRN(triggerHapticSuccess);
              } else{
                console.log(":(")
                score.value = 0; 
                triggerBadHitEffect();
                scheduleOnRN(triggerHapticWarning);
              }
            }
          })

          dropColor.value = dropColors[Math.floor(Math.random() * dropColors.length)];
        }
    })

    return {score, dropY, dropX, dropRadius, dropColor, shakeX, shakeY, splashTrigger, splashPosition, splashColor, particles, buffers, triggerBadHitEffect}
}