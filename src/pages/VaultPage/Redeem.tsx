import BN from 'bn.js';
import Button from '../../components/Button';
import TokenField from '../../components/TokenField';
import { VaultData } from '../../contexts/fraktion/fraktion.model';
import { useWallet } from '../../external/contexts/wallet';
import fraktionConfig from '../../contexts/fraktion/config';
import styles from './styles.module.scss';
import { useUserTokens } from '../../contexts/userTokens';
import { Loader } from '../../components/Loader';

const { SOL_TOKEN_PUBKEY } = fraktionConfig;

const MOCK_TOKEN_LIST = [
  {
    mint: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    img: 'https://sdk.raydium.io/icons/So11111111111111111111111111111111111111112.png',
    data: 'Some value 1',
  },
  {
    mint: '2kMr32vCwjehHizggK4Gdv7izk7NhTUyLrH7RYvQRFHH',
    symbol: 'FRKT',
    img: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj/logo.png',
    data: 'Some value 1',
  },
];

export const Redeem = ({
  vaultInfo,
}: {
  vaultInfo: VaultData;
}): JSX.Element => {
  const { loading, rawUserTokensByMint } = useUserTokens();
  const { connected, select } = useWallet();
  const currency =
    vaultInfo?.priceTokenMint === SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';

  const usetFractions = rawUserTokensByMint[vaultInfo.fractionMint];

  const userFractionsAmount = usetFractions?.amount
    ? usetFractions.amount === -1
      ? usetFractions.amountBN
      : new BN(Number(usetFractions.amount))
    : new BN(0);

  const userRedeemValue =
    userFractionsAmount.mul(vaultInfo.lockedPricePerFraction).toNumber() / 1e9;

  return (
    <div className={styles.redeem}>
      <h5 className={styles.redeem__title}>
        {!connected && 'Have this fractions? Connect your wallet to redeem'}
        {!!userRedeemValue && "You're available to redeem"}
        {connected &&
          !loading &&
          !userRedeemValue &&
          "Seems like you don't have this fractions"}
      </h5>
      <div className={styles.redeemControls}>
        {connected && !loading && !!userRedeemValue && (
          <>
            <TokenField
              className={styles.redeem__tokenField}
              value={userRedeemValue.toFixed(2)}
              onValueChange={() => {}}
              currentToken={
                currency === 'SOL' ? MOCK_TOKEN_LIST[0] : MOCK_TOKEN_LIST[1]
              }
            />
            <Button className={styles.redeem__redeemBtn} type="alternative">
              Redeem
            </Button>
          </>
        )}
        {connected && loading && (
          <div className={styles.redeem__loader}>
            <Loader />
          </div>
        )}
        {!connected && (
          <Button onClick={select} className={styles.redeem__connectWalletBtn}>
            Connect wallet
          </Button>
        )}
      </div>
    </div>
  );
};
