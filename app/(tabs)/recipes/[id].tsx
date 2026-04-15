import {Link, useLocalSearchParams} from "expo-router";
import {Pressable, Text, View} from "react-native";

export default function RecipeScreen() {
    const { id } = useLocalSearchParams();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Recipe: {id}</Text>
            <Link href={`/brew/${id}`} asChild>
                <Pressable><Text>Brew</Text></Pressable>
            </Link>
        </View>
    )
}