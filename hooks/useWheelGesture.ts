import { Gesture } from "react-native-gesture-handler";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

export function useWheelGesture(centerX: number, centerY: number){
    const rotation = useSharedValue(0);
    const savedRotation = useSharedValue(0);
    const startAngle = useSharedValue(0);

    const transform = useDerivedValue(() => {
        return [{ rotate: rotation.value }]
    })

    const panGesture = Gesture.Pan()
        .onStart((e) => {
            'worklet'
            startAngle.value = Math.atan2(e.y - centerY, e.x - centerX);
            console.log('Pan started: ', startAngle.value * (180/Math.PI));
        })
        .onUpdate((e) => {
            'worklet'
            const currentAngle = Math.atan2(e.y - centerY, e.x - centerX);
            const delta = currentAngle - startAngle.value;
            rotation.value = savedRotation.value + delta
            // console.log('Rotation:', rotation.value * (180/Math.PI));
        })
        .onEnd(() => {
            'worklet'
            savedRotation.value = rotation.value % (2*Math.PI);
            console.log('Saved: ', savedRotation.value * (180/Math.PI));
        })

    return {panGesture, rotation, transform}
}

