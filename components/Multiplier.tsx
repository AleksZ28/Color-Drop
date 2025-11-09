import { TextInput, TextStyle } from "react-native";
import Animated, { interpolateColor, SharedValue, useAnimatedProps, useAnimatedReaction, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface MultiplierProps{
    multiplier: SharedValue<number>;
    style: TextStyle[];
}

const normalColor = "#FFFFFF"
const highlightColor = "#75dd8dff"

export default function Multiplier ({multiplier, style}: MultiplierProps){

    const colorProgress = useSharedValue(0);

    useAnimatedReaction(
        () => multiplier.value,
        (currMultip, prevMultip) => {
            if(currMultip !== prevMultip) {
                colorProgress.value = withSequence(
                    withTiming(1, { duration: 100 }),
                    withTiming(0, { duration: 200 })
                );
            }
        },
        [multiplier]
    )

    const animatedStyle = useAnimatedStyle(() => {
        const animatedColor = interpolateColor(
            colorProgress.value,
            [0,1],
            [normalColor, highlightColor]
        )

        return{
            color: animatedColor
        }
    })

    const animatedProps = useAnimatedProps(() => {
        return { 
            text: 'x' + String(multiplier.value),
            defaultValue: 'x' + String(multiplier.value)
        } as any
    });

    return(
        <AnimatedTextInput editable={false} animatedProps={animatedProps} style={[style, animatedStyle]}/>
    )
}