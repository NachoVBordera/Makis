import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  Button as DefaultButton,
} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];
export type ButtonProps = ThemeProps & DefaultButton["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  return <DefaultText {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  return <DefaultView style={style} {...otherProps} />;
}

export function Card(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  return <DefaultView style={[{}, style]} {...otherProps} />;
}

export function Button(props: DefaultButton["props"]) {
  return <DefaultButton {...props} />;
}

export function TextInput(props: DefaultTextInput["props"]) {
  const { style, ...otherProps } = props;
  return (
    <DefaultTextInput
      style={[{ fontSize: 16, padding: 8 }, style]}
      {...props}
    />
  );
}
