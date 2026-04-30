import {StyleSheet, View, ViewStyle} from "react-native";
import {colors, radius, spacing} from "../theme";
import React, {ReactNode} from "react";
import Animated from "react-native-reanimated";

type CardProps = {
    children: ReactNode;
    style?: ViewStyle;
} & Pick<React.ComponentProps<typeof Animated.View>, "entering" | "exiting" | "layout">;

export function Card({ children, style, ...animationProps }: CardProps) {
    return <Animated.View
        style={[styles.card, style]}
        {...animationProps}
    >
        {children}
    </Animated.View>;
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
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
        gap: spacing.md,
    },
})