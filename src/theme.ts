import {TextStyle} from "react-native";

export const colors = {
    // --- core palette ---
    coral: "#fe5566",
    brown: "#ae4c38",
    orange: "#ed7a32",
    cream: "#f3db8c",
    white: "#ffffff",

    // --- surfaces ---
    background: "#fdf6e7",
    surface: "#ffffff",
    surfacePressed: "#f3db8c", // cream
    surfaceFaded: "rgba(255, 255, 255, 0.35)",

    // --- text ---
    textPrimary: "#5a2618", // headings, body
    textSecondary: "#ae4c38", // secondary text - brown
    textMuted: "#ed7a32", // hints, disabled text etc - orange

    // --- utility ---
    border: "#f3db8c",
    divider: "#f3db8c",
    overlay: "rgba(90, 38, 24, 0.35)",
    cardShadow: "#5a2618",

    // --- semantic ---
    success: "#5cb87a",
    error: "#fe5566",
    warning: "#ed7a32",
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
} as const;

export const radius = {
    xs: 2,
    sm: 6,
    md: 10,
    lg: 16,
    full: 9999,
} as const;

export const fonts = {
    heading: "ClashGrotesk",
    body: {
        regular: "DMSans_400Regular",
        regularItalic: "DMSans_400Regular_Italic",
        medium: "DMSans_500Medium",
        bold: "DMSans_700Bold",
    },
    mono: {
        regular: "DMMono_400Regular",
        medium: "DMMono_500Medium",
    },
}

export const typography = {
    screenTitle: {
        fontFamily: fonts.heading,
        fontSize: 28,
        fontWeight: "600" as const,
        letterSpacing: 1,
        textTransform: "uppercase" as const,
    } as TextStyle,
    sectionHeader: {
        fontFamily: fonts.heading,
        fontSize: 20,
        fontWeight: "600" as const,
        letterSpacing: 2,
        textTransform: "capitalize" as const,
    } as TextStyle,
    cardTitle: {
        fontFamily: fonts.heading,
        fontSize: 17,
        fontWeight: "700" as const,
        letterSpacing: 0.1,
    } as TextStyle,
    cardMeta: {
        fontFamily: fonts.body.medium,
        fontSize: 14,
        letterSpacing: 0.2,
    } as TextStyle,
    cardMetaBold: {
        fontFamily: fonts.body.bold,
        fontSize: 14,
    } as TextStyle,
    ingredientText: {
        fontFamily: fonts.body.bold,
        fontSize: 18,
    } as TextStyle,
    ingredientTextSecondary: {
        fontFamily: fonts.body.regular,
        fontSize: 16,
    } as TextStyle,
    timerPrimary: {
        fontFamily: fonts.mono.medium,
        fontSize: 36,
    } as TextStyle,
    timerSecondary: {
        fontFamily: fonts.mono.regular,
        fontSize: 12,
    } as TextStyle,
    timerLabel: {
        fontFamily: fonts.body.regular,
        fontSize: 10,
        letterSpacing: 0.5,
        textTransform: "uppercase" as const,
    } as TextStyle,
};