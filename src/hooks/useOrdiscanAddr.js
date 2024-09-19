import { useState } from 'react';
import axios from 'axios';
import { ordiscanKey } from '../keystore';

const useOrdiscanAddr = () => {
  const [rareSats, setRareSats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRareSats = async (address) => {
    if (!address) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.ordiscan.com/v1/address/${address}/rare-sats`,
        {
          headers: {
            Authorization: `Bearer ${ordiscanKey}`,
          },
        }
      );
      setRareSats(response.data);
      return response.data; // Возвращаем данные напрямую
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { rareSats, loading, error, fetchRareSats };
};

export default useOrdiscanAddr;
