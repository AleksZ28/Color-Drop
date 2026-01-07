import { Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type StartButtonProps = {
    onPress: () => void;
    text: string;
};

export default function NeonButton({ onPress, text }: StartButtonProps) {
    const buttonScale = useSharedValue(1);
    const buttonBorderColor = useSharedValue('#ff8800ff');
    const buttonBackgroundColor = useSharedValue('#ff66002c');

    const animatedButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: buttonScale.value }],
            borderColor: buttonBorderColor.value,
            backgroundColor: buttonBackgroundColor.value,
        }
    })

    return (
        <Pressable
            onPressIn={() => {
                buttonScale.value = withTiming(0.9, { duration: 100 });
                buttonBorderColor.value = withTiming('white', { duration: 100 });
                buttonBackgroundColor.value = withTiming('transparent', { duration: 100 });
            }}
            onPressOut={() => {
                buttonScale.value = withTiming(1, { duration: 100 });
                buttonBorderColor.value = withTiming('#ff8800ff', { duration: 100 });
                buttonBackgroundColor.value = withTiming('#ff66002c', { duration: 100 });
            }}
            onPress={onPress}
        >
            <Animated.View style={[styles.button, animatedButtonStyle]}>
                <Animated.Text style={styles.buttonText}>{text}</Animated.Text>
            </Animated.View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderStyle: "solid",
        borderWidth: 3,
        borderRadius: 15,
        boxShadow: '0 0 5px 2px rgba(255, 153, 0, 0.4)'
    },

    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "rgba(249, 232, 200, 1)",
        letterSpacing: 2
    },
})
