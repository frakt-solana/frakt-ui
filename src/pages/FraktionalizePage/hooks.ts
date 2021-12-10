import { useState } from 'react';

import { useUserTokens, UserNFT } from '../../contexts/userTokens';
import { useFraktion } from '../../contexts/fraktion';

interface FraktionalizeTxnData {
  userNfts: UserNFT[];
  tickerName: string;
  pricePerFraction: number;
  fractionsAmount: number;
  basketName?: string;
}

type ModalState = 'loading' | 'success' | 'fail';

export const useFraktionalizeTransactionModal = (): {
  visible: boolean;
  open: (txnData: FraktionalizeTxnData) => void;
  close: () => void;
  state: ModalState;
  setState: (nextState: ModalState) => void;
  fractionTokenMint: string;
  tickerName: string;
} => {
  const { removeTokenOptimistic } = useUserTokens();
  const { fraktionalize } = useFraktion();
  const [visible, setVisible] = useState<boolean>(false);
  const [state, setState] = useState<ModalState>('loading');
  const [fractionTokenMint, setFractionTokenMint] = useState<string>('');

  const [transactionData, setTransactionData] =
    useState<FraktionalizeTxnData>(null);

  const open = (txnData: FraktionalizeTxnData) => {
    setVisible(true);

    setTransactionData(txnData);

    const { userNfts } = txnData;

    if (userNfts.length === 1) {
      createSingleVault(txnData);
    } else {
      //TODO: create basket here
    }
  };

  const createSingleVault = async (txnData: FraktionalizeTxnData) => {
    const result = await fraktionalize(
      txnData.userNfts[0],
      txnData.tickerName,
      txnData.pricePerFraction,
      txnData.fractionsAmount,
      'SOL',
    );

    if (!result) {
      setState('fail');
    } else {
      setState('success');
      setFractionTokenMint(result.fractionalMint);
      removeTokenOptimistic(txnData.userNfts[0].mint);
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
  };
};
