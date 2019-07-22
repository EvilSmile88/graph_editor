import React from "react";
import { hot } from "react-hot-loader";
import style from "./app.scss";
import Main from "./components/Main/Main";
import PanelProvider from "./contextProviders/PanelProvider";
import DomainProvider from "./contextProviders/DomainProviders";

const App = () => {
  return (
    <div className={style.app}>
      <DomainProvider>
        <PanelProvider>
          <Main />
        </PanelProvider>
      </DomainProvider>
    </div>
  );
};

export default hot(module)(App);
