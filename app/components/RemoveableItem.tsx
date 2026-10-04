import { PropsWithChildren, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import SwipeableItem, {
	OpenDirection,
	RenderUnderlay,
	SwipeableItemImperativeRef,
} from "react-native-swipeable-item";
import { Trash2 } from "lucide-react-native/icons";

type RemoveableItemProps<T> = {
	disabled?: boolean | undefined;
	item: T;
	onDelete: () => Promise<void>;
	onOpenStateChange?: (isOpen: boolean) => void;
	renderUnderlayLeft?: RenderUnderlay<T> | undefined;
	renderUnderlayRight?: RenderUnderlay<T> | undefined;
	snapPointLeft?: number | undefined;
	snapPointRight?: number | undefined;
	swipeLeftAction?: (() => Promise<void>) | undefined;
	swipeRightAction?: (() => Promise<void>) | undefined;
};

const RemoveableItem = <T extends {}>({
	children,
	disabled,
	item,
	onDelete,
	onOpenStateChange,
	renderUnderlayLeft,
	renderUnderlayRight,
	snapPointLeft,
	snapPointRight,
	swipeLeftAction,
	swipeRightAction,
}: PropsWithChildren<RemoveableItemProps<T>>) => {
	const firstSnapPoint: number = 170;
	const instantActivationPoint: number = 400;
	const ref = useRef<SwipeableItemImperativeRef>(null);
	const isOpenRef = useRef<boolean>(false);
	return (
		<SwipeableItem<T>
			activationThreshold={60}
			item={item}
			onChange={async (e) => {
				const isOpen = e.openDirection !== OpenDirection.NONE;
				if (isOpenRef.current !== isOpen) {
					isOpenRef.current = isOpen;
					if (onOpenStateChange) {
						onOpenStateChange(isOpen);
					}
				}
				if (e.snapPoint !== instantActivationPoint) {
					return;
				}
				if (e.openDirection === OpenDirection.LEFT) {
					if (swipeLeftAction === undefined) {
						await onDelete();
					} else {
						await swipeLeftAction();
						requestAnimationFrame(() => ref.current?.close());
					}
				} else {
					// e.openDirection === OpenDirection.RIGHT
					if (swipeRightAction === undefined) {
						await onDelete();
					} else {
						await swipeRightAction();
						requestAnimationFrame(() => ref.current?.close());
					}
				}
			}}
			ref={ref}
			renderUnderlayLeft={
				renderUnderlayLeft === undefined
					? () => (
							<TouchableOpacity
								onPress={async () => {
									await onDelete();
								}}
								style={{
									backgroundColor: "#f72626",
									flex: 1,
									justifyContent: "center",
									alignItems: "flex-end",
									paddingRight: 65,
								}}
							>
								<Trash2 size={40} />
							</TouchableOpacity>
						)
					: renderUnderlayLeft
			}
			renderUnderlayRight={
				renderUnderlayRight === undefined
					? () => (
							<TouchableOpacity
								onPress={async () => {
									await onDelete();
								}}
								style={{
									backgroundColor: "#f72626",
									flex: 1,
									justifyContent: "center",
									paddingLeft: 65,
								}}
							>
								<Trash2 size={40} />
							</TouchableOpacity>
						)
					: renderUnderlayRight
			}
			snapPointsLeft={
				renderUnderlayLeft === undefined || swipeLeftAction !== undefined
					? [
							snapPointLeft === undefined ? firstSnapPoint : snapPointLeft,
							instantActivationPoint,
						]
					: [snapPointLeft === undefined ? firstSnapPoint : snapPointLeft]
			}
			snapPointsRight={
				renderUnderlayRight === undefined || swipeRightAction !== undefined
					? [
							snapPointRight === undefined ? firstSnapPoint : snapPointRight,
							instantActivationPoint,
						]
					: [snapPointRight === undefined ? firstSnapPoint : snapPointRight]
			}
			swipeEnabled={!disabled}
			swipeDamping={250}
		>
			{children}
		</SwipeableItem>
	);
};

export default RemoveableItem;
