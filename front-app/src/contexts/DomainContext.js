import { createContext } from "react";

const DomainContext = createContext({
  loading: false,
  updating: false,
  error: null,
  domains: [],
  selectedDomainGroup: null,
  loadDomains: () => {},
  loadDomainsSuccess: () => {},
  loadDomainsFail: () => {},
  selectDomainGroup: () => {},
  addGroup: () => {},
  addGroupSuccess: () => {},
  addGroupFail: () => {},
});

export default DomainContext;
