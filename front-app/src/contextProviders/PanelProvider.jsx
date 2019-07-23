import React, { useState } from "react";
import PanelContext from "Contexts/PanelContext";
import PropTypes from "prop-types";

const PanelProvider = ({ children }) => {
  const [panelState, togglePanelState] = useState({
    collapsed: true,
    selectedTab: null,
    openPanel: () => {
      togglePanelState(prevState => {
        return {
          ...prevState,
          collapsed: false,
        };
      });
    },
    closePanel: () => {
      togglePanelState(prevState => {
        return {
          ...prevState,
          collapsed: true,
        };
      });
    },
    selectTab: tab => {
      togglePanelState(prevState => {
        return {
          ...prevState,
          selectedTab: tab,
        };
      });
    },
  });
  return (
    <PanelContext.Provider value={panelState}>{children}</PanelContext.Provider>
  );
};

PanelProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default PanelProvider;
