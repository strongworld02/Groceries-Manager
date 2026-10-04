import { forwardRef, useImperativeHandle, useState } from "react";
import { View } from "react-native";

import { globals } from "../../DataManager";
import ProductSelect from "../ProductSelect";
import UnitSelect from "../UnitSelect";
import Button from "../NativeComponents/Button";
import TextInput from "../NativeComponents/TextInput";
import Ingredient from "../../model/Ingredient";

export type EditIngredientRef = {
	reset: () => void;
};

const otherProduct = [{ value: -1, label: "Alltagsartikel" }];

const EditIngredient = forwardRef<
	EditIngredientRef,
	{ add: (ingredient: Ingredient) => void; backdropColor?: string | undefined }
>(function EditIngredient({ add, backdropColor }, ref) {
	const [productResetKey, setProductResetKey] = useState<number>(1);
	const [productId, setProductId] = useState<number | null>(null);
	const [productName, setProductName] = useState<string>("");
	const [amount, setAmount] = useState<string>("1");
	const [unitName, setUnitName] = useState<string | undefined>(undefined);

	useImperativeHandle(ref, () => ({
		reset: () => {
			setProductResetKey((old) => old + 1);
			setProductId(null);
			setProductName("");
			setAmount("1");
			setUnitName(undefined);
		},
	}));
	const productChanged = (productId: number) => {
		if (productId === otherProduct[0].value) {
			setProductName("");
		} else {
			setUnitName(globals.products.get(productId)!.unitName);
		}
		setProductId(productId);
	};
	return (
		<View
			style={
				backdropColor !== undefined
					? { backgroundColor: backdropColor }
					: undefined
			}
		>
			<ProductSelect
				key={productResetKey}
				extraEntries={otherProduct}
				onChange={productChanged}
			/>
			{productId === otherProduct[0].value && (
				<TextInput
					onChangeText={setProductName}
					placeholder="Artikelbezeichnung"
					style={{ marginTop: 8 }}
					value={productName}
				/>
			)}
			<View
				style={{
					flexDirection: "row",
					marginTop: 8,
					marginBottom: 10,
				}}
			>
				<TextInput
					keyboardType="numeric"
					style={{ flex: 0.4, marginRight: 8 }}
					onChangeText={setAmount}
					value={amount}
				/>
				<View style={{ flex: 1 }}>
					<UnitSelect
						key={productId}
						defaultValue={unitName}
						onChange={setUnitName}
					/>
				</View>
			</View>
			<Button
				disabled={
					productId === null ||
					(productId === otherProduct[0].value &&
						productName.trimStart().length === 0) ||
					unitName === undefined ||
					isNaN(+amount) ||
					Number(amount) <= 0
				}
				onPress={() => {
					add({
						productId: productId === otherProduct[0].value ? null : productId,
						productName:
							productId === otherProduct[0].value ? productName : null,
						amount: Number(amount),
						unitName: unitName!,
					});
				}}
				title="Hinzufügen"
				type="button"
			/>
		</View>
	);
});

export default EditIngredient;
