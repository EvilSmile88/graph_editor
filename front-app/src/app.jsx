import React, { useEffect } from "react";
import { hot } from "react-hot-loader";
import style from "./app.scss";
import Main from "./components/Main/Main";
import PanelProvider from "./contextProviders/PanelProvider";
import DomainProvider from "./contextProviders/DomainProviders";

const App = () => {
  useEffect(() => {
    // Set global window variable to understand that bookmarklet app have been initialized
    window.meshAppVersion = process.env.APP_VERSION;
  }, []);

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
