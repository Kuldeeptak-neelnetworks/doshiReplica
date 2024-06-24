import React, { createContext, useState } from "react";

export const ContextSidebarToggler = createContext();

const SidebarToggler = ({ children }) => {
  const [sidebarClose, setSidebarClose] = useState(false);
  return (
    <ContextSidebarToggler.Provider value={{ sidebarClose, setSidebarClose }}>
      {children}
    </ContextSidebarToggler.Provider>
  );
};

export default SidebarToggler;
