export type BrewStep = {
    label: string;
    durationSeconds: number;
    waterMl?: number; // absent for wait steps
    instruction: string;
}

type BrewMethod = 'pourover' | 'aeropress' | 'french_press';

export type Recipe = {
    id: string;
    name: string;
    source: string;
    method: BrewMethod;
    description: string;
    baseDoseGrams: number;
    baseWaterMl: number;
    baseServings: number;
    grind: string;
    waterTempCelsius: number;
    steps: BrewStep[];
};

export type BrewLogEntry = {
    id: string;
    recipeId: string;
    userId: string;
    dose: number;
    water: number;
    rating: number; // 1-5
    grind: string;
    notes?: string;
    brewedAt: number; // Date.now() - will be made into Timestamp
}