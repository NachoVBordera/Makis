import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useUserInfo } from "../context/userContext";
import ContactItem from "../components/ContactItem";
import { RootTabScreenProps } from "../types";
import { Contact, Contacts, fetchContacts } from "../services/getContacts";
import { Card } from "../components/Themed";

const ContactsScreen = ({ navigation }: RootTabScreenProps<"Contacts">) => {
  const [contacts, setContacts] = React.useState<Contacts>([]);
  const { profile } = useUserInfo();

  React.useEffect(() => {
    if (!profile) return;
    fetchContacts(profile.id).then(setContacts);
  }, []);

  const handleContactOnPress = (contact: Contact) => {
    navigation.navigate("Chat", {
      contactId: contact.id,
      username: contact.user_name!,
    });
  };
  return (
    <FlatList
      data={contacts}
      contentContainerStyle={styles.container}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ContactItem
          contact={item}
          onPressItem={() => handleContactOnPress(item)}
        />
      )}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    alignItems: "center",
    gap: 10,
  },
});
export default ContactsScreen;
