import AsyncStorage from "@react-native-async-storage/async-storage";
import Product from "./model/Product";
import Recipe from "./model/Recipe";
import ShoppingItem from "./model/ShoppingItem";
import Unit from "./model/Unit";

type GlobalObjectCollection = {
	products: Map<number, Product>;
	recipes: Recipe[];
	selectedRecipes: Set<string>;
	shoppingList: ShoppingItem[];
	units: Map<string, Unit>;
};

export const globals: GlobalObjectCollection = {
	products: new Map<number, Product>(),
	recipes: [],
	selectedRecipes: new Set<string>(),
	shoppingList: [],
	units: new Map<string, Unit>(),
};

const dataManager = {
	async readAll(): Promise<void> {
		const rawUnits = await AsyncStorage.getItem("units");
		if (rawUnits !== null) {
			const units = JSON.parse(rawUnits) as Unit[];
			globals.units = units.reduce(
				(map, unit) => map.set(unit.name, unit),
				new Map<string, Unit>(),
			);
		}
		const rawProducts = await AsyncStorage.getItem("products");
		if (rawProducts !== null) {
			const products = JSON.parse(rawProducts) as Product[];
			globals.products = products.reduce(
				(map, product) => map.set(product.id, product),
				new Map<number, Product>(),
			);
		}
		const rawRecipes = await AsyncStorage.getItem("recipes");
		if (rawRecipes !== null) {
			globals.recipes = JSON.parse(rawRecipes) as Recipe[];
		}
		const rawSelectedRecipes = await AsyncStorage.getItem("selectedRecipes");
		if (rawSelectedRecipes !== null) {
			globals.selectedRecipes = new Set<string>(
				JSON.parse(rawSelectedRecipes) as string[],
			);
		}
		const rawShoppingList = await AsyncStorage.getItem("shoppingList");
		if (rawShoppingList !== null) {
			globals.shoppingList = JSON.parse(rawShoppingList) as ShoppingItem[];
		}
	},

	async writeProducts(products: Product[]) {
		await AsyncStorage.setItem("products", JSON.stringify(products));
		globals.products = products.reduce(
			(map, product) => map.set(product.id, product),
			new Map<number, Product>(),
		);
	},

	async writeRecipes(recipes: Recipe[]) {
		await AsyncStorage.setItem("recipes", JSON.stringify(recipes));
		globals.recipes = recipes;
	},

	async writeSelectedRecipes(selectedRecipes: string[]) {
		await AsyncStorage.setItem(
			"selectedRecipes",
			JSON.stringify(selectedRecipes),
		);
		globals.selectedRecipes = new Set<string>(selectedRecipes);
	},

	async writeShoppingList(shoppingList: ShoppingItem[]) {
		await AsyncStorage.setItem("shoppingList", JSON.stringify(shoppingList));
		globals.shoppingList = shoppingList;
	},

	async writeUnits(units: Unit[]) {
		await AsyncStorage.setItem("units", JSON.stringify(units));
		globals.units = units.reduce(
			(map, unit) => map.set(unit.name, unit),
			new Map<string, Unit>(),
		);
	},
};

export default dataManager;
