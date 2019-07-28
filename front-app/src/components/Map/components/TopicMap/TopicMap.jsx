import React, { useContext, useEffect } from "react";
import TopicMapContext from "Contexts/TopicMapContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import Button from "Components/controls/Button/Button";
import ApiService from "Services/ApiService";
import API_ENDPOINTS from "Constants/api";
import ERROR_MESSAGES from "Constants/errorMessages";

import style from "./TopicMap.scss";
import Diagram from "../Diagram/Diagram";

const TopicMap = () => {
  const { loading, error, map, getMap, getMapFail, getMapSuccess } = useContext(
    TopicMapContext,
  );

  function loadMapData() {
    getMap();
    ApiService.get(API_ENDPOINTS.MAP)
      .then(res => {
        getMapSuccess(res.data);
      })
      .catch(() => {
        getMapFail(ERROR_MESSAGES.internalError);
      });
  }

  useEffect(() => {
    loadMapData();
  }, []);

  return (
    <div className={style.container}>
      {loading ? (
        <FontAwesomeIcon
          className={style.spinner}
          icon={faSpinner}
          spin
          size="2x"
        />
      ) : null}
      {error ? (
        <div className={style.error_container}>
          <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
          <p>{error}</p>
          <Button primary onClick={loadMapData} text="TRY AGAIN" />
        </div>
      ) : null}
      {!loading && !error && map ? (
        <Diagram data={map.data} width="100%" height="100%" />
      ) : (
        ""
      )}
    </div>
  );
};

export default TopicMap;
