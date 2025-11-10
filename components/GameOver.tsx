import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { BlurView } from 'expo-blur';
import StartButton from '@/components/StartButton'

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface GameOverMenuProps {
    score: number;
    highScore: number;
    onRestart: () => void;
}

export default function GameOver({ score, highScore, onRestart }: GameOverMenuProps) {
    return (
        <AnimatedBlurView
            intensity={20}
            tint={"dark"}
            experimentalBlurMethod={"dimezisBlurView"}
            style={styles.container}
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
        >
            <Animated.View
                style={styles.card}
                entering={SlideInDown.springify().damping(40)}
                exiting={SlideOutDown.duration(250)}
            >
                <Text style={styles.title}>GAME OVER</Text>
                
                <View style={styles.scoreContainer}>
                    <Text style={styles.label}>SCORE</Text>
                    <Text style={styles.score}>{score}</Text>
                </View>

                <View style={[styles.scoreContainer, {marginBottom: 50}]}>
                    <Text style={styles.label}>BEST</Text>
                    <Text style={styles.highScore}>{highScore}</Text>
                </View>
                
                <StartButton onPress={onRestart} text="RETRY"/>
            </Animated.View>
        </AnimatedBlurView>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },

    card: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 30,
        borderRadius: 50,
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#ffffffff',
        boxShadow: '0 0 10px 0 white',
        width: '80%',
    },

    title: {
        fontSize: 60,
        fontWeight: "bold",
        color: "#FF0000",
        textAlign: "center",
        textShadowColor: "#a20000ff",
        textShadowRadius: 15,
        marginBottom: 30,
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