import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validate = () => {
    let valid = true;
    let newErrors = { email: "", password: "" };

    // EMAIL
    if (!email.trim()) {
      newErrors.email = "Veuillez saisir votre email.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Adresse email invalide.";
      valid = false;
    }

    // PASSWORD
    if (!password.trim()) {
      newErrors.password = "Veuillez saisir votre mot de passe.";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) navigation.navigate("Home");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/LOGO.png")}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>Bienvenue à FlyAir</Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Adresse e-mail"
            value={email}
            onChangeText={setEmail}
          />
          {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

          <TouchableOpacity style={styles.loginBtn} onPress={validate}>
            <Text style={styles.loginText}>Connexion</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.signup}>Pas de compte ? S’inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 260,
    backgroundColor: "#4B2FB3",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 90,
    height: 90,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  form: {
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
    marginLeft: 5,
  },
  loginBtn: {
    backgroundColor: "#4B2FB3",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 20,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  signup: {
    textAlign: "center",
    color: "#4B2FB3",
    fontWeight: "700",
    fontSize: 15,
  },
});