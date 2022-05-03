import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/components/navigation";
import WatchlistProvider from "./src/context/WatchlistContext";
import { RecoilRoot } from "recoil";

export default function App() {
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
