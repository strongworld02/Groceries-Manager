import { StyleSheet, TouchableNativeFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ShoppingBasket } from "lucide-react-native/icons";

const NavigationBar = () => {
	const navigation = useNavigation();
	return (
		<View style={styles.navBar}>
			<TouchableNativeFeedback
				onPress={() => navigation.navigate("ShoppingCart")}
			>
				<View style={styles.navItem}>
					<ShoppingBasket size={60} />
				</View>
			</TouchableNativeFeedback>
		</View>
	);
};

const styles = StyleSheet.create({
	fullWindow: {
		flex: 1,
		justifyContent: "flex-end",
	},
	navBar: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	navBarContainer: {
		height: 60,
	},
	navItem: {
		backgroundColor: "#119db9",
		alignItems: "center",
		justifyContent: "center",
		flexGrow: 1,
	},
});

export default NavigationBar;
