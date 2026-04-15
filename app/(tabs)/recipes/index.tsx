import {Pressable, Text, View} from "react-native";
import {Link} from "expo-router";

export default function Recipes() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Recipes</Text>
            <Link href="/recipes/hoffman-v60" asChild>
                <Pressable><Text>V60 recipe</Text></Pressable>
            </Link>
        </View>
    )
}