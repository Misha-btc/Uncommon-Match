export function sortRareSats(rareSats) {

  const blackUncommonSats = [];
  const uncommonSats = [];

  rareSats.tokens.forEach(sat => {
    sat.rareSatsUtxo.satRanges.forEach(satRange => {
      satRange.satributes.forEach(satribute => {
        if (satribute === 'Black Uncommon') {
          blackUncommonSats.push(satRange.from);
        } else if (satribute === 'Uncommon') {
          uncommonSats.push(satRange.from);
        }
      });
    });
  });

  return { blackUncommonSats, uncommonSats };
}

export function sortListings(blackList, uncommonList) {
    const blackListings = [];
    const uncommonListings = [];
    if (blackList && blackList.length > 0) {
      blackList.forEach(listing => {
        if (listing.lowestSatIndex && listing.lowestSatIndex.endsWith('9')) {
          blackListings.push(listing.lowestSatIndex);
        }
      });
    }

    if (uncommonList && uncommonList.length > 0) {
      uncommonList.forEach(listing => {
        if (listing.lowestSatIndex && listing.lowestSatIndex.endsWith('0')) {
          uncommonListings.push(listing.lowestSatIndex);
        }
      });
    }
  return {blackListings, uncommonListings};
}

export function useSortingSats() {
  return {
    sortRareSats,
    sortListings
  };
}
