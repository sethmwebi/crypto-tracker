import { useState, useEffect, useCallback } from "react";
import {
	View,
	Text,
	Dimensions,
	TextInput,
	ActivityIndicator,
	Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { LineChart, CandlestickChart } from "react-native-wagmi-charts";
import { MaterialIcons } from "@expo/vector-icons";
import CoinDetailHeader from "./components/CoinDetailHeader";
import FilterComponent from "./components/FilterComponent";
import {
	getDetailedCoinData,
	getCoinMarketChart,
	getCandleChartData,
} from "../../services/request";
import styles from "./styles";

const filterDaysArray = [
	{ filterDay: "1", filterText: "24h" },
	{ filterDay: "7", filterText: "7d" },
	{ filterDay: "30", filterText: "30d" },
	{ filterDay: "365", filterText: "1y" },
	{ filterDay: "max", filterText: "All" },
];

const CoinDetailedScreen = () => {
	const [coin, setCoin] = useState(null);
	const [coinMarketData, setCoinMarketData] = useState(null);
	const [coinCandleChartData, setCoinCandleChartData] = useState(null);
	const route = useRoute();
	const {
		params: { coinId },
	} = route;

	const [loading, setLoading] = useState(false);
	const [coinValue, setCoinValue] = useState("1");
	const [usdValue, setUsdValue] = useState("");
	const [selectedRange, setSelectedRange] = useState("1");
	const [isCandleChartVisible, setIsCandleChartVisible] = useState(false);

	const { width } = Dimensions.get("window");

	const fetchCoinData = async () => {
		setLoading(true);
		const fetchedCoinData = await getDetailedCoinData(coinId);
		setCoin(fetchedCoinData);

		setUsdValue(fetchedCoinData.market_data.current_price.usd.toString());
		setLoading(false);
	};

	const fetchMarketCoinData = async (selectedRangeValue) => {
		const fetchedCoinMarketData = await getCoinMarketChart(
			coinId,
			selectedRange
		);
		setCoinMarketData(fetchedCoinMarketData);
	};

	const fetchCandleStickChartData = async (selectedRangeValue) => {
		const fetchSelectedCandleChartData = await getCandleChartData(
			coinId,
			selectedRangeValue
		);
		setCoinCandleChartData(fetchSelectedCandleChartData);
	};

	useEffect(() => {
		fetchCoinData();
		fetchMarketCoinData(1);
		fetchCandleStickChartData();
	}, []);

	const onSelectedRangeChange = (selectedRangeValue) => {
		setSelectedRange(selectedRangeValue);
		fetchMarketCoinData(selectedRangeValue);
		fetchCandleStickChartData(selectedRangeValue);
	};

	const memoOnSelectedRangeChange = useCallback(
		(range) => onSelectedRangeChange(range),
		[]
	);

	if (loading || !coin || !coinMarketData || !coinCandleChartData) {
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
	const chartColor = current_price.usd > prices[0][1] ? "#16c784" : "#ea3943";
	const screenWidth = Dimensions.get("window").width;

	const formatCurrency = ({ value }) => {
		"worklet";
		if (value === "") {
			if (current_price.usd < 1) {
				return `$${current_price.usd}`;
			}
			return `$${current_price.usd.toFixed(2)}`;
		}
		if (current_price.usd < 1) {
			return `$${parseFloat(value)}`;
		}
		return `$${parseFloat(value).toFixed(2)}`;
	};

	return (
		<Pressable style={{ paddingHorizontal: 10 }}>
			<LineChart.Provider
				data={prices.map(([timestamp, value]) => ({ timestamp, value }))}
			>
				<CoinDetailHeader
					coinId={id}
					image={small}
					symbol={symbol}
					marketCapRank={market_cap_rank}
				/>
				<View style={styles.priceContainer}>
					<View>
						<Text style={styles.name}>{name}</Text>
						<LineChart.PriceText
							format={formatCurrency}
							style={styles.currentPrice}
						/>
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
				<View style={styles.filtersContainer}>
					{filterDaysArray.map((day, idx) => (
						<FilterComponent
							key={idx}
							filterDay={day.filterDay}
							filterText={day.filterText}
							selectedRange={selectedRange}
							setSelectedRange={memoOnSelectedRangeChange}
						/>
					))}
					{isCandleChartVisible ? (
						<MaterialIcons
							name="show-chart"
							size={24}
							color={price_change_percentage_24h < 0 ? "#ea3943" : "#16c784"}
							onPress={() => setIsCandleChartVisible(false)}
						/>
					) : (
						<MaterialIcons
							name="waterfall-chart"
							size={24}
							color={price_change_percentage_24h < 0 ? "#ea3943" : "#16c784"}
							onPress={() => setIsCandleChartVisible(true)}
						/>
					)}
				</View>

				{isCandleChartVisible ? (
					<CandlestickChart.Provider
						data={coinCandleChartData.map(
							([timestamp, open, high, low, close]) => ({
								timestamp,
								open,
								high,
								low,
								close,
							})
						)}
					>
						<CandlestickChart height={screenWidth / 2} width={screenWidth}>
							<CandlestickChart.Candles />
							<CandlestickChart.Crosshair>
								<CandlestickChart.Tooltip />
							</CandlestickChart.Crosshair>
						</CandlestickChart>
					</CandlestickChart.Provider>
				) : (
					<LineChart height={screenWidth / 2} width={screenWidth}>
						<LineChart.Path color={percentageColor} />
						<LineChart.CursorCrosshair color={percentageColor} />
					</LineChart>
				)}

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
			</LineChart.Provider>
		</Pressable>
	);
};

export default CoinDetailedScreen;
