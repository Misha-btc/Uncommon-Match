import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { useRareSats } from '../context/rareSatsContext';
import { useMagisatListing } from '../context/magisatListingContext';
import ordinals1 from './ordinals1.png';
import magisatLogo from './magisatLogo.png';

const Sheet = () => {
  const { blackSats, uncommonSats, loading, setLoading } = useRareSats();
  const { blackUncommonListings, uncommonListings } = useMagisatListing();
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (blackSats && uncommonSats && blackUncommonListings.length > 0 && uncommonListings.length > 0) {
      setLoading('loading...');
      const blackSet = new Set(blackSats);
      const uncommonSet = new Set(uncommonSats);
      const blackListingsSet = new Set(blackUncommonListings.map(listing => listing.satIndex));
      const uncommonListingsSet = new Set(uncommonListings.map(listing => listing.satIndex));

      const newDataSource = [];
      const addedSats = new Set();
      const hypotheticalPairs = new Map();
      const listingPairs = new Map();

      // Находим пары на листингах
      blackUncommonListings.forEach(black => {
        const uncommon = Number(black.satIndex) - 99_999_999;
        if (uncommonListingsSet.has(uncommon.toString())) {
          listingPairs.set(Number(black.satIndex), uncommon);
        }
      });

      // Функция для добавления сата в dataSource
      const addSat = (
        sat, 
        isUncommon, 
        isOwned, 
        blackColor, 
        uncommonColor, 
        uncommonPrice = null, 
        blackPrice = null,
        uncommonId = null, 
        blackId = null
      ) => {
        if (addedSats.has(sat)) return;

        const pair = isUncommon ? sat + 99_999_999 : sat - 99_999_999;
        const key = `${isUncommon ? 'uncommon' : 'black'}-${isOwned ? 'own' : 'listing'}-${sat}`;

        newDataSource.push({
          key,
          uncommon: isUncommon ? sat : pair,
          black: isUncommon ? pair : sat,
          uncommonColor: uncommonColor,
          blackColor: blackColor,
          uncommonPrice: uncommonPrice,
          blackPrice: blackPrice,
          uncommonId: uncommonId,
          blackId: isUncommon ? null : blackId,
        });

        addedSats.add(sat);
        
        // Добавляем гипотетическую пару
        if (isOwned) {
          hypotheticalPairs.set(pair, 'red');
        }
      };

      // Добавляем наши саты из useRareSats
      uncommonSet.forEach(uncommon => addSat(uncommon, true, true, 'green'));
      blackSet.forEach(black => addSat(black, false, true, 'green'));

      // Обрабатываем листинги
      const processListing = (listing, isUncommon) => {
        const sat = Number(listing.satIndex);
        const pair = isUncommon ? sat + 99_999_999 : sat - 99_999_999;
        if (addedSats.has(sat)) {
          // Если сат уже добавлен (наш), меняем цвет на фиолетовый
          const index = newDataSource.findIndex(item => 
            (isUncommon ? item.uncommon : item.black) === sat
          );
          if (index !== -1) {
            if (isUncommon) {
              newDataSource[index].uncommonColor = 'purple';
              newDataSource[index].uncommonPrice = listing.relativeUnitPrice;
              newDataSource[index].uncommonId = listing.id;
            } else {
              newDataSource[index].blackColor = 'purple';
              newDataSource[index].blackPrice = listing.relativeUnitPrice;
              newDataSource[index].blackId = listing.id;
            }
          }
        } else if (hypotheticalPairs.has(sat)) {
          // Если сат совпадает с гипотетической парой, добавляем как красный
          addSat(sat, isUncommon, false, 'red', 'red', listing.relativeUnitPrice, null, listing.id, listing.id);
        } else if (listingPairs.has(sat)) {
          // Если сат имеет пару на листинге, добавляем как голубой
          addSat(sat, isUncommon, false, 'blue', 'blue', listing.relativeUnitPrice, null, listing.id, listing.id);
        } else if (uncommonSet.has(isUncommon ? sat : pair) || blackSet.has(isUncommon ? pair : sat)) {
          // Добавляем только если у нас есть хотя бы один сат из пары
          addSat(sat, isUncommon, false, 'black', 'black', listing.relativeUnitPrice, null, listing.id, listing.id);
        }
      };

      blackUncommonListings.forEach(listing => processListing(listing, false));
      uncommonListings.forEach(listing => processListing(listing, true));

      setLoading('');
      setDataSource(newDataSource);
    }
  }, [blackSats, uncommonSats, blackUncommonListings, uncommonListings, setLoading]);

  const renderCell = (text, record, isUncommon) => (
    <div style={{ 
      color: isUncommon ? record.uncommonColor : record.blackColor, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      fontSize: 'calc(8px + 1vw)',
      wordBreak: 'break-word'
    }}>
      <div>
        {isUncommon ? record.uncommonId : record.blackId && (
          <a 
            href={`https://magisat.io/listing/${isUncommon ? record.uncommonId : record.blackId}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={magisatLogo} alt="Magisat" style={{ width: '30px', height: '30px', verticalAlign: 'middle', marginRight: '3px' }} />
          </a>
        )}
        {text}
      </div>
      {(isUncommon ? record.uncommonPrice : record.blackPrice) && (
        <div style={{ fontSize: '0.8em' }}>
          {isUncommon ? record.uncommonPrice : record.blackPrice} sats
        </div>
      )}
    </div>
  );

  const columns = [
    {
      title: <span style={{ fontSize: 'calc(10px + 1vw)', fontWeight: 'bold' }}>ALPHA</span>,
      dataIndex: 'uncommon',
      key: 'uncommon',
      align: 'center',
      render: (text, record) => renderCell(text, record, true),
    },
    {
      title: <span style={{ fontSize: 'calc(10px + 1vw)', fontWeight: 'bold' }}>OMEGA</span>,
      dataIndex: 'black',
      key: 'black',
      align: 'center',
      render: (text, record) => renderCell(text, record, false),
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        style={{ 
          width: '100%', 
          maxWidth: '80%', 
          borderBottomLeftRadius: '10px', 
          borderBottomRightRadius: '10px', 
          overflow: 'hidden' 
        }}
        locale={{
          emptyText: (
            <div style={{ padding: '20px' }}>
              <img src={ordinals1} alt="ordinals1" style={{ width: '50px', height: 'auto' }} />
            </div>
          )
        }}
      />
    </div>
  );
};

export default Sheet;
