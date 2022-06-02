import InfiniteScroll, {
  Props as InfinityScrollProps,
} from 'react-infinite-scroll-component';
import { useEffect, useState } from 'react';

import styles from './styles.module.scss';
import classNames from 'classnames';
import { Loader } from '../Loader';
import { useDebounce } from '../../hooks';

interface FakeInfinityScrollProps {
  itemsToShow?: number;
  next: () => void;
  infinityScrollProps?: Omit<
    InfinityScrollProps,
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

export type FetchData = (props: {
  offset: number;
  limit: number;
  searchStr?: string;
}) => Promise<any[]>;

type UseInfinityScroll = (props: {
  fetchData: FetchData;
  itemsPerScroll: number;
}) => {
  next: () => void;
  search: string;
  setSearch: (searchStr: string) => void;
  items: any;
};

export const useInfinityScroll: UseInfinityScroll = ({
  fetchData,
  itemsPerScroll = 10,
}) => {
  const [search, setSearch] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [items, setItems] = useState<any[]>([]);

  const fetchItems = async (nextSearch: string) => {
    const nextItems = await fetchData({
      offset,
      limit: itemsPerScroll,
      searchStr: search,
    });
    setItems((prev) => (nextSearch ? nextItems : [...prev, ...nextItems]));
  };

  const next = (search?: string) => {
    setOffset((prev) => prev + itemsPerScroll);
    fetchItems(search);
  };

  const nextDebounced = useDebounce((search: string) => {
    next(search);
  }, 500);

  useEffect(() => {
    setOffset(0);
    nextDebounced(search);
  }, [search]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     next();
  //   }, 2000);
  // }, []);

  return {
    next,
    search,
    setSearch,
    items,
  };
};

const FakeInfinityScroll = ({
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
}: FakeInfinityScrollProps): JSX.Element => {
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
    <InfiniteScroll
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
    </InfiniteScroll>
  );
};

export default FakeInfinityScroll;
