import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

import Recipe from "../model/Recipe";
import dataManager, { globals } from "../DataManager";
import Collapse from "../components/Collapse";
import EditRecipe from "../components/Recipes/EditRecipe";
import RecipePreview from "../components/Recipes/RecipePreview";
import TextInput from "../components/NativeComponents/TextInput";
import Text from "../components/NativeComponents/Text";
import { useNavigation } from "@react-navigation/native";
import CollapseButton from "../components/CollapseButton";

const RecipesScreen = () => {
	const [recipes, setRecipes] = useState<
		{ recipe: Recipe; selected: boolean }[]
	>(
		globals.recipes.map((r) => ({
			recipe: r,
			selected: globals.selectedRecipes.has(r.name),
		})),
	);
	const [newOpen, setNewOpen] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);
	const [recipeInEdit, setRecipeInEdit] = useState<{
		index: number;
		recipe: Recipe;
	} | null>(null);
	const [searchString, setSearchString] = useState<string>("");
	const [selectionChanged, setSelectionChanged] = useState<boolean>(false);

	const navigation = useNavigation();

	const addRecipe = async (newRecipe: Recipe) => {
		setSaving(true);
		const newState = [...recipes];
		let updateSelected: boolean = false;
		if (recipeInEdit === null) {
			newState.push({ recipe: newRecipe, selected: false });
		} else {
			const previous = newState[recipeInEdit.index];
			updateSelected =
				previous.selected && previous.recipe.name !== newRecipe.name;
			newState[recipeInEdit.index] = {
				recipe: newRecipe,
				selected: previous.selected,
			};
		}
		newState.sort((a, b) =>
			a.recipe.name.localeCompare(b.recipe.name, undefined, {
				sensitivity: "base",
			}),
		);
		await dataManager.writeRecipes(newState.map((r) => r.recipe));
		if (updateSelected) {
			await dataManager.writeSelectedRecipes(
				newState.filter((r) => r.selected).map((r) => r.recipe.name),
			);
		}
		setRecipes(newState);
		toggleEdit(false);
		setRecipeInEdit(null);
		setSaving(false);
	};

	const deleteRecipe = async (name: string) => {
		setSaving(true);
		const newState = recipes.filter((r) => r.recipe.name === name);
		await dataManager.writeRecipes(newState.map((r) => r.recipe));
		setRecipes(newState);
		setSaving(false);
	};

	const setRecipeEdit = (name: string) => {
		let recipe: Recipe | undefined = undefined;
		let index: number | undefined = undefined;
		for (let i = 0; i < recipes.length; i++) {
			if (recipes[i].recipe.name === name) {
				recipe = recipes[i].recipe;
				index = i;
				break;
			}
		}
		if (index === undefined) {
			return;
		}
		setRecipeInEdit({ index: index, recipe: recipe! });
		setNewOpen(true);
	};

	const toggleEdit = (open?: boolean) => {
		open = open === undefined ? !newOpen : open;
		setNewOpen(open);
		if (!open) {
			setRecipeInEdit(null);
		}
	};

	const toggleSelected = (name: string) => {
		const newState: { recipe: Recipe; selected: boolean }[] = [];
		let countSelected: number = 0;
		let allSelectedHandled: boolean = true;
		recipes.forEach((r) => {
			let selected: boolean;
			if (r.recipe.name === name) {
				newState.push({ recipe: r.recipe, selected: !r.selected });
				selected = !r.selected;
			} else {
				newState.push(r);
				selected = r.selected;
			}
			if (selected) {
				countSelected++;
				allSelectedHandled =
					allSelectedHandled && globals.selectedRecipes.has(r.recipe.name);
			}
		});
		setRecipes(newState);
		setSelectionChanged(
			countSelected !== globals.selectedRecipes.size || !allSelectedHandled,
		);
	};

	const updateSelectedRecipes = async () => {
		await dataManager.writeSelectedRecipes(
			recipes.filter((item) => item.selected).map((item) => item.recipe.name),
		);
		setSelectionChanged(false);
	};

	if (newOpen) {
		return (
			<>
				<CollapseButton
					disabled={saving}
					disabledText="bitte warten"
					open={true}
					onPress={() => toggleEdit()}
				/>
				<EditRecipe
					invalidNames={recipes.map((r) => r.recipe.name)}
					onSave={addRecipe}
					recipe={recipeInEdit?.recipe ?? null}
				/>
			</>
		);
	}

	return (
		<>
			<CollapseButton
				disabled={saving}
				disabledText="bitte warten"
				open={false}
				onPress={() => toggleEdit()}
			/>
			<View
				style={{
					marginLeft: 25,
					marginRight: 25,
					marginTop: 10,
					marginBottom: 10,
				}}
			>
				<TextInput
					onChangeText={setSearchString}
					value={searchString}
					trimStart
				/>
			</View>
			<FlatList
				data={
					searchString.length === 0
						? recipes
						: recipes.filter((r) =>
								r.recipe.name
									.toLocaleLowerCase()
									.includes(searchString.toLocaleLowerCase()),
							)
				}
				keyExtractor={(item) => item.recipe.name}
				renderItem={({ item }) => (
					<RecipePreview
						onDelete={async () => await deleteRecipe(item.recipe.name)}
						onLongPress={() => {
							if (
								item.recipe.ingredients.length > 0 ||
								item.recipe.steps.length > 0
							) {
								navigation.navigate("Recipe", { name: item.recipe.name });
							}
						}}
						onPress={() => toggleSelected(item.recipe.name)}
						onStartEdit={() => setRecipeEdit(item.recipe.name)}
						recipe={item.recipe}
						selected={item.selected}
					/>
				)}
			/>
			{selectionChanged && !newOpen && (
				<TouchableOpacity onPress={updateSelectedRecipes}>
					<View
						style={{
							alignItems: "center",
							backgroundColor: "#1f8dfb",
							paddingTop: 6,
							paddingBottom: 6,
						}}
					>
						<Text style={{ color: "#fff" }}>Essensplan aktualisieren</Text>
					</View>
				</TouchableOpacity>
			)}
		</>
	);
};

export default RecipesScreen;
