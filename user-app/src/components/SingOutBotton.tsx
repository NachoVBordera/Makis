import { StyleSheet } from "react-native";
import { Button, View } from "./Themed";

interface SignOutButtonProps {
  onLogout: () => void;
  label: string;
}

export const SignOutButton = ({ onLogout, label }: SignOutButtonProps) => {
  return (
    <View style={styles.input}>
      <Button title={label} onPress={onLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 16,
    flex: 1,
  },
  input: {
    paddingVertical: 8,
  },
  avatarbutton: {
    marginBottom: 20,
    alignItems: "center",
  },
});
