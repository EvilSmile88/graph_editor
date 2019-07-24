import { createContext } from "react";

const DomainContext = createContext({
  loading: false,
  error: null,
  domains: [],
  selectedDomainGroup: null,
  loadDomains: () => {},
  loadDomainsSuccess: () => {},
  loadDomainsFail: () => {},
  selectDomainGroup: () => {},
});

export default DomainContext;
