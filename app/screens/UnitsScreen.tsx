import { useState } from "react";
import {
	FlatList,
	ListRenderItem,
	ListRenderItemInfo,
	View,
} from "react-native";
import SwipeableItem from "react-native-swipeable-item";

import Button from "../components/NativeComponents/Button";
import Collapse from "../components/Collapse";
import dataManager, { globals } from "../DataManager";
import Text from "../components/NativeComponents/Text";
import Unit from "../model/Unit";
import UnitSelect from "../components/UnitSelect";
import TextInput from "../components/NativeComponents/TextInput";

const orderUnits = (units: Unit[]): Unit[] => {
	const orderedUnits: Unit[] = [];
	let remaining: Unit[] = [];
	units.forEach((u) => {
		if (u.nextHigherUnitName === undefined) {
			orderedUnits.push(u);
		} else {
			remaining.push(u);
		}
	});
	orderedUnits.sort((a, b) =>
		a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
	);

	while (remaining.length > 0) {
		remaining.sort((a, b) =>
			a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
		);
		const nextRemaining: Unit[] = [];
		remaining.forEach((u) => {
			const indexNextHigherUnit = orderedUnits.findIndex(
				(x) => x.name === u.nextHigherUnitName,
			);
			if (indexNextHigherUnit < 0) {
				nextRemaining.push(u);
			} else {
				if (indexNextHigherUnit + 1 === orderedUnits.length) {
					orderedUnits.push(u);
				} else {
					orderedUnits.splice(indexNextHigherUnit + 1, 0, u);
				}
			}
		});

		if (remaining.length === nextRemaining.length) {
			// None of the remaining units could be matched which results in an infinite loop.
			// This must be caused by faulty data, so we just add the remaining ones to the ordered list.
			remaining.forEach((u) => orderedUnits.push(u));
			break;
		}
		remaining = nextRemaining;
	}
	return orderedUnits.reverse();
};

const createsCyclicDependencies = (
	newUnit: Unit,
	allUnits: Unit[],
): boolean => {
	if (!newUnit.nextHigherUnitName) {
		return false;
	}
	const units = new Set<string>();
	units.add(newUnit.name);
	let higherUnits = allUnits.filter(
		(u) => u.name === newUnit.nextHigherUnitName,
	);
	while (higherUnits.length > 0) {
		let nextHigherUnits: Unit[] = [];
		for (let i = 0; i < higherUnits.length; i++) {
			const u = higherUnits[i];
			if (u.nextHigherUnitName === undefined) {
				continue;
			}
			if (units.has(u.nextHigherUnitName)) {
				return true;
			}
			units.add(u.name);
			nextHigherUnits = nextHigherUnits.concat(
				allUnits.filter((x) => x.name === u.nextHigherUnitName),
			);
		}
		higherUnits = nextHigherUnits;
	}
	return false;
};

