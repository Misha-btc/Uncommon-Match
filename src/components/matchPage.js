import React, { useState } from 'react';
import Sheet from './sheet';
import { useWallet } from '../context/walletContext';
import { Input } from 'antd';
import { ScanOutlined } from '@ant-design/icons';

function MatchPage() {
  const { ordinalsAddress, setIsAddressConfirmed, isAddressConfirmed } = useWallet();
  const [address, setAddress] = useState('');


  const handleAddressConfirm = () => {
    if (address.trim()) {
      setIsAddressConfirmed(true);
      // Здесь можно добавить дополнительную логику, например, загрузку данных для этого адреса
    }
  };

  return (
    <div style={{ backgroundColor: 'rgb(9 9 11)', minHeight: '100vh', color: 'white' }}>
      <div>
        {ordinalsAddress === 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Input
              placeholder="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onPressEnter={handleAddressConfirm}
              style={{ width: '75%', height: '40px', fontSize: '16px', marginRight: '10px', textAlign: 'center', borderRadius: '10px', borderColor: address.trim() ? 'rgb(34, 197, 94)' : 'transparent', borderWidth: '2px', borderStyle: 'solid' }}
            />
            <ScanOutlined
                  style={{ fontSize: '20px', cursor: 'pointer' }}
                  onClick={handleAddressConfirm}
            />
          </div>
        )}
        {isAddressConfirmed && (
          <>
            <h1 style={{ textAlign: 'center' }}>Your matches</h1>
            <Sheet />
          </>
        )}
      </div>
    </div>
  );
}

export default MatchPage;
