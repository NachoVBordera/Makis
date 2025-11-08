import React, { useState, useContext } from "react";
import { Alert, StyleSheet, View, TextInput, Button, Text } from "react-native";
import { supabase } from "../connection/supabase";
import { UserContext } from "../context/userContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function AuthScreen() {
  const [name, setName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const navigation = useNavigation<
    NativeStackNavigationProp<RootStackParamList>
  >();

  const handleLogin = async () => {
    if (!sessionId || !name) {
      Alert.alert("Faltan datos", "Introduce o ID da sesión e o teu nome");
      return;
    }
    setLoading(true);

    const { data, error } = await supabase
      .from("instances")
      .select("schema_name")
      .eq("name", sessionId)
      .single();

    if (error || !data) {
      Alert.alert("Erro", "ID da sesión non válido ou non existe");
      setLoading(false);
      return;
    }
    const schemaName = data.schema_name;
    // Buscar o crear el usuario en la tabla users del schema de la instancia
    let userId = null;
    const usersTable = `users_${schemaName}`;
    // Intentar obtener el usuario
    let { data: userData, error: userError } = await supabase
      .from(usersTable)
      .select("id")
      .eq("username", name)
      .single();

    if (userError && userError.code === "PGRST116") {
      // No existe, crearlo
      const { data: insertData, error: insertError } = await supabase
        .from(usersTable)
        .insert([{ username: name }])
        .select("id")
        .single();

      if (insertError || !insertData) {
        Alert.alert(
          "Erro",
          `Non se puido crear o usuario: ${insertError?.message}`
        );
        setLoading(false);
        return;
      }
      userId = insertData.id;
    } else if (userData) {
      userId = userData.id;
    } else {
      Alert.alert(
        "Erro",
        `Non se puido obter ou crear o usuario: ${userError?.message}`
      );
      setLoading(false);
      return;
    }
    // Guardar en el contexto el nombre, el schema y el user_id
    setUserInfo({ sessionId: schemaName, name, userId });
    setLoading(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Chat", params: { contactId: "", username: name } }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="O teu nome"
        autoCapitalize="none"
      />
      <Text style={styles.label}>ID de sesión</Text>
      <TextInput
        style={styles.input}
        value={sessionId}
        onChangeText={setSessionId}
        placeholder="ID da sesión"
        autoCapitalize="none"
      />
      <Button
        title={loading ? "Cargando..." : "Entrar"}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});
