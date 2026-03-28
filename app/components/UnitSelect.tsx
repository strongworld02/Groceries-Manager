import { useMemo } from "react";
import { globals } from "../DataManager";
import Select from "./NativeComponents/Select";

const UnitSelect = ({
	allowEmpty,
	defaultValue,
	disabled,
	onChange,
	units,
}: {
	defaultValue?: string | undefined;
	disabled?: boolean | undefined;
	units?: string[] | undefined;
} & (
	| {
			allowEmpty: true;
			onChange: (unitName: string | null, index: number) => void;
	  }
	| {
			allowEmpty?: false | undefined;
			onChange: (unitName: string, index: number) => void;
	  }
)) => {
	const globalUnits = useMemo(
		() => [...globals.units.entries()].map((u) => u[0]),
		[],
	);
	const data = units ?? globalUnits;
	if (allowEmpty) {
		return (
			<Select
				data={data}
				allowEmpty={true}
				defaultValue={defaultValue}
				disabled={disabled}
				onChange={onChange}
			/>
		);
	}
	return (
		<Select
			data={data}
			allowEmpty={false}
			defaultValue={defaultValue}
			disabled={disabled}
			emptyText="Einheit auswählen"
			onChange={onChange}
		/>
	);
};

export default UnitSelect;
