import { supabase } from "../connection/supabase";

export const fetchContacts = async (user_id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_name, avatar_url, id")
    .neq("id", user_id);
  if (error) {
    console.log(error);
    return [];
  }
  return data;
};
export type Contacts = Awaited<ReturnType<typeof fetchContacts>>;
export type Contact = Contacts[number];
