import { TextInput, TextStyle } from "react-native"
import Animated, { SharedValue, useAnimatedProps } from "react-native-reanimated"

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface ScoreCounterProps{
    score: SharedValue<number>;
    style: TextStyle;
}

export default function ScoreCounter({score, style}: ScoreCounterProps){
    
    const animatedProps = useAnimatedProps(() => {
        return { 
            text: String(score.value),
            defaultValue: String(score.value)
        } as any
    });

    return(
        <AnimatedTextInput editable={false} style={style} animatedProps={animatedProps}/>
    )
}