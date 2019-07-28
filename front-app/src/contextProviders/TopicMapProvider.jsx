import React, { useState } from "react";
import TopicMapContext from "Contexts/TopicMapContext";
import PropTypes from "prop-types";

const TopicMapProvider = ({ children }) => {
  const [mapState, toggleMapState] = useState({
    opened: false,
    loading: false,
    map: null,
    error: null,
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
    getMap: () => {
      toggleMapState(prevState => {
        return {
          ...prevState,
          map: null,
          error: null,
          loading: true,
        };
      });
    },
    getMapSuccess: map => {
      toggleMapState(prevState => {
        return {
          ...prevState,
          loading: false,
          map,
        };
      });
    },
    getMapFail: error => {
      toggleMapState(prevState => {
        return {
          ...prevState,
          loading: false,
          error,
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
