import React from "react"

import { Skia, Path } from "@shopify/react-native-skia"
import { SharedValue, useDerivedValue, useSharedValue, withRepeat, withTiming, Easing } from "react-native-reanimated";

interface DropProps {
  dropX: number;
  dropY: SharedValue<number>;
  dropRadius: number;
}

const dropColor = "#FF0000"

export default function Drop({dropX, dropY, dropRadius}: DropProps) {

    const shake = useSharedValue(0);

    React.useEffect(() => {
        shake.value = withRepeat(
            withTiming(1, { 
                duration: 500,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );
    }, [shake]);
    
    const animatedPath = useDerivedValue(() => {
        const path = Skia.Path.Make()
        const r = dropRadius
        const x = dropX
        const y = dropY.value

        const xr = r + shake.value * (r * 0.2);
        const yr = r - shake.value * (r * 0.2);

        path.moveTo(x,y+yr);
        path.cubicTo(
            x + xr, y + yr,
            x + xr, y - yr,
            x, y - yr * 2
        );

        path.cubicTo(
            x - xr, y - yr,
            x - xr, y + yr,
            x, y + yr
        );
        path.close()

        return path;
    })

    return(
        <Path path={animatedPath} color={dropColor} />
    )

}