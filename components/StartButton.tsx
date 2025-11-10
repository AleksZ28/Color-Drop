import { Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type StartButtonProps = {
    onPress: () => void;
    text: string;
};

export default function StartButton({onPress, text}: StartButtonProps){
    const buttonScale = useSharedValue(1);
    const buttonBorderColor = useSharedValue('rgba(133, 255, 255, 1)');
    const buttonBackgroundColor = useSharedValue('rgba(0, 255, 255, 0.15)');

    const animatedButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: buttonScale.value }],
            borderColor: buttonBorderColor.value,
            backgroundColor: buttonBackgroundColor.value,
        }
    })

    return(
        <Pressable
            onPressIn={() => {
                buttonScale.value = withTiming(0.9, {duration: 100});
                buttonBorderColor.value = withTiming('white', {duration: 100});
                buttonBackgroundColor.value = withTiming('transparent', {duration: 100});
            }}
            onPressOut={() => {
                buttonScale.value = withTiming(1, {duration: 100});
                buttonBorderColor.value = withTiming('rgba(133, 255, 255, 1)', {duration: 100});
                buttonBackgroundColor.value = withTiming('rgba(0, 255, 255, 0.15)', {duration: 100});
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
      paddingVertical: 10,
      paddingHorizontal: 40,
      borderStyle: "solid",
      borderWidth: 4,
      borderRadius: 15,
      boxShadow: '0 0 10px 3px rgba(0,255,255,0.4)'
    },
    
    buttonText: {
      fontSize: 30,
      fontWeight: 'bold',
      color: "rgba(200, 249, 249, 1)",
      letterSpacing: 3
    },
})
