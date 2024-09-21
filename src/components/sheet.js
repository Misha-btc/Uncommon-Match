import React, { useEffect, useState, useMemo } from 'react';
import { Table, Tag, Radio } from 'antd';
import { useRareSats } from '../context/rareSatsContext';
import { useMagisatListing } from '../context/magisatListingContext';
import magisatLogo from './magisatLogo.png';

const Sheet = () => {
  const { blackSats, uncommonSats, loading, setLoading } = useRareSats();
  const { blackUncommonListings, uncommonListings } = useMagisatListing();
  const [dataSource, setDataSource] = useState([]);
  const [filterOption, setFilterOption] = useState('all');

  const columns = useMemo(() => [
    {
      title: 'alpha',
      dataIndex: 'uncommon',
      key: 'uncommon',
      align: 'center',
      width: '20%',
      render: (text, record) => (
        <Tag color={record.uncommonColor}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'price',
      dataIndex: 'uncommonPrice',
      key: 'uncommonPrice',
      align: 'center',
      width: '15%',
      render: (text) => text ? `${text} sats` : '-',
    },
    {
      title: 'listing',
      dataIndex: 'uncommonId',
      key: 'uncommonId',
      align: 'center',
      width: '15%',
      render: (text) => text ? (
        <a href={`https://magisat.io/listing/${text}`} target="_blank" rel="noopener noreferrer">
          <img src={magisatLogo} alt="Magisat" style={{ width: '30px', height: '30px' }} />
        </a>
      ) : '-',
    },
    {
      title: 'omega',
      dataIndex: 'black',
      key: 'black',
      align: 'center',
      width: '20%',
      render: (text, record) => (
        <Tag color={record.blackColor}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'price',
      dataIndex: 'blackPrice',
      key: 'blackPrice',
      align: 'center',
      width: '15%',
      render: (text) => text ? `${text} sats` : '-',
    },
    {
      title: 'listing',
      dataIndex: 'blackId',
      key: 'blackId',
      align: 'center',
      width: '15%',
      render: (text) => text ? (
        <a href={`https://magisat.io/listing/${text}`} target="_blank" rel="noopener noreferrer">
          <img src={magisatLogo} alt="Magisat" style={{ width: '30px', height: '30px' }} />
        </a>
      ) : '-',
    },
  ], []);

  useEffect(() => {
    if (blackSats && uncommonSats && blackUncommonListings.length > 0 && uncommonListings.length > 0) {
      setLoading('loading...');
      const blackSet = new Set(blackSats);
      const uncommonSet = new Set(uncommonSats);

      // Добавляем тестовый сат в список листингов
      const testBlackListing = {
        satIndex: '1544987599999999',
        relativeUnitPrice: 100000, // Пример цены
        id: 'test-listing-id'
      };
      const updatedBlackUncommonListings = [...blackUncommonListings];
      
      const blackListingsSet = new Set(updatedBlackUncommonListings.map(listing => listing.satIndex));
      const uncommonListingsSet = new Set(uncommonListings.map(listing => listing.satIndex));

      const pairMap = new Map();

      const addOrUpdatePair = (uncommonSat, blackSat, data) => {
        const key = `${uncommonSat}-${blackSat}`;
        if (!pairMap.has(key)) {
          pairMap.set(key, {
            key,
            uncommon: uncommonSat,
            black: blackSat,
            uncommonColor: 'gray',
            blackColor: 'gray',
            uncommonPrice: null,
            blackPrice: null,
            uncommonId: null,
            blackId: null,
            uncommonListed: null,
            blackListed: null,
            match: null,
          });
        }
        Object.assign(pairMap.get(key), data);
      };

      // Обработка owned сатов
      uncommonSet.forEach(uncommon => {
        addOrUpdatePair(uncommon, uncommon + 99_999_999, { uncommonColor: 'green', uncommonListed: 'own' });
      });
      blackSet.forEach(black => {
        addOrUpdatePair(black - 99_999_999, black, { blackColor: 'green', blackListed: 'own' });
      });

      const processOwnedSats = () => {
        uncommonSet.forEach(uncommonSat => {
          const matchBlackSat = uncommonSat + 99_999_999;
          let data = {};
          blackSet.forEach(blackSat => {
            if (blackSat === matchBlackSat) {
              data = {
                uncommonColor: 'green',
                blackColor: 'green',
                blackListed: 'own',
                match: 'match',
              };
            }
          });

          addOrUpdatePair(uncommonSat, matchBlackSat, data);
        });
      };

      processOwnedSats();

      // Обработка листингов
      const processListing = (listing, isUncommon) => {
        const sat = Number(listing.satIndex);
        const pair = isUncommon ? sat + 99_999_999 : sat - 99_999_999;
        const data = isUncommon ? {
          uncommonColor: 'blue',
          uncommonPrice: listing.relativeUnitPrice,
          uncommonId: listing.id,
          uncommonListed: 'listing',
        } : {
          blackColor: 'blue',
          blackPrice: listing.relativeUnitPrice,
          blackId: listing.id,
          blackListed: 'listing',
        };
        
        if (isUncommon ? uncommonSet.has(sat) : blackSet.has(sat)) {
          data[isUncommon ? 'uncommonColor' : 'blackColor'] = 'purple';
        } else if (isUncommon ? blackListingsSet.has(pair.toString()) : uncommonListingsSet.has(pair.toString())) {
          data.match = 'match';
        } else if (isUncommon ? uncommonSet.has(pair) : blackSet.has(pair)) {
          data.match = 'match';
        }
        
        addOrUpdatePair(isUncommon ? sat : pair, isUncommon ? pair : sat, data);
      };

      updatedBlackUncommonListings.forEach(listing => processListing(listing, false));
      uncommonListings.forEach(listing => processListing(listing, true));

      // Фильтруем и включаем все owned саты
      const applyFilter = (data) => {
        switch (filterOption) {
          case 'pairedListings':
            return data.filter(item => item.match === 'match' && (item.uncommonListed === 'listing' || item.blackListed === 'listing'));
          case 'ownPairs':
            return data.filter(item => item.match === 'match' && item.uncommonColor === 'green' && item.blackColor === 'green');
          case 'ownUnpaired':
            return data.filter(item => 
              (item.uncommonColor === 'green' && item.blackColor !== 'green') || 
              (item.blackColor === 'green' && item.uncommonColor !== 'green')
            );
          case 'ownMatch':
            return data.filter(item => 
              (item.uncommonColor === 'green' && item.blackListed === 'listing') || 
              (item.blackColor === 'green' && item.uncommonListed === 'listing')
            );
          default:
            return data;
        }
      };

      const filteredDataSource = applyFilter(Array.from(pairMap.values()));

      setLoading('');
      setDataSource(filteredDataSource);
    }
  }, [blackSats, uncommonSats, blackUncommonListings, uncommonListings, setLoading, filterOption]);

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Radio.Group onChange={handleFilterChange} value={filterOption}>
          <Radio.Button value="pairedListings">paired listings</Radio.Button>
          <Radio.Button value="ownPairs">my pairs</Radio.Button>
          <Radio.Button value="ownUnpaired">my unpaired</Radio.Button>
          <Radio.Button value="ownMatch">match</Radio.Button>
        </Radio.Group>
      </div>
      <Table 
        dataSource={dataSource} 
        columns={columns} 
        loading={loading !== ''}
        pagination={false}
        style={{
          width: '80%',
          margin: '0 auto',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      />
    </div>
  );
};

export default Sheet;
