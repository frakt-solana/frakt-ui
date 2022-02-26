import { FC } from 'react';

import styles from './HeaderBuy.module.scss';
import { QuestionIcon } from '../../../../../icons';
import { BuyRandomNftForm } from './BuyRandomNftForm';
import {
  NftPoolData,
  SafetyDepositBoxState,
} from '../../../../../utils/cacher/nftPools';
import {
  useLotteryTicketSubscription,
  useNftPoolTokenBalance,
} from '../../../hooks';
import { useNftPools } from '../../../../../contexts/nftPools';

import { MarketHeaderInner } from '../../../components/MarketHeaderInner';

interface HeaderBuyProps {
  pool: NftPoolData;
}

export const HeaderBuy: FC<HeaderBuyProps> = ({ pool }) => {
  const { balance } = useNftPoolTokenBalance(pool);
  const poolTokenAvailable = balance >= 1;

  const { getLotteryTicket } = useNftPools();
  const { subscribe } = useLotteryTicketSubscription();

  const onBuy = async () => {
    const lotteryTicketPubkey = await getLotteryTicket({ pool });

    subscribe(lotteryTicketPubkey, (saferyBoxPublicKey: string) =>
      // eslint-disable-next-line no-console
      console.log(
        pool.safetyBoxes.find(
          ({ publicKey }) => publicKey.toBase58() === saferyBoxPublicKey,
        ),
      ),
    );
    // //? Run roulette
    // //? subscribe to changes
    // // eslint-disable-next-line no-console
    // console.log(lotteryTicketPubkey?.toBase58());
  };

  const poolImage = pool.safetyBoxes.filter(
    ({ safetyBoxState }) => safetyBoxState === SafetyDepositBoxState.LOCKED,
  )?.[0]?.nftImage;

  return (
    <MarketHeaderInner poolPublicKey={pool.publicKey.toBase58()}>
      <div className={styles.randomWrapper}>
        <div className={styles.questionWrapper}>
          <img
            src={poolImage}
            alt="Pool image"
            className={styles.poolBgImage}
          />
          <QuestionIcon className={styles.questionIcon} />
        </div>
        <BuyRandomNftForm
          poolTokenAvailable={poolTokenAvailable}
          onBuy={onBuy}
        />
      </div>
    </MarketHeaderInner>
  );
};
