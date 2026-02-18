import { StyleSheet, View } from "react-native";
import {
	createStaticNavigation,
	StaticParamList,
	useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import ShoppingListScreen from "./app/screens/ShoppingListScreen";
import RecipesScreen from "./app/screens/RecipesScreen";
import NavigationBar from "./app/components/NavigationBar";
import ProductsScreen from "./app/screens/ProductsScreen";
import UnitsScreen from "./app/screens/UnitsScreen";

const RootStack = createNativeStackNavigator({
	initialRouteName: "ShoppingCart",
	screens: {
		Products: {
			screen: ProductsScreen,
			options: {
				title: "Produkte",
				headerBackVisible: false,
				animation: "none",
			},
		},
		Recipes: {
			screen: RecipesScreen,
			options: {
				title: "Rezepte",
				headerBackVisible: false,
				animation: "none",
			},
		},
		ShoppingCart: {
			screen: ShoppingListScreen,
			options: {
				title: "Einkaufsliste",
				headerBackVisible: false,
				animation: "slide_from_left",
			},
		},
		Units: {
			screen: UnitsScreen,
			options: {
				title: "Einheiten",
				headerBackVisible: false,
				animation: "slide_from_right",
			},
		},
	},
});

declare global {
	namespace ReactNavigation {
		interface RootParamList extends StaticParamList<typeof RootStack> {}
	}
}

const Navigation = createStaticNavigation(RootStack);

export default function App() {
	const navigationRef = useNavigationContainerRef();
	return (
		<SafeAreaView style={styles.fullWindow}>
			<View style={{ flex: 1 }}>
				<Navigation ref={navigationRef} />
			</View>
			<View style={styles.navBarContainer}>
				<NavigationBar navigationRef={navigationRef} />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	fullWindow: {
		flex: 1,
		justifyContent: "flex-end",
	},
	navBarContainer: {
		height: 60,
	},
});
