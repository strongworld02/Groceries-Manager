import Ingredient from "./Ingredient";

type RecipeStep = {
	number: number;
	ingredients?: Ingredient[] | undefined;
	instruction: string;
};

export default RecipeStep;
