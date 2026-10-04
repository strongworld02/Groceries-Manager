import { globals } from "./app/DataManager";
import Ingredient from "./app/model/Ingredient";
import Recipe from "./app/model/Recipe";
import ShoppingItem from "./app/model/ShoppingItem";
import Unit from "./app/model/Unit";

export function buildShoppingList(recipes: Recipe[]): ShoppingItem[] {
	const items = new Map<number, Map<string, number>>();
	recipes.forEach((r) => {
		r.ingredients.forEach((i) => {
			if (!i.productId) {
				return;
			}
			const product = globals.products.get(i.productId);
			if (product === undefined) {
				return;
			}
			const lowestUnit = product.isSingle
				? { amount: 1, unitName: "Single" }
				: getInLowestUnit(i.amount, i.unitName);

			const entry = items.get(product.id);
			if (entry === undefined) {
				const unitAmountMap = new Map<string, number>();
				unitAmountMap.set(lowestUnit.unitName, lowestUnit.amount);
				items.set(product.id, unitAmountMap);
			} else if (!product.isSingle) {
				const currentAmount = entry.get(lowestUnit.unitName);
				entry.set(
					lowestUnit.unitName,
					lowestUnit.amount + (currentAmount ?? 0),
				);
			}
		});
	});
	const shoppingList: (ShoppingItem & { order: number })[] = [];
	items.forEach((unitAmounts, productId) => {
		const product = globals.products.get(productId)!;
		unitAmounts.forEach((amount, unitName) => {
			shoppingList.push({
				order: product.order,
				name: product.name,
				amount: amount,
				unitName: unitName,
				checked: false,
			});
		});
	});
	shoppingList.sort((a, b) => a.order - b.order);
	return shoppingList.map((i) => ({
		name: i.name,
		amount: i.amount,
		unitName: i.unitName,
		checked: i.checked,
	}));
}

export function getInLowestUnit(
	amount: number,
	unitName: string,
): { amount: number; unitName: string } {
	let amountInLowestUnit = amount;
	let lowestUnitName = unitName;
	let lowerUnit: Unit | undefined = undefined;
	for (const [_, u] of globals.units) {
		if (
			u.nextHigherUnitName !== undefined &&
			u.nextHigherUnitName === lowestUnitName
		) {
			lowerUnit = u;
			break;
		}
	}
	while (
		lowerUnit !== undefined &&
		lowerUnit.amountForNextHigherUnit !== undefined
	) {
		amountInLowestUnit = amountInLowestUnit * lowerUnit.amountForNextHigherUnit;
		lowestUnitName = lowerUnit.name;
		lowerUnit = undefined;
		for (const [_, u] of globals.units) {
			if (
				u.nextHigherUnitName !== undefined &&
				u.nextHigherUnitName === lowestUnitName
			) {
				lowerUnit = u;
				break;
			}
		}
	}
	return { amount: amountInLowestUnit, unitName: lowestUnitName };
}

export function getInHighestReasonableUnit(
	amount: number,
	unitName: string,
): { amount: number; unitName: string; unitDisplayName: string } {
	let currentUnit = globals.units.get(unitName);
	if (
		currentUnit === undefined ||
		currentUnit.amountForNextHigherUnit === undefined ||
		currentUnit.nextHigherUnitName === undefined
	) {
		return {
			amount: amount,
			unitName: unitName,
			unitDisplayName:
				currentUnit === undefined ? unitName : currentUnit.displayName,
		};
	}
	let amountInHighestUnit = amount;
	let higherUnit = globals.units.get(currentUnit.nextHigherUnitName);
	while (
		higherUnit !== undefined &&
		amountInHighestUnit >= currentUnit.amountForNextHigherUnit!
	) {
		const amountInNextUnit =
			amountInHighestUnit /
			(currentUnit.amountForNextHigherUnit === 0
				? 1
				: currentUnit.amountForNextHigherUnit!);
		const decimals = amountInNextUnit % 1;
		if (
			decimals !== 0 &&
			decimals !== 0.25 &&
			decimals !== 0.5 &&
			decimals !== 0.75
		) {
			break;
		}
		amountInHighestUnit = amountInNextUnit;
		currentUnit = higherUnit;
		higherUnit =
			currentUnit.nextHigherUnitName === undefined ||
			currentUnit.amountForNextHigherUnit === undefined
				? undefined
				: globals.units.get(currentUnit.nextHigherUnitName);
	}
	return {
		amount: amountInHighestUnit,
		unitName: currentUnit.name,
		unitDisplayName: currentUnit.displayName,
	};
}

export function compareIngredients(a: Ingredient, b: Ingredient): number {
	return (
		(a.productId !== null
			? globals.products.get(a.productId)?.name
			: a.productName) ?? ""
	).localeCompare(
		(b.productId !== null
			? globals.products.get(b.productId)?.name
			: b.productName) ?? "",
		undefined,
		{ sensitivity: "base" },
	);
}
