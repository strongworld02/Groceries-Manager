import {
	ImageBackground,
	TouchableOpacity,
	TouchableWithoutFeedback,
	useWindowDimensions,
	View,
} from "react-native";
import Recipe from "../../model/Recipe";
import { PencilLine, SquareCheckBig } from "lucide-react-native/icons";
import Text from "../NativeComponents/Text";
import RemoveableItem from "../RemoveableItem";
import { useState } from "react";

const RecipePreview = ({
	onDelete,
	onLongPress,
	onPress,
	onStartEdit,
	recipe,
	selected,
}: {
	onDelete: () => Promise<void>;
	onLongPress: () => void;
	onPress: () => void;
	onStartEdit: () => void;
	recipe: Recipe;
	selected: boolean;
}) => {
	const [open, setOpen] = useState<boolean>(false);
	const { width } = useWindowDimensions();
	const height = (width / 20) * 9;
	const imageSizeStyle = { height: height, width: width };
	return (
		<RemoveableItem
			disabled={selected}
			item={recipe}
			onDelete={onDelete}
			onOpenStateChange={setOpen}
			renderUnderlayRight={({ close }) => (
				<TouchableOpacity
					style={{ alignItems: "flex-start", backgroundColor: "#d8eef5" }}
					onPress={() => {
						onStartEdit();
						close();
					}}
				>
					<View
						style={{
							height: height + (recipe.image ? 20 : 0),
							justifyContent: "center",
							marginLeft: 69,
						}}
					>
						<PencilLine size={32} />
					</View>
				</TouchableOpacity>
			)}
			swipeRightAction={async () => {
				onStartEdit();
			}}
		>
			{recipe.image ? (
				<TouchableWithoutFeedback
					disabled={open}
					onPress={onPress}
					onLongPress={onLongPress}
				>
					<View>
						<ImageBackground
							source={recipe.image}
							resizeMode="cover"
							style={imageSizeStyle}
						>
							{selected && (
								<View
									style={{
										alignItems: "center",
										backgroundColor: "#00000066",
										height: (width / 20) * 9,
										justifyContent: "center",
										width: width,
									}}
								>
									<SquareCheckBig color="#fff" size={64} />
								</View>
							)}
						</ImageBackground>
						<View
							style={{
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
								width: width,
								height: 40,
								backgroundColor: selected ? "#f7f7f7" : "#fff",
								borderColor: "#c2c1c1",
								borderWidth: 1,
								marginTop: -20,
								paddingLeft: 20,
								paddingRight: 20,
								alignItems: "center",
								justifyContent: "center",
								overflow: "hidden",
							}}
						>
							<Text
								fontSize={recipe.name.length > 23 ? 20 : 28}
								numberOfLines={1}
							>
								{recipe.name}
							</Text>
						</View>
					</View>
				</TouchableWithoutFeedback>
			) : (
				<TouchableWithoutFeedback
					disabled={open}
					onPress={onPress}
					onLongPress={onLongPress}
				>
					<View
						style={[
							imageSizeStyle,
							{
								backgroundColor: selected ? "#e0e0e0" : "#fff",
								borderRadius: 10,
								borderBottomWidth: 1,
								borderColor: "#c2c1c1",
								justifyContent: "center",
								alignItems: "center",
								padding: 20,
								overflow: "hidden",
							},
						]}
					>
						{selected && <SquareCheckBig size={64} />}
						<Text
							fontSize={selected && recipe.name.length > 23 ? 20 : 28}
							numberOfLines={selected ? undefined : 1}
						>
							{recipe.name}
						</Text>
					</View>
				</TouchableWithoutFeedback>
			)}
		</RemoveableItem>
	);
};

export default RecipePreview;
