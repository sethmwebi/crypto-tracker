import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import millify from "millify";
import { useNavigation } from "@react-navigation/native"
import styles from "./styles";

const CoinItem = ({ marketCoin }) => {
	const {
		id,
		name,
		current_price,
		market_cap_rank,
		price_change_percentage_24h,
		symbol,
		market_cap,
		image,
	} = marketCoin;

	const navigation = useNavigation()

	const percentageColor =
		price_change_percentage_24h < 0 ? "#ea3943" : "#16c784" || "white";

	return (
		<Pressable style={styles.coinContainer} onPress={() => navigation.navigate("CoinDetailedScreen", {coinId: id})}>
			<Image
				source={{
					uri: image,
				}}
				style={{
					height: 30,
					width: 30,
					marginRight: 10,
					alignSelf: "center",
				}}
			/>
			<View>
				<Text style={styles.title}>{name}</Text>
				<View style={{ flexDirection: "row" }}>
					<View style={styles.rankContainer}>
						<Text style={styles.rank}>{market_cap_rank}</Text>
					</View>
					<Text style={styles.text}>{symbol.toUpperCase()}</Text>
					<AntDesign
						name={price_change_percentage_24h < 0 ? 'caretdown' : 'caretup'}
						size={12}
						color={percentageColor}
						style={{ alignSelf: "center", marginRight: 5 }}
					/>
					<Text style={{color: percentageColor}}>
						{price_change_percentage_24h?.toFixed(2)}%
					</Text>
				</View>
			</View>
			<View style={{ marginLeft: "auto", alignItems: "flex-end" }}>
				<Text style={styles.text}>{current_price}</Text>
				<Text style={{ color: "white" }}>{millify(market_cap, { precision: 2})}</Text>
			</View>
		</Pressable>
	);
};

export default CoinItem;
