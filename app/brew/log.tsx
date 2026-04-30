import {useLocalSearchParams, useRouter} from "expo-router";
import {useAuth} from "../../src/context/AuthContext";
import {recipes} from "../../src/data";
import {useState} from "react";
import {saveBrewLog} from "../../src/services/brewLogService";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import {colors, radius, spacing, typography} from "../../src/theme";
import {Card} from "../../src/components/Card";

export default function LogBrewScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { recipeId, dose, water, grind } =
        useLocalSearchParams<{
            recipeId: string;
            dose: string;
            water: string;
            grind: string;
        }>();

    const recipe = recipes.find((r) => r.id === recipeId);

    const [rating, setRating] = useState(0);
    const [grindNote, setGrindNote] = useState(grind ?? "");
    const [notes, setNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const canSave = rating > 0 && !isSaving;

    async function handleSave() {
        if (!user || !recipeId) return;

        setIsSaving(true);

        try {
            const entry = {
                recipeId,
                userId: user.uid,
                dose: Number(dose),
                water: Number(water),
                grind: grindNote,
                rating,
                brewedAt: Date.now(),
            };

            const trimmedNotes = notes.trim();
            await saveBrewLog(trimmedNotes ? { ...entry, notes: trimmedNotes } : entry);
            //console.log("Save succeeded");

            router.dismissAll();
            router.replace("/(tabs)/history");
        } catch (error) {
            console.error("Failed to save brew log:", error);
            Alert.alert("Error", "Could not save your brew.")
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={100}
        >
            <ScrollView
                style={styles.screen}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                {recipe && (
                    <Text style={styles.recipeName}>{recipe.name}</Text>
                )}
                <Text style={styles.meta}>
                    {dose}g  ·  {water} ml
                </Text>

                <Card style={{width: "100%", gap: spacing.sm }}>
                    <Text style={styles.fieldLabel}>How was your brew?</Text>
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Pressable
                                key={star}
                                onPress={() => setRating(star)}
                                hitSlop={8}
                            >
                                <Text
                                    style={[
                                        styles.star,
                                        star <= rating && styles.starFilled,
                                    ]}
                                >
                                    ★
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Card>

                <Card style={{ width: "100%", gap: spacing.sm }}>
                    <Text style={styles.fieldLabel}>Grind setting</Text>
                    <TextInput
                        style={styles.textInput}
                        value={grindNote}
                        onChangeText={setGrindNote}
                        placeholder={grind}
                        placeholderTextColor={colors.textMuted}
                    />
                </Card>

                <Card style={{ width: "100%", gap: spacing.sm }}>
                    <Text style={styles.fieldLabel}>Notes</Text>
                    <TextInput
                        style={[styles.textInput, styles.notesInput]}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Tasting notes, tweaks, ideas..."
                        placeholderTextColor={colors.textMuted}
                        multiline
                        textAlignVertical="top"
                    />
                </Card>

                <Pressable
                    style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={!canSave}
                >
                    <Text style={styles.saveButtonText}>
                        {isSaving ? "Saving..." : "Save"}
                    </Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    )
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

    recipeName: {
        ...typography.sectionHeader,
        color: colors.coral,
        fontSize: 18,
        textAlign: "center",
    },

    meta: {
        ...typography.cardMeta,
        color: colors.brown,
        marginBottom: spacing.sm,
    },

    fieldLabel: {
        ...typography.cardMetaBold,
        color: colors.textPrimary,
        fontSize: 14,
    },

    starsRow: {
        flexDirection: "row",
        gap: spacing.md,
        justifyContent: "center",
        paddingVertical: spacing.xs,
    },

    star: {
        fontSize: 32,
        color: colors.border,
    },

    starFilled: {
        color: colors.orange,
    },

    textInput: {
        ...typography.cardMeta,
        color: colors.textPrimary,
        backgroundColor: colors.background,
        borderRadius: radius.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        fontSize: 14,
    },

    notesInput: {
        minHeight: 100,
        width: "100%",
    },

    saveButton: {
        backgroundColor: colors.coral,
        borderRadius: radius.md,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xxl,
        width: "100%",
        alignItems: "center",
        marginTop: spacing.sm,
    },

    saveButtonDisabled: {
        opacity: 0.4,
    },

    saveButtonText: {
        ...typography.cardMetaBold,
        color: colors.white,
        fontSize: 16,
    },
})