import { View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { ChevronDown, ChevronUp } from "lucide-react-native/icons";

import Text from "./Text";

const Select = ({
	allowEmpty,
	canSearch,
	data,
	defaultValue,
	disabled,
	emptyText,
	onChange,
}: {
	canSearch?: boolean | undefined;
	disabled?: boolean | undefined;
} & (
	| ({
			data: string[];
	  } & (
			| {
					allowEmpty: true;
					defaultValue?: string | undefined;
					emptyText: string;
					onChange: (value: string | null, index: number) => void;
			  }
			| ({
					allowEmpty?: false | undefined;
					onChange: (value: string, index: number) => void;
			  } & (
					| { defaultValue?: undefined; emptyText: string }
					| { defaultValue: string; emptyText?: string | undefined }
			  ))
	  ))
	| ({
			data: { label: string; value: string }[];
	  } & (
			| {
					allowEmpty: true;
					defaultValue?: { label: string; value: string } | undefined;
					emptyText: string;
					onChange: (
						value: { label: string; value: string } | null,
						index: number,
					) => void;
			  }
			| ({
					allowEmpty?: false | undefined;
					onChange: (
						value: { label: string; value: string },
						index: number,
					) => void;
			  } & (
					| { defaultValue?: undefined; emptyText: string }
					| {
							defaultValue: { label: string; value: string };
							emptyText?: string | undefined;
					  }
			  ))
	  ))
)) => {
	const dataObjects = (
		allowEmpty
			? [{ label: emptyText, value: null }]
			: ([] as { label: string; value: string }[])
	).concat(
		data.length === 0
			? ([] as { label: string; value: string }[])
			: typeof data[0] === "string"
				? (data as string[]).map((v) => ({ label: v, value: v }))
				: (data as { label: string; value: string }[]),
	);
	const initialValue =
		defaultValue === undefined
			? undefined
			: typeof defaultValue === "string"
				? { label: defaultValue, value: defaultValue }
				: defaultValue;
	return (
		<SelectDropdown
			disabled={disabled}
			data={dataObjects}
			defaultValue={initialValue}
			onSelect={(selectedItem, index) => {
				if (data.length === 0 || typeof data[0] === "string") {
					onChange(selectedItem.value, allowEmpty ? index - 1 : index);
				} else {
					onChange(selectedItem, allowEmpty ? index - 1 : index);
				}
			}}
			renderButton={(selectedItem, isOpen) => (
				<View
					style={{
						alignItems: "center",
						backgroundColor: !disabled ? "#fff" : undefined,
						borderColor: "#5a5a5a",
						borderRadius: 10,
						borderWidth: 1,
						flexDirection: "row",
						height: 48,
						paddingHorizontal: 12,
					}}
				>
					<Text
						style={{
							flex: 1,
							color:
								!selectedItem || selectedItem.value === null
									? "#a8a8a8"
									: undefined,
							fontStyle: !selectedItem ? "italic" : "normal",
						}}
					>
						{(selectedItem && selectedItem.value) || (emptyText ?? "")}
					</Text>
					{isOpen ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
				</View>
			)}
			renderItem={(item, index, isSelected) => (
				<View
					style={{
						flexDirection: "row",
						paddingHorizontal: 12,
						alignItems: "center",
						paddingVertical: 12,
						borderBottomWidth: 1,
						borderBottomColor: "#a8a8a8",
						backgroundColor:
							isSelected && (!allowEmpty || index > 0 || item.value !== null)
								? "#b7e1ea"
								: index % 2 === 1
									? "#efefef"
									: "#fff",
					}}
				>
					<Text
						style={{
							color:
								allowEmpty && index === 0 && item.value === null
									? "#a8a8a8"
									: undefined,
							fontStyle:
								allowEmpty && index === 0 && item.value === null
									? "italic"
									: "normal",
						}}
					>
						{item.label}
					</Text>
				</View>
			)}
			dropdownStyle={{
				backgroundColor: "#fff",
				borderRadius: 10,
			}}
			showsVerticalScrollIndicator={true}
			search={canSearch}
			searchInputStyle={{
				backgroundColor: "#fff",
				borderRadius: 10,
				borderBottomWidth: 1,
				borderBottomColor: "#B1BDC8",
			}}
			searchInputTxtStyle={{ fontSize: 18 }}
			searchInputTxtColor={"#151E26"}
			searchPlaceHolder={"Suche beginnen"}
			searchPlaceHolderColor={"#72808D"}
		/>
	);
};

export default Select;
