import { createContext, ReactNode } from "react";

interface AppContextType {}

const initialState = {};

const AppContext = createContext<AppContextType>(initialState);

const AppContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
