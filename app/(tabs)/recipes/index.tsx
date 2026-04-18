import {SectionList, Pressable, Text, View, StyleSheet} from "react-native";
import {Link} from "expo-router";
import {recipes} from "../../../src/data";
import {useMemo} from "react";
import {Recipe} from "../../../src/types/brew";
import {colors, spacing, radius, typography} from "../../../src/theme";
import {Ionicons} from "@expo/vector-icons";
import {useFavorites} from "../../../src/context/FavoritesContext";

export default function Recipes() {
    const { favorites, toggleFavorite } = useFavorites();


    const sections = useMemo(() => {
        const grouped = recipes.reduce<Record<string, Recipe[]>>((acc, recipe) => {
            (acc[recipe.method] ??= []).push(recipe);
            return acc;
        }, {});

        return Object.entries(grouped).map(([method, data]) => ({
            title: method,
            data,
        }));
    }, [recipes]);


    return (
        <View style={styles.screen}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    const isFav = favorites.has(item.id);
                    return (
                        <Link href={`/recipes/${item.id}`} asChild>
                            <Pressable>
                                {({pressed}) => (
                                    <View style={[styles.card, pressed && styles.cardPressed]}>
                                        <Pressable
                                            onPress={(e) => {
                                                e.preventDefault();
                                                toggleFavorite(item.id);
                                            }}
                                            hitSlop={8}
                                        >
                                            <Ionicons name={isFav ? "heart" : "heart-outline"} size={30}
                                                      color={isFav ? colors.coral : colors.textPrimary}/>
                                        </Pressable>
                                        <View style={styles.cardBody}>
                                            <View style={{alignSelf: "flex-start"}}>
                                                <Text style={styles.recipeName}>{item.name}</Text>
                                                <View style={[styles.cardDivider, {marginTop: spacing.sm}]}/>
                                            </View>
                                            <Text style={styles.recipeMeta}>
                                                {item.source} <Text
                                                style={{fontWeight: "800"}}>·</Text> 1:{(item.baseWaterMl / item.baseDoseGrams).toFixed(1)}
                                            </Text>
                                        </View>

                                        <Text style={styles.chevron}>›</Text>
                                    </View>
                                )}
                            </Pressable>
                        </Link>
                    )
                }}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeaderRow}>
                        <View style={styles.sectionHeaderAccent} />
                        <Text style={styles.sectionHeaderText}>{title}</Text>
                    </View>
                )}
                stickySectionHeadersEnabled={false}
                SectionSeparatorComponent={() => <View style={styles.sectionGap} />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },

    listContent: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxxl,
    },

    // --- section headers ---
    sectionHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    sectionHeaderAccent: {
        width: 4,
        height: 24,
        borderRadius: radius.sm,
        backgroundColor: colors.orange,
    },
    sectionHeaderText: {
        ...typography.sectionHeader,
        color: colors.orange,
    },
    sectionGap: {
        height: spacing.xxl,
    },

    // --- recipe card ---
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
    cardPressed: {
        backgroundColor: colors.surfacePressed,
    },

    cardBody: {
        flex: 1,
        gap: spacing.sm,
    },

    recipeName: {
        ...typography.cardTitle,
        color: colors.textPrimary,
    },

    cardDivider: {
        height: 2,
        backgroundColor: colors.divider,
        borderRadius: radius.full,
    },

    recipeMeta: {
        ...typography.cardMeta,
        color: colors.brown,
    },

    chevron: {
        fontSize: 26,
        fontWeight: "700",
        color: colors.orange,
        marginLeft: spacing.md,
    },
});