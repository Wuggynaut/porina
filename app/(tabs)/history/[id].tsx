import {useLocalSearchParams, useRouter} from "expo-router";
import {View, Text, Alert, StyleSheet, ScrollView, Pressable} from "react-native";
import {useEffect, useState} from "react";
import {BrewLogEntry} from "../../../src/types/brew";
import {doc, getDoc} from "@firebase/firestore";
import {db} from "../../../firebase/config";
import {deleteBrewLog} from "../../../src/services/brewLogService";
import {colors, radius, spacing, typography} from "../../../src/theme";
import {findRecipeById} from "../../../src/data";
import {Card} from "../../../src/components/Card";
import Button from "../../../src/components/Button";

export default function BrewDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [entry, setEntry] = useState<BrewLogEntry | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        getDoc(doc(db, "brewLogs", id))
            .then((snap) => {
                if (snap.exists()) {
                    setEntry({ id: snap.id, ...snap.data() } as BrewLogEntry);
                }
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [id]);

    function handleDelete() {
        Alert.alert(
            "Delete brew?",
            "This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        if (!id) return;
                        try {
                            await deleteBrewLog(id);
                            router.back();
                        } catch (error) {
                            console.error(error);
                            Alert.alert("Error", "Could not delete brew.");
                        }
                    },
                },
            ]
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>Loading...</Text>
            </View>
        )
    }

    if (!entry) {
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>Brew not found</Text>
            </View>
        )
    }

    const recipe = findRecipeById(entry.recipeId);
    const date = new Date(entry.brewedAt);

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <Text style={styles.recipeName}>
                {recipe?.name ?? "Unknown recipe"}
            </Text>
            <Text style={styles.date}>
                {date.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                })}
            </Text>

            <Text style={styles.stars}>
                {"★".repeat(entry.rating)}
                {"☆".repeat(5 - entry.rating)}
            </Text>

            <Card style={{ width: "100%", gap: spacing.md }}>
                <Text style={styles.cardHeader}>Details</Text>

                <View style={styles.cardDivider} />

                <DetailRow label="Coffee" value={`${entry.dose}g`} />
                <DetailRow label="Water" value={`${entry.water} ml`} />
                <DetailRow label="Grind" value={entry.grind} />
                {recipe && (
                    <DetailRow label="Method" value={recipe.method} />
                )}
            </Card>

            {entry.notes && (
                <Card style={{ width: "100%", gap: spacing.sm }}>
                    <Text style={styles.cardHeader}>Notes</Text>
                    <View style={styles.cardDivider} />
                    <Text style={styles.notesText}>{entry.notes}</Text>
                </Card>
            )}

            <Button label="Delete Brew" onPress={handleDelete} buttonStyle={{width: "100%"}}/>
        </ScrollView>
    )
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        padding: spacing.xl,
        gap: spacing.md,
        alignItems: "center",
    },

    centered: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },

    emptyText: {
        ...typography.cardMeta,
        color: colors.brown,
    },

    recipeName: {
        ...typography.screenTitle,
        color: colors.textPrimary,
        fontSize: 24,
        textAlign: "center",
    },

    date: {
        ...typography.cardMeta,
        color: colors.brown,
        fontSize: 13,
    },

    stars: {
        fontSize: 28,
        color: colors.orange,
        letterSpacing: 4,
        marginVertical: spacing.xs,
    },

    cardDivider: {
        height: 2,
        backgroundColor: colors.divider,
        borderRadius: radius.full,
        width: "100%",
    },

    detailRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "baseline",
        paddingHorizontal: spacing.lg,
    },

    detailLabel: {
        ...typography.cardMeta,
        color: colors.brown,
        fontSize: 14,
        flex: 1,
    },

    detailValue: {
        ...typography.cardMetaBold,
        color: colors.textPrimary,
        fontSize: 14,
    },

    cardHeader: {
        ...typography.cardTitle,
        color: colors.textPrimary,
    },

    notesText: {
        ...typography.cardMeta,
        color: colors.textPrimary,
        fontSize: 14,
        lineHeight: 20,
    },

    deleteButton: {
        borderRadius: radius.md,
        borderWidth: 1.5,
        borderColor: colors.coral,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xxl,
        width: "100%",
        alignItems: "center",
        marginTop: spacing.lg,
    },

    deleteButtonText: {
        ...typography.cardMetaBold,
        color: colors.coral,
        fontSize: 14,
    },
})