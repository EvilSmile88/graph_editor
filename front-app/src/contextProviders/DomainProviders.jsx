import React, { useState } from "react";
import DomainContext from "Contexts/DomainContext";
import PropTypes from "prop-types";

const DomainProvider = ({ children }) => {
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
      if (group && group.color) {
        document.documentElement.style.setProperty(
          "--MAIN_THEME_COLOR",
          group.color,
        );
      } else {
        const defaultThemeColor = getComputedStyle(
          document.documentElement,
        ).getPropertyValue("--DEFAULT_MAIN_THEME_COLOR");
        document.documentElement.style.setProperty(
          "--MAIN_THEME_COLOR",
          defaultThemeColor,
        );
      }
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
