// src/services/flightService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { flights as staticFlights } from "../data/flights";

export type Flight = {
  id: string;
  from: string;
  to: string;
  time: string;
  price: number;
  company: string;
  class?: string[];
};

const FLIGHTS_KEY = "FLYAIR_FLIGHTS";
const LAST_UPDATE_KEY = "FLYAIR_LAST_UPDATE";

const companies = ["Air Algérie", "Qatar Airways", "Turkish Airlines", "Emirates"];
const fromCities = ["Alger", "Oran", "Constantine"];
const toCities = ["Paris", "Istanbul", "Doha", "Dubai", "Lyon", "Nice"];
const hours = ["06:00", "08:30", "11:00", "14:00", "16:30", "19:00"];

function rand<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomFlight(i: number): Flight {
  return {
    id: `R${Date.now()}-${i}`,
    from: rand(fromCities),
    to: rand(toCities),
    time: rand(hours),
    price: Math.floor(10000 + Math.random() * 40000),
    company: rand(companies),
    class: ["Économique", "Affaires"],
  };
}

export async function initializeFlights(): Promise<Flight[]> {
  try {
    const stored = await AsyncStorage.getItem(FLIGHTS_KEY);
    if (!stored) {
      // Save static initial flights (convert price to number if needed)
      const initial = staticFlights.map((f) => ({
        id: f.id,
        from: f.from,
        to: f.to,
        time: f.time,
        price: typeof f.price === "number" ? f.price : Number(String(f.price).replace(/\s|DA/g, "")),
        company: f.company,
        class: f.class,
      }));
      await AsyncStorage.setItem(FLIGHTS_KEY, JSON.stringify(initial));
      await AsyncStorage.setItem(LAST_UPDATE_KEY, new Date().toISOString());
      return initial;
    }
    return JSON.parse(stored);
  } catch (err) {
    console.warn("initializeFlights error", err);
    return staticFlights as any;
  }
}

export async function getFlights(): Promise<Flight[]> {
  try {
    const stored = await AsyncStorage.getItem(FLIGHTS_KEY);
    if (!stored) return initializeFlights();
    return JSON.parse(stored);
  } catch (err) {
    console.warn("getFlights error", err);
    return [];
  }
}

/**
 * refreshFlights: génère `count` nouveaux vols, les ajoute au cache,
 * met à jour lastUpdate et renvoie { addedCount, lastUpdateISO, updatedFlights }.
 */
export async function refreshFlights(count = 5) {
  try {
    const previous = await getFlights();
    const newFlights: Flight[] = Array.from({ length: count }, (_, i) => generateRandomFlight(i));
    const updated = [...newFlights, ...previous]; // nouveaux en tête
    await AsyncStorage.setItem(FLIGHTS_KEY, JSON.stringify(updated));
    const now = new Date().toISOString();
    await AsyncStorage.setItem(LAST_UPDATE_KEY, now);
    return { addedCount: newFlights.length, lastUpdateISO: now, flights: updated };
  } catch (err) {
    console.warn("refreshFlights error", err);
    return { addedCount: 0, lastUpdateISO: new Date().toISOString(), flights: await getFlights() };
  }
}

export async function getLastUpdateISO(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_UPDATE_KEY);
  } catch {
    return null;
  }
}

/**
 * startAutoRefresh: lance un interval qui appelle refreshFlights(count) toutes les intervalMs.
 * Retourne une fonction stop() pour arrêter l'interval.
 */
export function startAutoRefresh(intervalMs = 5 * 60 * 1000, count = 3) {
  let stopped = false;
  const id = setInterval(async () => {
    if (stopped) return;
    try {
      await refreshFlights(count);
      console.log("FlightService: auto refresh performed");
    } catch (e) {
      console.warn("FlightService auto refresh error", e);
    }
  }, intervalMs);

  return () => {
    stopped = true;
    clearInterval(id);
  };
}
