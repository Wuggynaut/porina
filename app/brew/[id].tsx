import {useLocalSearchParams} from "expo-router";
import {View, Text, StyleSheet, Pressable} from "react-native";
import {recipes} from "../../src/data";
import {useBrewTimer} from "../../src/hooks/useBrewTimer";
import {colors, radius, spacing, typography} from "../../src/theme";
import {ProgressRing} from "../../src/components/ProgressRing";
import {RotateCcw} from "lucide-react-native";
import {Ionicons} from "@expo/vector-icons";
import {Card} from "../../src/components/Card";
import {useEffect, useMemo} from "react";
import {formatAmount, formatTime} from "../../src/utils/format";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    FadeInRight, FadeOutLeft, FadeInLeft, FadeOutRight,
} from "react-native-reanimated";
import {activateKeepAwakeAsync, deactivateKeepAwake} from "expo-keep-awake";
import * as Haptics from 'expo-haptics';
import {useBrewSounds} from "../../src/hooks/useBrewSounds";

export default function BrewSession() {
    const { id, servings } = useLocalSearchParams<{ id: string; servings: string }>();
    const recipe = recipes.find(r => r.id === id);
    const servingCount = Number(servings) || recipe?.baseServings || 1;
    const ratio = recipe ? servingCount / recipe.baseServings : 1;

    // Sounds
    const { playStepChime, playFinishChime } = useBrewSounds();

    const timer = useBrewTimer({
        steps: recipe?.steps ?? [],

        onStepChange: (index, step) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(console.warn);
            playStepChime().catch(console.warn);
        },

        onFinish: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(console.warn);
            playFinishChime().catch(console.warn);
        }
    })

    const { scaleTarget, nextScaleTarget } = useMemo(() => {
        let cumulative = 0;
        for (let i = 0; i <= timer.currentStepIndex; i++) {
            cumulative += (timer.steps[i].waterMl ?? 0) * ratio;
        }

        const nextStep = timer.steps[timer.currentStepIndex + 1];
        const next = nextStep?.waterMl ? cumulative + nextStep.waterMl * ratio : null;

        return { scaleTarget: cumulative, nextScaleTarget: next };
    }, [timer.steps, timer.currentStepIndex, ratio]);

    // Screen stays awake while timer is running or paused
    useEffect(() => {
        const isActive = timer.status === 'running' || timer.status === 'paused';

        if (isActive) {
            activateKeepAwakeAsync('brewSession').catch(console.warn);
        } else {
            deactivateKeepAwake('brewSession').catch(console.warn);
        }

        return () => {
            deactivateKeepAwake('brewSession').catch(console.warn);
        };
    }, [timer.status]);



    // Animations
    const isSplit = timer.status === 'running' || timer.status === 'paused';
    const spread = useSharedValue(0);
    const resetOpacity = useSharedValue(0);

    useEffect(() => {
        spread.value = withTiming(isSplit ? 70 : 0, {
            duration: 400,
            easing: Easing.out(Easing.cubic),
        });

        resetOpacity.value = withTiming(isSplit ? 1 : 0, {
            duration: isSplit ? 400 : 300,
        });
    }, [isSplit]);

    const resetButtonStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: -spread.value }],
        opacity: resetOpacity.value,
    }));

    const mainButtonStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: spread.value }],
    }));

    if (!recipe) {
        return <Text>Recipe not found</Text>;
    }

    return (
        <View style={styles.screen}>

            <Text style={styles.subHeader}>
                {recipe.name}
            </Text>

            {timer.currentStep && (
                <View style={{ width: 200, height: 200, position: 'relative', marginTop: spacing.xl, marginBottom: spacing.xl }}>
                    <ProgressRing
                        steps={timer.steps}
                        progress={timer.progress}
                        totalDuration={timer.totalDuration}
                        status={timer.status}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={styles.timerPrimary}>
                            {formatTime(timer.secondsRemaining)}
                        </Text>
                        <Text style={styles.totalTimeText}>
                            ELAPSED
                        </Text>
                        <Text style={styles.timerSecondary}>
                            {formatTime(timer.elapsedTotal)}
                        </Text>
                    </View>
                </View>
            )}

            <View style={styles.buttonContainer}>

                <Animated.View style={[styles.buttonBundle, styles.centeredButton, resetButtonStyle]}>
                    <Pressable
                        style={[styles.roundButton, { backgroundColor: colors.orange }]}
                        onPress={timer.reset}
                        disabled={!isSplit}
                    >
                        <RotateCcw size={30} strokeWidth={2.5} color="white" />
                    </Pressable>
                    <Text style={styles.buttonLabelText}>Reset</Text>
                </Animated.View>

                <Animated.View style={[styles.buttonBundle, styles.centeredButton, mainButtonStyle]}>
                    <Pressable
                        style={isSplit ? styles.roundButton : styles.roundButtonBig}
                        onPress={
                            timer.status === 'idle'     ? timer.start :
                                timer.status === 'running'  ? timer.pause :
                                    timer.status === 'paused'   ? timer.resume :
                                        timer.reset
                        }
                    >
                        {timer.status === 'running' ? (
                            <Ionicons name="pause" color="white" size={isSplit ? 30 : 34} />
                        ) : timer.status === 'finished' ? (
                            <RotateCcw size={34} strokeWidth={2.5} color="white" />
                        ) : (
                            <Ionicons name="play" color="white" size={isSplit ? 30 : 34} />
                        )}
                    </Pressable>
                    <Text style={styles.buttonLabelText}>
                        {timer.status === 'idle'    ? 'Start' :
                            timer.status === 'running' ? 'Pause' :
                                timer.status === 'paused'  ? 'Resume' : 'Restart'}
                    </Text>
                </Animated.View>

            </View>

            {timer.currentStep && (
                <Animated.View
                    key={`step-${timer.currentStepIndex}`}
                    entering={FadeInRight.duration(350)}
                    exiting={FadeOutLeft.duration(250)}
                    style={{width: "100%"}}
                >
                    <Card style={{marginTop: spacing.md, gap: spacing.sm, width: "100%"}}>
                        <View style={styles.stepRow}>
                            <Text style={styles.stepTitle}>{timer.currentStep.label}</Text>
                            <View style={styles.stepMetaRow}>
                                <Text style={styles.stepMeta}>
                                    Step <Text style={styles.stepMetaBold}>{timer.currentStepIndex + 1}</Text> of <Text style={styles.stepMetaBold}>{timer.steps.length}</Text>
                                </Text>
                            </View>
                        </View>

                        <View style={styles.cardDivider} />
                        {timer.currentStep.waterMl && (
                            <View style={styles.stepRow}>
                                <Text style={styles.waterAmountText}>{formatAmount(timer.currentStep.waterMl*ratio)} ml</Text>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={styles.stepMeta}>Scale target: </Text>
                                    <Text style={styles.stepMetaBold}>{scaleTarget} ml</Text>
                                </View>
                            </View>
                        )}
                        <Text style={styles.instructionText}>{timer.currentStep.instruction}</Text>

                    </Card>
                </Animated.View>
            )}

            {timer.currentStepIndex < recipe.steps.length - 1 && (() => {
                const nextStep = recipe.steps[timer.currentStepIndex + 1];
                return (
                    <Animated.View
                        key={`next-${timer.currentStepIndex}`}
                        entering={FadeInLeft.duration(350).delay(200)}
                        exiting={FadeOutRight.duration(250)}
                        style={{width: "100%"}}
                    >
                        <View style={styles.previewCard}>
                            <Text style={styles.previewHeader}>Next</Text>
                            <View style={{flexDirection: "row", gap: spacing.sm}}>
                                <Text style={styles.previewText}>{nextStep.label}</Text>
                                {nextStep.waterMl && (
                                    <>
                                        <Text style={styles.previewText}>•</Text>
                                        <Text style={styles.previewTextBold}>
                                            {formatAmount(nextStep.waterMl * ratio)} ml
                                        </Text>
                                        {nextScaleTarget && (
                                            <Text style={styles.previewText}>
                                                (Scale target: {formatAmount(nextScaleTarget)} ml)
                                            </Text>
                                        )}
                                    </>
                                )}
                            </View>
                        </View>
                    </Animated.View>
                );
            })()}
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.xl,
        alignItems: 'center',
    },

    header: {
        ...typography.cardMetaBold,
        fontSize: 14,
        textTransform: "uppercase",
        color: colors.brown,
        paddingTop: spacing.md,
    },

    subHeader: {
        ...typography.sectionHeader,
        color: colors.coral,
        fontSize: 18,
        fontWeight: "600",
        letterSpacing: 1,
    },

    divider: {
        height: 1,
        backgroundColor: colors.brown,
        borderRadius: radius.full,
        alignSelf: 'stretch',
    },

    timerPrimary: {
        ...typography.timerPrimary,
        color: colors.textPrimary,
    },

    timerSecondary: {
        ...typography.timerSecondary,
        color: colors.brown,
    },

    totalTimeText: {
        ...typography.ingredientTextSecondary,
        color: colors.orange,
        fontSize: 10,
        marginTop: spacing.xs,
    },

    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 90,
        width: '100%',
        marginVertical: spacing.sm,
    },

    buttonRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        justifyContent: 'space-evenly',
        width: '100%'
    },

    roundButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.coral,
        alignItems: "center",
        justifyContent: "center",
    },

    roundButtonBig: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.coral,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonBundle: {
        alignItems: 'center',
        gap: spacing.sm,
    },

    centeredButton: {
        position: 'absolute',
    },

    buttonLabelText: {
        ...typography.ingredientTextSecondary,
        color: colors.textPrimary,
        fontSize: 11,
    },

    stepRow: {
        flexDirection: "row",
        alignItems: "baseline",
        width: "100%",
        gap: spacing.xs,
    },

    stepMetaRow: {
        marginLeft: "auto",
        flexDirection: "row",
        gap: spacing.sm,
    },

    stepTitle: {
        ...typography.cardTitle,
        color: colors.textPrimary,
        fontSize: 18,
        flex: 1,
        flexShrink: 1,
    },

    stepMeta: {
        ...typography.cardMeta,
        fontSize: 12,
        color: colors.brown,
    },

    stepMetaBold: {
        ...typography.cardMetaBold,
        fontSize: 12,
        color: colors.textPrimary,
    },

    cardDivider: {
        height: 2,
        backgroundColor: colors.divider,
        borderRadius: radius.full,
        width: "100%",
    },

    waterAmountText: {
        ...typography.cardMetaBold,
        fontSize: 16,
        color: colors.white,
        backgroundColor: colors.brown,
        borderRadius: radius.sm,
        overflow: 'hidden',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },

    instructionText: {
        ...typography.cardMeta,
        color: colors.textPrimary,
        paddingTop: spacing.xs,
    },

    previewHeader: {
        ...typography.cardTitle,
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
        color: colors.orange,
    },

    previewText: {
        ...typography.cardMeta,
        fontSize: 12,
        color: colors.brown,
    },

    previewTextBold: {
        ...typography.cardMetaBold,
        fontSize: 12,
        color: colors.brown,
    },

    previewCard: {
        flexDirection: "row",
        alignItems: "baseline",
        width: "100%",
        backgroundColor: colors.surfaceFaded,
        borderRadius: radius.xs,
        paddingVertical: spacing.md,
        paddingLeft: spacing.md,
        paddingRight: spacing.md,
        marginBottom: spacing.sm,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
        gap: spacing.lg,
    }

})