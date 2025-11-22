// src/screens/FlightResultsScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getFlights, refreshFlights, getLastUpdateISO } from "../services/flightService";
import { Flight } from "../services/flightService";

type RootStackParamList = {
  FlightResults: {
    from?: string;
    to?: string;
    departDate?: string;
    passengers?: string;
    flightClass?: string;
    tripType?: "round" | "oneway";
  };
  FlightReservation: { flight: Flight };
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "FlightResults">;
  route: RouteProp<RootStackParamList, "FlightResults">;
};

export default function FlightResultsScreen({ route, navigation }: Props) {
  const params = route.params ?? {};
  const { from = "", to = "", passengers = "1", flightClass } = params;

  const [flights, setFlights] = useState<Flight[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [addedCount, setAddedCount] = useState<number>(0);

  // Charge les vols au montage
  const load = async () => {
    const data = await getFlights();
    setFlights(data);

    const lu = await getLastUpdateISO();
    setLastUpdate(lu);
  };

  useEffect(() => {
    load();

    // auto refresh toutes les 2 minutes: génère 3 nouveaux vols puis recharge
    const id = setInterval(async () => {
      const res = await refreshFlights(3);
      setAddedCount(res.addedCount || 0);
      const lu = await getLastUpdateISO();
      setLastUpdate(lu);
      const data = await getFlights();
      setFlights(data);
    }, 2 * 60 * 1000);

    return () => clearInterval(id);
  }, []);

  // Filter flights using useMemo
  const results = useMemo(() => {
    return flights.filter((fl) => {
      const matchesFrom = from ? fl.from.toLowerCase().includes(from.toLowerCase()) : true;
      const matchesTo = to ? fl.to.toLowerCase().includes(to.toLowerCase()) : true;
      const matchesClass = flightClass ? (fl.class ?? []).includes(flightClass) : true;
      return matchesFrom && matchesTo && matchesClass;
    });
  }, [flights, from, to, flightClass]);

  const renderItem = ({ item }: { item: Flight }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("FlightReservation", { flight: item })}>
      <Text style={styles.company}>{item.company} — {item.id}</Text>
      <Text style={styles.time}>{item.time}</Text>
      <Text style={styles.price}>{item.price} DA</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vols disponibles</Text>

      <Text style={styles.updateText}>
        🔄 Dernière mise à jour : {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : "Jamais"} {addedCount ? `— ${addedCount} vols ajoutés` : ""}
      </Text>

      <Text style={styles.subtitle}>
        {from || "Toutes les origines"} ➝ {to || "Toutes les destinations"} — {passengers} passager(s)
      </Text>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ marginTop: 20, textAlign: "center" }}>Aucun vol trouvé.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#4B2FB3" },
  updateText: { marginTop: 3, marginBottom: 10, color: "#444", fontStyle: "italic" },
  subtitle: { marginBottom: 20, marginTop: 5, color: "#555" },
  card: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  company: { fontWeight: "700", fontSize: 16 },
  time: { color: "#555", marginVertical: 6 },
  price: { color: "#4B2FB3", fontSize: 16, fontWeight: "700" },
});
