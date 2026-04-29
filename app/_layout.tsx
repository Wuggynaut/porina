import {Stack, useRouter, useSegments} from "expo-router";
import {FavoritesProvider} from "../src/context/FavoritesContext";
import {useFonts} from "expo-font";
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans/';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";
import {AuthProvider, useAuth} from "../src/context/AuthContext";
import {ActivityIndicator, View, StyleSheet } from "react-native";
import {colors} from "../src/theme";


function AuthGate() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (isLoading) return;
        const inAuthGroup = segments[0] === "(auth)";

        if (!user && !inAuthGroup) {
            router.replace("/(auth)/login");
        } else if (user && inAuthGroup) {
            router.replace("/(tabs)");
        }
    }, [user, isLoading, segments]);

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={colors.coral}/>
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Screen name="(auth)" options={{headerShown: false}} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="brew" options={{ presentation: "modal", headerShown: false }} />
        </Stack>
    )
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        "ClashGrotesk": require("../assets/fonts/ClashGrotesk-Variable.ttf"),
        DMSans_400Regular,
        DMSans_500Medium,
        DMSans_700Bold,
        DMMono_400Regular,
        DMMono_500Medium
    });

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <AuthProvider>
            <FavoritesProvider>
                <AuthGate />
            </FavoritesProvider>
        </AuthProvider>
    );
}


const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },
});