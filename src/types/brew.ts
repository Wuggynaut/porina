export type BrewStep = {
    label: String;
    duration: number;
    waterAmount?: number; // ml - absent for wait steps
    instruction: string;
}

type BrewMethod = 'pourover' | 'aeropress' | 'french_press';

export type Recipe = {
    id: string;
    name: string;
    method: BrewMethod;
    baseServings: number;
    baseDose: number; // grams
    baseWater: number; // ml
    grind: string;
    waterTemp: number; // celsius
    description: string;
    source?: string;
    steps: BrewStep[];
}

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