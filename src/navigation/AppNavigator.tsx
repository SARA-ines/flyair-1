// src/navigation/AppNavigator.tsx
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import StartScreen from "../screens/StartScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SearchFlightScreen from "../screens/SearchFlightScreen";
import FlightResultsScreen from "../screens/FlightResultsScreen";
import FlightReservationScreen from "../screens/FlightReservationScreen";

import { startAutoRefresh } from "../services/flightService";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  useEffect(() => {
    const stop = startAutoRefresh(5 * 60 * 1000, 3); // toutes les 5 min, ajoute 3 vols
    return () => stop();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="SearchFlight" component={SearchFlightScreen} />
        <Stack.Screen name="FlightResults" component={FlightResultsScreen} />
        <Stack.Screen name="FlightReservation" component={FlightReservationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
