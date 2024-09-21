import { useState } from 'react';
import { magisatKey } from '../keystore';
import { sortListings } from './useSortingSats';
import { useMagisatListing } from '../context/magisatListingContext';

const useMagisat = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blackList, setBlackList] = useState([]);
  const [uncommonList, setUncommonList] = useState([]);
  const { setBlackUncommonListings, setUncommonListings } = useMagisatListing();

  const blackId = '52074589-f582-4006-a6b6-f16cb226a888';
  const uncommonId = 'f5eff054-f8e7-4220-af1f-406866ebbcc6';

  const fetchListings = async () => {
    setLoading(true);
    setError(null);

    const fetchBatch = async (tagId, offsets) => {
      const promises = offsets.map(offset =>
        fetch('https://api.magisat.io/external/v1/listing', {
          method: 'POST',
          headers: {
            'X-MGST-API-KEY': magisatKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ offset, limit: 50, tagId }),
        }).then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ошибка! статус: ${response.status}`);
          }
          return response.json();
        })
      );

      return Promise.all(promises);
    };

    const fetchAllData = async (tagId) => {
      let allResults = [];
      let offset = 0;
      const limit = 50;

      while (true) {
        try {
          const offsets = [offset, offset + 50, offset + 100, offset + 150, offset + 200];
          const batchResults = await fetchBatch(tagId, offsets);

          const newResults = batchResults.flatMap(data => data.results || []);
          allResults = [...allResults, ...newResults];

          if (newResults.length < 5 * limit) {
            break; // Все данные получены
          }

          offset += 5 * limit;
          await new Promise(resolve => setTimeout(resolve, 100)); // Ждём 1 минуту
        } catch (err) {
          console.error(`Ошибка при загрузке листингов для tagId ${tagId}:`, err);
          setError(`Произошла ошибка при загрузке листингов: ${err.message}`);
          break;
        }
      }

      return allResults;
    };

    try {
      const [blackData, uncommonData] = await Promise.all([
        fetchAllData(blackId),
        fetchAllData(uncommonId),
      ]);

      setBlackList(blackData);
      setUncommonList(uncommonData);
      console.log('blackData', blackData);
      console.log('uncommonData', uncommonData);
      
      const allListings = [...blackData, ...uncommonData];
      setListings(allListings);
      const sortedListings = sortListings(blackData, uncommonData);
      setBlackUncommonListings(sortedListings.blackListings);
      setUncommonListings(sortedListings.uncommonListings);
      localStorage.setItem('magisatBlackUncommonListings', JSON.stringify(sortedListings.blackListings));
      localStorage.setItem('magisatUncommonListings', JSON.stringify(sortedListings.uncommonListings));
      console.log('sortedListings', sortedListings);
    } catch (err) {
      console.error('Ошибка при загрузке листингов:', err);
      setError(`Произошла ошибка при загрузке листингов: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { listings, loading, error, fetchListings, blackList, uncommonList};
};

export default useMagisat;
