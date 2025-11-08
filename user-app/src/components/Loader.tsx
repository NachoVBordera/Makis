import { StyleSheet, View, ActivityIndicator, Text } from "react-native";

interface Props {
  isLoading: boolean;
  withText?: boolean;
  size?: "small" | "large";
}

export const Loader = ({
  isLoading = false,
  withText = false,
  size = "large",
}: Props) => {
  return isLoading ? (
    <View style={styles.loader}>
      <ActivityIndicator size={size} color="#aaaaaa" />
      {withText ? <Text style={{ color: "green" }}>Loading</Text> : null}
    </View>
  ) : null;
};
const styles = StyleSheet.create({
  loader: {
    marginVertical: 15,
    alignItems: "center",
  },
});
