import { Stack } from 'expo-router';
import {colors, typography} from "../../src/theme";

export default function BrewLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTitleStyle: typography.screenTitle as any,
                headerTintColor: colors.brown,
                headerTitle: 'Now Brewing',
                headerShadowVisible: false,
                headerTitleAlign: "center",
            }}
        />
    );
}