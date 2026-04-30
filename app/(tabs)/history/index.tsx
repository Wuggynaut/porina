import {FlatList, Pressable, SectionList, StyleSheet, Text, View} from "react-native";
import {useRouter} from "expo-router";
import {useAuth} from "../../../src/context/AuthContext";
import {useEffect, useMemo, useState} from "react";
import {BrewLogEntry} from "../../../src/types/brew";
import {subscribeToBrewLogs} from "../../../src/services/brewLogService";
import {colors, radius, spacing, typography} from "../../../src/theme";
import {findRecipeById, recipes} from "../../../src/data";
import {Card} from "../../../src/components/Card";
import {formatDate} from "../../../src/utils/format";
import {Ionicons} from "@expo/vector-icons";
import Chevron from "../../../src/components/Chevron";
import {SectionHeader} from "../../../src/components/SectionHeader";

type Section = {
    title: string; // the year
    data: BrewLogEntry[];
};


// Groups brew logs by month, descending (most recent first)
function useGroupedByMonth(logs: BrewLogEntry[]): Section[] {
    return useMemo(() => {
        const map = new Map<string, { label: string; entries: BrewLogEntry[] }>();

        for (const log of logs) {
            const date = new Date(log.brewedAt);
            // "2026-04" format — sorts chronologically as a string
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

            if (!map.has(key)) {
                // Human-readable label: "April 2026"
                const label = date.toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                });
                map.set(key, { label, entries: [] });
            }
            map.get(key)!.entries.push(log);
        }

        // Sort keys descending (most recent month first)
        return Array.from(map.entries())
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([, { label, entries }]) => ({ title: label, data: entries }));
    }, [logs]);
}

export default function HistoryList() {
    const { user } = useAuth();
    const router = useRouter();
    const [logs, setLogs] = useState<BrewLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const sections = useGroupedByMonth(logs);

    useEffect(() => {
        if (!user) return;

        return subscribeToBrewLogs(
            user.uid,
            (data) => {
                setLogs(data);
                setIsLoading(false);
            },
            (error) => {
                console.error(error);
                setIsLoading(false);
            }
        );
    }, [user]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>Loading...</Text>
            </View>
        )
    }

    if (logs.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyTitle}>No brews yet</Text>
                <Text style={styles.emptyText}>
                    Complete a brew and log it to start tracking.
                </Text>
            </View>
        );
    }

    return (
        <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            style={styles.screen}
            contentContainerStyle={styles.listContent}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({ section }) => (
                <SectionHeader title={section.title} />
            )}
            renderItem={({ item }) => {
                const recipe = findRecipeById(item.recipeId);
                const date = new Date(item.brewedAt);
                const day = date.getDate();
                const month = date.toLocaleDateString(undefined, { month: "short" });

                return (
                    <Pressable onPress={() => router.push(`/(tabs)/history/${item.id}`)}>
                        {({pressed}) => (
                            <Card pressed={pressed} style={styles.card}>
                                <View style={styles.dateColumn}>
                                    <Text style={styles.dateDay}>{day}</Text>
                                    <Text style={styles.dateMonth}>{month}</Text>
                                </View>

                                <View style={styles.verticalDivider} />

                                <View style={styles.contentColumn}>
                                    <Text style={styles.subtitle} numberOfLines={1}>
                                        {recipe?.method ?? "Brew"}  ·  {item.dose}g  ·  {item.water}ml
                                    </Text>
                                    <Text style={styles.recipeName} numberOfLines={1}>
                                        {recipe?.name ?? "Unknown recipe"}
                                    </Text>
                                    <Text style={styles.stars}>
                                        {"★".repeat(item.rating)}
                                        {"☆".repeat(5 - item.rating)}
                                    </Text>
                                </View>

                                <Chevron />
                            </Card>
                        )}
                    </Pressable>
                )
        }} />
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },

    centered: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.xxl,
    },

    emptyTitle: {
        ...typography.sectionHeader,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },

    emptyText: {
        ...typography.cardMeta,
        color: colors.brown,
        textAlign: "center",
    },

    card: {
        flexDirection: "row",
    },

    dateColumn: {
        alignItems: "center",
        minWidth: 48,
    },

    dateDay: {
        ...typography.cardTitle,
        color: colors.textPrimary,
        fontSize: 22,
        lineHeight: 26,
    },

    dateMonth: {
        ...typography.cardMeta,
        color: colors.brown,
        fontSize: 13,
        textTransform: "capitalize",
    },

    verticalDivider: {
        width: 2,
        alignSelf: "stretch",
        backgroundColor: colors.divider,
        borderRadius: radius.full,
        marginHorizontal: spacing.xs,
    },

    listContent: {
        padding: spacing.xl,
        gap: spacing.md,
    },

    contentColumn: {
        flex: 1,
        gap: 2,
        alignItems: "center",
    },

    subtitle: {
        ...typography.cardMeta,
        color: colors.brown,
        fontSize: 12,
        textTransform: "capitalize",
    },

    recipeName: {
        ...typography.cardTitle,
        color: colors.textPrimary,
        fontSize: 18,
    },

    date: {
        ...typography.cardMeta,
        color: colors.brown,
        fontSize: 12,
    },

    meta: {
        ...typography.cardMeta,
        color: colors.brown,
        fontSize: 14,
    },

    stars: {
        fontSize: 20,
        color: colors.orange,
        letterSpacing: 2,
    },

    notes: {
        ...typography.cardMeta,
        color: colors.textSecondary,
        fontSize: 13,
        fontStyle: "italic",
    },
});