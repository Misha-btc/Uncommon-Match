import React from 'react';
import MatchPage from './components/matchPage';
import Header from './components/header'; // Убедитесь, что путь к файлу правильный
import { WalletProvider } from './context/walletContext';
import { RareSatsProvider } from './context/rareSatsContext';
import { MagisatListingProvider } from './context/magisatListingContext';

function App() {
  return (
    <WalletProvider>
      <RareSatsProvider>
        <MagisatListingProvider>
          <Header />
          <MatchPage />
        </MagisatListingProvider>
      </RareSatsProvider>
    </WalletProvider>
  );
}

export default App;
