import { supabase } from "../connection/supabase";

export const insertComment = async (
  comment: string,
  user_id: string,
  post_id: string,
  user_name: string
) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          comment: comment,
          user_id: user_id,
          post_id: post_id,
          user_name: user_name,
        },
      ])
      .select();

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
