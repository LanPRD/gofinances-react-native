import "intl";
import "intl/locale-data/jsonp/pt-BR";

import React from "react";
import { StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "styled-components";

import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";

import { AppProvider } from "./src/context";
import { useAuth } from "./src/context/Auth";

import { AppRoutes } from "./src/routes";

import theme from "./src/global/styles/theme";

export default function App() {
  SplashScreen.preventAutoHideAsync();
  const { userStorageLoading } = useAuth();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if (!fontsLoaded || userStorageLoading) {
    return null;
  }

  SplashScreen.hideAsync();

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </ThemeProvider>
  );
}
