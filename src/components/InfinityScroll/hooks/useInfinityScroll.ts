import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '../../../hooks';

export type FetchData<T> = (props: {
  offset: number;
  limit: number;
  searchStr?: string;
}) => Promise<T[]>;

export const useInfinityScroll = <T, D>(
  {
    fetchData,
    itemsPerScroll = 10,
  }: {
    fetchData: FetchData<T>;
    itemsPerScroll?: number;
  },
  [deps]: [D],
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
  const { publicKey } = useWallet();

  const fetchItems = async (): Promise<void> => {
    const nextItems = await fetchData({
      offset,
      limit: itemsPerScroll,
      searchStr: stringRef.current,
    });

    setItems([...items, ...nextItems]);
  };

  const next = (): void => {
    if (publicKey) {
      setOffset(offset + itemsPerScroll);
      fetchItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const nextDebounced = useDebounce((search: string): void => {
    stringRef.current = search;
    next();
  }, 500);

  useEffect(() => {
    setItems([]);
    next();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);

  useEffect(() => {
    nextDebounced(search);
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
