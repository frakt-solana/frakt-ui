import React, { FC, useState } from 'react';
import {
  HeaderStateContextValues,
  HeaderStateProviderProps,
} from './headerState.model';

export const HeaderStateContext = React.createContext<HeaderStateContextValues>(
  {
    isHeaderHidden: false,
    setIsHeaderHidden: () => {},
  },
);

export const HeaderStateProvider: FC<HeaderStateProviderProps> = ({
  children,
}) => {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  return (
    <HeaderStateContext.Provider
      value={{
        isHeaderHidden,
        setIsHeaderHidden,
      }}
    >
      {children}
    </HeaderStateContext.Provider>
  );
};
