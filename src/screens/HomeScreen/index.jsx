import { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import CoinItem from "../../components/CoinItem";
import cryptocurrencies from "../../../assets/data/cryptocurrencies.json";
import { getMarketData } from "../../services/request";

const HomeScreen = () => {
	const [coins, setCoins] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchCoins = async (pageNumber) => {
		if(loading){
			return;
		}
		setLoading(true);
		const coinsData = await getMarketData(pageNumber);
		setCoins((existingCoins) => ([...existingCoins, ...coinsData]));
		setLoading(false);
	};

	const refetchCoins = async () => {
		if(loading){
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
		<FlatList
			data={coins}
			renderItem={({ item }) => <CoinItem marketCoin={item} />}
			refreshControl={
				<RefreshControl
					refreshing={loading}
					onRefresh={refetchCoins}
					tintColor="white"
				/>
			}
			onEndReached={() => fetchCoins((coins.length / 50) + 1)}
		/>
	);
};

export default HomeScreen;
