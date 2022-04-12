import React, { useState } from "react";
import { View, Text, Dimensions, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Coin from "../../../assets/data/crypto.json";
import CoinDetailHeader from "./components/CoinDetailHeader";
import styles from "./styles";

const CoinDetailedScreen = () => {
	const {
		image: { small },
		symbol,
		name,
		prices,
		market_data: {
			market_cap_rank,
			current_price,
			price_change_percentage_24h,
		},
	} = Coin;

	const [coinValue, setCoinValue] = useState("1");
	const [usdValue, setUsdValue] = useState(current_price.usd.toString());

	const changeCoinValue = (value) => {
		setCoinValue(value);
		const floatValue = parseFloat(value.replace(",", ".")) || 0;
		setUsdValue((floatValue * current_price.usd).toString())
	};

	const changeUsdValue = (value) => {
		setUsdValue(value);
		const floatValue = parseFloat(value.replace(",", ".")) || 0;
		setCoinValue((floatValue / current_price.usd).toString())
	};

	const percentageColor =
		price_change_percentage_24h < 0 ? "#ea3943" : "#16c784";

	const screenWidth = Dimensions.get("window").width;
	return (
		<View style={{ paddingHorizontal: 10 }}>
			<CoinDetailHeader
				image={small}
				symbol={symbol}
				marketCapRank={market_cap_rank}
			/>
			<View style={styles.priceContainer}>
				<View>
					<Text style={styles.name}>{name}</Text>
					<Text style={styles.currentPrice}>${current_price.usd}</Text>
				</View>
				<View
					style={{
						backgroundColor: percentageColor,
						paddingHorizontal: 3,
						paddingVertical: 8,
						borderRadius: 5,
						flexDirection: "row",
					}}
				>
					<AntDesign
						name={price_change_percentage_24h < 0 ? "caretdown" : "caretup"}
						size={12}
						color={"white"}
						style={{ alignSelf: "center", marginRight: 5 }}
					/>
					<Text style={styles.priceChange}>
						{price_change_percentage_24h.toFixed(2)}%
					</Text>
				</View>
			</View>
			<View style={{ flexDirection: "row" }}>
				<View style={{ flexDirection: "row", flex: 1 }}>
					<Text style={{ color: "white", alignSelf: "center" }}>
						{symbol.toUpperCase()}
					</Text>
					<TextInput
						style={styles.input}
						value={coinValue}
						keyboardType="numeric"
						onChangeText={changeCoinValue}
					/>
				</View>
				<View style={{ flexDirection: "row", flex: 1 }}>
					<Text style={{ color: "white", alignSelf: "center" }}>USD</Text>
					<TextInput
						style={styles.input}
						value={usdValue}
						keyboardType="numeric"
						onChangeText={changeUsdValue}
					/>
				</View>
			</View>
		</View>
	);
};

export default CoinDetailedScreen;
