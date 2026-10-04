import { View } from "react-native";
import Ingredient from "../../model/Ingredient";
import Text from "../NativeComponents/Text";
import IngredientText from "./IngredientText";

const IngredientList = ({ ingredients }: { ingredients: Ingredient[] }) => {
	return (
		<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
			{ingredients.map((ingredient, index) => (
				<View key={index} style={{ flex: 0, flexDirection: "row" }}>
					<IngredientText ingredient={ingredient} />
					{ingredients.length - 1 !== index && (
						<Text style={{ marginLeft: 8, marginRight: 8 }}>|</Text>
					)}
				</View>
			))}
		</View>
	);
};

export default IngredientList;
