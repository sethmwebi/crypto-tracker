import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View, Text } from "react-native";
import CoinItem from "../../components/CoinItem";
import cryptocurrencies from "../../../assets/data/cryptocurrencies.json";
import { getMarketData } from "../../services/request";

const HomeScreen = () => {
	const [coins, setCoins] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchCoins = async (pageNumber) => {
		if (loading) {
			return;
		}
		setLoading(true);
		const coinsData = await getMarketData(pageNumber);
		setCoins((existingCoins) => [...existingCoins, ...coinsData]);
		setLoading(false);
	};

	const refetchCoins = async () => {
		if (loading) {
			return;
		}
		setLoading(true);
		const coinsData = await getMarketData();
		setCoins(coinsData);
		setLoading(false);
	};

	useEffect(() => {
		fetchCoins();
	}, []);

	return (
		<View>
			<View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
				<Text
					style={{
						fontFamily: "DroidSans",
						color: "white",
						fontSize: 25,
						letterSpacing: 1,
						paddingHorizontal: 20,
						paddingBottom: 5,
					}}
				>
					crypto assets
				</Text>
				<Text style={{color: "lightgray", fontSize: 12, paddingHorizontal: 10}}>Powered by CoinGecko</Text>
			</View>
			<FlatList
				data={coins}
				keyExtractor={(item, index) => index + item.symbol}
				renderItem={({ item }) => <CoinItem marketCoin={item} />}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={refetchCoins}
						tintColor="white"
					/>
				}
				onEndReached={() => fetchCoins(coins.length / 50 + 1)}
			/>
		</View>
	);
};

export default HomeScreen;
