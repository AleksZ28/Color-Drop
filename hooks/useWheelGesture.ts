import { Gesture } from "react-native-gesture-handler";
import { useDerivedValue, useFrameCallback, useSharedValue } from "react-native-reanimated";
import { GameState } from "./useGameLoop";

export function useWheelGesture(centerX: number, centerY: number, gameState: GameState, isPaused: boolean){
    const rotation = useSharedValue(0);
    const savedRotation = useSharedValue(0);
    const startAngle = useSharedValue(0);

    const transform = useDerivedValue(() => {
        return [{ rotate: rotation.value }]
    })

    useFrameCallback(() => {
        'worklet';
        if (gameState !== 'PLAYING') {
            rotation.value += 0.005;
            savedRotation.value = rotation.value;
        }
    });

    const panGesture = Gesture.Pan()
        .enabled(gameState === "PLAYING" && !isPaused)
        .onStart((e) => {
            'worklet'
            startAngle.value = Math.atan2(e.y - centerY, e.x - centerX);
        })
        .onUpdate((e) => {
            'worklet'
            const currentAngle = Math.atan2(e.y - centerY, e.x - centerX);
            const delta = currentAngle - startAngle.value;
            rotation.value = savedRotation.value + delta
        })
        .onEnd(() => {
            'worklet'
            savedRotation.value = rotation.value % (2*Math.PI);
        })

    return {panGesture, rotation, transform}
}

