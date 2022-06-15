import { useState, useRef, useEffect } from 'react';
import { isArray } from 'ramda-adjunct';

import { useDebounce } from '../../../hooks';

export type FetchData<T> = (props: {
  offset: number;
  limit: number;
  searchStr?: string;
}) => Promise<T[]>;

export const useInfinityScroll = <T>(
  {
    fetchData,
    itemsPerScroll = 10,
  }: {
    fetchData: FetchData<T>;
    itemsPerScroll?: number;
  },
  deps: any[] = [],
): {
  next: () => void;
  search: string;
  setSearch: (searchStr: string) => void;
  items: T[];
  nextDebounced: (search: string) => void;
} => {
  const [search, setSearch] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [items, setItems] = useState<T[]>([]);
  const stringRef = useRef(null);
  const fetchOnlyConnectedWallet = deps[0]?.publicKey;

  const fetchItems = async (): Promise<void> => {
    const nextItems = await fetchData({
      offset,
      limit: itemsPerScroll,
      searchStr: stringRef.current,
    });

    if (isArray(nextItems)) {
      setItems([...items, ...nextItems]);
    }
  };

  const next = (): void => {
    setOffset(offset + itemsPerScroll);
    fetchItems();
  };

  const nextDebounced = useDebounce((search: string): void => {
    stringRef.current = search;
    next();
  }, 500);

  useEffect(() => {
    if (fetchOnlyConnectedWallet) {
      setItems([]);
      next();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOnlyConnectedWallet]);

  useEffect(() => {
    search && nextDebounced(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return {
    next,
    search,
    setSearch,
    items,
    nextDebounced,
  };
};
