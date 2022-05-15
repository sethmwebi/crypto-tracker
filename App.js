import React from "react"
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, SafeAreaView, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/components/navigation";
import WatchlistProvider from "./src/context/WatchlistContext";
import { RecoilRoot } from "recoil";
import {
  useFonts,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import 'react-native-gesture-handler'


export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_900Black,
    DroidSans: require("./assets/fonts/DroidSans.ttf")
  });

  if(!fontsLoaded){
    return <ActivityIndicator size={'large'}/>
  }
  return (
    <NavigationContainer
      theme={{
        colors: {
          backgroundColor: "#121212",
        },
      }}
    >
      <RecoilRoot>
        <WatchlistProvider>
          <SafeAreaView style={styles.container}>
            <Navigation />
            <StatusBar style="light" />
          </SafeAreaView>
        </WatchlistProvider>
      </RecoilRoot>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 50,
  },
});
