import { TextStyle, View, ViewStyle } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

interface ScoreCounterProps{
    score: number;
    scoreStyle: ViewStyle;
    digitStyle: TextStyle;
}

export default function ScoreCounter({score, scoreStyle, digitStyle}: ScoreCounterProps){

    const scoreDigits = String(score).split('');
    
    return(
        <View style={scoreStyle}>
            {scoreDigits.map((digit, i) => (
                <Animated.Text
                    key={`${digit}-${i}`}
                    entering={FadeInDown.duration(300)}
                    exiting={FadeOutUp.duration(300)}
                    style={digitStyle}
                >
                    {digit}
                </Animated.Text>
            ))}
        </View>
    )
}