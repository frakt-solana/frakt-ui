import { useState } from 'react';

export const useFakeInfinityScroll = (
  itemsPerScroll = 20,
): {
  itemsToShow: number;
  next: () => void;
  setItemsToShow: (itemsToShow: number) => void;
} => {
  const [itemsToShow, setItemsToShow] = useState<number>(itemsPerScroll);

  const onScrollHandler = () => setItemsToShow((prev) => prev + itemsPerScroll);
  return {
    itemsToShow,
    setItemsToShow,
    next: onScrollHandler,
  };
};
