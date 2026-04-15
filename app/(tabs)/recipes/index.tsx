import {FlatList, Pressable, Text, View} from "react-native";
import {Link} from "expo-router";
import {recipes} from "../../../src/data";

export default function Recipes() {

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Recipes</Text>
            <FlatList data={recipes} renderItem={({item}) =>
                <Link href={`/recipes/${item.id}`} asChild>
                    <Pressable><Text>{item.name}</Text></Pressable>
                </Link>
            } />
        </View>
    )
}