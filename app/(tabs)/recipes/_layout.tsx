import { Stack } from 'expo-router';
import HeaderStack from "../../../src/components/HeaderStack";

export default function RecipesLayout() {

    return (
        <HeaderStack>
            <Stack.Screen name="index" options={{ title: 'Recipes' }} />
            <Stack.Screen name="[id]" options={{ title: 'Recipe' }} />
        </HeaderStack>
    );
}