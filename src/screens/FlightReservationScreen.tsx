// src/screens/FlightReservationScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Flight } from "../services/flightService";

type RootStackParamList = {
  FlightReservation: { flight: Flight };
  Login: undefined;
  MyReservations: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "FlightReservation">;
  route: RouteProp<RootStackParamList, "FlightReservation">;
};

const RES_KEY = "FLYAIR_RESERVATIONS";
const TOKEN_KEY = "FLYAIR_USER_TOKEN"; // clé fictive pour auth simple

export default function FlightReservationScreen({ route, navigation }: Props) {
  const { flight } = route.params;
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      Alert.alert("Connexion requise", "Vous devez vous connecter pour réserver.", [
        { text: "Se connecter", onPress: () => navigation.navigate("Login") },
        { text: "Annuler", style: "cancel" },
      ]);
      return;
    }

    setLoading(true);
    try {
      const ex = await AsyncStorage.getItem(RES_KEY);
      const arr = ex ? JSON.parse(ex) : [];
      const newRes = {
        id: `${flight.id}_${Date.now()}`,
        flightId: flight.id,
        company: flight.company,
        time: flight.time,
        price: flight.price,
        createdAt: new Date().toISOString(),
      };
      arr.push(newRes);
      await AsyncStorage.setItem(RES_KEY, JSON.stringify(arr));
      setLoading(false);
      Alert.alert("Réservation confirmée", "Ta réservation a été enregistrée.", [
        { text: "Voir mes réservations", onPress: () => navigation.navigate("MyReservations") },
        { text: "OK" },
      ]);
    } catch (err) {
      setLoading(false);
      Alert.alert("Erreur", "Impossible d'enregistrer la réservation.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réservation</Text>
      <View style={styles.box}>
        <Text style={styles.label}>Compagnie : {flight.company}</Text>
        {flight.from && <Text style={styles.label}>De : {flight.from}</Text>}
        {flight.to && <Text style={styles.label}>À : {flight.to}</Text>}
        <Text style={styles.label}>Horaire : {flight.time}</Text>
        <Text style={styles.label}>Prix : {flight.price} DA</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={confirm} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Enregistrement..." : "Confirmer la réservation"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", color: "#4B2FB3", marginBottom: 25 },
  box: { padding: 20, backgroundColor: "#f1f1f1", borderRadius: 15, marginBottom: 25 },
  label: { fontSize: 18, marginBottom: 8 },
  btn: { backgroundColor: "#4B2FB3", padding: 15, borderRadius: 30, alignItems: "center" },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
