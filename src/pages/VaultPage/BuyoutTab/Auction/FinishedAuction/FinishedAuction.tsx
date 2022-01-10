import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import BN from 'bn.js';

import TokenField, {
  TOKEN_FIELD_CURRENCY,
} from '../../../../../components/TokenField';
import Button from '../../../../../components/Button';
import { useWalletModal } from '../../../../../contexts/WalletModal';
import { BidHistory } from '../../../../../components/BidHistory';
import { useAuction } from '../../../../../contexts/auction';
import { Bid, VaultData, VaultState } from '../../../../../contexts/fraktion';
import fraktionConfig from '../../../../../contexts/fraktion/config';
import { useUserTokens } from '../../../../../contexts/userTokens';
import { Loader } from '../../../../../components/Loader';
import { FinishFlagsIcon } from '../../../../../icons';
import { RedeemNFTs } from './RedeemNFTs';
import styles from './styles.module.scss';

interface FinishedAuctionProps {
  vaultInfo: VaultData;
}

export const FinishedAuction: FC<FinishedAuctionProps> = ({ vaultInfo }) => {
  const { setVisible: setWalletModalVisibility } = useWalletModal();
  const { refundBid, redeemRewardsFromAuctionShares } = useAuction();
  const { connected, publicKey: walletPublicKey } = useWallet();
  const { loading, rawUserTokensByMint } = useUserTokens();
  const [isRedeemAvailable, setIsRedeemAvailable] = useState(true);

  if (!vaultInfo.auction.auction) return null;

  const winningBidPubKey = vaultInfo.auction.auction.currentWinningBidPubkey;
  const currency =
    vaultInfo?.priceMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';
  const winningBid = vaultInfo?.auction.bids?.find(
    (bid: Bid) => bid.bidPubkey === winningBidPubKey,
  );
  const isWinner =
    winningBid.bidder === walletPublicKey?.toString() &&
    vaultInfo.state === VaultState.AuctionFinished;

  const usetFractions = rawUserTokensByMint[vaultInfo.fractionMint];
  const userFractionsAmount = usetFractions?.amountBN || new BN(0);

  const userRedeemValue =
    userFractionsAmount.mul(winningBid.bidAmountPerShare).toNumber() / 1e9;

  const redeemValueHandler = () => {
    redeemRewardsFromAuctionShares(vaultInfo).then(() =>
      setIsRedeemAvailable(false),
    );
  };

  return (
    <div>
      <p className={styles.finished}>
        <FinishFlagsIcon className={styles.finishedIcon} />
        Auction finished!
      </p>
      <BidHistory
        refundBid={(bidPubKey) => refundBid(vaultInfo, bidPubKey)}
        winningBidPubKey={winningBidPubKey}
        supply={vaultInfo.fractionsSupply}
        bids={vaultInfo.auction.bids}
      />
      {isWinner && vaultInfo.tokenTypeCount > 0 && (
        <RedeemNFTs vaultData={vaultInfo} />
      )}
      {loading && <Loader className={styles.loader} />}
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
          className={styles.connectWalletBtn}
        >
          Connect wallet
        </Button>
      )}
    </div>
  );
};
