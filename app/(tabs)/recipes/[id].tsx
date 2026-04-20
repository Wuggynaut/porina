import {Link, useLocalSearchParams} from "expo-router";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {colors, spacing, radius, typography} from "../../../src/theme";
import {recipes} from "../../../src/data";
import {useMemo} from "react";
import {SectionHeader} from "../../../src/components/SectionHeader";

export default function RecipeScreen() {
    const { id } = useLocalSearchParams<{id: string}>();
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) {
        return <Text>Recipe not found</Text>
    }

    const totalTime = useMemo(() => {
        let totalTimeSeconds = 0;
        for (let step of recipe.steps) {
            totalTimeSeconds += step.durationSeconds;
        }
        const minutes = Math.floor(totalTimeSeconds / 60);
        const seconds = totalTimeSeconds % 60;
        return `${minutes}m ${seconds}s`;
    }, [recipe.steps]);

    const formatTime = (seconds: number) =>
        `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

    return (
        <View style={styles.screen}>
            <Text style={styles.recipeHeader}>{recipe.name}</Text>
            <View style={styles.recipeMetaContainer}>
                <Text style={styles.recipeMetaText}>{totalTime}</Text>
                <Text style={styles.recipeMetaText}>•</Text>
                <Text style={styles.recipeMetaText}>1:{(recipe.baseWaterMl / recipe.baseDoseGrams).toFixed(1)}</Text>
                <Text style={styles.recipeMetaText}>•</Text>
                <Text style={styles.recipeMetaText}>{recipe.method}</Text>
            </View>

            <View style={[styles.divider, {marginTop: spacing.sm}]}/>

            <SectionHeader title={"Ingredients"} />

            <View style={styles.ingredientContainer}>
                <View style={styles.row}>
                    <Text style={styles.ingredientText}>Coffee</Text>
                    <View style={styles.ingredientValueGroup}>
                        <Text style={styles.ingredientText}>{recipe.baseDoseGrams} g</Text>
                        <Text style={styles.ingredientTextSecondary}>({recipe.grind})</Text>
                    </View>
                </View>
                <View style={[styles.divider, {marginTop: spacing.sm}]}/>
                <View style={styles.row}>
                    <Text style={styles.ingredientText}>Water</Text>
                    <View  style={styles.ingredientValueGroup}>
                        <Text style={styles.ingredientText}>{recipe.baseWaterMl} ml</Text>
                        <Text style={styles.ingredientTextSecondary}>(at {recipe.waterTempCelsius}°C)</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.divider, {marginTop: spacing.sm}]}/>

            <SectionHeader title={"Steps"} />

            <View style={styles.card}>
                <View style={styles.cardBody}>
                    {recipe.steps.map((step, index) => {
                        const startTime = recipe.steps
                            .slice(0,index)
                            .reduce((sum, s) => sum + s.durationSeconds, 0);
                        const endTime = startTime + step.durationSeconds;
                        return (
                            <View>
                                <View style={styles.stepRow}>
                                    <Text style={styles.stepTitle}>{index + 1}. {step.label}</Text>
                                    <View style={styles.stepMetaRow}>
                                        {step.waterMl && <Text style={styles.stepMeta}>{step.waterMl} ml</Text>}
                                        <Text style={styles.stepMeta}>{formatTime(startTime)}-{formatTime(endTime)}</Text>
                                    </View>
                                </View>

                                <View style={[styles.cardDivider, { marginTop: spacing.sm }]} />

                                <View>
                                    <Text style={styles.instructionText}>{step.instruction}</Text>
                                </View>
                            </View>
                        )
                    })}
                </View>
            </View>
            <Link href={`/brew/${id}`} asChild>
                <Pressable><Text>Brew</Text></Pressable>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.xl,
    },

    recipeHeader: {
        ...typography.sectionHeader,
        fontSize: 22,
        color: colors.brown,
        paddingTop: spacing.xl,
        textTransform: "uppercase",
    },

    recipeMetaContainer: {
        flexDirection: "row",
        gap: spacing.xxl,
    },

    recipeMetaText: {
        ...typography.cardMeta,
        textTransform: "capitalize",
        fontWeight: "400",
        color: colors.orange,
    },

    divider: {
        height: 1,
        backgroundColor: colors.brown,
        borderRadius: radius.full,
    },

    ingredientContainer: {
        paddingHorizontal: spacing.xl,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },

    ingredientText: {
        ...typography.ingredientText,
        color: colors.brown,
    },

    ingredientTextSecondary: {
        ...typography.ingredientTextSecondary,
        color: colors.brown,
    },

    ingredientValueGroup: {
        marginLeft: "auto",
        flexDirection: "row",
        alignItems: "baseline",
        gap: spacing.xs,
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: radius.xs,
        paddingVertical: spacing.lg,
        paddingLeft: spacing.xl,
        paddingRight: spacing.lg,
        marginBottom: spacing.sm,
        minHeight: 72,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
        gap: spacing.lg,
    },

    cardBody: {
        flex: 1,
        gap: spacing.sm,
    },

    stepRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: spacing.md,
    },

    stepTitle: {
        ...typography.cardTitle,
        color: colors.textPrimary,
        fontSize: 22,
    },

    stepMetaRow: {
        marginLeft: "auto",
        flexDirection: "row",
        alignItems: "baseline",
        gap: spacing.lg,
    },

    stepMeta: {
        ...typography.cardMeta,
        color: colors.white,
        backgroundColor: colors.brown,
        borderRadius: radius.sm,
        overflow: 'hidden',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },

    cardDivider: {
        height: 2,
        backgroundColor: colors.divider,
        borderRadius: radius.full,
    },

    instructionText: {
        ...typography.cardMeta,
        color: colors.brown,
        paddingTop: spacing.sm,
    }
})