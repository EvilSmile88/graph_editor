import React, { useContext } from "react";
import TopicMapContext from "Contexts/TopicMapContext";

import style from "./TopPanel.scss";
import TopicMap from "../TopicMap/TopicMap";

const TopPanel = () => {
  const { opened } = useContext(TopicMapContext);

  return opened ? (
    <div className={style.panel}>
      <TopicMap />
    </div>
  ) : (
    ""
  );
};

export default TopPanel;
