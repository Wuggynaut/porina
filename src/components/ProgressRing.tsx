import {BrewStep} from "../types/brew";
import Svg, {Circle, Line} from "react-native-svg";

type Props = {
    steps: BrewStep[];
    progress: number;
    totalDuration: number;
    size?: number;
    strokeWidth?: number;
}

export function ProgressRing({ steps, progress, totalDuration, size = 200, strokeWidth = 12}: Props) {
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const filled = progress * circumference;

    // progress starts at 12-o-clock
    const rotation = -90;

    const dividers: {angle: number}[] = [];
    let accumulated = 0;
    for (let i = 0; i < steps.length -1; i++) {
        accumulated += steps[i].durationSeconds;
        const angle = (accumulated / totalDuration) * 360 + rotation;
        dividers.push({ angle });
    }

    const tickInner = radius - strokeWidth / 2 - 2;
    const tickOuter = radius + strokeWidth / 2 + 2;

    return (
        <Svg width={size} height={size}>
            <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#e0e0e0"
                strokeWidth={strokeWidth}
                fill="none"
            />

            <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#6F4E37"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - filled}
                strokeLinecap="butt"
                rotation={rotation}
                origin={`${center}, ${center}`}
            />

            {dividers.map(({ angle }, i) => {
                const rad = (angle * Math.PI) / 180;
                return (
                    <Line
                        key={i}
                        x1={center + tickInner * Math.cos(rad)}
                        y1={center + tickInner * Math.sin(rad)}
                        x2={center + tickOuter * Math.cos(rad)}
                        y2={center + tickOuter * Math.sin(rad)}
                        stroke="#fff"
                        strokeWidth={2}
                    />
                );
            })}
        </Svg>
    )
}