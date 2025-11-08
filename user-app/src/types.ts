// RootStackParamList for navigation types
export type RootStackParamList = {
  Root: undefined;
  Chat: { contactId?: string; username?: string } | undefined;
};

export type RootTabParamList = {
  Contacts: undefined;
};
