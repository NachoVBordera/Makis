import { supabase } from "../connection/supabase";

export const fetchLikes = async (post_id: string) => {
  const { data, error } = await supabase
    .from("post_likes")
    .select("user_id, id")
    .eq("post_id", post_id);
  if (error) {
    console.log(error);

    return [];
  } else {
    return data;
  }
};

export type Likes = Awaited<ReturnType<typeof fetchLikes>>;
export type Like = Likes[number];
