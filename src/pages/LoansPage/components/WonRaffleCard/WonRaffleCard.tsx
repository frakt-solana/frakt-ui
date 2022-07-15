import { FC, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import Button from '../../../../components/Button';
import { useNativeAccount } from '../../../../utils/accounts';
import { selectTxLiquidateStatus } from '../../../../state/liquidations/selectors';
import { liquidationsActions } from '../../../../state/liquidations/actions';
import { useOnFulfilled } from '../../../../hooks';
import styles from './WonRaffleCard.module.scss';

const WonRaffleCard: FC<{ data }> = ({ data }) => {
  const [tryId, setTryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const txRequestStatus = useSelector(selectTxLiquidateStatus);
  useOnFulfilled(txRequestStatus, () => {
    setIsLoading(false);
  });

  const { account } = useNativeAccount();
  const balance = (account?.lamports || 0) / LAMPORTS_PER_SOL;

  const handleClick = () => {
    setTryId(data.nftMint);
  };

  const handleSumit = () => {
    setTryId(null);
    setIsLoading(true);
    dispatch(liquidationsActions.txLiquidate(data));
  };

  return (
    <div className={styles.card}>
      <div className={styles.nftInfo}>
        <img className={styles.nftImage} src={data.nftImageUrl} />
        <div>
          <p className={styles.nftName}>{data.nftName}</p>
        </div>
      </div>

      <div className={styles.statsValue}>
        <div className={classNames(styles.totalValue, styles.opacity)}>
          <p className={styles.subtitle}>floor price</p>
          <p className={styles.value}>{`${data.nftFloorPrice} SOL`}</p>
        </div>
        <div className={styles.totalValue}>
          <p className={styles.subtitle}>liquidation price</p>
          <p className={styles.value}>{`${data.paybackPriceWithGrace} SOL`}</p>
        </div>
        <Button
          type="alternative"
          className={styles.btn}
          onClick={handleClick}
          disabled={data.paybackPriceWithGrace > balance}
        >
          Liquidate
        </Button>
      </div>
      <ConfirmModal
        visible={tryId}
        onCancel={() => setTryId(null)}
        onSubmit={handleSumit}
        title="Ready?"
        subtitle={`You are about to confirm the transaction to liquidate and aquire ${data.nftName}`}
        btnAgree="Let's go"
      />
      <LoadingModal
        title="Please approve transaction"
        visible={isLoading}
        onCancel={() => setIsLoading(false)}
      />
    </div>
  );
};

export default WonRaffleCard;
