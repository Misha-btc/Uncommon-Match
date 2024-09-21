import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext(undefined);

export const WalletProvider = ({ children }) => {
  const [paymentAddress, setPaymentAddress] = useState(localStorage.getItem('paymentAddress') || '');
  const [ordinalsAddress, setOrdinalsAddress] = useState(localStorage.getItem('ordinalsAddress') || '');
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(ordinalsAddress);
  const [isConnected, setIsConnected] = useState(ordinalsAddress);

  return (
    <WalletContext.Provider value={{
      paymentAddress,
      ordinalsAddress,
      setPaymentAddress,
      setOrdinalsAddress,
      isAddressConfirmed,
      setIsAddressConfirmed,
      isConnected,
      setIsConnected
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet должен использоваться внутри WalletProvider');
  }
  return context;
};
