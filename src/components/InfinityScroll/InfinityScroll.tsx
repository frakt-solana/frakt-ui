import InfiniteScrollComponent, {
  Props,
} from 'react-infinite-scroll-component';
import { useEffect, useRef, useState } from 'react';

import styles from './styles.module.scss';
import classNames from 'classnames';
import { Loader } from '../Loader';
import { useDebounce } from '../../hooks';

interface InfinityScrollProps {
  itemsToShow?: number;
  next: () => void;
  infinityScrollProps?: Omit<
    Props,
    'dataLength' | 'next' | 'hasMore' | 'children'
  >;
  wrapperClassName?: string;
  emptyMessage?: string;
  emptyMessageClassName?: string;
  isLoading?: boolean;
  customLoader?: JSX.Element;
  children: JSX.Element[];
  scrollableTargetId?: string;
}

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

export type FetchData = <T>(props: {
  offset: number;
  limit: number;
  searchStr?: string;
}) => Promise<T[]>;

type UseInfinityScroll = (props: {
  fetchData: FetchData;
  itemsPerScroll?: number;
}) => {
  next: () => void;
  search: string;
  setSearch: (searchStr: string) => void;
  items: any;
  nextDebounced: (search: string) => void;
};

export const useInfinityScroll: UseInfinityScroll = ({
  fetchData,
  itemsPerScroll = 5,
}) => {
  const [search, setSearch] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [items, setItems] = useState<any>([]);
  const stringRef = useRef(null);

  const fetchItems = async (): Promise<void> => {
    const nextItems = await fetchData({
      offset,
      limit: itemsPerScroll,
      searchStr: stringRef.current,
    });

    setItems([...items, ...nextItems]);
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

const InfinityScroll = ({
  itemsToShow = 20,
  next,
  wrapperClassName,
  isLoading = false,
  emptyMessage = 'No items found',
  emptyMessageClassName,
  children,
  infinityScrollProps,
  scrollableTargetId = 'app-content',
  customLoader,
}: InfinityScrollProps): JSX.Element => {
  if (isLoading) {
    return (
      customLoader || (
        <div className={styles.loader}>
          <Loader size={'large'} />
        </div>
      )
    );
  }

  if (!children.length) {
    return (
      <div className={classNames(styles.empty, emptyMessageClassName)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <InfiniteScrollComponent
      scrollableTarget={scrollableTargetId}
      next={next}
      dataLength={itemsToShow}
      hasMore={true}
      loader={false}
      {...infinityScrollProps}
    >
      <div className={classNames(wrapperClassName)}>
        {children?.slice(0, itemsToShow).map((child) => child)}
      </div>
    </InfiniteScrollComponent>
  );
};

export default InfinityScroll;
