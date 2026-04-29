import {Pressable, View, Text, StyleSheet} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/config";
import {colors, radius, spacing} from "../../../src/theme";

export default function Profile() {

    const handleSignOut = () => signOut(auth);


    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Pressable style={styles.button} onPress={handleSignOut}>
                <Text>Sign out</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.coral,
        borderRadius: radius.md,
        paddingVertical: spacing.lg,
        alignItems: "center",
        marginTop: spacing.sm,
    },
})

