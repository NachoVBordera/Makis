import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import { TextInput, View } from "./Themed";

import type {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";
import { isLoaded, isLoading } from "expo-font";
import { Loader } from "./Loader";

interface AuthFormProps {
  onSignUp: (credentials: SignUpWithPasswordCredentials) => void;
  onLogin: (credentials: SignInWithPasswordCredentials) => void;
  loading: boolean;
}

export default function AuthForm({
  onSignUp,
  onLogin,
  loading,
}: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "signUp">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (mode === "login") {
      onLogin({ email, password });
    } else {
      onSignUp({
        email,
        password,

        options: { data: { username } },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <Loader isLoading={loading} />}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.title}>
              <Image
                style={styles.logo}
                source={require("../assets/images/icon.png")}
              />
              Tuenti
            </Text>
            <View style={styles.inputsContainer}>
              {mode === "signUp" && (
                <View style={styles.input}>
                  <TextInput
                    placeholder="Nombre de usuario"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>
              )}
              <View style={styles.input}>
                <TextInput
                  placeholder="Correo"
                  placeholderTextColor={"#000"}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.input}>
                <TextInput
                  placeholderTextColor={"#000"}
                  placeholder="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  autoCapitalize="none"
                />
              </View>
              <View>
                <Button
                  color={"#5889B4"}
                  title={mode === "login" ? "Iniciar sesión" : "Registrarse"}
                  onPress={handleSubmit}
                  disabled={loading || !email || !password}
                />
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={{ marginBottom: 8 }}>
                {mode === "login"
                  ? "¿No tienes una cuenta?"
                  : "¿Ya tienes una cuenta?"}
              </Text>
              <Button
                title={mode === "login" ? "Regístrate" : "Inicia sesión"}
                onPress={() => setMode(mode === "login" ? "signUp" : "login")}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  logo: {
    width: 130,
    height: 130,
    position: "absolute",
    top: 240,
    left: 20,
    zIndex: 1,
  },
  container: {
    minWidth: "90%",
    flex: 1,
  },
  inner: {
    padding: 16,
    position: "relative",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 65,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 2,
    marginTop: 10,
    color: "white",
    marginRight: 30,
    zIndex: 2,
  },
  input: {
    backgroundColor: "#C2C6D3",
    borderRadius: 3,
  },
  footer: {
    paddingTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 8,
    color: "#C2C6D3",
  },
  inputsContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    gap: 16,
    zIndex: -2,
  },
  buttonLogin: {},
});
