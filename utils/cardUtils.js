/**
 * Equalizes the height of all cards in a collection
 * @param {Array} cardsRef 
 */
export const equalizeCardHeights = (cardsRef) => {
    if (!cardsRef || cardsRef.length === 0) return;

    cardsRef.forEach(card => {
      if (card) card.style.height = 'auto';
    });

    return new Promise(resolve => {
      setTimeout(() => {
        let maxHeight = 0;
        cardsRef.forEach(card => {
          if (card && card.offsetHeight > maxHeight) {
            maxHeight = card.offsetHeight;
          }
        });

        if (maxHeight > 0) {
          cardsRef.forEach(card => {
            if (card) card.style.height = `${maxHeight}px`;
          });
        }
        
        resolve(maxHeight);
      }, 100);
    });
  };