import { Audio } from 'expo-av';
import {useCallback, useEffect, useRef} from "react";

const STEP_CHIME = require('../../assets/sounds/step-chime.wav')
const FINISH_CHIME = require('../../assets/sounds/finish-chime.wav')

export function useBrewSounds() {
    const stepSound = useRef<Audio.Sound | null >(null)
    const finishSound = useRef<Audio.Sound | null >(null)

    useEffect(() => {
        let cancelled = false;

        async function load() {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
            });

            const { sound: step } = await Audio.Sound.createAsync(STEP_CHIME);
            const { sound: finish } = await Audio.Sound.createAsync(FINISH_CHIME);

            if (cancelled) {
                // Component unmounted while loading: clean up immediately
                await step.unloadAsync();
                await finish.unloadAsync();
                return;
            }

            stepSound.current = step;
            finishSound.current = finish;
        }

        load().catch(console.warn);

        return () => {
            cancelled = true;
            stepSound.current?.unloadAsync();
            finishSound.current?.unloadAsync();
        };
    }, []);

    const playStepChime = useCallback(async () => {
        try {
            await stepSound.current?.replayAsync();
        } catch (e) {
            console.warn('Step chime failed:', e);
        }
    }, []);

    const playFinishChime = useCallback(async () => {
        try {
            await finishSound.current?.replayAsync();
        } catch (e) {
            console.warn('Finish chime failed:', e);
        }
    }, []);

    return { playStepChime, playFinishChime } as const;
}