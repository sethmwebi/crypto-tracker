import React from "react";
import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator"

import HomeScreen from "../../screens/HomeScreen";
import CoinDetailedScreen from "../../screens/CoinDetailedScreen";
import AddNewAssetScreen from "../../screens/AddNewAssetScreen"

const Stack = createNativeStackNavigator();
const Navigation = () => {
	return (
		<Stack.Navigator initialRouteName="Root">
			<Stack.Screen name={"Root"} component={BottomTabNavigator} options={{headerShown: false}}/>
			<Stack.Screen name="CoinDetailedScreen" component={CoinDetailedScreen} options={{headerShown: false}}/>
			<Stack.Screen name="AddNewAssetScreen" component={AddNewAssetScreen} options={{
				title: "Add New Asset",
				headerStyle: {
					backgroundColor: "#121212",
				},
				headerTintColor: "white",
				headerTitleStyle: {
					fontWeight: "bold",
				},
				headerTitleAlign: "center"
			}}/>
		</Stack.Navigator>
	);
};

export default Navigation;
