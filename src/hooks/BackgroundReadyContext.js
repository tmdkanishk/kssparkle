// src/context/BackgroundReadyContext.js
import React, { createContext, useContext, useState } from 'react';

const BackgroundReadyContext = createContext(false);

export const BackgroundReadyProvider = ({ children }) => {
  const [ready, setReady] = useState(false);
  return (
    <BackgroundReadyContext.Provider value={{ ready, setReady }}>
      {children}
    </BackgroundReadyContext.Provider>
  );
};

export const useBackgroundReady = () => useContext(BackgroundReadyContext);