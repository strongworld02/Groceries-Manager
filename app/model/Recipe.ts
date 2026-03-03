import { ImageSourcePropType } from "react-native";
import Ingredient from "./Ingredient";
import RecipeStep from "./RecipeStep";

type Recipe = {
	name: string;
	ingredients: Ingredient[];
	steps: RecipeStep[];
	image?: ImageSourcePropType | undefined;
};

export default Recipe;
