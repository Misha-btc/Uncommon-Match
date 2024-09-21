import React from 'react';
import { Button } from 'antd';
import { ScanOutlined } from '@ant-design/icons';
import { useWallet } from '../context/walletContext';
import useDeezy from '../hooks/useDeezy';
import useMagisat from '../hooks/useMagisat';

function ScanComponent() {
  const { ordinalsAddress, isConnected } = useWallet();
  const { scanAddress, loading } = useDeezy();
  const { fetchListings } = useMagisat();

  const handleScan = async () => {
    if (ordinalsAddress && isConnected) {
        scanAddress(ordinalsAddress);
        fetchListings();
    } else {
        return;
    }
  };

  return (
    <div>
    {isConnected && (
      <Button
        type="primary"
        icon={<ScanOutlined />}
        onClick={loading === '' ? handleScan : null}
        style={{
          fontSize: 'clamp(12px, 3vw, 16px)',
          margin: '20px auto', // Центрирование кнопки
          padding: '20px',
          backgroundColor: 'rgba(20, 150, 70)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          borderRadius: '30px',
          height: 'auto',
          width: 'fit-content', // Автоматическая ширина для центрирования
          fontWeight: 'bold', // Жирный текст
        }}
      >
        {loading === '' ? 'MATCH' : 'MATCHING...'}
      </Button>
    )}
    </div>
  );
}

export default ScanComponent;
