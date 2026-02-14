import { StyleSheet, View } from "react-native";
import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import ShoppingListScreen from "./app/screens/ShoppingListScreen";
import RecipesScreen from "./app/screens/RecipesScreen";
import NavigationBar from "./app/components/NavigationBar";

const RootStack = createNativeStackNavigator({
	initialRouteName: "ShoppingCart",
	screens: {
		Recipes: {
			screen: RecipesScreen,
			options: { title: "Rezepte" },
		},
		ShoppingCart: {
			screen: ShoppingListScreen,
			options: { title: "Einkaufsliste" },
		},
	},
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
	return (
		<SafeAreaView style={styles.fullWindow}>
			<View style={{ flex: 1 }}>
				<Navigation />
			</View>
			<View style={styles.navBarContainer}>
				<NavigationBar />
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
