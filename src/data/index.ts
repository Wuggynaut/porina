import recipesJson from './recipes.json';
import {Recipe} from "../types/brew";

export const recipes: Recipe[] = recipesJson as Recipe[];

export const findRecipeById = (id: string) => {
    return recipes.find(r => r.id === id);
}