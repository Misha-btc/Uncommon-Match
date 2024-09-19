import React, { useState } from 'react';
import { Layout, Typography, Button, ConfigProvider } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import useConnectWallet from '../hooks/useConnectWallet';
import { useWallet } from '../context/walletContext';
import useMagicEden from '../hooks/useMagicEden';
import { sortRareSats } from '../hooks/useSortingSats';
import { useRareSats } from '../context/rareSatsContext';
const { Header: AntHeader } = Layout;
const { Title } = Typography;

function Header() {
  const { connectWallet } = useConnectWallet();
  const [error, setError] = useState('');
  const { setPaymentAddress, setOrdinalsAddress, paymentAddress, ordinalsAddress } = useWallet();
  const { fetchRareSats } = useMagicEden();
  const { blackSats, uncommonSats, addBlackSats, addUncommonSats } = useRareSats();

  const address = 'bc1pmw0knfph5nvrg3t8eta0w960wxd9y5vjle2smyvmcrzaj4msvtzsm82aaq'
  

  const handleConnectClick = async () => {
    setError('');
    try {
      const result = await connectWallet();
      if (result.success) {
        console.log('result', result);
        const rareSats = await fetchRareSats(result.ordinalsAddress);
        console.log('rareSats', rareSats);
        if (rareSats.tokens.length > 0) {
          const sortedRareSats = sortRareSats(rareSats);
          if (sortedRareSats.blackUncommonSats.length > 0 || sortedRareSats.uncommonSats.length > 0) {
            console.log('rareSats', sortedRareSats);
            addBlackSats(sortedRareSats.blackUncommonSats);
            addUncommonSats(sortedRareSats.uncommonSats);
            localStorage.setItem('blackUncommonSats', JSON.stringify(sortedRareSats.blackUncommonSats));
            localStorage.setItem('uncommonSats', JSON.stringify(sortedRareSats.uncommonSats));
          } else {
            setError('No rare sats found');
          }
        } else {
          setError('No rare sats found');
        }
        setPaymentAddress(result.paymentAddress);
        setOrdinalsAddress(result.ordinalsAddress);
        localStorage.setItem('paymentAddress', result.paymentAddress);
        localStorage.setItem('ordinalsAddress', result.ordinalsAddress);
      } else {
        setError(result.error || 'Произошла ошибка при подключении кошелька');
      }
    } catch (err) {
      setError(err.message || 'Произошла неизвестная ошибка');
    }
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
        background: '#fff',
        flexWrap: 'nowrap',
      }}>
        <Title level={3} style={{ 
          margin: 0, 
          whiteSpace: 'nowrap',
          fontSize: 'clamp(16px, 5vw, 24px)',
        }}>
          <span style={{ color: 'black', fontStyle: 'italic' }}>Uncommon</span><span style={{ color: 'purple', fontWeight: 'bold' }}>Match</span>
        </Title>
        {paymentAddress && ordinalsAddress ? (
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