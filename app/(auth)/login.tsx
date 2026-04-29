import {useState} from "react";
import {
    KeyboardAvoidingView,
    Platform,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import {colors, fonts, radius, spacing, typography} from "../../src/theme";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "@firebase/auth";
import {auth} from "../../firebase/config";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) return;

        setIsSubmitting(true);
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error: any) {
            // Map to friendlier strings later
            Alert.alert("Error", error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.content}>
                <Text style={styles.title}>Porina</Text>
                <Text style={styles.subtitle}>
                    {isSignUp ? "Create an account" : "Welcome back"}
                </Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={colors.textMuted}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                        textContentType="emailAddress"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={colors.textMuted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                        textContentType={isSignUp ? "newPassword" : "password"}
                    />

                    <TouchableOpacity
                        style={[styles.button, isSubmitting && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>
                            {isSubmitting
                                ? "Loading..."
                                : isSignUp
                                    ? "Sign Up"
                                    : "Sign In"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => setIsSignUp(!isSignUp)}
                    style={styles.toggleButton}
                >
                    <Text style={styles.toggleText}>
                        {isSignUp
                            ? "Already have an account? Sign In"
                            : "Don't have an account? Sign Up"}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
    },

    title: {
        ...typography.screenTitle,
        color: colors.textPrimary,
        fontSize: 40,
        textAlign: "center",
    },

    subtitle: {
        fontFamily: fonts.body.regular,
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: spacing.sm,
        marginBottom: spacing.xxxl,
    },

    form: {
        gap: spacing.md,
    },

    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        fontFamily: fonts.body.regular,
        fontSize: 16,
        color: colors.textPrimary,
    },

    button: {
        backgroundColor: colors.coral,
        borderRadius: radius.md,
        paddingVertical: spacing.lg,
        alignItems: "center",
        marginTop: spacing.sm,
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        fontFamily: fonts.body.bold,
        fontSize: 16,
        color: colors.white,
    },

    toggleButton: {
        marginTop: spacing.xl,
        alignItems: "center",
    },

    toggleText: {
        fontFamily: fonts.body.regular,
        fontSize: 14,
        color: colors.textSecondary,
    },
})