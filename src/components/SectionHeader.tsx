import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, radius, typography } from "../theme";

interface SectionHeaderProps {
    title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
    return (
        <View style={styles.row}>
            <View style={styles.accent} />
            <Text style={styles.text}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        marginBottom: spacing.lg,
        paddingTop: spacing.md,
    },
    accent: {
        width: 4,
        height: 24,
        borderRadius: radius.sm,
        backgroundColor: colors.orange,
    },
    text: {
        ...typography.sectionHeader,
        color: colors.orange,
        fontWeight: "300",
        letterSpacing: 1,
    },
});