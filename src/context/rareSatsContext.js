import React, { createContext, useState, useContext, useEffect } from 'react';

const RareSatsContext = createContext();

export const RareSatsProvider = ({ children }) => {
  const [loading, setLoading] = useState('');
  const [blackSats, setBlackSats] = useState(() => {
    const saved = localStorage.getItem('blackSats');
    return saved ? JSON.parse(saved) : [];
  });

  const [uncommonSats, setUncommonSats] = useState(() => {
    const saved = localStorage.getItem('uncommonSats');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('blackSats', JSON.stringify(blackSats));
  }, [blackSats]);

  useEffect(() => {
    localStorage.setItem('uncommonSats', JSON.stringify(uncommonSats));
  }, [uncommonSats]);

  const addBlackSats = (newBlackSats) => {
    setBlackSats((prevSats) => [...new Set([...prevSats, ...newBlackSats])]);
  };

  const addUncommonSats = (newUncommonSats) => {
    setUncommonSats((prevSats) => [...new Set([...prevSats, ...newUncommonSats])]);
  };

  const clearRareSats = () => {
    setBlackSats([]);
    setUncommonSats([]);
    localStorage.removeItem('blackSats');
    localStorage.removeItem('uncommonSats');
  };

  return (
    <RareSatsContext.Provider 
      value={{ 
        blackSats, 
        uncommonSats, 
        addBlackSats, 
        addUncommonSats,
        clearRareSats,
        loading,
        setLoading
      }}
    >
      {children}
    </RareSatsContext.Provider>
  );
};

export const useRareSats = () => useContext(RareSatsContext);
