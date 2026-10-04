import { useEffect, useState } from "react";
import {
	Alert,
	Image,
	ImageSourcePropType,
	Keyboard,
	TouchableHighlight,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { ImageUp } from "lucide-react-native/icons";
import {
	DragEndParams,
	NestableDraggableFlatList,
	NestableScrollContainer,
	RenderItemParams,
	ScaleDecorator,
} from "react-native-draggable-flatlist";

import Button from "../NativeComponents/Button";
import Text from "../NativeComponents/Text";
import TextInput from "../NativeComponents/TextInput";
import { defaultBackgroundColor, navbarHeight } from "../../../Constants";
import {
	compareIngredients,
	getInHighestReasonableUnit,
	getInLowestUnit,
} from "../../../Utils";
import Recipe from "../../model/Recipe";
import RecipeStep from "../../model/RecipeStep";
import Ingredient from "../../model/Ingredient";
import ManageIngredients from "./ManageIngredients";
import RemoveableItem from "../RemoveableItem";
import IngredientList from "./IngredientList";

const saveButtonMinHeight: number = 35;

const EditRecipe = ({
	recipe,
	onSave,
	invalidNames,
}: {
	recipe: Recipe | null;
	onSave: (recipe: Recipe) => Promise<void>;
	invalidNames: string[];
}) => {
	const [newImage, setNewImage] = useState<ImageSourcePropType | null>(
		recipe?.image ?? null,
	);
	const [newName, setNewName] = useState<string>(recipe?.name ?? "");
	const [newSource, setNewSource] = useState<string>(recipe?.source ?? "");
	const [newIngredients, setNewIngredients] = useState<Ingredient[]>(
		recipe?.ingredients ?? [],
	);
	const [newSteps, setNewSteps] = useState<RecipeStep[]>(recipe?.steps ?? []);
	const [addNewStep, setAddNewStep] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);
	const { width } = useWindowDimensions();

	const keyboardSpacer = useSharedValue(0);
	const transitionKeyboardSpacer = useAnimatedStyle(() => ({
		height: keyboardSpacer.value,
	}));

	useEffect(() => {
		setNewImage(recipe?.image ?? null);
		setNewName(recipe?.name ?? "");
		setNewSource(recipe?.source ?? "");
		setNewIngredients(recipe?.ingredients ?? []);
		setNewSteps(recipe?.steps ?? []);
		setAddNewStep(false);
	}, [recipe]);

	useEffect(() => {
		const showSub = Keyboard.addListener("keyboardDidShow", (event) => {
			keyboardSpacer.value =
				event.endCoordinates.height - navbarHeight - saveButtonMinHeight;
		});

		const hideSub = Keyboard.addListener("keyboardDidHide", () => {
			keyboardSpacer.value = withTiming(0, { duration: 80 });
		});

		return () => {
			showSub.remove();
			hideSub.remove();
		};
	}, []);

	const pickImage = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (!permissionResult.granted) {
			Alert.alert(
				"Zugriff verweigert",
				"Die App hat keinen Zugriff auf Fotos.",
			);
			return;
		}
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "images",
			allowsEditing: true,
			aspect: [20, 9],
			quality: 0.5,
			base64: true,
		});
		if (!result.canceled) {
			setNewImage({
				uri: `data:${result.assets[0].mimeType};base64,${result.assets[0].base64}`,
			});
		}
	};

	const save = async () => {
		if (
			invalidNames.some(
				(name) =>
					name === newName && (recipe === null || recipe.name !== newName),
			)
		) {
			Alert.alert(
				"Rezeptnamen müssen eindeutig sein",
				`Es ist bereits ein Rezept mit dem Namen \"${newName}\" vorhanden.`,
			);
			return;
		}
		setSaving(true);
		const newRecipe: Recipe = {
			name: newName,
			ingredients: newIngredients,
			steps: newSteps,
		};
		if (newSource.length > 0) {
			newRecipe.source = newSource;
		}
		if (newImage !== null) {
			newRecipe.image = newImage;
		}
		onSave(newRecipe);
		setNewImage(recipe?.image ?? null);
		setNewName(recipe?.name ?? "");
		setNewSource(recipe?.source ?? "");
		setNewIngredients(recipe?.ingredients ?? []);
		setNewSteps(recipe?.steps ?? []);
		setAddNewStep(false);
		setSaving(false);
	};

	const addStep = (step: RecipeStep) => {
		if (
			step.ingredients === undefined ||
			step.ingredients.length === 0 ||
			!step.ingredients.some((ingredient) => ingredient.productId !== null)
		) {
			setNewSteps((old) => old.concat(step));
			return;
		}
		setSaving(true);
		// Check if there are new ingredients that should be added to the total list
		const current = new Map<number, Map<string, number>>();
		const remaining = new Map<number, Map<string, number>>();
		// Fill remaining with all existing ingredients and keep a deep copy in current
		newIngredients.forEach((ingredient) => {
			if (ingredient.productId === null) {
				return;
			}
			const inLowestUnit = getInLowestUnit(
				ingredient.amount,
				ingredient.unitName,
			);
			const unitMap = remaining.get(ingredient.productId);
			if (unitMap !== undefined) {
				const previous = unitMap.get(inLowestUnit.unitName) ?? 0;
				unitMap.set(inLowestUnit.unitName, inLowestUnit.amount + previous);
				current
					.get(ingredient.productId)!
					.set(inLowestUnit.unitName, inLowestUnit.amount + previous);
			} else {
				remaining.set(
					ingredient.productId,
					new Map<string, number>([
						[inLowestUnit.unitName, inLowestUnit.amount],
					]),
				);
				current.set(
					ingredient.productId,
					new Map<string, number>([
						[inLowestUnit.unitName, inLowestUnit.amount],
					]),
				);
			}
		});
		// Subtract the amount configured in each existing step from remaining
		newSteps.forEach((s) =>
			s.ingredients?.forEach((ingredient) => {
				if (ingredient.productId === null) {
					return;
				}
				const inLowestUnit = getInLowestUnit(
					ingredient.amount,
					ingredient.unitName,
				);
				const unitMap = remaining.get(ingredient.productId);
				if (unitMap !== undefined && unitMap.has(inLowestUnit.unitName)) {
					unitMap.set(
						inLowestUnit.unitName,
						unitMap.get(inLowestUnit.unitName)! - inLowestUnit.amount,
					);
				}
			}),
		);
		// remaining now contains the ingredients that are not yet associated with a step
		// With this info we can update the current amounts for anything that isn't present yet
		const updatedProducts: number[] = [];
		step.ingredients.forEach((ingredient) => {
			if (ingredient.productId === null) {
				return;
			}
			const inLowestUnit = getInLowestUnit(
				ingredient.amount,
				ingredient.unitName,
			);
			const unitMapRemaining = remaining.get(ingredient.productId);
			if (unitMapRemaining !== undefined) {
				const amountRemaining = unitMapRemaining.get(inLowestUnit.unitName);
				if (amountRemaining === undefined) {
					updatedProducts.push(ingredient.productId);
					current
						.get(ingredient.productId)!
						.set(inLowestUnit.unitName, inLowestUnit.amount);
					unitMapRemaining.set(inLowestUnit.unitName, 0); // keep updated to handle duplicates
				} else {
					const excess =
						inLowestUnit.amount - (amountRemaining > 0 ? amountRemaining : 0);
					if (excess > 0) {
						updatedProducts.push(ingredient.productId);
						const unitMapCurrent = current.get(ingredient.productId)!;
						unitMapCurrent.set(
							inLowestUnit.unitName,
							unitMapCurrent.get(inLowestUnit.unitName)! + excess,
						);
					}
					// keep updated to handle duplicates
					unitMapRemaining.set(
						inLowestUnit.unitName,
						amountRemaining - inLowestUnit.amount,
					);
				}
			} else {
				updatedProducts.push(ingredient.productId);
				current.set(
					ingredient.productId,
					new Map<string, number>([
						[inLowestUnit.unitName, inLowestUnit.amount],
					]),
				);
				// keep updated to handle duplicates
				remaining.set(
					ingredient.productId,
					new Map<string, number>([[inLowestUnit.unitName, 0]]),
				);
			}
		});
		// Create the new total ingredient state
		if (updatedProducts.length > 0) {
			// Start with all ingredients that haven't been updated
			const newIngredientState: Ingredient[] = newIngredients.filter(
				(ingredient) =>
					ingredient.productId === null ||
					!updatedProducts.includes(ingredient.productId),
			);
			// add the changed / new products
			current.forEach((units, productId) => {
				if (!updatedProducts.includes(productId)) {
					return;
				}
				units.forEach((amount, unitName) => {
					const inHighestUnit = getInHighestReasonableUnit(amount, unitName);
					newIngredientState.push({
						amount: inHighestUnit.amount,
						productId: productId,
						productName: null,
						unitName: inHighestUnit.unitName,
					});
				});
			});
			newIngredientState.sort(compareIngredients);
			setNewIngredients(newIngredientState);
		}
		setNewSteps((old) => old.concat(step));
		setSaving(false);
	};

	return (
		<View style={{ flex: 1 }}>
			<NestableScrollContainer scrollEventThrottle={50} style={{ flex: 1 }}>
				<TextInput
					onChangeText={setNewName}
					placeholder="Bezeichnung"
					style={{ marginLeft: 8, marginRight: 8, marginBottom: 8 }}
					trimStart
					value={newName}
				/>
				{newImage ? (
					<TouchableHighlight onPress={pickImage}>
						<Image
							resizeMode="cover"
							height={((width <= 16 ? width : width - 16) / 20) * 9}
							source={newImage}
							width={width <= 16 ? width : width - 16}
							style={
								width > 14
									? { borderRadius: 10, borderWidth: 2, marginLeft: 8 }
									: { borderRadius: 10, borderWidth: 2 }
							}
						/>
					</TouchableHighlight>
				) : (
					<TouchableHighlight
						style={{
							width: width <= 16 ? width : width - 16,
							height: ((width <= 16 ? width : width - 16) / 20) * 9,
							backgroundColor: "#d7d7d7",
							borderRadius: 10,
							justifyContent: "center",
							alignItems: "center",
							borderStyle: "solid",
							borderWidth: 4,
							alignSelf: "center",
						}}
						onPress={pickImage}
					>
						<ImageUp size={50} />
					</TouchableHighlight>
				)}
				<TextInput
					keyboardType="url"
					onChangeText={setNewSource}
					placeholder="Quelle"
					style={{ margin: 8 }}
					trimStart
					value={newSource}
				/>
				<View style={{ marginLeft: 8, marginRight: 8 }}>
					<ManageIngredients
						ingredients={newIngredients}
						nestable
						onChange={setNewIngredients}
					/>
				</View>
				<View>
					<View
						style={{
							alignItems: "center",
							borderBottomColor: "#c2c1c1",
							borderBottomWidth: 1,
							borderRadius: 10,
							flexDirection: "row",
							paddingBottom: 6,
							paddingLeft: 14,
						}}
					>
						<Text style={{ marginRight: 8 }}>Schritte</Text>
						<Button
							type="add"
							disabled={addNewStep}
							onPress={() => setAddNewStep(true)}
						/>
					</View>
					<View style={{ marginLeft: 8, marginRight: 8 }}>
						{addNewStep && (
							<EditRecipeStep
								cancel={() => setAddNewStep(false)}
								onSave={(newStep) => {
									addStep(newStep);
									setAddNewStep(false);
								}}
								step={{ instruction: "", number: newSteps.length + 1 }}
							/>
						)}
						<RecipeStepList
							changeDisabled={addNewStep}
							onChange={(newState) => setNewSteps(newState)}
							steps={newSteps}
						/>
					</View>
				</View>
				<Animated.View style={transitionKeyboardSpacer} />
			</NestableScrollContainer>
			<View
				style={{ minHeight: saveButtonMinHeight, justifyContent: "flex-end" }}
			>
				<Button
					disabled={saving || addNewStep || newName.length === 0}
					onPress={save}
					title={saving ? "Wird gespeichert" : "Hinzufügen"}
					type="button"
				/>
			</View>
		</View>
	);
};

