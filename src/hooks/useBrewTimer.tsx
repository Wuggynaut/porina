import {BrewStep} from "../types/brew";
import {useCallback, useEffect, useReducer, useRef} from "react";

// The state

type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export type TimerState = {
    status: TimerStatus;
    steps: BrewStep[];
    currentStepIndex: number;
    secondsRemaining: number;
    elapsedTotal: number; // Elapsed seconds since start (across all steps)
};

// Actions

type TimerAction =
    | { type: 'START' }
    | { type: 'TICK' }
    | { type: 'PAUSE' }
    | { type: 'RESUME' }
    | { type: 'RESET' }
    | { type: 'LOAD'; steps: BrewStep[] };

// Reducer

function initialState (steps: BrewStep[] = []): TimerState {
    return  {
        status: 'idle',
        steps,
        currentStepIndex: 0,
        secondsRemaining: steps[0]?.durationSeconds ?? 0,
        elapsedTotal: 0,
    };
}

// Takes current state and an action, and returns new state.
function timerReducer (state: TimerState, action: TimerAction): TimerState {
    switch (action.type) {
        case 'LOAD':
            return initialState(action.steps);
        case "START":
            if (state.status !== 'idle' || state.steps.length === 0) return state;
            return { ...state, status: 'running' };
        case "PAUSE":
            if (state.status !== 'running') return state;
            return {...state, status: 'paused'};
        case "RESUME":
            if (state.status !== 'paused') return state;
            return {...state, status: 'running'};
        case 'TICK':
            if (state.status !== 'running') return state;

            const next = state.secondsRemaining - 1;
            const elapsed = state.elapsedTotal + 1;

            if (next > 0) {
                return { ...state, secondsRemaining: next, elapsedTotal: elapsed };
            }

            // Advance past any zero-duration steps
            let nextIndex = state.currentStepIndex + 1;
            while (
                nextIndex < state.steps.length &&
                state.steps[nextIndex].durationSeconds === 0
                ) {
                nextIndex++;
            }

            if (nextIndex >= state.steps.length) {
                return { ...state, secondsRemaining: 0, elapsedTotal: elapsed, status: 'finished' };
            }

            return {
                ...state,
                currentStepIndex: nextIndex,
                secondsRemaining: state.steps[nextIndex].durationSeconds,
                elapsedTotal: elapsed,
            };
        case "RESET":
            return  initialState(state.steps);

        default:
            return state;
    }
}

// Hook

type UseBrewTimerOptions = {
    steps: BrewStep[];
    onStepChange?: (stepIndex: number, step: BrewStep) => void; // Called when timer advances to new step. Haptics/audio to be wired here.
    onFinish?: () => void;
}

export function useBrewTimer({steps, onStepChange, onFinish}: UseBrewTimerOptions) {
    const [state, action] = useReducer(timerReducer, steps, initialState);

    const onStepChangeRef = useRef(onStepChange);
    onStepChangeRef.current = onStepChange;
    const onFinishRef = useRef(onFinish);
    onFinishRef.current = onFinish;

    // Track previous step index for transition detection
    const prevStepIndexRef = useRef(state.currentStepIndex);

    // Reload if step array changes -> Means new recipe has been selected
    useEffect(() => {
        action({type: "LOAD", steps});
    }, [steps])

    useEffect(() => {
        if (state.status !== 'running') return;

        const id = setInterval(() => action({ type: 'TICK' }), 1_000);
        return () => clearInterval(id);
    }, [state.status]);

    // Step change
    useEffect(() => {
        if (state.currentStepIndex !== prevStepIndexRef.current) {
            prevStepIndexRef.current = state.currentStepIndex;
            onStepChangeRef.current?.(state.currentStepIndex, state.steps[state.currentStepIndex]);
        }
    }, [state.currentStepIndex, state.steps]);

    // Finish callbacks
    useEffect(() => {
        if (state.status === 'finished') {
            onFinishRef.current?.();
        }
    }, [state.status]);

    // API
    const start = useCallback(() => action({type: "START"}), []);
    const pause = useCallback(() => action({ type: 'PAUSE' }), []);
    const resume = useCallback(() => action({ type: 'RESUME' }), []);
    const reset = useCallback(() => action({ type: 'RESET' }), []);

    const currentStep: BrewStep | null = state.steps[state.currentStepIndex] ?? null;

    const totalDuration = state.steps.reduce((sum, s) => sum + s.durationSeconds, 0);

    return {
        ...state,
        currentStep,
        totalDuration,
        progress: totalDuration > 0 ? state.elapsedTotal / totalDuration : 0,
        stepProgress:
            currentStep && currentStep.durationSeconds > 0
            ? 1 - state.secondsRemaining / currentStep.durationSeconds : 0,
        start,
        pause,
        resume,
        reset,
    } as const;
}