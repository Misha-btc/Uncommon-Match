import React, { useEffect } from 'react';
import Sheet from './sheet';
import useMagisat from '../hooks/useMagisat';
import { sortListings } from '../hooks/useSortingSats';
import { useMagisatListing } from '../context/magisatListingContext';
function MatchPage() {
  const { listings, loading, error, fetchListings, blackList, uncommonList} = useMagisat();
  const { listingStore, setListingStore } = useMagisatListing();

  useEffect(() => {
    const sortedListings = sortListings(blackList, uncommonList);
    localStorage.setItem('magisatListings', JSON.stringify(sortedListings));
    setListingStore(sortedListings);
  }, [blackList, uncommonList, setListingStore]);

  const handleFetchListings = () => {
    const blackId = '6c2a1e25-6750-422c-9ea6-a8971d97ddcb';
    const uncommonId = '86b46002-9216-4d19-9f3f-46c61c34632f';
    fetchListings(undefined, undefined, blackId, uncommonId);
  };

  const handleGetListings = () => {
    const listings = localStorage.getItem('magisatListings');
    console.log('listings', listings);
  };

  return (
    <>
      <div>
        <button onClick={handleFetchListings}>Загрузить листинги</button>
        {loading && <p>Загрузка...</p>}
        {error && <p>Ошибка: {error}</p>}
        {listings.length > 0 ? (
          <p>Loaded {listings.length} listings</p>
        ) : (
          <p>Listings not loaded or list is empty</p>
        )}
      </div>
      <div><button onClick={handleGetListings}>XXX</button></div>
      <div>
        <h1 style={{ textAlign: 'center' }}>Your matches</h1>
        <Sheet listings={listingStore} />
      </div>
    </>
  );
}

export default MatchPage;
