import { createContext } from "react";

const TopicMapContext = createContext({
  opened: false,
  openMap: () => {},
  closeMap: () => {},
});

export default TopicMapContext;
