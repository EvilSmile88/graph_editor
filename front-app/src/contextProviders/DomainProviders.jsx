import React, { useState } from "react";
import DomainContext from "Contexts/DomainContext";
import colorUtil from "Utils/colorUtil";
import PropTypes from "prop-types";

const DomainProvider = ({ children }) => {
  const defaultThemeColor = getComputedStyle(
    document.documentElement,
  ).getPropertyValue("--MESH_DEFAULT_MAIN_THEME_COLOR");

  const defaultThemeTextColor = getComputedStyle(
    document.documentElement,
  ).getPropertyValue("--MESH_MAIN_PANEL_TEXT_COLOR");

  const bgColorColor = getComputedStyle(
    document.documentElement,
  ).getPropertyValue("--MESH_MAIN_BACKGROUND_COLOR");

  function updateTextThemeColor(color) {
    if (colorUtil.brightnessByColor(color) <= 50) {
      document.documentElement.style.setProperty(
        "--MESH_MAIN_THEME_TEXT_COLOR",
        bgColorColor,
      );
    } else {
      document.documentElement.style.setProperty(
        "--MESH_MAIN_THEME_TEXT_COLOR",
        defaultThemeTextColor,
      );
    }
  }

  function updateThemeColors(group) {
    if (group && group.color) {
      document.documentElement.style.setProperty(
        "--MESH_MAIN_THEME_COLOR",
        group.color,
      );
      updateTextThemeColor(group.color);
    } else {
      document.documentElement.style.setProperty(
        "--MESH_MAIN_THEME_COLOR",
        defaultThemeColor,
      );
      updateTextThemeColor(defaultThemeColor);
    }
  }

  const [domainState, toggleDomainState] = useState({
    loading: true,
    error: null,
    domains: [],
    selectedDomainGroup: null,
    loadDomains: () => {
      toggleDomainState(prevState => {
        return {
          ...prevState,
          loading: true,
          domains: [],
          error: null,
        };
      });
    },
    loadDomainsSuccess: domains => {
      toggleDomainState(prevState => {
        return {
          ...prevState,
          loading: false,
          domains,
        };
      });
    },
    loadDomainsFail: error => {
      toggleDomainState(prevState => {
        return {
          ...prevState,
          loading: false,
          error,
        };
      });
    },
    selectDomainGroup: group => {
      updateThemeColors(group);
      toggleDomainState(prevState => {
        return {
          ...prevState,
          selectedDomainGroup: group,
        };
      });
    },
  });
  return (
    <DomainContext.Provider value={domainState}>
      {children}
    </DomainContext.Provider>
  );
};

DomainProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default DomainProvider;
