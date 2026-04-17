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

    // --- text ---
    textPrimary: "#5a2618", // headings, body
    textSecondary: "#ae4c38", // secondary text - brown
    textMuted: "#ed7a32", // hints, disabled text etc - orange

    // --- utility ---
    border: "#f3db8c",
    divider: "#f3db8c",
    overlay: "rgba(90, 38, 24, 0.35)",
    cardShadow: "rgba(90, 38, 24, 0.08)",

    // --- semantic ---
    success: "#5cb87a",
    error: "#fe5566",
    warning: "#ed7a32",
} as const;

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
    body: "DMSans",
}
export const typography = {
    /** Screen title in header */
    screenTitle: {
        fontFamily: fonts.heading,
        fontSize: 28,
        fontWeight: "800" as const,
        letterSpacing: 1,
        textTransform: "uppercase" as const,
    },
    /** Section headers (POUROVER, FRENCH PRESS) */
    sectionHeader: {
        fontFamily: fonts.heading,
        fontSize: 20,
        fontWeight: "800" as const,
        letterSpacing: 2,
        textTransform: "uppercase" as const,
    },
    /** Card title (recipe name) */
    cardTitle: {
        fontFamily: fonts.heading,
        fontSize: 17,
        fontWeight: "700" as const,
        letterSpacing: 0.1,
    },
    /** Card secondary line (author · ratio) */
    cardMeta: {
        fontFamily: fonts.body,
        fontSize: 14,
        fontWeight: "500" as const,
        letterSpacing: 0.2,
    },
} as const;