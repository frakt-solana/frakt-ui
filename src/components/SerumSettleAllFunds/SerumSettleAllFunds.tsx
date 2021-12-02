import React, { useState } from 'react';
import { Button, Row } from 'antd';
import { settleAllFunds } from '../../utils/serumUtils/send';

import {
  useAllMarkets,
  useSelectedTokenAccounts,
  useTokenAccounts,
} from '../../utils/serumUtils/markets';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { notify } from '../../utils';
import { useFraktion } from '../../contexts/fraktion';
import { Market } from '@project-serum/serum';

export default function SerumSettleAllFunds({ market }: { market: Market }) {
  const { connection } = useConnection();
  const {
    publicKey: walletPublicKey,
    signTransaction,
    connected,
  } = useWallet();
  const [selectedTokenAccounts] = useSelectedTokenAccounts();
  const [tokenAccounts, tokenAccountsConnected] = useTokenAccounts();
  const [settlingFunds, setSettlingFunds] = useState(false);

  async function onSettleFunds() {
    setSettlingFunds(true);
    try {
      if (!connected) {
        notify({
          message: 'Wallet not connected',
          description: 'Wallet not connected',
          type: 'error',
        });
        return;
      }

      if (!tokenAccounts || !tokenAccountsConnected) {
        notify({
          message: 'Error settling funds',
          description: 'TokenAccounts not connected',
          type: 'error',
        });
        return;
      }
      // if (!allMarkets || !allMarketsConnected) {
      //     notify({
      //         message: 'Error settling funds',
      //         description: 'Markets not connected',
      //         type: 'error',
      //     });
      //     return;
      // }
      await settleAllFunds({
        connection,
        walletPublicKey,
        signTransaction,
        tokenAccounts,
        selectedTokenAccounts,
        markets: [market],
      });
    } catch (e) {
      notify({
        message: 'Error settling funds',
        description: e.message,
        type: 'error',
      });
    } finally {
      setSettlingFunds(false);
    }
  }

  return (
    <Button
      onClick={onSettleFunds}
      loading={settlingFunds}
      type="link"
      style={{ padding: '0' }}
    >
      Settle funds
    </Button>
  );
}
