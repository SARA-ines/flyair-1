import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";

export default function StartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/avion_bg.jpg")} 
        style={styles.background}
      >
        <View style={styles.overlay} />

        {/* LOGO AU MILIEU */}
        <View style={styles.centerContent}>
          <Image
           
            style={styles.logo}
          />
        </View>

        {/* BOUTON EN BAS */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SearchFlight")}
        >
          <Text style={styles.buttonText}>Commencer</Text>
        </TouchableOpacity>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  centerContent: {
    position: "absolute",
    top: "35%",      
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "#4B2FB3",
    paddingVertical: 16,
    borderRadius: 30,
    width: "85%",
    alignSelf: "center",
    marginBottom: 60,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#d9dde3ff",
  },
});