import { PropsWithChildren, useMemo } from "react";
import { View } from "react-native";
import { globals } from "../DataManager";
import Select from "./NativeComponents/Select";
import Text from "./NativeComponents/Text";

const UnitSelect = ({
	allowEmpty,
	defaultValue,
	disabled,
	label,
	onChange,
	units,
}: {
	defaultValue?: string | undefined;
	disabled?: boolean | undefined;
	label?: string | undefined;
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
			<LabelWrapper label={label}>
				<Select
					data={data}
					allowEmpty={true}
					defaultValue={defaultValue}
					disabled={disabled}
					onChange={onChange}
				/>
			</LabelWrapper>
		);
	}
	return (
		<LabelWrapper label={label}>
			<Select
				data={data}
				allowEmpty={false}
				defaultValue={defaultValue}
				disabled={disabled}
				emptyText="Einheit auswählen"
				onChange={onChange}
			/>
		</LabelWrapper>
	);
};

const LabelWrapper = ({
	children,
	label,
}: PropsWithChildren<{ label: string | undefined }>) => {
	if (!label) {
		return children;
	}
	return (
		<View>
			<Text>{label}</Text>
			{children}
		</View>
	);
};

export default UnitSelect;
