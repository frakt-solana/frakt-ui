import React, { useContext, useState } from 'react';

import { HeaderStateContext } from './headerState.context';

type OnContentScroll = (event: React.UIEvent<HTMLDivElement>) => void;

type UseHeaderState = () => {
  isHeaderHidden: boolean;
  onContentScroll: OnContentScroll;
};

export const useHeaderState: UseHeaderState = () => {
  const { isHeaderHidden, setIsHeaderHidden } = useContext(HeaderStateContext);

  const [scrollTop, setScrollTop] = useState(0);
  const [prevOffsetTop, setPrevOffsetTop] = useState(0);

  const onContentScroll: OnContentScroll = (event) => {
    if (event.currentTarget.getAttribute('id') !== 'app-content') {
      return;
    }

    const offset = event.currentTarget.scrollTop;

    if (offset > scrollTop) setPrevOffsetTop(offset);
    if (offset < prevOffsetTop) setScrollTop(offset);

    if (offset > 200 && offset > prevOffsetTop) {
      setIsHeaderHidden(true);
    }
    if (offset + 100 < prevOffsetTop) {
      setIsHeaderHidden(false);
    }
  };

  return { onContentScroll, isHeaderHidden };
};
