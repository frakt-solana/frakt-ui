import React, { FC, useContext, useState } from 'react';
import {
  HeaderStateContextInterface,
  HeaderStateProviderProps,
} from './headerState.model';

export const HeaderStateContext =
  React.createContext<HeaderStateContextInterface>({
    visible: false,
    setVisible: () => {},
  });

export const HeaderStateProvider: FC<HeaderStateProviderProps> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <HeaderStateContext.Provider
      value={{
        visible,
        setVisible,
      }}
    >
      {children}
    </HeaderStateContext.Provider>
  );
};

export const useHeaderState = (): HeaderStateContextInterface => {
  const { setVisible, visible } = useContext(HeaderStateContext);

  return { setVisible, visible };
};
