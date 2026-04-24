import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface AppContextType {
  isFocusMode: boolean;
  setFocusMode: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFocusMode, setFocusMode] = useState(false);
  const location = useLocation();

  // Reset focus mode on navigation
  useEffect(() => {
    setFocusMode(false);
  }, [location.pathname]);

  return (
    <AppContext.Provider value={{ isFocusMode, setFocusMode }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
