import { TextInput, TextStyle } from "react-native";
import Animated, { SharedValue, useAnimatedProps } from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface MultiplierProps{
    multiplier: SharedValue<number>;
    style: TextStyle[];
}

export default function Multiplier ({multiplier, style}: MultiplierProps){

    const animatedProps = useAnimatedProps(() => {
        return { 
            text: 'x' + String(multiplier.value),
            defaultValue: String(multiplier.value)
        } as any
    });

    return(
        <AnimatedTextInput editable={false} animatedProps={animatedProps} style={style}/>
    )
}