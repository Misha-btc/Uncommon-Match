import { useState } from 'react';
import { magisatKey } from '../keystore';

const useMagisat = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blackList, setBlackList] = useState([]);
  const [uncommonList, setUncommonList] = useState([]);

  const blackId = '6c2a1e25-6750-422c-9ea6-a8971d97ddcb';
  const uncommonId = '86b46002-9216-4d19-9f3f-46c61c34632f';

  const fetchListings = async (offset = 0, limit = 50) => {
    setLoading(true);
    setError(null);

    try {
      const fetchData = async (tagId) => {
        const response = await fetch('https://api.magisat.io/external/v1/listing', {
          method: 'POST',
          headers: {
            'X-MGST-API-KEY': magisatKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ offset, limit, tagId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ошибка! статус: ${response.status}`);
        }

        const text = await response.text();
        return JSON.parse(text);
      };

      const [blackData, uncommonData] = await Promise.all([
        fetchData(blackId),
        fetchData(uncommonId),
      ]);

      setBlackList(blackData.results || []);
      setUncommonList(uncommonData.results || []);
      setListings([...blackData.results, ...uncommonData.results]);
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
