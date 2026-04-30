import {Pressable, View, Text, StyleSheet} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/config";
import {colors, radius, spacing, typography} from "../../../src/theme";
import Button from "../../../src/components/Button";

export default function Profile() {
    const user = auth.currentUser;
    const handleSignOut = () => signOut(auth);

    return (
        <View style={styles.container}>
            <View style={styles.userCard}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.displayName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?"}
                    </Text>
                </View>

                {user?.displayName && (
                    <Text style={styles.name}>{user.displayName}</Text>
                )}
                <Text style={styles.email}>{user?.email}</Text>
            </View>
            <Button label="Sign Out" onPress={handleSignOut} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xxxl,
        justifyContent: "space-between",
        paddingBottom: spacing.xxxl,
    },
    userCard: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.xl,
        alignItems: "center",
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.orange,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: spacing.lg,
    },
    avatarText: {
        ...typography.screenTitle,
        color: colors.white,
        fontSize: 28,
    },
    name: {
        ...typography.cardTitle,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    email: {
        ...typography.cardMeta,
        color: colors.textSecondary,
    },
    signOutButton: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        paddingVertical: spacing.lg,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.error,
    },
    signOutButtonPressed: {
        backgroundColor: colors.surfacePressed,
    },
    signOutText: {
        ...typography.cardMetaBold,
        color: colors.error,
    },
})

