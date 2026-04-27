import {useLocalSearchParams} from "expo-router";
import {View, Text, StyleSheet, Pressable} from "react-native";
import {recipes} from "../../src/data";
import {useBrewTimer} from "../../src/hooks/useBrewTimer";
import {colors, radius, spacing, typography} from "../../src/theme";
import {ProgressRing} from "../../src/components/ProgressRing";
import {RotateCcw} from "lucide-react-native";
import {Ionicons} from "@expo/vector-icons";
import {Card} from "../../src/components/Card";
import {useMemo} from "react";
import {formatAmount, formatTime} from "../../src/utils/format";

export default function BrewSession() {

    const {id, servings} = useLocalSearchParams();
    const recipe = recipes.find(r => r.id === id);
    const servingCount = Number(servings) || recipe?.baseServings || 1;
    const ratio = recipe ? servingCount / recipe.baseServings : 1;


    const timer = useBrewTimer({
        steps: recipe?.steps ?? [],

        onStepChange: (index, step) => {
            console.log(`Now on step ${index}: ${step.label}`);
            // TODO: Add haptics etc.
        },

        onFinish: () => {
            console.log('Brew is complete')
            // TODO: navigate to 'log this brew' screen.
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

    if (!recipe) {
        return <Text>Recipe not found</Text>;
    }

    return (
        <View style={styles.screen}>
            <Text
                style={styles.header}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={10}
            >
                Now brewing
            </Text>
            <Text style={styles.subHeader}>
                {recipe.name}
            </Text>

            {timer.currentStep && (
                <View style={{ width: 200, height: 200, position: 'relative', marginTop: spacing.xl, marginBottom: spacing.xl }}>
                    <ProgressRing
                        steps={timer.steps}
                        progress={timer.progress}
                        totalDuration={timer.totalDuration}
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

            {timer.status === 'idle' &&(
                <View style={styles.buttonBundle}>
                    <Pressable style={styles.roundButtonBig} onPress={timer.start}>
                        <Ionicons name={"play"} color={"white"} size={34}/>
                    </Pressable>
                    <Text style={styles.buttonLabelText}>Start</Text>
                </View>
            )}

            {timer.status === 'running' && (
                <View style={styles.buttonRow}>
                    <View style={styles.buttonBundle}>
                        <Pressable style={[styles.roundButton, {backgroundColor: colors.orange,}]} onPress={timer.reset}>
                            <RotateCcw size={30} strokeWidth={2.5} color={"white"}/>
                        </Pressable>
                        <Text style={styles.buttonLabelText}>Reset</Text>
                    </View>
                    <View style={styles.buttonBundle}>
                        <Pressable style={styles.roundButton} onPress={timer.pause}>
                            <Ionicons name={"pause"} color={"white"} size={30}/>
                        </Pressable>
                        <Text style={styles.buttonLabelText}>Pause</Text>
                    </View>
                </View>
            )}

            {timer.status === 'paused' && (
                <View style={styles.buttonRow}>
                    <View style={styles.buttonBundle}>
                        <Pressable style={[styles.roundButton, {backgroundColor: colors.orange,}]} onPress={timer.reset}>
                            <RotateCcw size={30} strokeWidth={2.5} color={"white"}/>
                        </Pressable>
                        <Text style={styles.buttonLabelText}>Reset</Text>
                    </View>
                    <View style={styles.buttonBundle}>
                        <Pressable style={styles.roundButton} onPress={timer.resume}>
                            <Ionicons name={"play"} color={"white"} size={30}/>
                        </Pressable>
                        <Text style={styles.buttonLabelText}>Resume</Text>
                    </View>
                </View>
            )}

            {timer.status === 'finished' &&(
                <View style={styles.buttonBundle}>
                    <Pressable style={styles.roundButtonBig} onPress={timer.start}>
                        <RotateCcw size={34} strokeWidth={2.5} color={"white"}/>
                    </Pressable>
                    <Text style={styles.buttonLabelText}>Start</Text>
                </View>
            )}

            {timer.currentStep && (
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
            )}

            {timer.currentStepIndex < recipe.steps.length - 1 && (() => {
                const nextStep = recipe.steps[timer.currentStepIndex + 1];
                return (
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
                                            (Scale target: {formatAmount(nextScaleTarget * ratio)} ml)
                                        </Text>
                                    )}
                                </>
                            )}
                        </View>
                    </View>
                );
            })()}

            {timer.status === 'finished' && (
                <View>
                    <Text>Done!</Text>
                    <Pressable onPress={timer.reset}>
                        <Text>Brew Again</Text>
                    </Pressable>
                </View>
            )}
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