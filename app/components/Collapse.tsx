import { PropsWithChildren } from "react";
import { TouchableOpacity, View } from "react-native";
import { ChevronsDown, ChevronsUp } from "lucide-react-native";

const Collapse = ({
	children,
	open,
	setOpen,
}: PropsWithChildren<{ open: boolean; setOpen: (value: boolean) => void }>) => {
	if (!open) {
		return (
			<TouchableOpacity
				style={{
					alignItems: "flex-end",
					borderStyle: "solid",
					borderBottomWidth: 1,
				}}
				onPress={() => setOpen(true)}
			>
				<ChevronsDown size={30} />
			</TouchableOpacity>
		);
	}
	return (
		<View style={{ borderStyle: "solid", borderBottomWidth: 1 }}>
			<TouchableOpacity
				style={{
					alignItems: "flex-end",
				}}
				onPress={() => setOpen(false)}
			>
				<ChevronsUp size={30} />
			</TouchableOpacity>
			{children}
		</View>
	);
};

export default Collapse;
