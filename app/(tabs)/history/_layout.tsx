import { Stack } from 'expo-router';
import HeaderStack from "../../../src/components/HeaderStack";

export default function HistoryLayout() {
    return (
        <HeaderStack>
            <Stack.Screen name="index" options={{ title: 'History' }} />
            <Stack.Screen name="[id]" options={{ title: 'Brew Log' }} />
        </HeaderStack>
    );
}