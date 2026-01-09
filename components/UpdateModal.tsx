import { useNeonFlicker } from "@/hooks/useNeonFlicker";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import SettingsButton from "./SettingsButton";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface UpdateModalProps {
    onDownload: () => void;
    onCancel: () => void;
}

export default function UpdateModal({ onDownload, onCancel }: UpdateModalProps) {

    const flickerStyle = useNeonFlicker();

    return (
        <Animated.View
            style={styles.container}
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
        >
            <AnimatedLinearGradient
                colors={['#121212ff', '#2b241bff', '#3c3226ff', '#2b2920ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >

                <Animated.Text style={[styles.title, flickerStyle]}>Dostępna jest nowa wersja!</Animated.Text>

                <View style={styles.row}>
                    <SettingsButton onPress={onDownload} text="Pobierz" />
                    <SettingsButton onPress={onCancel} text="Później" />
                </View>

            </AnimatedLinearGradient>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        paddingTop: 50,
        zIndex: 999,
        backgroundColor: 'rgba(17, 13, 13, 0.7)'
    },

    card: {
        padding: 30,
        borderRadius: 50,
        alignItems: 'center',
        boxShadow: '0 0 15px 0 #00000088',
        width: '95%',
    },

    title: {
        fontSize: 30,
        fontFamily: "TiltNeon",
        color: "#ff8800ff",
        textAlign: "center",
        textShadowColor: "#ff6600ff",
        textShadowRadius: 15,
        marginBottom: 25,
        letterSpacing: 4,
        lineHeight: 35
    },

    row: {
        flexDirection: "row",
        gap: 15
    }
})