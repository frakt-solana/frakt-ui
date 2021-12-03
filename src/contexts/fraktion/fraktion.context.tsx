import React, { useContext, useEffect, useState } from 'react';
import { keyBy } from 'lodash';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import {
  fetchVaultsFunction,
  FraktionContextType,
  SafetyBox,
  VaultData,
  VaultsMap,
  VaultState,
} from './fraktion.model';
import {
  buyout,
  createFraktionsMarket,
  fraktionalize,
  redeem,
} from './fraktion';
import { getMarkets } from '../../utils/markets';
import BN from 'bn.js';
import { VAULTS_AND_META_CACHE_URL } from './fraktion.constants';

const FraktionContext = React.createContext<FraktionContextType>({
  loading: false,
  error: null,
  vaults: [],
  vaultsMarkets: [],
  fraktionalize: () => Promise.resolve(null),
  buyout: () => Promise.resolve(null),
  redeem: () => Promise.resolve(null),
  createFraktionsMarket: () => Promise.resolve(null),
  refetch: () => Promise.resolve(null),
  patchVault: () => {},
});

export const FraktionProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const {
    publicKey: walletPublicKey,
    signTransaction,
    signAllTransactions,
  } = useWallet();
  const { connection } = useConnection();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [vaults, setVaults] = useState<VaultData[]>([]);
  const [vaultsMarkets, setVaultsMarkets] = useState([]);

  const fetchVaultsMarkets = async () => {
    try {
      const markets = await getMarkets();
      setVaultsMarkets(markets);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const fetchVaults: fetchVaultsFunction = async () => {
    try {
      setLoading(true);

      const { allVaults, metas } = await (
        await fetch(VAULTS_AND_META_CACHE_URL)
      ).json();

      const { safetyBoxes: rawSafetyBoxes, vaults: rawVaults } = allVaults;

      const metadataByMint = metas.reduce((acc, meta) => {
        return { ...acc, [meta.mintAddress]: meta };
      }, {});

      const safetyBoxes = rawSafetyBoxes as SafetyBox[];
      const vaultsMap = keyBy(rawVaults, 'vaultPubkey') as VaultsMap;

      const vaultsData: VaultData[] = safetyBoxes.reduce(
        (
          acc,
          { vault: vaultPubkey, tokenMint: nftMint, safetyBoxPubkey, store },
        ) => {
          const vault = vaultsMap[vaultPubkey];
          const arweaveMetadata = metadataByMint[nftMint].fetchedMeta;
          const verification = metadataByMint[nftMint].isVerifiedStatus;

          if (vault && arweaveMetadata) {
            const { name, description, image, attributes } = arweaveMetadata;
            const {
              authority,
              fractionMint,
              fractionsSupply,
              lockedPricePerShare,
              priceMint,
              state,
              fractionTreasury,
              redeemTreasury,
              createdAt,
            } = vault;

            const vaultData: VaultData = {
              fractionMint,
              authority,
              supply: new BN(fractionsSupply, 16),
              lockedPricePerFraction: new BN(lockedPricePerShare, 16),
              priceTokenMint: priceMint,
              publicKey: vaultPubkey,
              state: VaultState[state],
              nftMint,
              name,
              description,
              imageSrc: image,
              nftAttributes: attributes,
              fractionTreasury,
              redeemTreasury,
              safetyBoxPubkey,
              store,
              isNftVerified: verification?.success || false,
              nftCollectionName: verification?.collection,
              createdAt: new BN(createdAt, 16).toNumber(),
              buyoutPrice: new BN(lockedPricePerShare, 16).mul(
                new BN(fractionsSupply, 16),
              ),
            };

            return [...acc, vaultData];
          }

          return acc;
        },
        [],
      );

      setVaults(vaultsData);

      return vaultsData;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const patchVault = (vaultInfo: VaultData): void => {
    setVaults((vaults) =>
      vaults.reduce((vaults, vault) => {
        if (vault.publicKey === vaultInfo.publicKey) {
          return [...vaults, vaultInfo];
        }
        return [...vaults, vault];
      }, []),
    );
  };

  useEffect(() => {
    connection && fetchVaults();
    fetchVaultsMarkets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  return (
    <FraktionContext.Provider
      value={{
        loading,
        error,
        vaults,
        vaultsMarkets,
        fraktionalize: (
          userNft,
          tickerName,
          pricePerFraction,
          fractionsAmount,
          token,
        ) =>
          fraktionalize(
            userNft,
            tickerName,
            pricePerFraction,
            fractionsAmount,
            token,
            walletPublicKey,
            signTransaction,
            connection,
          ),
        buyout: (vault, userTokensByMint) =>
          buyout(
            vault,
            userTokensByMint,
            walletPublicKey,
            signTransaction,
            connection,
          ),
        redeem: (vault) =>
          redeem(vault, walletPublicKey, signTransaction, connection),
        createFraktionsMarket: (fractionsMintAddress, tickerName) =>
          createFraktionsMarket(
            fractionsMintAddress,
            tickerName,
            walletPublicKey,
            signAllTransactions,
            connection,
          ),
        refetch: fetchVaults,
        patchVault,
      }}
    >
      {children}
    </FraktionContext.Provider>
  );
};

export const useFraktion = (): FraktionContextType => {
  const {
    loading,
    error,
    vaults,
    vaultsMarkets,
    fraktionalize,
    buyout,
    redeem,
    createFraktionsMarket,
    refetch: fetchVaults,
    patchVault,
  } = useContext(FraktionContext);
  return {
    loading,
    error,
    vaults,
    vaultsMarkets,
    fraktionalize,
    buyout,
    redeem,
    createFraktionsMarket,
    refetch: fetchVaults,
    patchVault,
  };
};
