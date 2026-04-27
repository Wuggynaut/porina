import {Stack } from "expo-router";
import {FavoritesProvider} from "../src/context/FavoritesContext";
import {useFonts} from "expo-font";
import { JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono/700Bold';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono/400Regular';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans/';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        "ClashGrotesk": require("../assets/fonts/ClashGrotesk-Variable.ttf"),
        DMSans_400Regular,
        DMSans_500Medium,
        DMSans_700Bold,
        JetBrainsMono_400Regular,
        JetBrainsMono_700Bold,
        DMMono_400Regular,
        DMMono_500Medium
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <FavoritesProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
                <Stack.Screen name="brew" options={{ presentation: 'modal', headerShown: false}} />
            </Stack>
        </FavoritesProvider>
    )
}