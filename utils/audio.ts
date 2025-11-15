import { AudioPlayer, useAudioPlayer } from "expo-audio";

const dropAudio = require('../assets/sounds/drop.wav');
const failAudio = require('../assets/sounds/fail.wav');

export const createDropPlayer = (): AudioPlayer => {
    const player = useAudioPlayer(dropAudio);
    return player;
}

export const createFailPlayer = (): AudioPlayer => {
    const player = useAudioPlayer(failAudio);
    return player;
}