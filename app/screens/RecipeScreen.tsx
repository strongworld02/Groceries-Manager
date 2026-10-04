import {
	FlatList,
	Image,
	ListRenderItemInfo,
	useWindowDimensions,
	View,
} from "react-native";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import RecipeStep from "../model/RecipeStep";
import { globals } from "../DataManager";
import Text from "../components/NativeComponents/Text";
import IngredientList from "../components/Recipes/IngredientList";

const RecipeScreen = ({ route }: StaticScreenProps<{ name: string }>) => {
	const navigation = useNavigation();
	const { width } = useWindowDimensions();

	if (route.params.name.length === 0) {
		navigation.navigate("Recipes");
		return <View></View>;
	}
	const recipe = globals.recipes.find((r) => r.name === route.params.name);
	if (recipe === undefined) {
		navigation.navigate("Recipes");
		return <View></View>;
	}

	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					borderBottomColor: "#515151",
					borderBottomWidth: 1,
				}}
			>
				<Text fontSize={32}>{recipe.name}</Text>
			</View>

			<FlatList
				style={{ flex: 1 }}
				data={recipe.steps}
				keyExtractor={(step) => step.number.toString()}
				ListHeaderComponent={
					recipe.image !== undefined ? (
						<View
							style={{
								marginBottom: 8,
								borderBottomColor: "#515151",
								borderBottomWidth: 1,
							}}
						>
							<Image
								resizeMode="cover"
								height={(width / 20) * 9}
								source={recipe.image}
								width={width}
							/>
						</View>
					) : undefined
				}
				renderItem={({ item, index }: ListRenderItemInfo<RecipeStep>) => (
					<View>
						<RecipeStepView step={item} />
						<View
							style={{
								paddingTop: 8,
								borderBottomWidth: index + 1 < recipe.steps.length ? 1 : 0,
								marginBottom: 8,
							}}
						/>
					</View>
				)}
			/>
		</View>
	);
};

const RecipeStepView = ({ step }: { step: RecipeStep }) => {
	return (
		<View style={{ marginLeft: 8, marginRight: 8 }}>
			<View
				style={{ flexDirection: "row", alignItems: "center", paddingBottom: 4 }}
			>
				<View style={{ marginRight: 4, width: 36, height: "100%" }}>
					<Text fontSize={30}>{step.number}</Text>
				</View>
				{step.ingredients !== undefined && (
					<IngredientList ingredients={step.ingredients} />
				)}
			</View>
			<Text fontSize={24}>{step.instruction}</Text>
		</View>
	);
};

export default RecipeScreen;
