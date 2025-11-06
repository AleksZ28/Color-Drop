import { SharedValue, useAnimatedStyle } from "react-native-reanimated";

export function useShakeEffect(shakeX: SharedValue<number>, shakeY: SharedValue<number>){
    
    return useAnimatedStyle(() => ({
        transform: [
            { translateX: shakeX.value },
            { translateY: shakeY.value },
        ],
    }))
}