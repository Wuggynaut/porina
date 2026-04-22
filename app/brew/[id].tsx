import {useLocalSearchParams} from "expo-router";
import {View, Text, StyleSheet, Pressable} from "react-native";
import {recipes} from "../../src/data";
import {useBrewTimer} from "../../src/hooks/useBrewTimer";
import {colors, spacing} from "../../src/theme";

export default function BrewSession() {
    const {id} = useLocalSearchParams();
    const recipe = recipes.find(r => r.id === id);

    const timer = useBrewTimer({
        steps: recipe?.steps ?? [],

        onStepChange: (index, step) => {
            console.log(`Now on step ${index}: ${step.label}`);
            // TODO: Add haptics etc.
        },

        onFinish: () => {
            console.log('Brew is complete')
            // TODO: navigate to 'log this brew' screen.
        }
    })

    if (!recipe) {
        return <Text>Recipe not found</Text>;
    }

    return (
        <View style={styles.screen}>
            <Text>{timer.status}</Text>
            <Text>
                Step {timer.currentStepIndex + 1} of {timer.steps.length}
            </Text>
            <Text>{Math.round(timer.progress * 100)}%</Text>

            {timer.currentStep && (
                <View>
                    <Text>{timer.currentStep.label}</Text>
                    <Text>{timer.currentStep.instruction}</Text>
                    {timer.currentStep.waterMl && (
                        <Text>{timer.currentStep.waterMl} ml</Text>
                    )}
                    <Text>{timer.secondsRemaining}s</Text>

                    <View
                        style={{
                            height: 4,
                            width: `${timer.stepProgress * 100}%`,
                            backgroundColor: 'brown',
                        }}
                    />
                </View>
            )}

            {timer.status === 'idle' && (
                <Pressable onPress={timer.start}>
                    <Text>Start Brew</Text>
                </Pressable>
            )}

            {timer.status === 'running' && (
                <Pressable onPress={timer.pause}>
                    <Text>Pause</Text>
                </Pressable>
            )}

            {timer.status === 'paused' && (
                <View>
                    <Pressable onPress={timer.resume}>
                        <Text>Resume</Text>
                    </Pressable>
                    <Pressable onPress={timer.reset}>
                        <Text>Start Over</Text>
                    </Pressable>
                </View>
            )}

            {timer.status === 'finished' && (
                <View>
                    <Text>Done!</Text>
                    <Pressable onPress={timer.reset}>
                        <Text>Brew Again</Text>
                    </Pressable>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.xl,
    },

    progressBar: {
    },
})