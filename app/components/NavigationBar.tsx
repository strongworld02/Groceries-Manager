import { StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import {
	Apple,
	BookMarked,
	Ruler,
	ShoppingBasket,
} from "lucide-react-native/icons";

const NavigationBar = ({
	navigationRef,
}: {
	navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
}) => {
	return (
		<View style={styles.navBar}>
			<TouchableNativeFeedback
				onPress={() => navigationRef.navigate("ShoppingCart")}
			>
				<View style={styles.navItem}>
					<ShoppingBasket size={60} />
				</View>
			</TouchableNativeFeedback>
			<TouchableNativeFeedback
				onPress={() => navigationRef.navigate("Recipes")}
			>
				<View style={styles.navItem}>
					<BookMarked size={50} />
				</View>
			</TouchableNativeFeedback>
			<TouchableNativeFeedback
				onPress={() => navigationRef.navigate("Products")}
			>
				<View style={styles.navItem}>
					<Apple size={50} />
				</View>
			</TouchableNativeFeedback>
			<TouchableNativeFeedback onPress={() => navigationRef.navigate("Units")}>
				<View style={styles.navItem}>
					<Ruler size={50} />
				</View>
			</TouchableNativeFeedback>
		</View>
	);
};

const styles = StyleSheet.create({
	navBar: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	navItem: {
		backgroundColor: "#119db9",
		alignItems: "center",
		justifyContent: "center",
		width: "25%",
	},
});

export default NavigationBar;
