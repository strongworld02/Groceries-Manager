import { Ban, Pencil, Plus, Trash2 } from "lucide-react-native";
import {
	ColorValue,
	GestureResponderEvent,
	Button as NativeButton,
	TouchableHighlight,
	View,
} from "react-native";

type ButtonProps = {
	disabled?: boolean | undefined;
	onPress?: ((event: GestureResponderEvent) => void) | undefined;
} & (
	| { type: "button"; title: string; color?: ColorValue | undefined }
	| { type: "add" | "delete" | "modify"; title?: never; color?: never }
);
const Button = ({ color, disabled, type, title, onPress }: ButtonProps) => {
	if (type === "button") {
		return (
			<NativeButton
				color={color !== undefined ? color : "#1f8dfb"}
				disabled={disabled}
				onPress={onPress}
				title={title}
			/>
		);
	}
	const iconSize = 28;
	let btnColor: ColorValue | undefined = undefined;
	if (type === "add") {
		btnColor = disabled ? "#666666" : "black";
	} else if (type === "delete") {
		btnColor = disabled ? "#f77979" : "#f72626";
	} else if (type === "modify") {
		btnColor = disabled ? "#79b9f9" : "#1f8dfb";
	}
	return (
		<TouchableHighlight
			style={{
				alignItems: "center",
				height: 35,
				justifyContent: "center",
				borderColor: btnColor,
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
					<Plus size={iconSize} color={btnColor} />
				) : type === "modify" ? (
					<Pencil size={iconSize} color={btnColor} />
				) : type === "delete" ? (
					<Trash2 size={iconSize} color={btnColor} />
				) : (
					<Ban size={iconSize} />
				)}
			</View>
		</TouchableHighlight>
	);
};

export default Button;
