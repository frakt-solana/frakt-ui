import React, { FC, useState } from 'react';
import TokenField from '../../../../../components/TokenField';
import styles from './styles.module.scss';
import Button from '../../../../../components/Button';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '../../../../../contexts/WalletModal';
import { BidHistory } from '../../../../../components/BidHistory';
import { useAuction } from '../../../../../contexts/auction';
import { VaultData, VaultState } from '../../../../../contexts/fraktion';
import fraktionConfig from '../../../../../contexts/fraktion/config';
import { useUserTokens } from '../../../../../contexts/userTokens';
import BN from 'bn.js';

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

interface FinishedAuctionProps {
  vaultInfo: VaultData;
}

export const FinishedAuction: FC<FinishedAuctionProps> = ({ vaultInfo }) => {
  const { setVisible: setWalletModalVisibility } = useWalletModal();
  const {
    refundBid,
    closeAuctionFraktionalizer,
    redeemRewardsFromAuctionShares,
  } = useAuction();
  const { connected, publicKey: walletPublicKey } = useWallet();
  const { loading, rawUserTokensByMint } = useUserTokens();
  const [isRedeemAvailable, setIsRedeemAvailable] = useState(true);
  const [isNFTRedeemAvailable, setIsNFTRedeemAvailable] = useState(true);

  const winningBidPubKey = vaultInfo.auction.auction.currentWinningBidPubkey;
  const currency =
    vaultInfo?.priceMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';
  const winningBid = vaultInfo.auction.bids.find(
    (el) => (el as any).bidPubkey === winningBidPubKey,
  );
  const isWinner =
    winningBid.bidder === walletPublicKey?.toString() &&
    vaultInfo.state === VaultState.Auction;

  const usetFractions = rawUserTokensByMint[vaultInfo.fractionMint];
  const userFractionsAmount = usetFractions?.amountBN || new BN(0);
  const userRedeemValue =
    userFractionsAmount.mul(vaultInfo.lockedPricePerShare).toNumber() / 1e9;

  const redeemValueHandler = () => {
    redeemRewardsFromAuctionShares(vaultInfo).then(() =>
      setIsRedeemAvailable(false),
    );
  };

  const redeemNFTValueHandler = () => {
    closeAuctionFraktionalizer(vaultInfo).then(() =>
      setIsNFTRedeemAvailable(false),
    );
  };

  return (
    <div>
      <BidHistory
        refundBid={(bidPubKey) => refundBid(vaultInfo, bidPubKey)}
        winningBidPubKey={winningBidPubKey}
        supply={vaultInfo.fractionsSupply}
        bids={vaultInfo.auction.bids}
      />
      {isWinner && isNFTRedeemAvailable && (
        <Button
          onClick={redeemNFTValueHandler}
          className={styles.fullWidth}
          type="alternative"
        >
          Redeem NFT
        </Button>
      )}
      {!isNFTRedeemAvailable &&
        isRedeemAvailable &&
        connected &&
        !loading &&
        !!userRedeemValue && (
          <div className={styles.buyoutControls}>
            <TokenField
              disabled
              currentToken={
                currency === 'SOL' ? MOCK_TOKEN_LIST[0] : MOCK_TOKEN_LIST[1]
              }
              className={styles.buyout__tokenField}
              value={userRedeemValue.toFixed(2)}
              onValueChange={() => {}}
            />

            {connected && (
              <Button
                className={styles.buyout__buyoutBtn}
                type="alternative"
                onClick={redeemValueHandler}
              >
                Redeem
              </Button>
            )}
          </div>
        )}
      {!connected && (
        <Button
          onClick={() => setWalletModalVisibility(true)}
          className={styles.fullWidth}
        >
          Connect wallet
        </Button>
      )}
    </div>
  );
};
