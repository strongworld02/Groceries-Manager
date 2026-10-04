import { ImageSourcePropType } from "react-native";
import Ingredient from "./Ingredient";
import RecipeStep from "./RecipeStep";

type Recipe = {
	name: string;
	image?: ImageSourcePropType | undefined;
	ingredients: Ingredient[];
	source?: string | undefined;
	steps: RecipeStep[];
};

export default Recipe;
