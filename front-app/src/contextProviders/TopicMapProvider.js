import React, { useState } from "react";
import TopicMapContext from "Contexts/TopicMapContext";
import PropTypes from "prop-types";

const TopicMapProvider = ({ children }) => {
  const [mapState, toggleMapState] = useState({
    opened: false,
    openMap: () => {
      toggleMapState(prevState => {
        return {
          ...prevState,
          opened: true,
        };
      });
    },
    closeMap: () => {
      toggleMapState(prevState => {
        return {
          ...prevState,
          opened: false,
        };
      });
    },
  });
  return (
    <TopicMapContext.Provider value={mapState}>
      {children}
    </TopicMapContext.Provider>
  );
};

TopicMapProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default TopicMapProvider;
