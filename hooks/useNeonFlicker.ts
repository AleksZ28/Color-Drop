import { useEffect } from "react";
import { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";

export function useNeonFlicker() {
    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(
        withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0.4, { duration: 50 }),
            withTiming(1, { duration: 50 }),
            withDelay(1000, withTiming(0.6, { duration: 100 })),
            withTiming(1, { duration: 100 }),
            withDelay(500, withSequence(
                withTiming(0.2, { duration: 50 }),
                withTiming(0.8, { duration: 50 }),
                withTiming(0.1, { duration: 50 }),
                withTiming(1, { duration: 100 })
            ))
        ),
        -1,
        false
        );
    }, []);

    const flickerStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return flickerStyle;
}