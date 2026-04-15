import {Pressable, Text, View} from "react-native";
import {Link} from "expo-router";

export default function HistoryList() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Brew History</Text>
            <Link href="/history/sample-brew-1" asChild>
                <Pressable><Text>Sample brew 1</Text></Pressable>
            </Link>
        </View>
    )
}