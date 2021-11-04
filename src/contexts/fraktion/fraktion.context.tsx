import React, { useContext } from 'react';
import { useWallet } from '../../external/contexts/wallet';
import { useConnection } from '../../external/contexts/connection';
import { FraktionContextType } from './fraktion.model';
import { fraktionalize } from './fraktion';

const FraktionContext = React.createContext<FraktionContextType>({
  fraktionalize: () => Promise.resolve(null),
});

export const FraktionProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { wallet } = useWallet();
  const connection = useConnection();

  return (
    <FraktionContext.Provider
      value={{
        fraktionalize: (tokenMint, pricePerFraction, fractionsAmount, token) =>
          fraktionalize(
            tokenMint,
            pricePerFraction,
            fractionsAmount,
            token,
            wallet,
            connection,
          ),
      }}
    >
      {children}
    </FraktionContext.Provider>
  );
};

export const useFraktion = (): FraktionContextType => {
  const { fraktionalize } = useContext(FraktionContext);
  return {
    fraktionalize,
  };
};
