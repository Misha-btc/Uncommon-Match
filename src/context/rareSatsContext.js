import React, { createContext, useState, useContext } from 'react';

const RareSatsContext = createContext();

export const RareSatsProvider = ({ children }) => {
  const [blackSats, setBlackSats] = useState(() => {
    const saved = localStorage.getItem('blackUncommonSats');
    return saved ? JSON.parse(saved) : [];
  });

  const [uncommonSats, setUncommonSats] = useState(() => {
    const saved = localStorage.getItem('uncommonSats');
    return saved ? JSON.parse(saved) : [];
  });


  const addBlackSats = (newBlackSats) => {
    setBlackSats((prevSats) => [...prevSats, ...newBlackSats]);
  };

  const addUncommonSats = (newUncommonSats) => {
    setUncommonSats((prevSats) => [...prevSats, ...newUncommonSats]);
  };

  return (
    <RareSatsContext.Provider 
      value={{ 
        blackSats, 
        uncommonSats, 
        addBlackSats, 
        addUncommonSats 
      }}
    >
      {children}
    </RareSatsContext.Provider>
  );
};

export const useRareSats = () => useContext(RareSatsContext);
