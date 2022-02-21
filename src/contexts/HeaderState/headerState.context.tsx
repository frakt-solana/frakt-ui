import React, { FC, useContext, useState } from 'react';
import {
  HeaderStateContextInterface,
  HeaderStateProviderProps,
} from './headerState.model';

export const HeaderStateContext =
  React.createContext<HeaderStateContextInterface>({
    headerVisible: true,
    setHeaderVisible: () => {},
  });

export const HeaderStateProvider: FC<HeaderStateProviderProps> = ({
  children,
}) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  return (
    <HeaderStateContext.Provider
      value={{
        headerVisible: isHeaderVisible,
        setHeaderVisible: setIsHeaderVisible,
      }}
    >
      {children}
    </HeaderStateContext.Provider>
  );
};

export const useHeaderState = (): HeaderStateContextInterface => {
  const { setHeaderVisible, headerVisible } = useContext(HeaderStateContext);

  return { setHeaderVisible, headerVisible };
};
