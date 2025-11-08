import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserInfo {
  sessionId: string | null;
  name: string | null;
  userId?: string | null;
}

interface UserContextType extends UserInfo {
  setUserInfo: (info: UserInfo) => void;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  sessionId: null,
  name: null,
  userId: null,
  setUserInfo: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfoState] = useState<UserInfo>({
    sessionId: null,
    name: null,
    userId: null,
  });

  useEffect(() => {
    // Cargar datos guardados al iniciar la app
    loadStoredUserInfo();
  }, []);

  const loadStoredUserInfo = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem("userInfo");
      if (storedUserInfo) {
        setUserInfoState(JSON.parse(storedUserInfo));
      }
    } catch (e) {
      console.error("Error loading stored user info:", e);
    }
  };

  const setUserInfo = async (info: UserInfo) => {
    try {
      await AsyncStorage.setItem("userInfo", JSON.stringify(info));
      setUserInfoState(info);
    } catch (e) {
      console.error("Error saving user info:", e);
      setUserInfoState(info);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userInfo");
      setUserInfoState({
        sessionId: null,
        name: null,
        userId: null,
      });
    } catch (e) {
      console.error("Error during logout:", e);
    }
  };

  return (
    <UserContext.Provider value={{ ...userInfo, setUserInfo, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserInfo() {
  return useContext(UserContext);
}
