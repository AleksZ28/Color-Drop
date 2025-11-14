import { StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut, runOnJS } from "react-native-reanimated";
import { FontAwesome } from '@expo/vector-icons';
import { JSX } from "react";

interface TutorialOverlayProps {
    onHide: () => void,
    step: number
}

const steps: { [key: number]: JSX.Element } = {
    0: (<>Obracaj koło, wykonując na nim okrężny ruch palcem, aby dopasować <Text style={{color:"red"}}>kolor</Text> na kole do <Text style={{color:"red"}}>koloru</Text> kropli.</>),
    1: (<>Teraz złap <Text style={{color:"yellow"}}>żółty</Text>!</>),
    2: (<>Świetnie! A teraz ZMIESZAJ KOLORY! Traf między <Text style={{color:"red"}}>czerwony</Text> i <Text style={{color:"yellow"}}>żółty</Text>, aby złapać <Text style={{color:"orange"}}>pomarańczowy</Text>.</>),
    3: (<>Dobra robota! Gra z czasem będzie przyspieszać, a mieszanie kolorów rozpocznie się po przekroczeniu 100 pkt.</>)
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
                <FontAwesome name="hand-pointer-o" size={40} color="#ddd" style={styles.hand}/>
                <Text style={styles.subtext}>Dotknij, aby kontynuować</Text>
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
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    text: {
        fontSize: 26,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 20,
    },

    hand: {
        marginTop: 15,
    },

    subtext: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#bbb",
        marginTop: 5,
    }
})