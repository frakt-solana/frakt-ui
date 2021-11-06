import InfiniteScroll, {
  Props as InfinityScrollProps,
} from 'react-infinite-scroll-component';
import { useState } from 'react';

import styles from './styles.module.scss';
import classNames from 'classnames';
import { Loader } from '../Loader';

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
  loaderWrapperClassName?: string;
  children: JSX.Element[];
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

const FakeInfinityScroll = ({
  itemsToShow = 20,
  next,
  wrapperClassName,
  loaderWrapperClassName,
  isLoading = false,
  emptyMessage = 'No items found',
  emptyMessageClassName,
  children,
  infinityScrollProps,
}: FakeInfinityScrollProps): JSX.Element => {
  if (isLoading) {
    return (
      <div className={classNames(styles.loader, loaderWrapperClassName)}>
        <Loader size={'large'} />
      </div>
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
      scrollableTarget="app-content"
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
