import NeonButton from '@/components/NeonButton';
import { useNeonFlicker } from '@/hooks/useNeonFlicker';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, SharedValue, SlideInDown, SlideOutDown } from "react-native-reanimated";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface GameOverMenuProps {
    score: SharedValue<number>;
    highScore: number;
    showMenu: () => void;
}

export default function GameOver({ score, highScore, showMenu }: GameOverMenuProps) {

    const flickerStyle = useNeonFlicker();

    return (
        <Animated.View
            style={styles.container}
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
        >
            <AnimatedLinearGradient
                colors={['#121212ff', '#1b1b2bff', '#262f3cff', '#20202bff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
                entering={SlideInDown.springify().damping(40)}
                exiting={SlideOutDown.duration(200)}
            >

                <Animated.Text style={[styles.title, flickerStyle]}>GAME OVER</Animated.Text>

                <View style={styles.scoreContainer}>
                    <Text style={styles.label}>SCORE</Text>
                    <Text style={styles.score}>{score.value}</Text>
                </View>

                <View style={[styles.scoreContainer, { marginBottom: 50 }]}>
                    <Text style={styles.label}>BEST</Text>
                    <Text style={styles.highScore}>{highScore}</Text>
                </View>

                <NeonButton onPress={showMenu} text="HOME" />
            </AnimatedLinearGradient>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    card: {
        padding: 30,
        borderRadius: 50,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#d0f7ff43',
        boxShadow: '0 0 25px 0 #d0f7ff80',
        width: '80%',
    },

    title: {
        fontSize: 60,
        fontFamily: "TiltNeon",
        color: "#ff1100ff",
        textAlign: "center",
        textShadowColor: "#c10101ff",
        textShadowRadius: 15,
        marginBottom: 20,
        letterSpacing: 4,
        lineHeight: 60
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