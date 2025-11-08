import { supabase } from "../connection/supabase";

export const getAvatarUrl = async (
  contactId: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", contactId);
  if (error) {
    console.error("error", error.message);
    return null;
  } else {
    return data![0].avatar_url;
  }
};
