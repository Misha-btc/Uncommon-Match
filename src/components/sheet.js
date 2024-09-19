import React from 'react';
import { Table } from 'antd';
import { useRareSats } from '../context/rareSatsContext';

const Sheet = ({ listings }) => {
  const { blackSats, uncommonSats } = useRareSats();
  
  // Создаем массивы для отсутствующих сатов
  const missingUncommonSats = [];
  const missingBlackSats = [];

  // Новые массивы для отсутствующих сатов, доступных в листингах
  const availableUncommonSats = [698619900000000];
  const availableBlackSats = [];

  // Преобразуем листинги в множества для быстрого поиска
  const blackListingsSet = new Set(listings.blackListings);
  const uncommonListingsSet = new Set(listings.uncommonListings);

  const columns = [
    {
      title: <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>UNCOMMON</span>,
      dataIndex: 'uncommon',
      key: 'uncommon',
      align: 'center',
      width: '50%',
      render: (text, record) => (
        <span style={{ color: record.uncommonExists ? 'green' : 'black' }}>{text}</span>
      ),
    },
    {
      title: <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>BLACK</span>,
      dataIndex: 'black',
      key: 'black',
      align: 'center',
      width: '50%',
      render: (text, record) => (
        <span style={{ color: record.blackExists ? 'green' : 'black' }}>{text}</span>
      ),
    },
  ];

  const dataSource = [];
  const blackSet = new Set(blackSats);
  const uncommonSet = new Set(uncommonSats);

  uncommonSats.forEach((uncommon) => {
    const hypotheticalBlack = uncommon + 99_999_999;
    if (blackSet.has(hypotheticalBlack)) {
      dataSource.push({
        key: `uncommon-${uncommon}`,
        uncommon,
        uncommonExists: true,
        black: hypotheticalBlack,
        blackExists: true,
      });
    }
    
    // Добавляем отсутствующий black сат в массив
    if (!blackSet.has(hypotheticalBlack)) {
      missingBlackSats.push(hypotheticalBlack);
      // Проверяем, есть ли отсутствующий сат в листингах
      if (blackListingsSet.has(hypotheticalBlack.toString())) {
        availableBlackSats.push(hypotheticalBlack);
      }
    }
  });

  blackSats.forEach((black) => {
    const hypotheticalUncommon = black - 99_999_999;
    if (uncommonSet.has(hypotheticalUncommon)) {
      dataSource.push({
        key: `black-${black}`,
        uncommon: hypotheticalUncommon,
        uncommonExists: true,
        black,
        blackExists: true,
      });
    }
    
    // Добавляем отсутствующий uncommon сат в массив
    missingUncommonSats.push(hypotheticalUncommon);
    // Проверяем, есть ли отсутствующий сат в листингах
    if (uncommonListingsSet.has(hypotheticalUncommon.toString())) {
      availableUncommonSats.push(hypotheticalUncommon);
    }
  });

  // Добавляем доступные отсутствующие саты в dataSource
  availableUncommonSats.forEach((uncommon) => {
    const hypotheticalBlack = uncommon + 99_999_999;
    dataSource.push({
      key: `available-uncommon-${uncommon}`,
      uncommon,
      uncommonExists: false,
      black: hypotheticalBlack,
      blackExists: blackSet.has(hypotheticalBlack),
    });
  });

  availableBlackSats.forEach((black) => {
    const hypotheticalUncommon = black - 99_999_999;
    dataSource.push({
      key: `available-black-${black}`,
      uncommon: hypotheticalUncommon,
      uncommonExists: uncommonSet.has(hypotheticalUncommon),
      black,
      blackExists: false,
    });
  });

  console.log('Отсутствующие uncommon саты:', missingUncommonSats);
  console.log('Отсутствующие black саты:', missingBlackSats);
  console.log('Доступные отсутствующие uncommon саты:', availableUncommonSats);
  console.log('Доступные отсутствующие black саты:', availableBlackSats);

  return (
    <div>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </div>
  );
};

export default Sheet;
