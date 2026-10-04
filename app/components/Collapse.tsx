import { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import CollapseButton from "./CollapseButton";

const Collapse = ({
	children,
	disabled,
	disabledText,
	open,
	setOpen,
}: PropsWithChildren<{
	disabled?: boolean | undefined;
	disabledText?: string | undefined;
	open: boolean;
	setOpen: (value: boolean) => void;
}>) => {
	const borderBottomStyle: StyleProp<ViewStyle> = {
		borderStyle: "solid",
		borderBottomWidth: 1,
	};
	if (!open) {
		return (
			<CollapseButton
				disabled={disabled}
				disabledText={disabledText}
				onPress={() => setOpen(true)}
				open={false}
				style={borderBottomStyle}
			/>
		);
	}
	return (
		<View style={borderBottomStyle}>
			<CollapseButton
				disabled={disabled}
				disabledText={disabledText}
				onPress={() => setOpen(false)}
				open={true}
			/>
			{children}
		</View>
	);
};

export default Collapse;
