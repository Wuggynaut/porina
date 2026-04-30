import {Pressable, Text, View} from "react-native";
import {Link, useRouter} from "expo-router";
import {useAuth} from "../../../src/context/AuthContext";
import {useState} from "react";
import {BrewLogEntry} from "../../../src/types/brew";

export default function HistoryList() {
    const { user } = useAuth();
    const router = useRouter();
    const [logs, setLogs] = useState<BrewLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Brew History</Text>
            <Link href="/history/sample-brew-1" asChild>
                <Pressable><Text>Sample brew 1</Text></Pressable>
            </Link>
        </View>
    )
}