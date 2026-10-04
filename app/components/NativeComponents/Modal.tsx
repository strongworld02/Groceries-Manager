import { PropsWithChildren } from "react";
import {
	DimensionValue,
	Modal as ModalNative,
	TouchableWithoutFeedback,
	View,
} from "react-native";

const Modal = ({
	backdropColor,
	children,
	close,
	marginTop,
	isOpen,
}: PropsWithChildren<{
	backdropColor?: string | undefined;
	close: () => void;
	marginTop?: DimensionValue | undefined;
	isOpen: boolean;
}>) => {
	return (
		<ModalNative
			transparent={false}
			visible={isOpen}
			onRequestClose={close}
			backdropColor={backdropColor ?? defaultModalBackdropColor}
		>
			<TouchableWithoutFeedback onPress={close}>
				<View
					style={{
						height: marginTop ?? 80,
						backgroundColor: backdropColor ?? defaultModalBackdropColor,
					}}
				></View>
			</TouchableWithoutFeedback>
			<View style={{ justifyContent: "center" }}>{children}</View>
			<TouchableWithoutFeedback onPress={close}>
				<View
					style={{
						flex: 1,
						backgroundColor: backdropColor ?? defaultModalBackdropColor,
					}}
				></View>
			</TouchableWithoutFeedback>
		</ModalNative>
	);
};
export const defaultModalBackdropColor = "#d0d0d044";

export default Modal;
