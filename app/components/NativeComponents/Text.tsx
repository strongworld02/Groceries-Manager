import { PropsWithChildren } from "react";
import { Text as NativeText, StyleProp, TextStyle } from "react-native";

const Text = ({
	children,
	fontSize,
	numberOfLines,
	style,
}: PropsWithChildren<{
	fontSize?: number | undefined;
	numberOfLines?: number | undefined;
	style?: StyleProp<TextStyle> | undefined;
}>) => {
	return (
		<NativeText
			numberOfLines={numberOfLines}
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
