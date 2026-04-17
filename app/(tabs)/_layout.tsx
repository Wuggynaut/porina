import {Tabs} from "expo-router";
import {useFonts} from "expo-font";
import {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";
import { colors, typography } from "../../src/theme";
import {inspect} from "node:util";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        "ClashGrotesk": require("../../assets/fonts/ClashGrotesk-Variable.ttf"),
        "DMSans": require("../../assets/fonts/DMSans-Variable.ttf"),
        "DMSans-Italic": require("../../assets/fonts/DMSans-Italic-Variable.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: { backgroundColor: colors.coral },
                tabBarActiveTintColor: "#ffffff",
                tabBarInactiveTintColor: colors.background,
                headerShown: false,
            }}
        >
            <Tabs.Screen name="index" options={{ href: null }} />
            <Tabs.Screen name="recipes" options={{ title: 'Recipes', headerShown: false}} />
            <Tabs.Screen name="history" options={{ title: 'History', headerShown: false}} />
            <Tabs.Screen name="profile" options={{ title: 'Profile', headerShown: false}} />
        </Tabs>
    )
}