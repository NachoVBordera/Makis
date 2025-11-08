import { Alert, StyleSheet, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { Messages, fetchMessages, Message } from "../services/getMessages";
import React from "react";
import { useUserInfo } from "../context/userContext";
import { supabase } from "../connection/supabase";

type ChatScreenProps = {
  route: { params: { contactId: string } };
  schema_name?: string;
};

export default function ChatScreen({ route, schema_name }: ChatScreenProps) {
  const { contactId } = route.params;
  const [messages, setMessages] = React.useState<Messages>([]);
  const { userId, name, sessionId } = useUserInfo();

  React.useEffect(() => {
    if (!userId || !sessionId) return;
    fetchMessages(sessionId).then((msgs) => setMessages(msgs || []));

    // Supabase JS v2+ realtime event
    const channel = supabase.channel("messages");
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: sessionId,
        table: "messages",
      },
      (payload: { new: Message }) => {
        const newMessage = payload.new;
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
      }
    );
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, sessionId, contactId]);

  const onSend = React.useCallback(async (messages = []) => {
    const [message] = messages;
    const { text } = message;
    console.log(userId);

    if (!userId) {
      Alert.alert("Erro", "Non se atopou o usuario. Volve a iniciar sesión.");
      return;
    }
    let error, data;
    try {
      const tableName = `messages_${sessionId}`;
      const result = await supabase
        .from(tableName)
        .insert({
          user_id: userId,
          content: text,
        })
        .select("*");
      error = result.error;
      data = result.data;
      console.log("Supabase insert result:", result);
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : JSON.stringify(e);
      Alert.alert("Erro do servidor", errMsg);
      return;
    }
    if (error) {
      Alert.alert("Server Error", error.message);
    } else if (data && data[0]) {
      setMessages((prevMessages) => [data[0], ...prevMessages]);
    }
  }, []);

  return (
    <GiftedChat
      messages={messages.map((message) => ({
        _id: message.id,
        text: message.content,
        createdAt: new Date(message.created_at),
        user: {
          _id: message.user_id,
          name: message.user_id === userId ? name || "Ti" : "Contacto",
        },
      }))}
      onSend={(messages: any) => onSend(messages)}
      user={{
        _id: userId || "",
        name: name || "Ti",
      }}
      messagesContainerStyle={{ backgroundColor: "#5988B4" }}
      renderAvatarOnTop={false}
      renderUsernameOnMessage={true}
    />
  );
}

const styles = StyleSheet.create({});
