export function sortRareSats(rareSats) {
  console.log('Входные данные в sortRareSats:', rareSats); // Логируем входные данные

  const blackUncommonSats = [];
  const uncommonSats = [];

  try {
    rareSats.satributes.forEach(satribute => {
      for (const rarityTag of satribute.rarity_tags) {
        if (Array.isArray(rarityTag)) {
          for (const tag of rarityTag) {
            if (tag === 'omega') {
              blackUncommonSats.push(satribute.sat_number);
              break;
            } else if (tag === 'alpha') {
              uncommonSats.push(satribute.sat_number);
              break;
            }
          }
        } else if (typeof rarityTag === 'string') {
          if (rarityTag === 'omega') {
            blackUncommonSats.push(satribute.sat_number);
            break;
          } else if (rarityTag === 'alpha') {
            uncommonSats.push(satribute.sat_number);
            break;
          } else {
            console.warn('Неизвестный тег:', rarityTag);
          }
        } else {
          console.warn('rarityTag не является массивом или строкой:', rarityTag); // Логируем предупреждение
        }
      }
    });
  } catch (error) {
    console.error('Ошибка в sortRareSats:', error); // Логируем ошибку
  }

  console.log('Результат sortRareSats:', { blackUncommonSats, uncommonSats }); // Логируем результат
  return { blackUncommonSats, uncommonSats };
}

export function sortListings(blackList, uncommonList) {
  const blackListings = [];
  const uncommonListings = [];

  if (blackList && blackList.length > 0) {
    blackList.forEach(listing => {
      if (listing.lowestSatIndex && listing.lowestSatIndex.endsWith('9')) {
        blackListings.push({
          satIndex: listing.lowestSatIndex,
          relativeUnitPrice: listing.relativeUnitPrice,
          id: listing.id
        });
      }
    });
  }

  if (uncommonList && uncommonList.length > 0) {
    uncommonList.forEach(listing => {
      if (listing.lowestSatIndex && listing.lowestSatIndex.endsWith('0')) {
        uncommonListings.push({
          satIndex: listing.lowestSatIndex,
          relativeUnitPrice: listing.relativeUnitPrice,
          id: listing.id
        });
      }
    });
  }

  return { blackListings, uncommonListings };
}

export function useSortingSats() {
  return {
    sortRareSats,
    sortListings
  };
}
