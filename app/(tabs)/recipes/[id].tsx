import {Link, useLocalSearchParams} from "expo-router";
import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {colors, spacing, radius, typography} from "../../../src/theme";
import {recipes} from "../../../src/data";
import {useMemo, useState} from "react";
import {SectionHeader} from "../../../src/components/SectionHeader";
import {Ionicons} from "@expo/vector-icons";
import {Minus, Plus} from "lucide-react-native";

export default function RecipeScreen() {
    const { id } = useLocalSearchParams<{id: string}>();
    const recipe = recipes.find(r => r.id === id);

    const [servings, setServings] = useState<number>(recipe?.baseServings ?? 1);

    const totalTime = useMemo(() => {
        if (!recipe) return "0m 0s";
        let totalTimeSeconds = 0;
        for (let step of recipe.steps) {
            totalTimeSeconds += step.durationSeconds;
        }
        const minutes = Math.floor(totalTimeSeconds / 60);
        const seconds = totalTimeSeconds % 60;
        return `${minutes}m ${seconds}s`;
    }, [recipe]);

    if (!recipe) {
        return <Text>Recipe not found</Text>
    }

    const formatTime = (seconds: number) =>
        `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

    const changeServing = (amount: number) => {
        if (servings+amount <= 0) return;
        setServings(servings+amount);
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
            <Text
                style={styles.recipeHeader}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
            >
                {recipe.name}
            </Text>
            <View style={styles.recipeMetaContainer}>
                <Text style={styles.recipeMetaText}>{totalTime}</Text>
                <Text style={styles.recipeMetaText}>•</Text>
                <Text style={styles.recipeMetaText}>1:{(recipe.baseWaterMl / recipe.baseDoseGrams).toFixed(1)}</Text>
                <Text style={styles.recipeMetaText}>•</Text>
                <Text style={styles.recipeMetaText}>{recipe.method}</Text>
            </View>

            <View style={[styles.divider, {marginTop: spacing.sm}]}/>

            <View style={styles.row}>
                <SectionHeader title={"Ingredients"} />
                <View style={styles.servingGroup}>
                    <Pressable
                        style={styles.roundButton}
                        onPress={() => changeServing(-1)}
                    >
                        <Minus size={28} strokeWidth={3} color={"white"} />
                    </Pressable>
                    <Text style={styles.ingredientTextSecondary}>{servings} cups</Text>
                    <Pressable
                        style={styles.roundButton}
                        onPress={() => changeServing(1)}
                    >
                        <Plus size={28} strokeWidth={3} color={"white"} />
                    </Pressable>
                </View>
            </View>

            <View style={styles.ingredientContainer}>
                <View style={styles.row}>
                    <Text style={styles.ingredientText}>Coffee</Text>
                    <View style={styles.ingredientValueGroup}>
                        <Text style={styles.ingredientText}>{(recipe.baseDoseGrams*(servings/recipe.baseServings)).toFixed(1)} g</Text>
                        <Text style={styles.ingredientTextSecondary}>({recipe.grind})</Text>
                    </View>
                </View>
                <View style={[styles.divider, {marginTop: spacing.sm}]}/>
                <View style={styles.row}>
                    <Text style={styles.ingredientText}>Water</Text>
                    <View  style={styles.ingredientValueGroup}>
                        <Text style={styles.ingredientText}>{(recipe.baseWaterMl*(servings/recipe.baseServings)).toFixed(1)} ml</Text>
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
                            <View key={step.label}>
                                <View style={styles.stepRow}>
                                    <Text style={styles.stepTitle}>{index + 1}. {step.label}</Text>
                                    <View style={styles.stepMetaRow}>
                                        {step.waterMl && <Text style={styles.stepMeta}>{(step.waterMl*(servings/recipe.baseServings)).toFixed(1)} ml</Text>}
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
            <View style={styles.centered}>
                <Link href={`/brew/${id}`} asChild>
                    <Pressable style={styles.button}><Text style={styles.buttonText}>Brew</Text></Pressable>
                </Link>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.xl,
    },

    scrollContent: {
        paddingBottom: spacing.xxxl,
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

    roundButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.coral,
        alignItems: "center",
        justifyContent: "center",
    },

    button: {
        width: 120,
        height: 48,
        borderRadius: radius.sm,
        backgroundColor: colors.coral,
        alignItems: "center",
        justifyContent: "center",
        marginTop: spacing.md,
        marginBottom: spacing.md,
    },

    buttonText: {
        ...typography.sectionHeader,
        color: colors.white,
        textTransform: "uppercase",
    },

    centered: {
        alignItems: "center",
    },

    servingGroup: {
        marginLeft: "auto",
        flexDirection: "row",
        gap: spacing.sm,
        alignItems: 'center',
    },

    ingredientText: {
        ...typography.ingredientText,
        color: colors.brown,
    },

    ingredientTextSecondary: {
        ...typography.ingredientTextSecondary,
        color: colors.brown,
        fontWeight: "600",
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