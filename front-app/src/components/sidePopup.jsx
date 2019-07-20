import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBookmark as farBookmark,
  faCommentAlt as farCommentAlt,
} from "@fortawesome/free-regular-svg-icons";
import { faBrain } from "@fortawesome/free-solid-svg-icons/faBrain";

import style from "./sidePopup.css";

library.add(farBookmark, farCommentAlt);

const SidePopup = () => {
  return (
    <div className={style.popup}>
      <div className={style.popup__header}>
        <h1 className="ms">mesh.</h1>
        <p>21312</p>
      </div>
      <div className={style.popup__main} />
      <div className={style.popup__footer}>
        <div className={style.avatar} />
        <FontAwesomeIcon icon={faBrain} />
        <FontAwesomeIcon icon={["far", "bookmark"]} />
        <FontAwesomeIcon icon={["far", "comment-alt"]} />
      </div>
    </div>
  );
};

export default SidePopup;
