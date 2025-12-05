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
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";

import { auth, db } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">;
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
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

  const validatePassword = (pwd: string): string => {
    const minLength = /.{8,}/;
    const uppercase = /[A-Z]/;
    const number = /\d/;
    const specialChar = /[@#$%^&*!]/;

    if (!minLength.test(pwd)) return "Minimum 8 caractères.";
    if (!uppercase.test(pwd)) return "Doit contenir au moins une majuscule.";
    if (!number.test(pwd)) return "Doit contenir au moins un chiffre.";
    if (!specialChar.test(pwd))
      return "Doit contenir un caractère spécial (@,#,$, etc.).";
    return "";
  };

  const handleRegister = async () => {
    let valid = true;
    let newErrors = { fullname: "", email: "", phone: "", password: "", confirm: "" };

    if (!fullname.trim()) { newErrors.fullname = "Veuillez entrer votre nom complet."; valid = false; }
    if (!email.trim()) { newErrors.email = "Veuillez entrer un email."; valid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { newErrors.email = "Adresse email invalide."; valid = false; }
    if (!phone.trim()) { newErrors.phone = "Veuillez entrer un numéro de téléphone."; valid = false; }
    else if (!/^\d{8}$/.test(phone)) { newErrors.phone = "Le numéro doit contenir 8 chiffres."; valid = false; }
    if (!password.trim()) { newErrors.password = "Veuillez entrer un mot de passe."; valid = false; }
    else { const pwdError = validatePassword(password); if (pwdError) { newErrors.password = pwdError; valid = false; } }
    if (confirmPass !== password) { newErrors.confirm = "Les mots de passe ne correspondent pas."; valid = false; }

    setErrors(newErrors);
    if (!valid) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullname,
        email,
        phone,
        createdAt: new Date(),
      });

      Alert.alert("Succès", "Compte créé avec succès !");
      navigation.navigate("Login");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") { setErrors({ ...newErrors, email: "Email déjà utilisé." }); return; }
      if (error.code === "auth/invalid-email") { setErrors({ ...newErrors, email: "Email invalide." }); return; }
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.header}>
          <Image source={require("../../assets/images/LOGO.png")} style={styles.logo} />
          <Text style={styles.headerTitle}>Créer un compte</Text>
        </View>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Nom complet" value={fullname} onChangeText={setFullname} />
          {errors.fullname ? <Text style={styles.error}>{errors.fullname}</Text> : null}

          <TextInput style={styles.input} placeholder="Adresse e-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
          {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

          <TextInput style={styles.input} placeholder="Téléphone" keyboardType="numeric" value={phone} onChangeText={setPhone} />
          {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}

          <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
          {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

          <TextInput style={styles.input} placeholder="Confirmer mot de passe" secureTextEntry value={confirmPass} onChangeText={setConfirmPass} />
          {errors.confirm ? <Text style={styles.error}>{errors.confirm}</Text> : null}

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
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
  header: { height: 230, backgroundColor: "#4B2FB3", borderBottomLeftRadius: 40, borderBottomRightRadius: 40, justifyContent: "center", alignItems: "center" },
  logo: { width: 90, height: 90 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 10 },
  form: { paddingHorizontal: 25, paddingTop: 30 },
  input: { borderWidth: 1, borderColor: "#ccc", height: 55, borderRadius: 12, paddingHorizontal: 12, marginBottom: 5 },
  error: { color: "red", marginBottom: 10, marginLeft: 5 },
  registerBtn: { backgroundColor: "#4B2FB3", paddingVertical: 15, borderRadius: 30, alignItems: "center", marginVertical: 20 },
  registerText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  login: { textAlign: "center", color: "#4B2FB3", fontWeight: "700", fontSize: 15 },
});
