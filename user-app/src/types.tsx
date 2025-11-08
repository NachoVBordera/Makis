// Tipos mínimos para chat
export type ChatMessage = {
  id: number;
  content: string;
  created_at: string;
  sender_id: string;
  receiver_id: string;
};

export type ChatUser = {
  id: string;
  user_name: string | null;
};
