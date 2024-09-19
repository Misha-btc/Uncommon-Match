import React, { createContext, useState, useContext } from 'react';

const MagisatListingContext = createContext();

export const MagisatListingProvider = ({ children }) => {
  const [uncommonListings, setUncommonListings] = useState(() => {
    const saved = localStorage.getItem('magisatUncommonListings');
    return saved ? JSON.parse(saved) : [];
  });

  const [blackUncommonListings, setBlackUncommonListings] = useState(() => {
    const saved = localStorage.getItem('magisatBlackUncommonListings');
    return saved ? JSON.parse(saved) : [];
  });

  const [listingStore, setListingStore] = useState(() => {
    const saved = localStorage.getItem('magisatListings');
    return saved ? JSON.parse(saved) : [];
  });

  const addUncommonListing = (newListing) => {
    setUncommonListings((prevListings) => {
      const updatedListings = [...prevListings, newListing];
      localStorage.setItem('magisatUncommonListings', JSON.stringify(updatedListings));
      return updatedListings;
    });
  };

  const addBlackUncommonListing = (newListing) => {
    setBlackUncommonListings((prevListings) => {
      const updatedListings = [...prevListings, newListing];
      localStorage.setItem('magisatBlackUncommonListings', JSON.stringify(updatedListings));
      return updatedListings;
    });
  };

  const removeListing = (listingId, isBlackUncommon) => {
    const setListings = isBlackUncommon ? setBlackUncommonListings : setUncommonListings;
    const storageKey = isBlackUncommon ? 'magisatBlackUncommonListings' : 'magisatUncommonListings';

    setListings((prevListings) => {
      const updatedListings = prevListings.filter(listing => listing.id !== listingId);
      localStorage.setItem(storageKey, JSON.stringify(updatedListings));
      return updatedListings;
    });
  };

  return (
    <MagisatListingContext.Provider 
      value={{ 
        uncommonListings,
        blackUncommonListings,
        addUncommonListing,
        addBlackUncommonListing,
        removeListing,
        listingStore,
        setListingStore
      }}
    >
      {children}
    </MagisatListingContext.Provider>
  );
};

export const useMagisatListing = () => useContext(MagisatListingContext);
