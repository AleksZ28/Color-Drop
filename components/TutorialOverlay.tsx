import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeIn, FadeOut, runOnJS, SharedValue, useAnimatedReaction } from "react-native-reanimated";

interface TutorialOverlayProps {
  score: SharedValue<number>;
}

const steps: { [key: number]: string } = {
    0: "Przesuń, by obrócić koło i dopasować kolor na kole do koloru kropli.",
    1: "Teraz złap żółty!",
    2: "Świetnie! A teraz ZMIESZAJ KOLORY! Traf między czerwony i żółty, aby złapać pomarańczowy!",
    3: "Dobra robota! Gra z czasem będzie przyspieszać, a mieszanie kolorów rozpocznie się po przekroczeniu 100 pkt."
}

export default function TutorialOverlay({ score }: TutorialOverlayProps) {

    const [hint, setHint] = useState(steps[0]);

    useAnimatedReaction(
        () => score.value,
        (currScore, prevScore) => {
            'worklet';
            if (currScore !== prevScore){
                runOnJS(setHint)(steps[currScore]);
            }
        },
        [score]
    )

    return (
        <Animated.View key={hint} style={styles.container} entering={FadeIn} exiting={FadeOut}>
            <Text style={styles.text}>{hint}</Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '20%',
        left: '10%',
        right: '10%',
        alignItems: 'center',
        zIndex: 100,
    },

    text: {
        fontSize: 26,
        color: 'white',
        textAlign: 'center',
        fontWeight: "bold",
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
        boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)"
    }
})