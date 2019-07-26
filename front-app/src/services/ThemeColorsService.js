import colorUtil from "Utils/colorUtil";

class ThemeColorsService {
  constructor() {
    this.defaultThemeColor = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--MESH_DEFAULT_MAIN_THEME_COLOR");

    this.defaultThemeTextColor = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--MESH_MAIN_PANEL_TEXT_COLOR");

    this.bgColor = getComputedStyle(document.documentElement).getPropertyValue(
      "--MESH_MAIN_BACKGROUND_COLOR",
    );
  }

  updateTextThemeColor(color) {
    const brightness = colorUtil.brightnessByColor(color);
    if (brightness > 200) {
      document.documentElement.style.setProperty(
        "--MESH_MAIN_THEME_TEXT_COLOR",
        this.bgColor,
      );
    } else {
      document.documentElement.style.setProperty(
        "--MESH_MAIN_THEME_TEXT_COLOR",
        this.defaultThemeTextColor,
      );
    }
  }

  updateThemeColors(color) {
    if (color) {
      document.documentElement.style.setProperty(
        "--MESH_MAIN_THEME_COLOR",
        color,
      );
      this.updateTextThemeColor(color);
    } else {
      this.resetThemeColors();
    }
  }

  resetThemeColors() {
    document.documentElement.style.setProperty(
      "--MESH_MAIN_THEME_COLOR",
      this.defaultThemeColor,
    );
    this.updateTextThemeColor(this.defaultThemeColor);
  }
}

export default ThemeColorsService;
