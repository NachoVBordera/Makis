import { supabase } from "../connection/supabase";
import { Tables } from "../models/db_types";

export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profile: profiles(user_name, avatar_url )")
    .order("created_at", {
      ascending: false,
    });
  if (error) {
    return [];
  } else {
    return data;
  }
};

export type Posts = Awaited<ReturnType<typeof fetchPosts>>;
export type Comment = Tables<"comments">;
export type Post = Tables<"posts"> & { comments: Comment[] };
