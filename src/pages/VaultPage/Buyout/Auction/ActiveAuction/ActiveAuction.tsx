import React, { FC } from 'react';
import styles from './styles.module.scss';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '../../../../../contexts/WalletModal';
import { BidHistory } from '../../../../../components/BidHistory';
import { AuctionCountdown } from '../../../../../components/AuctionCountdown';
import { TokenFieldForm } from '../../../../../components/TokenField';
import Button from '../../../../../components/Button';
import { VaultData } from '../../../../../contexts/fraktion';
import fraktionConfig from '../../../../../contexts/fraktion/config';
import { useAuction } from '../../../../../contexts/auction';
import { Form } from 'antd';

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

interface ActiveAuctionProps {
  vaultInfo: VaultData;
}

export const ActiveAuction: FC<ActiveAuctionProps> = ({ vaultInfo }) => {
  const { setVisible: setWalletModalVisibility } = useWalletModal();
  const { bidOnAuction, refundBid } = useAuction();
  const { connected } = useWallet();
  const [form] = Form.useForm();

  const winningBidPubKey = vaultInfo.auction.auction.currentWinningBidPubkey;
  const winningBid = vaultInfo.auction.bids.find(
    (el) => (el as any).bidPubkey === winningBidPubKey,
  );

  // TODO rounding problem
  const nextBidAmount =
    (winningBid.bidAmountPerShare.toNumber() *
      vaultInfo.fractionsSupply.toNumber()) /
      1e9 +
    vaultInfo.auction.auction.tickSize.toNumber() / 1e9;

  const currency =
    vaultInfo?.priceMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';

  const placeBidHandler = (values) => {
    bidOnAuction(vaultInfo, +values.startBid.amount, winningBid.bidPubkey);
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
              currentToken={
                currency === 'SOL' ? MOCK_TOKEN_LIST[0] : MOCK_TOKEN_LIST[1]
              }
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
