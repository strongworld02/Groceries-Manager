import { globals } from "./app/DataManager";
import Recipe from "./app/model/Recipe";
import ShoppingItem from "./app/model/ShoppingItem";

export function buildShoppingList(recipes: Recipe[]): ShoppingItem[] {
	const items = new Map<number, Map<string, number>>();
	recipes.forEach((r) => {
		r.ingredients.forEach((i) => {
			const product = globals.products.get(i.productId)!;
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
	items.entries().forEach((i) => {
		const product = globals.products.get(i[0])!;
		i[1].entries().forEach((e) => {
			const highestUnit = getInHighestReasonableUnit(e[1], e[0]);
			shoppingList.push({
				order: product.order,
				name: product.name,
				amount: highestUnit.amount,
				unitName: highestUnit.unitName,
			});
		});
	});
	shoppingList.sort((a, b) => a.order - b.order);
	return shoppingList.map((i) => ({
		name: i.name,
		amount: i.amount,
		unitName: i.unitName,
	}));
}

function getInLowestUnit(
	amount: number,
	unitName: string,
): { amount: number; unitName: string } {
	let amountInLowestUnit = amount;
	let lowestUnitName = unitName;
	let lowerUnit = globals.units
		.entries()
		.find(
			(u) =>
				u[1].nextHigherUnitName !== undefined &&
				u[1].nextHigherUnitName === unitName,
		);
	while (
		lowerUnit !== undefined &&
		lowerUnit[1].amountForNextHigherUnit !== undefined
	) {
		amountInLowestUnit =
			amountInLowestUnit * lowerUnit[1].amountForNextHigherUnit;
		lowestUnitName = lowerUnit[1].name;
		lowerUnit = globals.units
			.entries()
			.find(
				(u) =>
					u[1].nextHigherUnitName !== undefined &&
					u[1].nextHigherUnitName === unitName,
			);
	}
	return { amount: amountInLowestUnit, unitName: lowestUnitName };
}

function getInHighestReasonableUnit(
	amount: number,
	unitName: string,
): { amount: number; unitName: string } {
	let amountInHighestUnit = amount;
	let highestUnitName = unitName;
	let higherUnit = globals.units
		.entries()
		.find(
			(u) =>
				u[1].nextHigherUnitName !== undefined &&
				u[1].nextHigherUnitName === unitName,
		);
	while (
		higherUnit !== undefined &&
		higherUnit[1].amountForNextHigherUnit !== undefined &&
		amountInHighestUnit >= higherUnit[1].amountForNextHigherUnit
	) {
		const amountInNextUnit =
			amountInHighestUnit / higherUnit[1].amountForNextHigherUnit;
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
		highestUnitName = higherUnit[1].name;
		higherUnit = globals.units
			.entries()
			.find(
				(u) =>
					u[1].nextHigherUnitName !== undefined &&
					u[1].nextHigherUnitName === unitName,
			);
	}
	return { amount: amountInHighestUnit, unitName: highestUnitName };
}
