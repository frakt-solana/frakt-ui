import { FC } from 'react';
import styles from './styles.module.scss';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '../../../../../contexts/WalletModal';
import { BidHistory } from '../../../../../components/BidHistory';
import { AuctionCountdown } from '../../../../../components/AuctionCountdown';
import {
  TokenFieldForm,
  TOKEN_FIELD_CURRENCY,
} from '../../../../../components/TokenField';
import Button from '../../../../../components/Button';
import { VaultData } from '../../../../../contexts/fraktion';
import fraktionConfig from '../../../../../contexts/fraktion/config';
import { useAuction } from '../../../../../contexts/auction';
import { Form } from 'antd';

interface LiveAuctionProps {
  vaultInfo: VaultData;
}

const calculateMinBid = (vaultInfo: VaultData) => {
  const winningBidPubKey = vaultInfo.auction.auction.currentWinningBidPubkey;
  const winningBid = vaultInfo.auction.bids.find(
    (el) => (el as any).bidPubkey === winningBidPubKey,
  );
  const supply = vaultInfo.fractionsSupply.toNumber();

  const nextBidAmount =
    winningBid.bidAmountPerShare.toNumber() * supply +
    vaultInfo.auction.auction.tickSize.toNumber();
  const minPerShare = Math.ceil(nextBidAmount / supply);
  return (minPerShare * supply) / 1e9;
};

export const LiveAuction: FC<LiveAuctionProps> = ({ vaultInfo }) => {
  const { setVisible: setWalletModalVisibility } = useWalletModal();
  const { bidOnAuction, refundBid } = useAuction();
  const { connected } = useWallet();
  const [form] = Form.useForm();

  const winningBidPubKey = vaultInfo.auction.auction.currentWinningBidPubkey;
  const nextBidAmount = calculateMinBid(vaultInfo);
  const currency =
    vaultInfo?.priceMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';

  const placeBidHandler = (values) => {
    bidOnAuction(vaultInfo, +values.startBid.amount);
  };

  return (
    <div>
      <div className={styles.container}>
        <AuctionCountdown
          className={styles.timer}
          endTime={vaultInfo.auction.auction.endingAt}
        />
      </div>
      <BidHistory
        refundBid={(bidPubKey) => refundBid(vaultInfo, bidPubKey)}
        winningBidPubKey={winningBidPubKey}
        supply={vaultInfo.fractionsSupply}
        bids={vaultInfo.auction.bids}
      />
      <Form
        form={form}
        autoComplete="off"
        layout="vertical"
        onFinish={placeBidHandler}
        initialValues={{
          startBid: {
            amount: nextBidAmount,
          },
        }}
      >
        <div className={styles.buyoutControls}>
          <Form.Item
            rules={[
              {
                type: 'number',
                min: nextBidAmount,
                transform: (value) => +value.amount,
                message: `Min bid = ${nextBidAmount} SOL`,
              },
            ]}
            label="New bid"
            name="startBid"
          >
            <TokenFieldForm
              className={styles.buyout__tokenField}
              currentToken={TOKEN_FIELD_CURRENCY[currency]}
            />
          </Form.Item>

          {connected && (
            <Button
              className={styles.buyout__buyoutBtn}
              type="alternative"
              onClick={form.submit}
            >
              Place bid
            </Button>
          )}

          {!connected && (
            <Button
              onClick={() => setWalletModalVisibility(true)}
              className={styles.buyout__connectWalletBtn}
            >
              Connect wallet
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};