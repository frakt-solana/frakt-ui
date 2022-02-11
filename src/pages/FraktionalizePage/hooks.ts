import { useState } from 'react';

import { UserNFT, useUserTokens } from '../../contexts/userTokens';
import { useFraktion, VaultData } from '../../contexts/fraktion';

export interface FraktionalizeTxnData {
  newNfts: UserNFT[];
  lockedNfts: UserNFT[];
  tickerName: string;
  pricePerFraction: number;
  fractionsAmount: number;
  vaultName: string;
  vault?: VaultData;
}

export type AddNftsToActiveVault = (params: {
  vaultData: VaultData;
  nfts: UserNFT[];
}) => Promise<void>;

type ModalState = 'loading' | 'success' | 'fail';

type UseFraktionalizeTransactionModal = () => {
  visible: boolean;
  open: (txnData: FraktionalizeTxnData) => Promise<void>;
  close: () => void;
  state: ModalState;
  setState: (nextState: ModalState) => void;
  fractionTokenMint: string;
  tickerName: string;
  addNftsToActiveVault: AddNftsToActiveVault;
};

export const useFraktionalizeTransactionModal: UseFraktionalizeTransactionModal =
  () => {
    const { removeTokenOptimistic, rawUserTokensByMint } = useUserTokens();
    const { createVault, addNFTsToVault } = useFraktion();
    const [visible, setVisible] = useState<boolean>(false);
    const [state, setState] = useState<ModalState>('loading');
    const [fractionTokenMint, setFractionTokenMint] = useState<string>('');

    const [transactionData, setTransactionData] =
      useState<FraktionalizeTxnData>(null);

    const open = (txnData: FraktionalizeTxnData) => {
      setVisible(true);
      setTransactionData(txnData);
      return fraktionalize(txnData);
    };

    const addNftsToActiveVault: AddNftsToActiveVault = async ({
      vaultData,
      nfts = [],
    }) => {
      setVisible(true);
      await addNFTsToVault({
        userNfts: nfts,
        vaultPubkey: vaultData.vaultPubkey,
        rawUserTokensByMint,
      });
      setVisible(false);
    };

    const fraktionalize = async ({
      newNfts = [],
      lockedNfts = [],
      tickerName,
      pricePerFraction,
      fractionsAmount,
      vaultName,
      vault,
    }: FraktionalizeTxnData) => {
      try {
        const unfinishedVaultData = (() => {
          if (vault) {
            const {
              vaultPubkey,
              fractionMint: fractionalMint,
              fractionTreasury,
              redeemTreasury,
            } = vault;

            return {
              vaultPubkey,
              fractionalMint,
              fractionTreasury,
              redeemTreasury,
            };
          }

          return null;
        })();

        const allNfts = [...lockedNfts, ...newNfts];

        const tokenImageUrl = (() => {
          const { metadata } = allNfts[0];
          return metadata.image;
        })();

        const fractionalMint = await createVault({
          userNfts: newNfts,
          fractionsAmount: fractionsAmount,
          pricePerFraction: pricePerFraction,
          unfinishedVaultData,
          tokenData: {
            tickerName: tickerName,
            name: vaultName,
            imageUrl: tokenImageUrl,
          },
          rawUserTokensByMint: rawUserTokensByMint,
        });

        if (!fractionalMint) {
          throw new Error('Some transaction failed');
        }

        setState('success');
        setFractionTokenMint(fractionalMint);
        removeTokenOptimistic(allNfts.map((nft) => nft.mint));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setState('fail');
      }
    };

    const close = () => {
      setVisible(false);
      setFractionTokenMint('');
    };

    return {
      visible,
      open,
      close,
      state,
      setState,
      fractionTokenMint,
      tickerName: transactionData?.tickerName || '',
      addNftsToActiveVault,
    };
  };
