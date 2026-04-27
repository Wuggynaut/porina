import {StyleSheet, View, ViewStyle} from "react-native";
import {colors, radius, spacing} from "../theme";
import {ReactNode} from "react";

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
    return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: radius.xs,
        paddingVertical: spacing.md,
        paddingLeft: spacing.md,
        paddingRight: spacing.md,
        marginBottom: spacing.sm,
        minHeight: 72,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
        gap: spacing.md,
    },
})