import { Image } from "react-native";
import { View } from "./Themed";

interface AvatarProps {
  uri?: string | null | undefined;
  size?: number;
}

export default function Avatar({ uri, size = 32 }: AvatarProps) {
  const styles = { height: size, width: size };
  if (uri) return <Image source={{ uri }} style={styles} />;
  return (
    <Image
      source={require("../assets/images/defaultUserImage.png")}
      style={styles}
    />
  );
}
