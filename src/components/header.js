import React, { useState } from 'react';
import { Layout, Typography, Button, ConfigProvider } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import useConnectWallet from '../hooks/useConnectWallet';
import { useWallet } from '../context/walletContext';
const { Header: AntHeader } = Layout;
const { Title } = Typography;

function Header() {
  const { connectWallet } = useConnectWallet();
  const [error, setError] = useState('');
  const { setPaymentAddress, setOrdinalsAddress, paymentAddress, ordinalsAddress, isAddressConfirmed, isConnected, setIsConnected } = useWallet();


  const handleConnectClick = async () => {
    setError('');
    localStorage.clear();
    try {
      const result = await connectWallet();
      if (result.success) {
        setIsConnected(true);
        setPaymentAddress(result.paymentAddress);
        const testOrdinalsAddress = 'bc1pkt45qac4dmmm6nwlxw6xfue6cjwnfanfyluyg85elrqqnl3y50lqm00dmx';
        const ordinalsAddress = result.ordinalsAddress;
        const addr = 'o'
        if (addr === 't') {
          setOrdinalsAddress(testOrdinalsAddress);
          localStorage.setItem('ordinalsAddress', testOrdinalsAddress);
        } else {
          setOrdinalsAddress(ordinalsAddress);
          localStorage.setItem('ordinalsAddress', ordinalsAddress);
        }
        localStorage.setItem('paymentAddress', result.paymentAddress);
        
      } else {
        setError(result.error || 'Произошла ошибка при подключении кошелька');
      }
    } catch (err) {
      setError(err.message || 'Произошла неизвестная ошибка');
    }
  };

  
  const handleDisconnectClick = () => {
    setIsConnected(false);
    setPaymentAddress('');
    setOrdinalsAddress('');
    localStorage.clear();
    localStorage.removeItem('paymentAddress');
    localStorage.removeItem('ordinalsAddress');
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <AntHeader style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 16px',
        backgroundColor: 'rgb(9 9 11)',
        flexWrap: 'nowrap',
      }}>
        <Title level={3} style={{ 
          margin: 0, 
          whiteSpace: 'nowrap',
          fontSize: 'clamp(16px, 5vw, 24px)',
        }}>
          <span style={{ color: 'white', fontStyle: 'italic' }}>Alpha</span><span style={{ color: 'rgb(34, 197, 94)', fontWeight: 'bold' }}>Match</span>
        </Title>
        {isConnected ? (
          <div>
          <Button 
            type="primary" 
            style={{
              backgroundColor: 'black',
              marginLeft: 'auto',
              fontSize: 'clamp(12px, 3vw, 16px)',
              padding: '4px 8px',
              height: 'auto',
          }}
        >
          {ordinalsAddress.slice(0, 6)}...{ordinalsAddress.slice(-4)}
        </Button>
          <Button 
            type="primary" 
            onClick={handleDisconnectClick}
                  style={{
                    backgroundColor: 'black',
                    marginLeft: 'auto',
                    fontSize: 'clamp(12px, 3vw, 16px)',
                    padding: '4px 8px',
                    height: 'auto',
                  }}
                  >
              exit
            </Button>
          </div>
        ) : (
          <Button 
            type="primary" 
            icon={<WalletOutlined />} 
            onClick={handleConnectClick}
            style={{
              backgroundColor: 'black',
              marginLeft: 'auto',
              fontSize: 'clamp(12px, 3vw, 16px)',
              padding: '4px 8px',
              height: 'auto',
            }}
          >
            connect
          </Button>
        )}
      </AntHeader>
    </ConfigProvider>
  );
}

export default Header;