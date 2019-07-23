import React, { useEffect } from "react";
import { hot } from "react-hot-loader";
import style from "./app.scss";
import Main from "./components/Main/Main";
import PanelProvider from "./contextProviders/PanelProvider";
import DomainProvider from "./contextProviders/DomainProviders";
import TopicMapProvider from "./contextProviders/TopicMapProvider";
import TopicMap from "./components/TopicMap/TopicMap";

const App = () => {
  useEffect(() => {
    // Set global window variable to get understanding that bookmarklet app has been initialized
    window.meshAppVersion = process.env.APP_VERSION;
  }, []);

  return (
    <div className={style.app}>
      <TopicMapProvider>
        <React.Fragment>
          <DomainProvider>
            <PanelProvider>
              <Main />
            </PanelProvider>
          </DomainProvider>
          <TopicMap />
        </React.Fragment>
      </TopicMapProvider>
    </div>
  );
};

export default hot(module)(App);
