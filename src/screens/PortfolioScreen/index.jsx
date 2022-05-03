import {Suspense} from 'react'
import { View, Text } from 'react-native'
import PortfolioAssetsList from "./components/PortfolioAssetsList"

const Portfolio = () => {
	return (
		<View style={{flex: 1}}>
			<Suspense fallback={<Text style={{color: "white"}}>Loading Please Wait...</Text>}>
			<PortfolioAssetsList />
			</Suspense>
		</View>
	)
}

export default Portfolio