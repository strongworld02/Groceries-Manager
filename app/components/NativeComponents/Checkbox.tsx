import NativeCheckbox from "expo-checkbox";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import Text from "./Text";

const Checkbox = ({
	disabled,
	label,
	onValueChange,
	style,
	value,
}: {
	disabled?: boolean | undefined;
	label?: string | undefined;
	onValueChange: ((value: boolean) => void) | undefined;
	style?: StyleProp<ViewStyle>;
	value?: boolean | undefined;
}) => {
	const checkbox = (
		<NativeCheckbox
			color={value ? "#1f8dfb" : undefined}
			disabled={disabled}
			onValueChange={onValueChange}
			value={value}
		/>
	);
	return !label ? (
		style === undefined ? (
			checkbox
		) : (
			<View style={style}>{checkbox}</View>
		)
	) : (
		<View
			style={style === undefined ? styles.container : [styles.container, style]}
		>
			<Text style={{ marginRight: 10 }}>{label}</Text>
			{checkbox}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
	},
});

export default Checkbox;
