import StartButton from '@/components/StartButton';
import { useNeonFlicker } from '@/hooks/useNeonFlicker';
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, SharedValue, SlideInDown, SlideOutDown } from "react-native-reanimated";

interface GameOverMenuProps {
    score: SharedValue<number>;
    highScore: number;
    onRestart: () => void;
}

export default function GameOver({ score, highScore, onRestart }: GameOverMenuProps) {

    const flickerStyle = useNeonFlicker();

    return (
        <Animated.View
            style={ styles.container }
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
        >
            <Animated.View
                style={styles.card}
                entering={SlideInDown.springify().damping(40)}
                exiting={SlideOutDown.duration(200)}
            >
                <Animated.Text style={[styles.title, flickerStyle]}>GAME OVER</Animated.Text>
                
                <View style={styles.scoreContainer}>
                    <Text style={styles.label}>SCORE</Text>
                    <Text style={styles.score}>{score.value}</Text>
                </View>

                <View style={[styles.scoreContainer, {marginBottom: 50}]}>
                    <Text style={styles.label}>BEST</Text>
                    <Text style={styles.highScore}>{highScore}</Text>
                </View>
                
                <StartButton onPress={onRestart} text="RETRY"/>
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        backgroundColor: 'rgba(0,0,0,0.75)'
    },

    card: {
        backgroundColor: 'rgba(10, 10, 10, 1)',
        padding: 30,
        borderRadius: 50,
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#d0f7ff80',
        boxShadow: '0 0 20px 0 #d0f7ff80',
        width: '80%',
    },

    title: {
        fontSize: 60,
        fontWeight: "bold",
        color: "#FF0000",
        textAlign: "center",
        textShadowColor: "#a20000ff",
        textShadowRadius: 15,
        marginBottom: 20,
        letterSpacing: 4
    },

    scoreContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },

    label: {
        color: '#888',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 5,
    },

    score: {
        color: 'white',
        fontSize: 50,
        fontWeight: 'bold',
    },
    
    highScore: {
        color: '#FFD700',
        fontSize: 40,
        fontWeight: 'bold',
    },
})