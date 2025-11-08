import { supabase } from "../connection/supabase";

export const fetchCommentsById = async (post_id: string) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", post_id);
  if (error) {
    console.log(error);
    return [];
  }
  return data;
};
export type Comment = Awaited<ReturnType<typeof fetchCommentsById>>;
export type Contact = Comment[number];
