import { StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut, runOnJS } from "react-native-reanimated";

interface TutorialOverlayProps {
    onHide: () => void,
    step: number
}

const steps: { [key: number]: string } = {
    0: "Przesuń, by obrócić koło i dopasować kolor na kole do koloru kropli.",
    1: "Teraz złap żółty!",
    2: "Świetnie! A teraz ZMIESZAJ KOLORY! Traf między czerwony i żółty, aby złapać pomarańczowy!",
    3: "Dobra robota! Gra z czasem będzie przyspieszać, a mieszanie kolorów rozpocznie się po przekroczeniu 100 pkt."
}

export default function TutorialOverlay({ onHide, step }: TutorialOverlayProps) {

    const tapGesture = Gesture.Tap()
        .onEnd(() => {
            'worklet'
            runOnJS(onHide)();
        })

    function getHint(step: number){
        return steps[step] ?? "";
    }


    return (
        <GestureDetector gesture={tapGesture}>
            <Animated.View key={step} style={styles.container} entering={FadeIn} exiting={FadeOut}>
                <Text style={styles.text}>{getHint(step)}</Text>
            </Animated.View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },

    text: {
        fontSize: 26,
        color: 'white',
        textAlign: 'center',
        fontWeight: "bold",
        padding: 20,
    }
})