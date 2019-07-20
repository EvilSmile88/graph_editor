import React from "react";
import { hot } from "react-hot-loader";
import SidePopup from "./components/sidePopup";

import style from "./app.css";

const App = () => {
  return (
    <div className={style.app}>
      <SidePopup/>
    </div>
  )
};

export default hot(module)(App);
