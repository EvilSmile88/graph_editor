import React, { useState } from "react";
import DomainContext from "Contexts/DomainContext";
import PropTypes from "prop-types";
import ThemeColorsService from "Services/ThemeColorsService";

const DomainProvider = ({ children }) => {
  const colorService = new ThemeColorsService();
  const [domainState, toggleDomainState] = useState({
    loading: true,
    updating: false,
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
      if (group) {
        colorService.updateThemeColors(group.color);
      } else {
        colorService.resetThemeColors();
      }
      toggleDomainState(prevState => {
        return {
          ...prevState,
          selectedDomainGroup: group,
        };
      });
    },
    addGroup: () => {
      toggleDomainState(prevState => {
        return {
          ...prevState,
          updating: true,
          error: null,
        };
      });
    },
    addGroupSuccess: updatedDomain => {
      toggleDomainState(prevState => {
        const domains = prevState.domains.map(domain => {
          if (domain.id === updatedDomain.id) {
            return updatedDomain;
          }
          return domain;
        });
        return {
          ...prevState,
          domains,
          updating: false,
        };
      });
    },
    addGroupFail: error => {
      toggleDomainState(prevState => {
        return {
          ...prevState,
          updating: false,
          error,
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
