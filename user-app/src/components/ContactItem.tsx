import React from "react";

import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Avatar from "./Avatar";
import { downloadAvatar } from "../services/getAvatar";
import { Contact } from "../services/getContacts";
interface Props {
  contact: Contact;
  onPressItem: () => void;
}

const ContactItem = ({ contact, onPressItem }: Props) => {
  const [avatartUrl, setAvatarUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!contact) return;
    downloadAvatar(contact.avatar_url!).then(setAvatarUrl);
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={onPressItem}>
      <Avatar uri={avatartUrl} size={45}></Avatar>
      <Text style={styles.title}>{contact.user_name}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    minWidth: "90%",
    justifyContent: "flex-start",
    borderColor: "black",
    borderWidth: 2,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 23,
    alignItems: "center",
  },
});
export default ContactItem;
