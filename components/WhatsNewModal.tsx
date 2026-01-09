import { useNeonFlicker } from "@/hooks/useNeonFlicker";
import { WhatsNewItem } from "@/types/types";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";
import SettingsButton from "./SettingsButton";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface WhatsNewModalProps {
    data: WhatsNewItem[];
    onClose: () => void;
}

export default function WhatsNewModal({ data, onClose }: WhatsNewModalProps) {
    const flickerStyle = useNeonFlicker();
    const [currentPage, setCurrentPage] = useState(0);

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
                entering={SlideInDown.springify().damping(40)}
                exiting={SlideOutDown.duration(200)}
            >
                <Animated.Text style={[styles.mainTitle, flickerStyle]}>Co nowego?</Animated.Text>

                <View style={styles.pagerContainer}>
                    <PagerView
                        style={styles.pagerView}
                        initialPage={0}
                        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
                    >
                        {data.map(item => (
                            <View key={item.id} style={styles.page}>
                                <Image source={item.image} style={styles.image} resizeMode="contain" />
                                <View style={styles.textContainer}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                </View>
                            </View>
                        ))}
                    </PagerView>

                    <View style={styles.pagination}>
                        {data.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentPage == index && styles.dotActive
                                ]}
                            />
                        ))}
                    </View>
                </View>

                <SettingsButton onPress={onClose} text={currentPage == data.length - 1 ? "Rozpocznij grę" : "Zamknij"} />

            </AnimatedLinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        backgroundColor: 'rgba(17, 13, 13, 0.8)'
    },
    card: {
        width: '90%',
        height: '85%',
        borderRadius: 50,
        alignItems: 'center',
        paddingVertical: 30,
        boxShadow: '0 0 15px 0 #00000088',
    },
    mainTitle: {
        fontSize: 36,
        fontFamily: "TiltNeon",
        color: "#ff8800ff",
        textAlign: "center",
        textShadowColor: "#ff6600ff",
        textShadowRadius: 15,
        marginBottom: 10,
    },
    pagerContainer: {
        flex: 1,
        width: '100%',
        marginBottom: 20,
    },
    pagerView: {
        flex: 1,
    },
    page: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 30,
        marginBottom: 20,
        backgroundColor: '#00000066'
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    itemTitle: {
        fontSize: 24,
        fontFamily: "TiltNeon",
        color: "#ffffff",
        marginBottom: 10,
        textAlign: 'center',
    },
    itemDescription: {
        fontSize: 16,
        color: "#cccccc",
        textAlign: 'center',
        lineHeight: 22,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    dot: {
        width: 25,
        height: 3,
        borderRadius: 2,
        backgroundColor: '#ffffff44',
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: '#ff8800',
    },
});
