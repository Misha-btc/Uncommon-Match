import { useState, useCallback, useRef } from 'react';
import { deezyPostUrl, deezyKey, deezyGetSatUrl } from '../keystore';
import { useRareSats } from '../context/rareSatsContext';
import { sortRareSats } from './useSortingSats';


const useDeezy = () => {
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [statusResult, setStatusResult] = useState(null);
  const intervalRef = useRef(null);
  const { addBlackSats, addUncommonSats, loading, setLoading } = useRareSats();


  const checkStatus = useCallback(async (requestId) => {
    try {
      const statusResponse = await fetch(`${deezyGetSatUrl}${requestId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-token': deezyKey,
        },
      });

      if (!statusResponse.ok) {
        throw new Error('Error getting status');
      }

      const statusData = await statusResponse.json();
      console.log('statusData = await statusResponse.json();', statusData);

      if (statusData.status === 'COMPLETED') {
        console.log('status completed:', statusData);
        console.log('ЖОООООПА');
        setStatusResult(statusData);
        const { blackUncommonSats, uncommonSats } = sortRareSats(statusData);
        addBlackSats(blackUncommonSats);
        addUncommonSats(uncommonSats);
        clearInterval(intervalRef.current);
      } else if (statusData.status === 'PENDING' || statusData.status === 'PROCESSING') {
        console.log('Processing still continues...');
      } else {
        clearInterval(intervalRef.current);
        setError('Unexpected status: ' + statusData.status);
      }
    } catch (err) {
      clearInterval(intervalRef.current);
      setError(err.message);
      setLoading('');
    }
  }, [addBlackSats, addUncommonSats, setLoading]);

  const scanAddress = async (address) => {
    setLoading('wallet scanning...');
    setError(null);

    try {
      const response = await fetch(deezyPostUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-token': deezyKey,
        },
        body: JSON.stringify({
          address_to_scan: address,
          included_tags: [
            ["alpha"],
            ["omega"]
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Error scanning address');
      }

      const data = await response.json();
      console.log(data);
      setResult(data);

      // Start checking status every second
      intervalRef.current = setInterval(() => checkStatus(data.id), 1000);

    } catch (err) {
      setError(err.message);
      setLoading('');
    }
  };

  return { scanAddress, loading, error, result, statusResult };
};

export default useDeezy;
