import React from "react"

import { Skia, Path, Circle, Group, vec} from "@shopify/react-native-skia"

const red = "#FF0000";
const yellow = "#FFFF00";
const blue = "#0000FF";
const bgColor = "#222";

interface WheelProps {
  radius: number
  holeRadius: number
  centerX: number
  centerY: number
  transform: any
}

export default function GameWheel({radius, holeRadius, centerX, centerY, transform}: WheelProps) {

  const rect = React.useMemo(() => 
    Skia.XYWHRect(
      centerX - radius,
      centerY - radius,
      radius * 2,
      radius * 2),
    [centerX, centerY, radius]
  );

  const path1 = React.useMemo(() => {
    const p = Skia.Path.Make();
    const startAngleDeg = 0;
    const sweepAngleDeg = 120;
    const startX = centerX + radius * Math.cos((startAngleDeg * Math.PI) / 180);
    const startY = centerY + radius * Math.sin((startAngleDeg * Math.PI) / 180);

    p.moveTo(startX, startY);
    p.addArc(rect,startAngleDeg-0.75,sweepAngleDeg+1.5);
    p.lineTo(centerX, centerY);
    p.close();
    return p;
  }, [centerX, centerY, radius, rect]);
  

  const path2 = React.useMemo(() => {
    const p = Skia.Path.Make();
    const startAngleDeg = 120;
    const sweepAngleDeg = 120;
    const startX = centerX + radius * Math.cos((startAngleDeg * Math.PI) / 180);
    const startY = centerY + radius * Math.sin((startAngleDeg * Math.PI) / 180);

    p.moveTo(startX, startY);
    p.addArc(rect,startAngleDeg-0.75,sweepAngleDeg+1.5);
    p.lineTo(centerX, centerY);
    p.close();
    return p;
  }, [centerX, centerY, radius, rect]);

  const path3 = React.useMemo(() => {
    const p = Skia.Path.Make();
    const startAngleDeg = 240;
    const sweepAngleDeg = 120;
    const startX = centerX + radius * Math.cos((startAngleDeg * Math.PI) / 180);
    const startY = centerY + radius * Math.sin((startAngleDeg * Math.PI) / 180);

    p.moveTo(startX, startY);
    p.addArc(rect,startAngleDeg-0.75,sweepAngleDeg+1.5);
    p.lineTo(centerX, centerY);
    p.close();
    return p;
  }, [centerX, centerY, radius, rect]);


  return (
    <Group origin={vec(centerX, centerY)} transform={transform}>
      <Path
        path={path1}
        style="fill"
        color={red}
      />
      <Path
        path={path2}
        style="fill"
        color={yellow}
      />
      <Path
        path={path3}
        style="fill"
        color={blue}
      />
      <Circle 
        c={vec(centerX, centerY)} 
        r={holeRadius} 
        color={bgColor} 
      />
    </Group>
  )
}