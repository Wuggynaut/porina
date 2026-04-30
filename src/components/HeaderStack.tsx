import {ReactNode} from "react";
import {colors, typography} from "../theme";
import {Stack} from "expo-router";

export default function HeaderStack ({ children }: { children: ReactNode }) {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.coral },
                headerTitleStyle: typography.screenTitle as any,
                headerTintColor: colors.white,
                headerTitleAlign: "center",
            }}
        >
            {children}
        </Stack>
    )
}