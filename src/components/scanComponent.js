import React from 'react';
import { Button } from 'antd';
import { ScanOutlined } from '@ant-design/icons';
import { useWallet } from '../context/walletContext';
import useDeezy from '../hooks/useDeezy';
import useMagisat from '../hooks/useMagisat';

function ScanComponent() {
  const { ordinalsAddress, isAddressConfirmed } = useWallet();
  const { scanAddress, loading } = useDeezy();
  const { fetchListings } = useMagisat();

  const handleScan = async () => {
    if (ordinalsAddress && isAddressConfirmed) {
        scanAddress(ordinalsAddress);
        fetchListings();
    } else {
        return;
    }
  };

  return (
    <div>
    {isAddressConfirmed && (
      <Button
        type="primary"
        icon={<ScanOutlined />}
        onClick={loading === '' ? handleScan : null}
        style={{
          fontSize: 'clamp(12px, 3vw, 16px)',
          position: 'fixed',
          bottom: '20px',
          left: '40%',
          right: '40%',
          padding: '20px',
          backgroundColor: 'rgba(50, 50, 50, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          borderRadius: '30px',
          height: 'auto',
        }}
      >
        {loading === '' ? 'SCAN' : 'SCANNING...'}
      </Button>
    )}
    </div>
  );
}

export default ScanComponent;
