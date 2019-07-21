import React, { useState, useEffect } from "react";
import { hot } from "react-hot-loader";
import PanelContext from "./contexts/PanelContext";
import SidePanel from "./components/SidePanel/SidePanel";
import ApiService from "./services/ApiService";
import API_ENDPOINTS from "./constants/api";
import style from "./app.scss";

const App = () => {
  const [domains, setDomains] = useState([]);
  const [isDomainsLoading, setDomainsLoading] = useState(true);
  const [panelState, togglePanelState] = useState({
    collapsed: true,
    openPanel: () => {
      togglePanelState(prevState => {
        return {
          ...prevState,
          collapsed: false,
        };
      });
    },
    closePanel: () => {
      togglePanelState(prevState => {
        return {
          ...prevState,
          collapsed: true,
        };
      });
    },
  });

  useEffect(() => {
    ApiService.get(API_ENDPOINTS.DOMAIN)
      .then(res => {
        setDomainsLoading(false);
        panelState.openPanel();
        setDomains(res.data);
      })
      .catch(() => {
        panelState.openPanel();
        setDomainsLoading(false);
      });
  }, []);

  return (
    <div className={style.app}>
      <PanelContext.Provider value={panelState}>
        <SidePanel domains={domains} loading={isDomainsLoading} />
      </PanelContext.Provider>
    </div>
  );
};

export default hot(module)(App);
