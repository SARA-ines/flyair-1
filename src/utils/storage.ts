// src/utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "FLYAIR_RESERVATIONS";

export async function saveReservation(reservation: any) {
  const existing = await AsyncStorage.getItem(KEY);
  const data = existing ? JSON.parse(existing) : [];
  data.push(reservation);
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}

export async function getReservations() {
  const existing = await AsyncStorage.getItem(KEY);
  return existing ? JSON.parse(existing) : [];
}

export async function clearReservations() {
  await AsyncStorage.removeItem(KEY);
}
