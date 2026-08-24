import tinycolor from "tinycolor2";

export const generateTheme = ({
  mode = "light",
  primary_color = "#0070ff",
  secondary_color = "#71c0ff",
  typography = "#000000", // treated as text color
}) => {
  const isDark = mode === "dark";
  const primary = tinycolor(primary_color);
  const secondary = tinycolor(secondary_color);
  const textColor = tinycolor(typography);

  return {
    token: {
      colorPrimary: primary.toRgbString(),      // e.g., "rgb(0, 112, 255)"
      colorSecondary: secondary.toRgbString(),
      colorText: isDark ? "white" : "black",

      borderRadius: 2,
      fontFamily: "Inter, sans-serif",

      colorBgContainer: isDark ? "rgb(52, 52, 52)" : "rgb(255, 255, 255)",
      colorBgElevated: isDark ? "rgb(31, 31, 31)" : "rgb(240, 242, 245)",
      colorBorder: primary,
      colorBorderSecondary: isDark ? "rgb(0, 0, 0)" : "rgb(235, 235, 235)",
    },
    components: {
      Input: {
        colorPrimary: primary.lighten(15).toRgbString(),
      },
      Button: {
        colorPrimaryHover: primary.darken(5).toRgbString(),
        colorPrimaryActive: primary.darken(10).toRgbString(),
      },
      Select: {
        colorPrimary: secondary.toRgbString(),
      },
    },
  };
};
