import { BrewStep } from "../types/brew";
import Svg, { Circle, Line } from "react-native-svg";
import { colors } from "../theme";
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    Easing, cancelAnimation,
} from "react-native-reanimated";
import {useEffect} from "react";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
    steps: BrewStep[];
    progress: number;       // 0 → 1
    totalDuration: number;
    status: 'idle' | 'running' | 'paused' | 'finished';
    size?: number;
    strokeWidth?: number;
};

export function ProgressRing({
                                 steps,
                                 progress,
                                 totalDuration,
                                 status,
                                 size = 200,
                                 strokeWidth = 16,
                             }: Props) {
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const filled = progress * circumference;
    const rotation = -90; // start from 12 o'clock

    const animatedProgress = useSharedValue(0);


    useEffect(() => {
        //Look ahead one tick for smooth animation, when idle
        if (status === 'running') {
            const stepSize = totalDuration > 0 ? 1 / totalDuration : 0;
            const target = Math.min(progress + stepSize, 1);

            animatedProgress.value = withTiming(target, {
                duration: 1000,
                easing: Easing.linear,
            });
        }
        else if (status === 'paused') {
            // Pause: stop the animation exactly where it is right now
            cancelAnimation(animatedProgress);
        }
        else {
            // Idle & finished: snap to actual position
            animatedProgress.value = withTiming(progress, {
                duration: 300,
                easing: Easing.out(Easing.cubic),
            });
        }
    }, [progress, status]);

    const animatedStrokeProps = useAnimatedProps(() => {
        const filled = animatedProgress.value * circumference;
        return {
            strokeDashoffset: circumference - filled,
        };
    });

    // Build divider positions between steps
    const dividers: { angle: number; fraction: number }[] = [];
    let accumulated = 0;
    for (let i = 0; i < steps.length - 1; i++) {
        accumulated += steps[i].durationSeconds;
        const fraction = accumulated / totalDuration;
        const angle = fraction * 360 + rotation;
        dividers.push({ angle, fraction });
    }

    const tickOuter = radius + strokeWidth / 2 - 2;
    const tickInner = radius - strokeWidth / 2 + 2;

    return (
        <Svg width={size} height={size}>
            {/* Background track */}
            <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#F0E6D7"
                strokeWidth={strokeWidth}
                fill="none"
            />

            {/* Progress arc, smooth animated */}
            <AnimatedCircle
                cx={center}
                cy={center}
                r={radius}
                stroke={colors.coral}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference}, ${circumference}`}
                animatedProps={animatedStrokeProps}
                strokeLinecap="butt"
                transform={`rotate(${rotation}, ${center}, ${center})`}
            />

            {/* Step divider ticks */}
            {dividers.map(({ angle, fraction }, i) => {
                const rad = (angle * Math.PI) / 180;
                const surpassed = progress >= fraction;

                return (
                    <Line
                        key={i}
                        x1={center + tickInner * Math.cos(rad)}
                        y1={center + tickInner * Math.sin(rad)}
                        x2={center + tickOuter * Math.cos(rad)}
                        y2={center + tickOuter * Math.sin(rad)}
                        stroke={surpassed ? colors.white : colors.textPrimary}
                        strokeWidth={3}
                    />
                );
            })}
        </Svg>
    );
}