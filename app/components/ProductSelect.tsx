import { useMemo } from "react";
import { View } from "react-native";
import { globals } from "../DataManager";
import Select from "./NativeComponents/Select";
import Text from "./NativeComponents/Text";

const ProductSelect = ({
	extraEntries,
	label,
	onChange,
}: {
	extraEntries?: { label: string; value: number }[] | undefined;
	label?: string | undefined;
	onChange: (productId: number) => void;
}) => {
	const products = useMemo(() => {
		return (
			extraEntries?.map((e) => ({
				value: e.value.toString(),
				label: e.label,
			})) ?? []
		).concat(
			[...globals.products.entries()]
				.map((p) => ({
					value: p[0].toString(),
					label: p[1].name,
				}))
				.sort((a, b) =>
					a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
				),
		);
	}, [extraEntries]);
	const handleOnChange = (value: { label: string; value: string }) => {
		onChange(Number(value.value));
	};
	if (!label) {
		return (
			<Select
				canSearch={true}
				data={products}
				onChange={handleOnChange}
				emptyText="Produkt auswählen"
			/>
		);
	}
	return (
		<View>
			<Text>{label}</Text>
			<Select
				canSearch={true}
				data={products}
				onChange={handleOnChange}
				emptyText="Produkt auswählen"
			/>
		</View>
	);
};

export default ProductSelect;
