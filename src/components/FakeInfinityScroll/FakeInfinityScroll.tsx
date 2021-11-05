import InfiniteScroll, {
  Props as InfinityScrollProps,
} from 'react-infinite-scroll-component';
import styles from './styles.module.scss';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Loader } from '../Loader';

interface FakeInfinityScrollProps {
  items: any;
  perPage?: number;
  infinityScrollProps?: Omit<
    InfinityScrollProps,
    'dataLength' | 'next' | 'hasMore' | 'children'
  >;
  component: any;
  wrapperClassName?: string;
  emptyMessage?: string;
  emptyMessageClassName?: string;
  isLoading?: boolean;
  loaderWrapperClassName?: string;
}

export const FakeInfinityScroll = ({
  items: allItems,
  perPage = 20,
  infinityScrollProps,
  component: Component,
  wrapperClassName,
  loaderWrapperClassName,
  isLoading = false,
  emptyMessage = 'No items found',
  emptyMessageClassName,
}: FakeInfinityScrollProps): JSX.Element => {
  const page = useRef<number>(1);
  const [items, setItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const getMoreData = () => {
    const lastIndex = page.current * perPage;
    const newItems = allItems.slice(0, lastIndex);
    if (lastIndex > allItems.length) setHasMore(false);
    page.current++;
    setItems(newItems);
  };

  useEffect(() => {
    page.current = 1;
    setItems([]);
    setHasMore(true);
    getMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allItems, isLoading]);

  if (isLoading) {
    return (
      <div className={classNames(styles.loader, loaderWrapperClassName)}>
        <Loader />
      </div>
    );
  }

  if (!allItems.length) {
    return (
      <div className={classNames(styles.empty, emptyMessageClassName)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <InfiniteScroll
      scrollableTarget="app-content"
      loader={null}
      {...infinityScrollProps}
      dataLength={items.length}
      next={getMoreData}
      hasMore={hasMore}
    >
      <div className={classNames(wrapperClassName)}>
        {items.map((props, idx) => (
          <Component key={idx} {...props} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default FakeInfinityScroll;
