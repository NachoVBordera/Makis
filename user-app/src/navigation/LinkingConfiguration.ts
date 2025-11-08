/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { RootStackParamList } from "../types";
import { Dimensions } from "react-native";
import { Card } from "../components/Themed";

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
    screenInterpolator: ({ sceneProps }) => {
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

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: "one",
            },
          },
          Contacts: {
            screens: {
              TabTwoScreen: "two",
            },
          },
          Profile: {
            screens: {
              TabTwoScreen: "two",
            },
          },
        },
      },
      Modal: "modal",
      NotFound: "*",
    },
  },
};

export default linking;
