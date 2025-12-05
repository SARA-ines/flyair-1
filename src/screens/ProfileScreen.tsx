import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) { setLoading(false); return; }

      try {
        const ref = doc(db, "users", user.uid);
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) setUserData(snapshot.data());
      } catch (error: any) {
        console.log("Erreur Firestore:", error.message);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4B2FB3" />
      </View>
    );

  if (!userData)
    return (
      <View style={styles.center}>
        <Text>Aucune donnée utilisateur trouvée.</Text>
      </View>
    );

  return (
    <View style={styles.container}>

      {/* --- Profil Header --- */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Image
            source={require("../../assets/images/profile.png")}
            style={styles.avatar}
          />
        </View>

        <View>
          <Text style={styles.profileName}>{userData.fullname}</Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>
        </View>
      </View>

      {/* --- Section Détails personnels --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Détails Personnels</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Nom</Text>
          <Text style={styles.value}>{userData.fullname}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Text style={styles.label}>Téléphone</Text>
          <Text style={styles.value}>{userData.phone || "Non renseigné"}</Text>
        </View>
      </View>

      {/* --- Actions du compte --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions du Compte</Text>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => navigation.navigate("Register" as never)}
        >
          <Text style={styles.actionText}>Modifier le profil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => navigation.navigate("Register" as never)}
        >
          <Text style={styles.actionText}>Modifier le mot de passe</Text>
        </TouchableOpacity>
      </View>

      {/* --- Barre du bas --- */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="search" size={26} color="#4B2FB3" />
          <Text style={styles.tabTextActive}>Rechercher</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="book-outline" size={26} color="#777" />
          <Text style={styles.tabText}>Réservations</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Ionicons name="person-outline" size={26} color="#777" />
          <Text style={styles.tabText}>Profil</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}


/* =======================
   STYLES MODERNES
======================= */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f1ebfa",
    padding: 22,
    paddingTop: 45
  },

  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },

  /* --- HEADER PROFIL --- */
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 22,          // 🔥 Taille augmentée
    borderRadius: 22,     // 🔥 Plus arrondi
    marginBottom: 18,     // 🔥 Plus d’espace
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3
  },

  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E6E2F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18
  },

  avatar: { width: 50, height: 50, tintColor: "#4B2FB3" },

  profileName: { fontSize: 20, fontWeight: "bold", color: "#222" },
  profileEmail: { fontSize: 14, color: "#666", marginTop: 2 },

  /* --- SECTIONS --- */
  section: {
    backgroundColor: "#FFFFFF",
    padding: 22,            // 🔥 Taille augmentée
    marginTop: 16,
    borderRadius: 22,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 14,
    color: "#4B2FB3"
  },

  row: {
    paddingVertical: 4
  },

  separator: {
    height: 1.4,       // 🔥 Trait plus visible
    backgroundColor: "#d0d0d0",
    marginVertical: 10,
    borderRadius: 20
  },

  label: { fontSize: 14, color: "#777" },
  value: { fontSize: 16, fontWeight: "600", color: "#222" },

  /* --- ACTIONS --- */
  actionRow: {
    paddingVertical: 14,
    borderBottomWidth: 1.4,
    borderColor: "#d0d0d0"
  },

  actionText: { 
    fontSize: 16, 
    fontWeight: "600",
    color: "#4B2FB3"
  },

  /* --- BOTTOM BAR --- */
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1.5,
    borderColor: "#ccc",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },

  tab: {
    alignItems: "center",
  },

  tabText: {
    fontSize: 13,
    color: "#888",
    marginTop: 2
  },

  tabTextActive: {
    fontSize: 13,
    color: "#4B2FB3",
    fontWeight: "bold",
    marginTop: 2
  }
});

