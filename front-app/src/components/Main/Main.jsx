import React, { useEffect, useContext } from "react";
import ApiService from "Services/ApiService";
import API_ENDPOINTS from "Constants/api";
import PanelContext from "Contexts/PanelContext";
import SidePanel from "Components/SidePanel/SidePanel";
import DomainContext from "Contexts/DomainContext";
import ERROR_MESSAGES from "Constants/errorMessages";

const Main = () => {
  const { openPanel } = useContext(PanelContext);
  const { loadDomains, loadDomainsSuccess, loadDomainsFail } = useContext(
    DomainContext,
  );

  useEffect(() => {
    loadDomains();
    ApiService.get(API_ENDPOINTS.DOMAIN)
      .then(res => {
        openPanel();
        if (res.data.length) {
          loadDomainsSuccess(res.data);
        } else {
          loadDomainsFail(ERROR_MESSAGES.noData);
        }
      })
      .catch(() => {
        openPanel();
        loadDomainsFail(ERROR_MESSAGES.internalError);
      });
  }, []);

  return <SidePanel />;
};

export default Main;
