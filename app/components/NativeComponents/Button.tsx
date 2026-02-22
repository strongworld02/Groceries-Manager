import { Ban, Pencil, Plus, Trash2 } from "lucide-react-native";
import {
	GestureResponderEvent,
	Button as NativeButton,
	StyleSheet,
	TouchableHighlight,
	View,
} from "react-native";

type ButtonProps = {
	disabled?: boolean | undefined;
	onPress?: ((event: GestureResponderEvent) => void) | undefined;
} & (
	| { type: "button"; title: string }
	| { type: "add" | "delete" | "modify"; title?: never }
);
const Button = ({ disabled, type, title, onPress }: ButtonProps) => {
	if (type === "button") {
		return (
			<NativeButton
				color="#1f8dfb"
				disabled={disabled}
				onPress={onPress}
				title={title}
			/>
		);
	}
	const iconSize = 28;
	const color =
		type === "add"
			? "black"
			: type === "delete"
				? "#f72626"
				: type === "modify"
					? "#1f8dfb"
					: undefined;
	return (
		<TouchableHighlight
			style={{
				alignItems: "center",
				height: 35,
				justifyContent: "center",
				borderColor: color,
				borderRadius: 10,
				borderStyle: "solid",
				borderWidth: 2,
				width: 35,
			}}
			disabled={disabled}
			onPress={onPress}
		>
			<View>
				{type === "add" ? (
					<Plus size={iconSize} color={color} />
				) : type === "modify" ? (
					<Pencil size={iconSize} color={color} />
				) : type === "delete" ? (
					<Trash2 size={iconSize} color={color} />
				) : (
					<Ban size={iconSize} />
				)}
			</View>
		</TouchableHighlight>
	);
};

const styles = StyleSheet.create({
	icon: { alignItems: "center", justifyContent: "center" },
});

export default Button;
