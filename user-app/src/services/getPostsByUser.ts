import { supabase } from "../connection/supabase";

export const fetchPostsByUser = async (userID: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profile: profiles(user_name, avatar_url )")
    .eq("user_id", userID)
    .order("created_at", {
      ascending: false,
    });
  if (error) {
    return [];
  } else {
    return data;
  }
};

export type Posts = Awaited<ReturnType<typeof fetchPostsByUser>>;
export type Post = Posts[number];
