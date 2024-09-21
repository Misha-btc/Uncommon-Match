import { magicEdenKey } from '../keystore';

const useMagicEden = () => {
  const fetchRareSats = async (walletAddress) => {
    const options = {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${magicEdenKey}`
      }
    };

    let allTokens = [];
    let nextOffset = '0';
    let iterationCount = 0;
    const maxIterations = 200;

    do {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const url = `https://api-mainnet.magiceden.dev/v2/ord/btc/raresats/wallet/utxos?walletAddress=${walletAddress}&listed=false&limit=100&offset=${nextOffset}`;

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!data || !Array.isArray(data.tokens)) {
          console.error('Неожиданный формат данных:', data);
          break;
        }

        allTokens = allTokens.concat(data.tokens);
        nextOffset = data.nextOffset;
        iterationCount++;

        if (data.tokens.length < 100 || data.nextOffset === '0') {
          break;
        }
      } catch (error) {
        console.error('Ошибка при запросе к Magic Eden API:', error);
        break;
      }
    } while (iterationCount < maxIterations);
    return { tokens: allTokens }; // Изменено для возврата данных под ключом токенс
  };

  return { fetchRareSats };
};

export default useMagicEden;