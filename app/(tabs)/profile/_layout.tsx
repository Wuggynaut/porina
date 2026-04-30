import { Stack } from 'expo-router';
import HeaderStack from "../../../src/components/HeaderStack";

export default function ProfileLayout() {
    return (
        <HeaderStack>
            <Stack.Screen name="index" options={{ title: 'Profile' }} />
        </HeaderStack>
    );
}