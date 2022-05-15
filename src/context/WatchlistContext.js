import { useContext, createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

const WatchlistProvider = ({ children }) => {
	const [watchListCoinIds, setWatchListCoinIds] = useState([]);

	const getWatchListData = async () => {
		try {
			const jsonValue = await AsyncStorage.getItem("watchlistcoins");
			const value = jsonValue != null ? await JSON.parse(jsonValue) : [];
			setWatchListCoinIds(value);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getWatchListData();
	}, []);

	const storeWatchlistCoinId = async (coinId) => {
		try {
			const newWatchList = [...watchListCoinIds, coinId];
			setWatchListCoinIds(newWatchList);
			await AsyncStorage.setItem(
				"watchlistcoins",
				JSON.stringify(newWatchList)
			);
		} catch (e) {
			console.log(e);
		}
	};

	const removeWatchlistCoinId = async (coidId) => {
		try {
			const newWatchList = watchListCoinIds.filter(
				(coinIdValue) => coinIdValue !== coinId
			);
			setWatchListCoinIds(newWatchList);
			await AsyncStorage.setItem(
				"watchlistcoins",
				JSON.stringify(newWatchList)
			);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<WatchlistContext.Provider
			value={{ watchListCoinIds, storeWatchlistCoinId, removeWatchlistCoinId }}
		>
			{children}
		</WatchlistContext.Provider>
	);
};

export default WatchlistProvider;
