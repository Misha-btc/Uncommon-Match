import React from 'react';
import MatchPage from './components/matchPage';
import Header from './components/header'; // Убедитесь, что путь к файлу правильный
import { WalletProvider } from './context/walletContext';
import { RareSatsProvider } from './context/rareSatsContext';
import { MagisatListingProvider } from './context/magisatListingContext';
import ScanComponent from './components/scanComponent';

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <WalletProvider>
        <RareSatsProvider>
          <MagisatListingProvider>
            <Header />
            <MatchPage />
          </MagisatListingProvider>
        </RareSatsProvider>
      </WalletProvider>
    </div>
  );
}

export default App;
