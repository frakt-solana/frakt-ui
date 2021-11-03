import { useState } from 'react';
import { createFraktionalizer } from 'fraktionalizer-client-library';

import Button from '../../components/Button';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import NFTCheckbox from '../../components/NFTCheckbox';
import { SearchInput } from '../../components/SearchInput';
import { useUserTokens } from '../../contexts/userTokens';
import { UserToken } from '../../contexts/userTokens/userTokens.model';
import { useWallet } from '../../external/contexts/wallet';
import Sidebar from './Sidebar';
import styles from './styles.module.scss';
import { useConnection } from '../../external/contexts/connection';
import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';

const FraktionalizePage = (): JSX.Element => {
  const { connected, select, wallet } = useWallet();
  const connection = useConnection();
  const { tokens } = useUserTokens();

  const [selectedToken, setSelectedToken] = useState<UserToken>(null);

  const clearSelectedToken = () => setSelectedToken(null);

  const onCardClick = (token: UserToken): void => {
    selectedToken?.mint === token.mint
      ? setSelectedToken(null)
      : setSelectedToken(token);
  };

  const onContinueClick = (
    tokenMint: string,
    pricePerFraction: number,
    fractionsAmount: number,
  ) => {
    createFraktionalizer(
      connection,
      new BN(pricePerFraction),
      new BN(fractionsAmount),
      3,
      new PublicKey(tokenMint),
      'So11111111111111111111111111111111111111112',
      wallet.publicKey,
      '9iAwxFwdxYSH5gw4QwRs78objbFHgDKGYmjCZPpgSgSA',
      async (txn, signers): Promise<void> => {
        const { blockhash } = await connection.getRecentBlockhash();
        txn.recentBlockhash = blockhash;
        txn.feePayer = wallet.publicKey;
        txn.sign(...signers);
        const signed = await wallet.signTransaction(txn);
        const txid = await connection.sendRawTransaction(signed.serialize());
        return void connection.confirmTransaction(txid);
      },
    );
  };

  return (
    <AppLayout className={styles.positionRelative}>
      <Sidebar
        token={selectedToken}
        onRemoveClick={clearSelectedToken}
        onContinueClick={onContinueClick}
      />
      <Container component="main" className={styles.contentWrapper}>
        <div className={styles.contentReducer}>
          <h4 className={styles.title}>Select your NFT</h4>
          <SearchInput
            size="large"
            className={styles.search}
            placeholder="Search by curator, collection or asset"
          />
          {!connected && (
            <Button
              type="secondary"
              className={styles.connectBtn}
              onClick={select}
            >
              Connect wallet
            </Button>
          )}
          <div className={styles.artsList}>
            {tokens.map((token, idx) => (
              <NFTCheckbox
                key={idx}
                onClick={() => onCardClick(token)}
                imageUrl={token.metadata.image}
                name={token.metadata.name}
                selected={selectedToken && selectedToken.mint === token.mint}
              />
            ))}
          </div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default FraktionalizePage;
