import { Stack } from 'expo-router';
import {typography, colors} from "../../../src/theme";
import {inspect} from "node:util";

export default function RecipesLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.coral },
                headerTintColor: colors.white,
                headerTitleStyle: typography.screenTitle,
                headerTitleAlign: "center",
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Recipes' }} />
            <Stack.Screen name="[id]" options={{ title: 'Recipe' }} />
        </Stack>
    );
}