const UnitsScreen = () => {
	const [newOpen, setNewOpen] = useState<boolean>(false);
	const [newName, setNewName] = useState<string>("");
	const [newDisplayName, setNewDisplayName] = useState<string>("");
	const [newHigherUnit, setNewHigherUnit] = useState<string | null>(null);
	const [newAmountHigherUnit, setNewAmountHigherUnit] = useState<string | null>(
		null,
	);
	const [units, setUnits] = useState<Unit[]>(
		orderUnits([...globals.units.entries()].map((u) => u[1])),
	);

	const addItem = async () => {
		const newUnit = {
			name: newName.trim(),
			displayName: newDisplayName.trim(),
			nextHigherUnitName: newHigherUnit ? newHigherUnit : undefined,
			amountForNextHigherUnit: newAmountHigherUnit?.trim()
				? Number(newAmountHigherUnit)
				: undefined,
		} as Unit;
		const updatedUnits: Unit[] = [];
		let unitAlreadyExists = false;
		for (let i = 0; i < units.length; i++) {
			if (units[i].name === newUnit.name) {
				unitAlreadyExists = true;
				if (newUnit.name === newUnit.nextHigherUnitName) {
					newUnit.nextHigherUnitName = undefined;
					newUnit.amountForNextHigherUnit = undefined;
				}
				if (createsCyclicDependencies(newUnit, units)) {
					setNewAmountHigherUnit(
						`${newUnit.nextHigherUnitName} kann nicht gewählt werden!`,
					);
					return;
				}
				updatedUnits.push(newUnit);
			} else {
				updatedUnits.push(units[i]);
			}
		}
		const newState: Unit[] = unitAlreadyExists
			? updatedUnits
			: [newUnit].concat(updatedUnits);
		setUnits(newState);
		setNewOpen(false);
		setNewName("");
		setNewDisplayName("");
		setNewHigherUnit(null);
		setNewAmountHigherUnit(null);
		await dataManager.writeUnits(newState);
	};

	const deleteItem = async (index: number) => {
		const newState = units.filter((_, i) => i !== index);
		setUnits(newState);
		await dataManager.writeUnits(newState);
	};

	const unitRow: ListRenderItem<Unit> = ({
		index,
		item,
	}: ListRenderItemInfo<Unit>) => {
		const lowerUnit = units.find((u) => u.nextHigherUnitName === item.name);
		const color = index % 2 === 0 ? "#bababa" : "#fff";
		return (
			<SwipeableItem
				activationThreshold={60}
				item={item}
				onChange={async (e) => {
					if (e.openDirection !== "none") {
						await deleteItem(index);
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
				swipeEnabled={true}
				swipeDamping={250}
			>
				<View
					style={{
						backgroundColor: color,
						height: 50,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Text>
						{item.name + (!!item.displayName ? ` (${item.displayName})` : "")}
					</Text>
					{!!lowerUnit && (
						<Text
							style={{ fontStyle: "italic", marginTop: -2 }}
							fontSize={14}
						>{`(${lowerUnit.amountForNextHigherUnit} ${lowerUnit.name})`}</Text>
					)}
				</View>
			</SwipeableItem>
		);
	};

	return (
		<View>
			<Collapse
				open={newOpen}
				setOpen={(open) => {
					setNewOpen(open);
					if (!open) {
						setNewHigherUnit(null);
						setNewAmountHigherUnit(null);
					}
				}}
			>
				<View style={{ margin: 5 }}>
					<Text>Bezeichnung</Text>
					<TextInput
						onChangeText={(value) => {
							setNewName(value);
							const existingEntry = units.find((u) => u.name === value);
							if (existingEntry !== undefined) {
								setNewDisplayName(existingEntry.displayName);
							} else if (newName === newDisplayName) {
								setNewDisplayName(value);
							}
						}}
						value={newName}
					/>
				</View>
				<View style={{ marginLeft: 5, marginRight: 5, marginBottom: 5 }}>
					<Text>Kurzform</Text>
					<TextInput onChangeText={setNewDisplayName} value={newDisplayName} />
				</View>
				<View
					style={{
						marginLeft: 5,
						marginRight: 5,
						marginBottom: newHigherUnit ? undefined : 10,
					}}
				>
					<Text>{"Nächst höhere Einheit"}</Text>
					<UnitSelect
						allowEmpty
						onChange={(unit) => {
							setNewHigherUnit(unit);
							if (
								unit === null ||
								(newAmountHigherUnit !== null && isNaN(+newAmountHigherUnit))
							) {
								setNewAmountHigherUnit(null);
							}
						}}
						units={units.map((u) => u.name)}
					/>
				</View>
				{newHigherUnit !== null && (
					<View style={{ margin: 5, marginBottom: 10 }}>
						<Text>{`Menge für 1 ${newHigherUnit}`}</Text>
						<TextInput
							onChangeText={setNewAmountHigherUnit}
							placeholder={`Menge ${newName} in ${newHigherUnit}`}
							value={newAmountHigherUnit ?? ""}
						/>
					</View>
				)}
				<Button
					disabled={
						newName.length === 0 ||
						(!!newHigherUnit &&
							(!newAmountHigherUnit || isNaN(+newAmountHigherUnit)))
					}
					onPress={addItem}
					title="Hinzufügen"
					type="button"
				/>
			</Collapse>
			<FlatList
				data={units}
				keyExtractor={(u) => u.name}
				renderItem={unitRow}
			/>
		</View>
	);
};

export default UnitsScreen;
