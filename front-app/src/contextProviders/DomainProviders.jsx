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
