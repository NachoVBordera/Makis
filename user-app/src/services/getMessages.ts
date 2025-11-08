import { supabase } from "../connection/supabase";

export const fetchMessages = async (sessionId: string) => {
  const tableName = `messages_${sessionId}`; 
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.log("error", error.message);
    return [];
  } else {
    return data;
  }
};

export type Messages = Awaited<ReturnType<typeof fetchMessages>>;
export type Message = Messages[number];
