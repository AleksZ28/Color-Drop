import { TextInput, TextStyle } from "react-native";
import Animated, { interpolateColor, SharedValue, useAnimatedProps, useAnimatedReaction, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface ScoreCounterProps {
    score: SharedValue<number>;
    style: TextStyle;
}

const normalColor = "#ffffff";
const goodColor = "#7596dd";
const badColor = "#ff0000";

export default function ScoreCounter({ score, style }: ScoreCounterProps) {

    const scale = useSharedValue(1);
    const colorProgress = useSharedValue(0);

    useAnimatedReaction(
        () => score.value,
        (currentScore, previousScore) => {
            if (currentScore > (previousScore ?? 0)) {
                scale.value = withSequence(
                    withTiming(1.5, { duration: 100 }),
                    withSpring(1)
                )

                colorProgress.value = withSequence(
                    withTiming(1, { duration: 100 }),
                    withTiming(0, { duration: 400 })
                )
            } else if (currentScore === 0 && (previousScore ?? 0) > 0) {
                colorProgress.value = withSequence(
                    withTiming(2, { duration: 100 }),
                    withTiming(0, { duration: 400 })
                )
            }
        },
        [score]
    );

    const animatedStyle = useAnimatedStyle(() => {
        const animatedColor = interpolateColor(
            colorProgress.value,
            [0, 1, 2],
            [normalColor, goodColor, badColor]
        )

        return {
            transform: [{ scale: scale.value }],
            color: animatedColor,
        }
    });

    const animatedProps = useAnimatedProps(() => {
        return {
            text: String(score.value),
            defaultValue: String(score.value)
        } as any
    });

    return (
        <AnimatedTextInput editable={false} style={[style, animatedStyle]} animatedProps={animatedProps} />
    )
}