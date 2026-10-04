import {
	GestureResponderEvent,
	StyleProp,
	StyleSheet,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native";
import { ChevronsDown, ChevronsUp } from "lucide-react-native";
import Text from "./NativeComponents/Text";

const CollapseButton = ({
	disabled,
	disabledText,
	onPress,
	open,
	style,
}: {
	disabled?: boolean | undefined;
	disabledText?: string | undefined;
	onPress?: ((event: GestureResponderEvent) => void) | undefined;
	open?: boolean | undefined;
	style?: StyleProp<ViewStyle> | undefined;
}) => {
	const defaultStyle: StyleProp<ViewStyle> = {
		alignItems: "flex-end",
	};
	return (
		<TouchableOpacity
			disabled={disabled}
			style={style === undefined ? defaultStyle : [defaultStyle, style]}
			onPress={onPress}
		>
			<ButtonContent
				disabled={disabled}
				disabledText={disabledText}
				open={open}
			/>
		</TouchableOpacity>
	);
};

const ButtonContent = ({
	disabled,
	disabledText,
	open,
}: {
	disabled?: boolean | undefined;
	disabledText?: string | undefined;
	open?: boolean | undefined;
}) => {
	if (!disabled || !disabledText) {
		return open ? (
			<ChevronsUp
				size={30}
				color={disabled ? styles.disabledText.color : undefined}
			/>
		) : (
			<ChevronsDown
				size={30}
				color={disabled ? styles.disabledText.color : undefined}
			/>
		);
	}
	return (
		<View style={{ flexDirection: "row", alignItems: "center" }}>
			{disabled && (
				<Text style={styles.disabledText} fontSize={12}>
					{disabledText}
				</Text>
			)}
			{open ? (
				<ChevronsUp size={30} color={styles.disabledText.color} />
			) : (
				<ChevronsDown size={30} color={styles.disabledText.color} />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	disabledText: { color: "#7b7b7b", marginRight: 8 },
});

export default CollapseButton;
