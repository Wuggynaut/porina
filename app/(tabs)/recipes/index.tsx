import {SectionList, Pressable, Text, View} from "react-native";
import {Link} from "expo-router";
import {recipes} from "../../../src/data";
import {useMemo} from "react";
import {Recipe} from "../../../src/types/brew";

export default function Recipes() {
    const sections = useMemo(() => {
        const grouped = recipes.reduce<Record<string, Recipe[]>>((acc, recipe) => {
            (acc[recipe.method] ??= []).push(recipe);
            return acc;
        }, {});

        return Object.entries(grouped).map(([method, data]) => ({
            title: method,
            data,
        }));
    }, [recipes]);
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Recipes</Text>

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View>
                        <Link href={`/recipes/${item.id}`}>
                            <Pressable>
                                <Text>{item.name}</Text>
                            </Pressable>
                        </Link>
                    </View>
                )}
                renderSectionHeader={({section: {title} }) => (
                    <Text>{title}</Text>
                )}
                stickySectionHeadersEnabled={false}
            />
        </View>
    )
}