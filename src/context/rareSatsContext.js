import React, { createContext, useState, useContext } from 'react';

const RareSatsContext = createContext();

export const RareSatsProvider = ({ children }) => {
  const [loading, setLoading] = useState('');
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
    localStorage.setItem('blackUncommonSats', JSON.stringify(blackSats));
  };

  const addUncommonSats = (newUncommonSats) => {
    setUncommonSats((prevSats) => [...prevSats, ...newUncommonSats]);
    localStorage.setItem('uncommonSats', JSON.stringify(uncommonSats));
  };

  return (
    <RareSatsContext.Provider 
      value={{ 
        blackSats, 
        uncommonSats, 
        addBlackSats, 
        addUncommonSats,
        loading,
        setLoading
      }}
    >
      {children}
    </RareSatsContext.Provider>
  );
};

export const useRareSats = () => useContext(RareSatsContext);
