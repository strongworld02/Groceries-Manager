import { useState } from "react";
import DraggableFlatList, {
	DragEndParams,
	RenderItemParams,
	ScaleDecorator,
} from "react-native-draggable-flatlist";
import { TouchableOpacity, View } from "react-native";
import SwipeableItem from "react-native-swipeable-item";
import { ChevronsDown, ChevronsUp } from "lucide-react-native";

import { globals } from "../DataManager";
import Text from "../components/NativeComponents/Text";
import Product from "../model/Product";
import Button from "../components/NativeComponents/Button";
import UnitSelect from "../components/UnitSelect";
import TextInput from "../components/NativeComponents/TextInput";
import Checkbox from "../components/NativeComponents/Checkbox";

const ProductsScreen = () => {
	const [newOpen, setNewOpen] = useState<boolean>(false);
	const [newIsSingle, setNewIsSingle] = useState<boolean>(false);
	const [newName, setNewName] = useState<string>("");
	const [newUnit, setNewUnit] = useState<string | null>(null);
	const [products, setProducts] = useState<Product[]>(
		[...globals.products.entries()]
			.map((x) => x[1])
			.sort((a, b) =>
				a.order === b.order
					? a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
					: a.order - b.order,
			),
	);
	const orderChanged = ({ data }: DragEndParams<Product>) => {
		const newState: Product[] = [];
		data.forEach((p, i) => {
			newState.push({ ...p, order: i });
		});
		setProducts(newState);
	};

	const addItem = () => {
		let id = 0;
		products.forEach((p) => {
			if (p.id >= id) {
				id = p.id + 1;
			}
		});
		const order = products.length > 0 ? products[0].order - 1 : 1;
		setProducts(
			[
				{
					id: id,
					name: newName,
					order: order,
					unitName: newUnit ?? "",
					isSingle: newIsSingle,
				},
			].concat(products),
		);
		setNewOpen(false);
		setNewName("");
		setNewUnit(null);
		setNewIsSingle(false);
	};

	const deleteItem = (id: number) => {
		const newState: Product[] = [];
		products.forEach((p) => {
			if (p.id !== id) {
				newState.push(p);
			}
		});
		setProducts(newState);
	};

	const productRow = ({
		drag,
		getIndex,
		isActive,
		item,
	}: RenderItemParams<Product>) => {
		const index = isActive ? undefined : getIndex();
		const color = isActive
			? "#119db9"
			: index !== undefined && index % 2 === 0
				? "#bababa"
				: "#fff";

		return (
			<ScaleDecorator>
				<SwipeableItem
					activationThreshold={60}
					item={item}
					onChange={(e) => {
						if (e.openDirection !== "none") {
							deleteItem(item.id);
						}
					}}
					renderUnderlayLeft={() => (
						<View style={{ backgroundColor: "#f72626", flex: 1 }} />
					)}
					renderUnderlayRight={() => (
						<View style={{ backgroundColor: "#f72626", flex: 1 }} />
					)}
					snapPointsLeft={[400]}
					snapPointsRight={[400]}
					swipeEnabled={
						!isActive &&
						!globals.recipes.some((r) =>
							r.ingredients.some((i) => i.productId === item.id),
						)
					}
					swipeDamping={250}
				>
					<TouchableOpacity
						disabled={isActive}
						onLongPress={drag}
						style={{
							backgroundColor: color,
							height: 50,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text>{item.name}</Text>
					</TouchableOpacity>
				</SwipeableItem>
			</ScaleDecorator>
		);
	};

	return (
		<View>
			{newOpen ? (
				<View style={{ borderStyle: "solid", borderBottomWidth: 1 }}>
					<TouchableOpacity
						style={{
							alignItems: "flex-end",
						}}
						onPress={(e) => setNewOpen(false)}
					>
						<ChevronsUp size={30} />
					</TouchableOpacity>
					<TextInput
						onChangeText={(v) => setNewName(v.trimStart())}
						placeholder="Namen angeben..."
						style={{ margin: 5 }}
						value={newName}
					/>
					<View style={{ marginLeft: 5, marginRight: 5 }}>
						<UnitSelect onChange={setNewUnit} />
					</View>
					<View style={{ margin: 5, marginBottom: 10 }}>
						<Checkbox
							label="Maximal einmal kaufen"
							value={newIsSingle}
							onValueChange={setNewIsSingle}
						/>
					</View>
					<Button
						disabled={newName.length === 0 || newUnit === null}
						onPress={addItem}
						title="Hinzufügen"
						type="button"
					/>
				</View>
			) : (
				<TouchableOpacity
					style={{
						alignItems: "flex-end",
						borderStyle: "solid",
						borderBottomWidth: 1,
					}}
					onPress={(e) => setNewOpen(true)}
				>
					<ChevronsDown size={30} />
				</TouchableOpacity>
			)}
			<DraggableFlatList
				activationDistance={15}
				data={products}
				onDragEnd={orderChanged}
				keyExtractor={(item) => item.id.toString()}
				renderItem={productRow}
			/>
		</View>
	);
};

export default ProductsScreen;
