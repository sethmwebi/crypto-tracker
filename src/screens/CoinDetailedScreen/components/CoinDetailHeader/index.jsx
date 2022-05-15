import { View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, EvilIcons, FontAwesome } from "@expo/vector-icons";
import styles from "./styles";
import { useWatchlist } from "../../../../context/WatchlistContext";

const CoinDetailHeader = (props) => {
	const { coinId, image, symbol, marketCapRank } = props;
	const navigation = useNavigation();
	const { watchListCoinIds, storeWatchlistCoinId, removeWatchlistCoinId } =
		useWatchlist();

	const checkIfCoinIsWatchlisted = () =>
		watchListCoinIds.some((coinIdValue) => coinIdValue === coinId);

	const handleWatchListCoin = () => {
		if (checkIfCoinIsWatchlisted()) {
			return removeWatchlistCoinId(coinId);
		} else {
			return storeWatchlistCoinId(coinId);
		}
	};

	return (
		<View style={styles.headerContainer}>
			<Ionicons
				name="chevron-back-sharp"
				size={30}
				color="white"
				onPress={() => navigation.goBack()}
			/>
			<View style={styles.tickerContainer}>
				<Image source={{ uri: image }} style={{ width: 25, height: 25 }} />
				<Text style={styles.tickerTitle}>{symbol.toUpperCase()}</Text>
				<View style={styles.rankContainer}>
					<Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
						#{marketCapRank}
					</Text>
				</View>
			</View>
			<FontAwesome
				name={checkIfCoinIsWatchlisted() ? "star" : "star-o"}
				size={25}
				color={checkIfCoinIsWatchlisted() ? "#FFBF00" : "white"}
				onPress={handleWatchListCoin}
			/>
		</View>
	);
};

export default CoinDetailHeader;
