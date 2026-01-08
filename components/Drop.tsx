import React from "react";

import { BlurMask, Group, Path, Skia } from "@shopify/react-native-skia";
import { Easing, SharedValue, useDerivedValue, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

interface DropProps {
    dropX: number;
    dropY: SharedValue<number>;
    dropRadius: number;
    dropColor: SharedValue<string>;
    isBomb: SharedValue<boolean>;
}

export default function Drop({ dropX, dropY, dropRadius, dropColor, isBomb }: DropProps) {

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

        path.moveTo(x, y + yr);
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
    });

    const innerDropPath = useDerivedValue(() => {
        if (!isBomb.value) return Skia.Path.Make();

        const path = Skia.Path.Make()
        const r = dropRadius * 0.6;
        const x = dropX
        const y = dropY.value

        const xr = r + shake.value * (r * 0.2);
        const yr = r - shake.value * (r * 0.2);

        path.moveTo(x, y + yr);
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
    });

    return (
        <Group>
            <Path path={animatedPath} color={dropColor} />

            <Group>
                <Path path={innerDropPath} color="rgba(0,0,0,0.8)" style="fill">
                    <BlurMask blur={10} style="normal" />
                </Path>

                <Path path={innerDropPath} color="rgba(10, 10, 10, 0.8)" style="fill" />
            </Group>
        </Group>
    )

}