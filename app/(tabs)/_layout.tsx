import {Tabs} from "expo-router";
import { colors } from "../../src/theme";
import {Ionicons} from "@expo/vector-icons";

export default function RootLayout() {

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
            <Tabs.Screen
                name="recipes"
                options={{
                    title: 'Recipes',
                    tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons name={focused ? "cafe" : "cafe-outline"} size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "time" : "time-outline"} size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}