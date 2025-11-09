import { Easing, Extrapolation, interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGameDimensions } from "./useGameDimensions";

export function useMenuTransition() {
    const insets = useSafeAreaInsets();
    const { height, centerY } = useGameDimensions();

    const gameStarted = useSharedValue(0);

    const startGame = () => {
        gameStarted.value = withTiming(1, {
            duration: 1000,
            easing: Easing.inOut(Easing.cubic),
        })
    }

    const wheelPosTransform = useDerivedValue(() => {
        const menuY = height / 2;
        const gameY = centerY;
        const currentY = interpolate(gameStarted.value, [0, 1], [menuY, gameY], Extrapolation.CLAMP);
        return [{ translateY: currentY }]
      })
    
    const titleStyle = useAnimatedStyle(() => {
        const centerY = insets.top + 50;
        const topY = insets.top;
        
        const translateY = interpolate(gameStarted.value, [0, 1], [centerY, topY], Extrapolation.CLAMP);
        const scale = interpolate(gameStarted.value, [0, 1], [1, 0.4], Extrapolation.CLAMP);
        
        return {
            transform: [{ translateY }, { scale }],
        }
    })
    
    const startButtonStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(gameStarted.value, [0, 1], [1, 0], Extrapolation.CLAMP),
            zIndex: gameStarted.value > 0.5 ? -1 : 50, 
        }
    });
    
    const HUDStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(gameStarted.value, [0.8, 1], [0, 1], Extrapolation.CLAMP),
        };
    })

    return { startGame, wheelPosTransform, titleStyle, startButtonStyle, HUDStyle }

}