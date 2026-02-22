import { globals } from "../DataManager";
import Select from "./NativeComponents/Select";
import Text from "./NativeComponents/Text";

const UnitSelect = ({
	disabled,
	onChange,
	defaultValue,
}: {
	disabled?: boolean | undefined;
	onChange: (unitName: string) => void;
	defaultValue?: string | undefined;
}) => {
	return (
		<Select
			data={[...globals.units.entries()].map((u) => u[1].name)}
			defaultValue={defaultValue as string}
			emptyText="Einheit auswählen"
			onChange={onChange}
		/>
	);
};

export default UnitSelect;
