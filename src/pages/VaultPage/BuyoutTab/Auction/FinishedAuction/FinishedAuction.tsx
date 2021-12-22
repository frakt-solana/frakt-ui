import React, { FC, useState } from 'react';
import TokenField, {
  TOKEN_FIELD_CURRENCY,
} from '../../../../../components/TokenField';
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
    vaultInfo.state === VaultState.AuctionStarted;

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
      {isRedeemAvailable && connected && !loading && !!userRedeemValue && (
        <div className={styles.buyoutControls}>
          <TokenField
            disabled
            currentToken={TOKEN_FIELD_CURRENCY[currency]}
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
