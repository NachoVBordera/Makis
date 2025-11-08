/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import {
  ColorSchemeName,
  Dimensions,
  Image,
  ImageBase,
  Pressable,
  Text,
} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import AuthScreen from "../screens/AuthScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { useUserInfo } from "../context/userContext";
import ContactsScreen from "../screens/ContactsScreen";
import ChatSreen from "../screens/ChatScreen";
const { width, height } = Dimensions.get("window");

export const fromtopToBottom = (
  index: number,
  position: any,
  width: number
) => {
  const inputRange = [index - 1, index, index + 1];
  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
  });

  const translateY = position.interpolate({
    inputRange,
    outputRange: [width, 0, 0],
  });

  return {
    opacity,
    transform: [{ translateY }],
  };
};

const transitionsConfig = {
  return: {
    screenInterpolator: ({ sceneProps }: any) => {
      const { initWidth, position, scene } = sceneProps;
      const { index, route } = scene;
      const params = route.params || {};
      const transition = params.transition || "default";
      return {
        default: null,
        fromtopToBottom: fromtopToBottom(index, position, width),
      }[transition];
    },
  },
};

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...Colors.dark,
  },
};

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors.light,
  },
};

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={darkTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { session } = useUserInfo();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={session ? BottomTabNavigator : AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatSreen}
        options={({ route }) => ({ title: "MAKIS" })}
      />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const { profile } = useUserInfo();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#144482",
        tabBarInactiveTintColor: "#fff",
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: "#5988B4",
          borderTopColor: "#5988B4",
          borderTopWidth: 1,
        },
      }}
    >
      <BottomTab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          title: () => {},
          headerTitle: () => (
            <Pressable onPress={() => navigation.navigate("Home")}>
              <Text
                style={{ color: "white", fontSize: 40, fontWeight: "bold" }}
              >
                tuenti
              </Text>
            </Pressable>
          ),
          headerBackground: () => {
            "#5988B4";
          },

          tabBarIcon: ({ color }) => (
            <TabBarIcon name="comment-o" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
