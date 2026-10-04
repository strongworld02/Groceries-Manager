import { useRef, useState } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import {
	NestableDraggableFlatList,
	RenderItemParams,
} from "react-native-draggable-flatlist";
import Button from "../NativeComponents/Button";
import Modal, { defaultModalBackdropColor } from "../NativeComponents/Modal";
import Text from "../NativeComponents/Text";
import { compareIngredients } from "../../../Utils";
import Ingredient from "../../model/Ingredient";
import EditIngredient, { EditIngredientRef } from "./EditIngredient";
import IngredientText from "./IngredientText";
import RemoveableItem from "../RemoveableItem";

const ManageIngredients = ({
	ingredients,
	nestable,
	onChange,
}: {
	ingredients: Ingredient[];
	nestable?: boolean | undefined;
	onChange: (updated: Ingredient[]) => void;
}) => {
	const [ingredientModalOpen, setIngredientModalOpen] =
		useState<boolean>(false);
	const editIngredientRef = useRef<EditIngredientRef>(null);

	const deleteIndex = (index: number) => {
		onChange(ingredients.filter((_, i) => i !== index));
	};
	const keyExtractor = (item: Ingredient, index: number) => {
		return `${index}-${item.amount}-${item.unitName}-${item.productId === null ? item.productName : item.productId}`;
	};

	return (
		<View>
			<View
				style={{
					borderColor: "#c2c1c1",
					borderRadius: 8,
					borderWidth: 1,
					marginBottom: 10,
				}}
			>
				<View
					style={{
						alignItems: "center",
						borderBottomColor: "#c2c1c1",
						borderBottomWidth: ingredients.length > 0 ? 1 : 0,
						borderRadius: 10,
						flexDirection: "row",
						paddingBottom: 4,
						paddingLeft: 4,
						paddingTop: 4,
					}}
				>
					<Text style={{ marginRight: 8 }}>Zutaten</Text>
					<Button
						type="add"
						onPress={() => {
							editIngredientRef.current?.reset();
							setIngredientModalOpen(true);
						}}
					/>
				</View>
				{ingredients.length > 0 && (
					<View style={{ paddingBottom: 2, paddingTop: 4 }}>
						{nestable ? (
							<NestableDraggableFlatList
								data={ingredients}
								keyExtractor={keyExtractor}
								renderItem={({
									item,
									getIndex,
								}: RenderItemParams<Ingredient>) => {
									return (
										<IngredientItem
											item={item}
											index={getIndex() ?? -1}
											onDelete={deleteIndex}
										/>
									);
								}}
								scrollEnabled={false}
							/>
						) : (
							<FlatList
								data={ingredients}
								keyExtractor={keyExtractor}
								renderItem={({
									item,
									index,
								}: ListRenderItemInfo<Ingredient>) => {
									return (
										<IngredientItem
											index={index}
											item={item}
											onDelete={deleteIndex}
										/>
									);
								}}
								scrollEnabled={false}
							/>
						)}
					</View>
				)}
			</View>

			<Modal
				close={() => setIngredientModalOpen(false)}
				isOpen={ingredientModalOpen}
			>
				<EditIngredient
					add={(r) => {
						setIngredientModalOpen(false);
						onChange(ingredients.concat([r]).sort(compareIngredients));
					}}
					backdropColor={defaultModalBackdropColor}
					ref={editIngredientRef}
				/>
			</Modal>
		</View>
	);
};

const IngredientItem = ({
	item,
	index,
	onDelete,
}: {
	item: Ingredient;
	index: number;
	onDelete: (index: number) => void;
}) => {
	return (
		<RemoveableItem<Ingredient>
			item={item}
			onDelete={async () => {
				onDelete(index);
			}}
		>
			<View
				style={{
					minHeight: 20,
					paddingLeft: 8,
					paddingRight: 8,
					paddingTop: 2,
					paddingBottom: 2,
				}}
			>
				<IngredientText ingredient={item} />
			</View>
		</RemoveableItem>
	);
};

export default ManageIngredients;
