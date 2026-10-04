import { globals } from "../../DataManager";
import Ingredient from "../../model/Ingredient";
import Text from "../NativeComponents/Text";

const IngredientText = ({ ingredient }: { ingredient: Ingredient }) => {
	const product =
		ingredient.productId === null
			? null
			: globals.products.get(ingredient.productId);
	const productName = product?.name ?? ingredient.productName;
	const unitName =
		globals.units.get(ingredient.unitName)?.displayName ?? ingredient.unitName;

	return (
		<Text>
			{(!!product &&
			product.isSingle &&
			unitName.length === 0 &&
			ingredient.amount <= 1
				? ""
				: `${ingredient.amount.toLocaleString()} `) +
				(unitName.length > 0 ? `${unitName} ` : "") +
				productName}
		</Text>
	);
};

export default IngredientText;
