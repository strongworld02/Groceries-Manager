import Product from "./model/Product";
import Recipe from "./model/Recipe";
import Unit from "./model/Unit";

type GlobalObjectCollection = {
	products: Map<number, Product>;
	units: Map<string, Unit>;
	recipes: Recipe[];
};

export const globals: GlobalObjectCollection = {
	products: new Map<number, Product>(),
	units: new Map<string, Unit>(),
	recipes: [],
};
