import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Dimensions,
	TextInput,
	ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";
import CoinDetailHeader from "./components/CoinDetailHeader";
import {
	getDetailedCoinData,
	getCoinMarketChart,
} from "../../services/request";
import styles from "./styles";

const CoinDetailedScreen = () => {
	const [coin, setCoin] = useState(null);
	const [coinMarketData, setCoinMarketData] = useState(null);
	const route = useRoute();
	const {
		params: { coinId },
	} = route;

	const [loading, setLoading] = useState(false);
	const [coinValue, setCoinValue] = useState("1");
	const [usdValue, setUsdValue] = useState("");

	const { width } = Dimensions.get("window");

	const fetchCoinData = async () => {
		setLoading(true);
		const fetchedCoinData = await getDetailedCoinData(coinId);
		const fetchedCoinMarketData = await getCoinMarketChart(coinId);
		setCoin(fetchedCoinData);
		setCoinMarketData(fetchedCoinMarketData);
		    setUsdValue(fetchedCoinData.market_data.current_price.usd.toString())
		setLoading(false);
	};

	useEffect(() => {
		fetchCoinData();
	}, []);

	if (loading || !coin || !coinMarketData) {
		return <ActivityIndicator size="large" color="white" />;
	}

	const changeCoinValue = (value) => {
		setCoinValue(value);
		const floatValue = parseFloat(value.replace(",", ".")) || 0;
		setUsdValue((floatValue * current_price.usd).toString());
	};

	const changeUsdValue = (value) => {
		setUsdValue(value);
		const floatValue = parseFloat(value.replace(",", ".")) || 0;
		setCoinValue((floatValue / current_price.usd).toString());
	};

	const {
		id,
		image: { small },
		name,
		symbol,
		market_data: {
			market_cap_rank,
			current_price,
			price_change_percentage_24h,
		},
	} = coin;

	const { prices } = coinMarketData;

	const data = {
		labels: ["January", "February", "March", "April", "May", "June"],
		datasets: [
			{
				data: prices.map(([x, y]) => y),
				color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
			},
		],
	};

	const percentageColor =
		price_change_percentage_24h < 0 ? "#ea3943" : "#16c784" || "white";

	return (
		<View style={{ paddingHorizontal: 10 }}>
			<CoinDetailHeader
				coinId={id}
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
						{price_change_percentage_24h?.toFixed(2)}%
					</Text>
				</View>
			</View>

			<View>
				<LineChart
					data={data}
					width={width - 20}
					height={220}
					withInnerLines={false}
					withOuterLines={false}
					withShadow={false}
					withDots={false}
					chartConfig={{
						color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
						backgroundColor: "#121212",
						backgroundGradientFrom: "#121212",
						backgroundGradientTo: "#121212",
					}}
					style={{paddingRight: 8, paddingBottom: -30}}
					withHorizontalLabels={false}
					withVerticalLabels={false}
					bezier
				/>
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
