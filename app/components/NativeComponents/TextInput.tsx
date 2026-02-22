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
	value,
}: {
	onChangeText?: ((text: string) => void) | undefined;
	placeholder?: string | undefined;
	style?: StyleProp<TextStyle> | undefined;
	value?: string | undefined;
}) => {
	return (
		<NativeTextInput
			onChangeText={onChangeText}
			style={style === undefined ? styles.input : [styles.input, style]}
			value={value}
			placeholder={placeholder}
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
