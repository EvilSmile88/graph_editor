import React, { useContext } from "react";
import TopicMapContext from "Contexts/TopicMapContext";
import style from "./TopicMap.scss";

const TopicMap = () => {
  const { opened } = useContext(TopicMapContext);
  return opened ? <div className={style.map_container} /> : "";
};

export default TopicMap;
