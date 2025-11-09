import { Dimensions, useWindowDimensions } from "react-native";

export function useGameDimensions(){
    const { width, height } = Dimensions.get('screen');
    const size = width - 80;
    const radius = size / 2;
    const centerX = width / 2;
    const centerY = height - radius - 60;
    const hitZoneY = centerY - radius - 20 + 2;

    return {width, height, size, radius, centerX, centerY, hitZoneY}
}