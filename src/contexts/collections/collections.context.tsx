import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { ConnectWalletModal } from '../../components/ConnectWallerModal';
import {
  CollectionsContextInterface,
  CollectionsProviderProps,
} from './collections.model';
import {
  fetchCollectionsData,
  mapVaultsByCollectionName,
} from '../../utils/collections';

export const CollectionsContext =
  React.createContext<CollectionsContextInterface>({
    loading: false,
  });

export const CollectionsProvider: FC<CollectionsProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  // const vaultsByCollectionName = useMemo(() => {
  //   return loading ? {} : mapVaultsByCollectionName(vaults);
  // }, [loading, vaults]);
  //
  // const getCollectionItems = async (): Promise<void> => {
  //   const collectionsNames = Object.keys(vaultsByCollectionName);
  //   const collectionsData = await fetchCollectionsData(collectionsNames);
  //   setCollectionsData(collectionsData);
  // };

  // useEffect(() => {
  //   !loading && getCollectionItems();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [loading]);

  return (
    <CollectionsContext.Provider value={null}>
      {children}
      <ConnectWalletModal />
    </CollectionsContext.Provider>
  );
};

export const useCollections = (): CollectionsContextInterface => {
  const { loading } = useContext(CollectionsContext);

  return { loading };
};
