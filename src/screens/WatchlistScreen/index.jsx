import React, { useState, useEffect } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { useWatchlist } from "../../context/WatchlistContext";
import CoinItem from "../../components/CoinItem";
import { getWatchListedCoins } from "../../services/request";

const WatchListScreen = () => {
	const { watchListCoinIds } = useWatchlist();

	const [coins, setCoins] = useState();
	const [loading, setLoading] = useState(false);

	const transformCoinIds = () => watchListCoinIds.join("%2C");

	const fetchWatchListedCoins = async () => {
		if (loading) {
			return;
		}
		setLoading(true);
		const watchListedCoinsData =
			(await getWatchListedCoins(1, transformCoinIds())) || [];
		setCoins(watchListedCoinsData);
		setLoading(false);
	};

	useEffect(() => {
		if (watchListCoinIds.length > 0) {
			fetchWatchListedCoins();
		}
	}, [watchListCoinIds]);

	return (
		<View>
			<FlatList
				data={coins}
				renderItem={({ item }) => <CoinItem marketCoin={item} />}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						tintColor="white"
						onRefresh={watchListCoinIds.length > 0 ? fetchWatchListedCoins : null}
					/>
				}
			/>
		</View>
	);
};

export default WatchListScreen;
