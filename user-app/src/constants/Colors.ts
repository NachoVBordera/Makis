const primary = "#456D93";
const headerLigth = "#363838";
const headerDark = "#e4ebeb";

const tintColorLight = primary;
const tintColorDark = primary;
const tintColorHeaderLight = headerLigth;
const tintColorHeaderDark = headerDark;

export default {
  light: {
    text: "#111827",
    background: "#456D93",
    card: "#fff",
    tint: tintColorHeaderLight,
    tabIconDefault: "#e5e7eb",
    tabIconSelected: tintColorLight,
    primary,
  },
  dark: {
    text: "#fff",
    background: "#456D93",
    card: "#374151",
    tint: tintColorHeaderDark,
    tabIconDefault: "#e5e7eb",
    tabIconSelected: tintColorDark,
    primary,
  },
};