const EditRecipeStep = ({
	cancel,
	onSave,
	step,
}: {
	cancel: () => void;
	onSave: (newStep: RecipeStep) => void;
	step: RecipeStep;
}) => {
	const [instruction, setInstruction] = useState<string>(step.instruction);
	const [ingredients, setIngredients] = useState<Ingredient[]>(
		step.ingredients ?? [],
	);

	return (
		<View>
			<View style={{ marginTop: 8, marginBottom: 10 }}>
				<TextInput
					label="Anleitung"
					multiline={true}
					onChangeText={(t) => setInstruction(t.trimStart())}
					value={instruction}
				/>
			</View>
			<ManageIngredients
				ingredients={ingredients}
				nestable
				onChange={setIngredients}
			/>
			<View style={{ flexDirection: "row", justifyContent: "space-around" }}>
				<View style={{ width: 150 }}>
					<Button
						type="button"
						disabled={instruction.length === 0}
						onPress={() =>
							onSave({
								number: step.number,
								instruction: instruction.trim(),
								ingredients: ingredients.length > 0 ? ingredients : undefined,
							})
						}
						title="Hinzufügen"
					/>
				</View>
				<View style={{ width: 150 }}>
					<Button
						type="button"
						onPress={() => cancel()}
						title="Abbrechen"
						color="#7c7c7c"
					/>
				</View>
			</View>
		</View>
	);
};

