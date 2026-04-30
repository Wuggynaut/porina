import {Pressable, Text, TextStyle, ViewStyle} from "react-native";
import {colors, radius, spacing, typography} from "../theme";

type ButtonProps = {
    label: string;
    onPress: () => void;
    size?: 'md' | 'lg' | 'xl';
    buttonStyle?: ViewStyle;
    labelStyle?: TextStyle;
}

export default function Button({label, onPress, size = 'md', buttonStyle, labelStyle}: ButtonProps) {
    let buttonSize = null;
    let fontSize = null;

    switch (size) {
        case 'md':
            buttonSize = spacing.md;
            fontSize = 16;
            break;
        case "lg":
            buttonSize = spacing.lg;
            fontSize = 18;
            break;
        case "xl":
            buttonSize = spacing.xl;
            fontSize = 20;
            break;
    }

    return (
        <Pressable
            style={({pressed}) => [
                {
                    borderRadius: radius.sm,
                    backgroundColor: colors.coral,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 24,
                    paddingVertical: buttonSize,
                },
                pressed && { opacity: 0.75 },
                buttonStyle,
            ]}
            onPress={onPress}
        >
            <Text style={[{
                ...typography.cardMetaBold,
                color: colors.white,
                fontSize: fontSize,
            }, labelStyle]}>
                {label}
            </Text>
        </Pressable>
    );
}