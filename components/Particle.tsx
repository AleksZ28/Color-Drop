import React from "react"
import { Circle, vec, SkPoint, Group, BlurMask } from "@shopify/react-native-skia"
import { Easing, interpolate, SharedValue, useAnimatedReaction, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";


interface ParticleProps{
    position: SharedValue<SkPoint>; 
    trigger: SharedValue<boolean>;
    color: SharedValue<string>;
}

function random(min: number, max: number){
    'worklet'
    return Math.random() * (max - min) + min;
} 

export default function Particle({position, trigger, color}: ParticleProps){
    const progress = useSharedValue(0);

    const startX = useSharedValue(0);
    const startY = useSharedValue(0);
    const endX = useSharedValue(0);
    const endY = useSharedValue(0);
    
    useAnimatedReaction(
        () => trigger.value,
        (active) => {
            if (active) {
                startX.value = position.value.x;
                startY.value = position.value.y;

                endX.value = startX.value + random(-75, 75);
                endY.value = startY.value + random(-65, -10);

                progress.value = withTiming(
                    1,
                    { 
                        duration: 600,
                        easing: Easing.out(Easing.ease)
                    },
                    () => {
                        progress.value = 0;
                        trigger.value = false;
                    }
                )
            }
        }
    )

    const animatedPosition = useDerivedValue(() => {
        return vec(
            interpolate(progress.value, [0, 1], [startX.value, endX.value]),
            interpolate(progress.value, [0, 0.45, 1], [startY.value, endY.value, startY.value + 30]),
        )
    })

    const animatedR = useDerivedValue(() => {
        return interpolate(progress.value, [0, 0.01, 1], [0, 10, 0]);
    })

    const animatedOpacity = useDerivedValue(() => {
        return interpolate(progress.value, [0, 0.75, 1], [1, 0.7, 0]);
    })

    return (
        <Group>
            <Circle
                c={animatedPosition}
                r={animatedR}
                opacity={0.5}
                color={color}
            >
                <BlurMask blur={30}/>
            </Circle>
            <Circle
                c={animatedPosition}
                r={animatedR}
                opacity={animatedOpacity}
                color={color}
            />
        </Group>
        
    )
}