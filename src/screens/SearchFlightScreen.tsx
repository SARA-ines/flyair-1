// src/screens/SearchFlightScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { initializeFlights } from "../services/flightService"; // <-- important

type RootStackParamList = {
  FlightResults: {
    from: string;
    to: string;
    departDate?: string;
    returnDate?: string;
    passengers?: string;
    flightClass?: string;
    tripType?: "round" | "oneway";
  };
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "FlightResults">;
};

const flightClasses = [
  "Économique",
  "Affaires",
  "Économique Premium",
  "Première classe",
];

export default function SearchFlightScreen({ navigation }: Props) {
  const [tripType, setTripType] = useState<"round" | "oneway">("round");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());

  const [showDepartPicker, setShowDepartPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  const [passengers, setPassengers] = useState("");
  const [flightClass, setFlightClass] = useState("Économique");

  useEffect(() => {
    // Initialise les vols en cache si nécessaire
    initializeFlights().catch((e) => console.warn("init flights", e));
  }, []);

  // FORMAT DATE JOLIE (JJ/MM/AAAA)
  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const onSearch = () => {
    navigation.navigate("FlightResults", {
      from: from.trim(),
      to: to.trim(),
      departDate: departDate.toISOString(),
      returnDate: returnDate.toISOString(),
      passengers,
      flightClass,
      tripType,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        {/* HEADER */}
        <View style={styles.header}>
          <Ionicons name="airplane-outline" size={45} color="white" />
          <Text style={styles.headerTitle}>FlyAir</Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          {/* SWITCH */}
          <View style={styles.switchRow}>
            <TouchableOpacity
              style={[styles.switchBtn, tripType === "round" && styles.switchBtnActive]}
              onPress={() => setTripType("round")}
            >
              <Text style={[styles.switchText, tripType === "round" && styles.switchTextActive]}>
                Aller-retour
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.switchBtn, tripType === "oneway" && styles.switchBtnActive]}
              onPress={() => setTripType("oneway")}
            >
              <Text style={[styles.switchText, tripType === "oneway" && styles.switchTextActive]}>
                Aller-simple
              </Text>
            </TouchableOpacity>
          </View>

          {/* INPUTS */}
          <TextInput
            style={styles.input}
            placeholder="Lieu-de départ"
            value={from}
            onChangeText={setFrom}
          />

          <TextInput
            style={styles.input}
            placeholder="Lieu d'arrivée"
            value={to}
            onChangeText={setTo}
          />

          {/* DATES */}
          <View style={styles.row}>
            <TouchableOpacity style={styles.inputSmall} onPress={() => setShowDepartPicker(true)}>
              <Text style={styles.label}>Date départ</Text>
              <Text style={styles.dateText}>{formatDate(departDate)}</Text>
              <Ionicons name="calendar-outline" size={22} color="#555" style={styles.icon} />
            </TouchableOpacity>

            {tripType === "round" && (
              <TouchableOpacity style={styles.inputSmall} onPress={() => setShowReturnPicker(true)}>
                <Text style={styles.label}>Date arrivée</Text>
                <Text style={styles.dateText}>{formatDate(returnDate)}</Text>
                <Ionicons name="calendar-outline" size={22} color="#555" style={styles.icon} />
              </TouchableOpacity>
            )}
          </View>

          {/* DATE PICKERS */}
          {showDepartPicker && (
            <DateTimePicker
              value={departDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                if (Platform.OS === "android") {
                  if ((event as any).type === "set" && selectedDate) {
                    setDepartDate(selectedDate);
                  }
                } else {
                  if (selectedDate) setDepartDate(selectedDate);
                }
                setShowDepartPicker(false);
              }}
            />
          )}

          {showReturnPicker && tripType === "round" && (
            <DateTimePicker
              value={returnDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                if (Platform.OS === "android") {
                  if ((event as any).type === "set" && selectedDate) {
                    setReturnDate(selectedDate);
                  }
                } else {
                  if (selectedDate) setReturnDate(selectedDate);
                }
                setShowReturnPicker(false);
              }}
            />
          )}

          {/* PASSENGERS + CLASS */}
          <View style={styles.row}>
            <TextInput
              style={styles.inputSmall}
              placeholder="Passagers"
              keyboardType="numeric"
              value={passengers}
              onChangeText={setPassengers}
            />

            <TouchableOpacity
              style={styles.inputSmall}
              onPress={() => {
                const next = (flightClasses.indexOf(flightClass) + 1) % flightClasses.length;
                setFlightClass(flightClasses[next]);
              }}
            >
              <Text style={styles.label}>Classe</Text>
              <Text style={styles.classValue}>{flightClass}</Text>
              <Ionicons name="chevron-down-outline" size={20} color="#555" style={styles.icon} />
            </TouchableOpacity>
          </View>

          {/* BUTTON */}
          <TouchableOpacity style={styles.searchBtn} onPress={onSearch}>
            <Text style={styles.searchBtnText}>Rechercher des vols</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="search" size={24} color="#4B2FB3" />
          <Text style={styles.tabTextActive}>Rechercher</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="book-outline" size={23} color="#777" />
          <Text style={styles.tabText}>Réservations</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="person-outline" size={23} color="#777" />
          <Text style={styles.tabText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4B2FB3",
    alignItems: "center",
    paddingVertical: 35,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginTop: -35,
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 22,
    elevation: 6,
  },
  switchRow: { flexDirection: "row", justifyContent: "center", marginBottom: 15 },
  switchBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#4B2FB3",
    marginHorizontal: 5,
  },
  switchBtnActive: { backgroundColor: "#4B2FB3" },
  switchText: { color: "#4B2FB3", fontWeight: "600" },
  switchTextActive: { color: "#fff" },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  inputSmall: {
    width: "48%",
    height: 55,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  label: { color: "#444" },
  dateText: { marginTop: 5, fontWeight: "600", color: "#4B2FB3" },
  classValue: { marginTop: 5, fontWeight: "600", color: "#4B2FB3" },
  icon: { position: "absolute", right: 10, top: 15 },
  searchBtn: {
    backgroundColor: "#4B2FB3",
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  searchBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  bottomBar: {
    height: 65,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  tab: { alignItems: "center" },
  tabText: { fontSize: 12, color: "#777" },
  tabTextActive: { fontSize: 12, color: "#4B2FB3", fontWeight: "bold" },
});
