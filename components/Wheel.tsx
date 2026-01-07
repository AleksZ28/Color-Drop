import React from "react";

import { BlurMask, Group, Path, Skia, vec } from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";

const red = "#FF0000";
const yellow = "#FFFF00";
const blue = "#0000FF";
const strokeWidth = 40;

interface WheelProps {
  radius: number
  centerX: number
  centerY: number
  transform: SharedValue<{ rotate: number }[]>
}

export default function Wheel({ radius, centerX, centerY, transform }: WheelProps) {

  const rect = React.useMemo(() =>
    Skia.XYWHRect(
      centerX - radius,
      centerY - radius,
      radius * 2,
      radius * 2),
    [centerX, centerY, radius]
  );

  const gap = 5;
  const sweepAngleDeg = 120 - gap;
  const start1Deg = gap / 2;
  const start2Deg = 120 + gap / 2;
  const start3Deg = 240 + gap / 2;

  const path1 = React.useMemo(() => {
    const p = Skia.Path.Make();
    p.addArc(rect, start1Deg, sweepAngleDeg);
    return p;
  }, [start1Deg, sweepAngleDeg, rect]);


  const path2 = React.useMemo(() => {
    const p = Skia.Path.Make();
    p.addArc(rect, start2Deg, sweepAngleDeg);
    return p;
  }, [start2Deg, sweepAngleDeg, rect]);

  const path3 = React.useMemo(() => {
    const p = Skia.Path.Make();
    p.addArc(rect, start3Deg, sweepAngleDeg);
    return p;
  }, [start3Deg, sweepAngleDeg, rect]);


  return (
    <Group origin={vec(centerX, centerY)} transform={transform}>
      <Group>
        <Path
          path={path1}
          style="stroke"
          color={red}
          strokeWidth={strokeWidth}
        >
          <BlurMask blur={10} />
        </Path>
      </Group>
      <Path
        path={path1}
        style="stroke"
        strokeWidth={strokeWidth / 1.5}
        color={red}
      />

      <Group>
        <Path
          path={path2}
          style="stroke"
          color={yellow}
          strokeWidth={strokeWidth}
        >
          <BlurMask blur={10} />
        </Path>
      </Group>
      <Path
        path={path2}
        style="stroke"
        color={yellow}
        strokeWidth={strokeWidth / 1.5}
      />

      <Group>
        <Path
          path={path3}
          style="stroke"
          color={blue}
          strokeWidth={strokeWidth}
        >
          <BlurMask blur={10} />
        </Path>
      </Group>
      <Path
        path={path3}
        style="stroke"
        color={blue}
        strokeWidth={strokeWidth / 1.5}
      />
    </Group>
  )
}