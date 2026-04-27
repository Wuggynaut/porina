import { Stack } from 'expo-router';
import {typography, colors} from "../../../src/theme";

export default function RecipesLayout() {

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.coral },
                headerTitleStyle: typography.screenTitle as any,
                headerTintColor: colors.white,
                headerTitleAlign: "center",
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Recipes' }} />
            <Stack.Screen name="[id]" options={{ title: 'Recipe' }} />
        </Stack>
    );
}