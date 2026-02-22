import { PropsWithChildren } from "react";
import { Text as NativeText, StyleProp, TextStyle } from "react-native";

const Text = ({
	children,
	fontSize,
	style,
}: PropsWithChildren<{
	fontSize?: number | undefined;
	style?: StyleProp<TextStyle> | undefined;
}>) => {
	return (
		<NativeText
			style={
				style === undefined
					? { fontSize: fontSize ?? 18 }
					: [{ fontSize: fontSize ?? 18 }, style]
			}
		>
			{children}
		</NativeText>
	);
};

export default Text;
