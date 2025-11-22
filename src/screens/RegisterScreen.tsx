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

export default function RegisterScreen({ navigation }) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const validate = () => {
    let valid = true;
    let e = { fullname: "", email: "", phone: "", password: "", confirm: "" };

    // NAME
    if (!fullname.trim()) {
      e.fullname = "Veuillez entrer votre nom complet.";
      valid = false;
    }

    // EMAIL
    if (!email.trim()) {
      e.email = "Veuillez entrer un email.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      e.email = "Adresse email invalide.";
      valid = false;
    }

    // PHONE
    if (!phone.trim()) {
      e.phone = "Veuillez entrer un numéro de téléphone.";
      valid = false;
    } else if (!/^\d{8}$/.test(phone)) {
      e.phone = "Le numéro doit contenir 8 chiffres.";
      valid = false;
    }

    // PASSWORD
    if (!password.trim()) {
      e.password = "Veuillez entrer un mot de passe.";
      valid = false;
    }

    // CONFIRM PASSWORD
    if (confirmPass !== password) {
      e.confirm = "Les mots de passe ne correspondent pas.";
      valid = false;
    }

    setErrors(e);

    if (valid) navigation.navigate("Login");
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
          <Text style={styles.headerTitle}>Créer un compte</Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          {/* NAME */}
          <TextInput
            style={styles.input}
            placeholder="Nom complet"
            value={fullname}
            onChangeText={setFullname}
          />
          {errors.fullname ? <Text style={styles.error}>{errors.fullname}</Text> : null}

          {/* EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="Adresse e-mail"
            value={email}
            onChangeText={setEmail}
          />
          {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

          {/* PHONE */}
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            keyboardType="numeric"
            value={phone}
            onChangeText={setPhone}
          />
          {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}

          {/* PASSWORD */}
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

          {/* CONFIRM PASSWORD */}
          <TextInput
            style={styles.input}
            placeholder="Confirmer mot de passe"
            secureTextEntry={true}
            value={confirmPass}
            onChangeText={setConfirmPass}
          />
          {errors.confirm ? <Text style={styles.error}>{errors.confirm}</Text> : null}
<TouchableOpacity style={styles.registerBtn} onPress={validate}>
            <Text style={styles.registerText}>Créer un compte</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.login}>Déjà un compte ? Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 230,
    backgroundColor: "#4B2FB3",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 90, height: 90 },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  form: { paddingHorizontal: 25, paddingTop: 30 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 5,
  },
  error: { color: "red", marginBottom: 10, marginLeft: 5 },
  registerBtn: {
    backgroundColor: "#4B2FB3",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 20,
  },
  registerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  login: {
    textAlign: "center",
    color: "#4B2FB3",
    fontWeight: "700",
    fontSize: 15,
  },
});
