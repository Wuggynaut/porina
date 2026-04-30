import {colors, spacing} from "../theme";
import {Ionicons} from "@expo/vector-icons";
import {StyleSheet, TextStyle} from "react-native";

export default function Chevron({ style, color = colors.orange, size = 18 }: { style?: TextStyle, color?: string, size?: number }) {
    return (
        <Ionicons
        name="chevron-forward"
        size={size}
        color={color}
        style={[styles.chevron, style]}
    />
    );
}

const styles = StyleSheet.create({
    chevron: {
        marginLeft: spacing.sm,
    },
})