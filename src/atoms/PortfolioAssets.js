import { atom, selector } from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWatchListedCoins } from "../services/request"

export const allPortfolioBoughtAssets = selector({
	key: 'allPortfolioBoughtAssets',
	get: async () => {
		const jsonValue = await AsyncStorage.getItem('@portfolio_coins')
		return jsonValue != null ? JSON.parse(jsonValue) : [];
	}
})

export const allPortfolioBoughtAssetsFromApi = selector({
	key: 'allPortfolioBoughtAssetsFromApi',
	get: async ({get}) => {
		const boughtPortfolioAssets = get(allPortfolioBoughtAssetsInStorage);
		const portfolioAssetsMarketData = await getWatchListedCoins(1, boughtPortfolioAssets.map(portfolioAsset => portfolioAsset.id).join(","))

		const boughtAssets = boughtPortfolioAssets.map((boughtAsset) => {
			const portfolioAsset = portfolioAssetsMarketData.filter((item) => boughtAsset.id === item.id)[0]
			return {
				...boughtAsset,
				currentPrice: portfolioAsset.current_price,
				priceChangePercentage: portfolioAsset.price_change_percentage_24h
			}
		})

		return boughtAssets.sort((item1, item2) => (item1.quantityBought * item1.current_price) < (item2.quantityBought * item2.current_price))
	}
})

export const allPortfolioAssets = atom({
	key: 'allPortfolioAssets',
	default: allPortfolioBoughtAssetsFromApi
})

export const allPortfolioBoughtAssetsInStorage = atom({
	key: 'allPortfolioBoughtAssetsInStorage',
	default: allPortfolioBoughtAssets
})

