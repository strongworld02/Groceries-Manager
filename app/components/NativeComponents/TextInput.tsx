import {
	TextInput as NativeTextInput,
	StyleProp,
	StyleSheet,
	TextStyle,
} from "react-native";

const TextInput = ({
	onChangeText,
	placeholder,
	style,
	keyboardType,
	value,
}: {
	onChangeText?: ((text: string) => void) | undefined;
	placeholder?: string | undefined;
	style?: StyleProp<TextStyle> | undefined;
	keyboardType?:
		| "default"
		| "number-pad"
		| "decimal-pad"
		| "numeric"
		| "email-address"
		| "phone-pad"
		| "url"
		| undefined;
	value?: string | undefined;
}) => {
	return (
		<NativeTextInput
			keyboardType={keyboardType}
			onChangeText={onChangeText}
			placeholder={placeholder}
			style={style === undefined ? styles.input : [styles.input, style]}
			value={value}
		/>
	);
};

const styles = StyleSheet.create({
	input: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#5a5a5a",
		borderRadius: 10,
		fontSize: 18,
		height: 48,
	},
});

export default TextInput;
