import {Tabs} from "expo-router";

export default function RootLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ href: null }} />
            <Tabs.Screen name="recipes" options={{ title: 'Recipes', headerShown: false}} />
            <Tabs.Screen name="history" options={{ title: 'History', headerShown: false}} />
            <Tabs.Screen name="profile" options={{ title: 'Profile', headerShown: false}} />
        </Tabs>
    )
}