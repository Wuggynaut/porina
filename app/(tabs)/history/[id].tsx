import {useLocalSearchParams} from "expo-router";
import {View, Text} from "react-native";

export default function BrewLogScreen() {
    const { id } = useLocalSearchParams();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Brew: {id}</Text>
        </View>
    )
}