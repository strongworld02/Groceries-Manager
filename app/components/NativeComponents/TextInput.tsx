import { forwardRef } from "react";
import {
	TextInput as NativeTextInput,
	TextInputProps,
	StyleProp,
	StyleSheet,
	TextStyle,
	View,
} from "react-native";
import Text from "./Text";

const TextInput = forwardRef<
	NativeTextInput,
	{
		keyboardType?:
			| "default"
			| "number-pad"
			| "decimal-pad"
			| "numeric"
			| "email-address"
			| "phone-pad"
			| "url"
			| undefined;
		label?: string | undefined;
		maxLength?: number | undefined;
		onChangeText?: ((text: string) => void) | undefined;
		onFocus?: TextInputProps["onFocus"];
		placeholder?: string | undefined;
		style?: StyleProp<TextStyle> | undefined;
		trimStart?: boolean | undefined;
		value?: string | undefined;
	} & (
		| { multiline?: false | undefined; maxNumberOfLines?: never }
		| { multiline: true; maxNumberOfLines?: number | undefined }
	)
>(function TextInput(
	{
		keyboardType,
		label,
		multiline,
		maxLength,
		maxNumberOfLines,
		onChangeText,
		onFocus,
		placeholder,
		style,
		trimStart,
		value,
	},
	ref,
) {
	const onChange =
		!!trimStart && !!onChangeText
			? (text: string) => {
					onChangeText(text.trimStart());
				}
			: onChangeText;
	if (!label) {
		return (
			<NativeTextInput
				keyboardType={keyboardType}
				maxLength={maxLength}
				multiline={multiline}
				numberOfLines={maxNumberOfLines}
				onChangeText={onChange}
				onFocus={onFocus}
				placeholder={placeholder}
				ref={ref}
				style={style === undefined ? styles.input : [styles.input, style]}
				value={value}
			/>
		);
	}
	return (
		<View>
			<Text>{label}</Text>
			<NativeTextInput
				keyboardType={keyboardType}
				maxLength={maxLength}
				multiline={multiline}
				numberOfLines={maxNumberOfLines}
				onChangeText={onChange}
				onFocus={onFocus}
				placeholder={placeholder}
				ref={ref}
				style={style === undefined ? styles.input : [styles.input, style]}
				value={value}
			/>
		</View>
	);
});

const styles = StyleSheet.create({
	input: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#5a5a5a",
		borderRadius: 10,
		fontSize: 18,
		minHeight: 48,
	},
});

export default TextInput;