const RecipeStepList = ({
	changeDisabled,
	onChange,
	steps,
}: {
	changeDisabled?: boolean | undefined;
	onChange: (updatedList: RecipeStep[]) => void;
	steps: RecipeStep[];
}) => {
	const orderChanged = ({ data }: DragEndParams<RecipeStep>) => {
		const updated: RecipeStep[] = [];
		data.forEach((rs, i) => {
			updated.push({ ...rs, number: i + 1 });
		});
		onChange(updated);
	};
	const rowDeleted = (deletedStep: RecipeStep) => {
		const updated: RecipeStep[] = [];
		let number = 1;
		steps.forEach((rs) => {
			if (rs.number !== deletedStep.number) {
				updated.push({ ...rs, number: number });
				number = number + 1;
			}
		});
		onChange(updated);
	};

	const recipeStepRow = ({
		drag,
		isActive,
		item,
	}: RenderItemParams<RecipeStep>) => {
		return (
			<ScaleDecorator>
				<RemoveableItem<RecipeStep>
					disabled={changeDisabled || isActive}
					item={item}
					onDelete={async () => rowDeleted(item)}
				>
					<TouchableOpacity
						disabled={changeDisabled || isActive}
						onLongPress={drag}
					>
						<View
							style={{
								flexDirection: "row",
								paddingBottom: 8,
								paddingLeft: isActive ? 16 : undefined,
								backgroundColor: defaultBackgroundColor,
							}}
						>
							<Text
								style={{
									fontWeight: "900",
									fontSize: 24,
									marginRight: 8,
								}}
							>
								{item.number}
							</Text>
							<View>
								<IngredientList ingredients={item.ingredients ?? []} />
								<Text>{item.instruction}</Text>
							</View>
						</View>
					</TouchableOpacity>
				</RemoveableItem>
			</ScaleDecorator>
		);
	};
	return (
		<NestableDraggableFlatList
			activationDistance={15}
			data={steps}
			onDragEnd={orderChanged}
			keyExtractor={(item) => item.instruction}
			renderItem={recipeStepRow}
			scrollEnabled={false}
		/>
	);
};

export default EditRecipe;
