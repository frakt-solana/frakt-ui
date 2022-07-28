import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { usePrevious } from '../../../../hooks';
import { notify, closeNotification } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { liquidationsActions } from '../../../../state/liquidations/actions';
import { LIQUIDATIONS_TABS } from '.';
import LiquidationRaffleCard from '../LiquidationRaffleCard';
import { LiquidationsTabsNames } from '../../model';
import { Tabs, useTabs } from '../../../../components/Tabs';
import { ConnectWalletSection } from '../../../../components/ConnectWalletSection';
import NoWinningRaffles from '../NoWinningRaffles';
import LiquidationsList from '../LiquidationsList';
import styles from './Liquidations.module.scss';
import GraceCard from '../GraceCard/GraceCard';
import WonRaffleCard from '../WonRaffleCard';
import { RaffleNotifications } from '../../../../state/liquidations/types';
import {
  selectSocket,
  selectWalletPublicKey,
} from '../../../../state/common/selectors';
import {
  selectGraceList,
  selectRaffleList,
  selectWonRaffleList,
  selectLotteryTickets,
  selectRaffleNotifications,
} from '../../../../state/liquidations/selectors';

const Liquidations: FC = () => {
  const {
    tabs: liquidationTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: LIQUIDATIONS_TABS,
    defaultValue: LIQUIDATIONS_TABS[0].value,
  });

  const dispatch = useDispatch();
  const notificationIdRef = useRef('');
  const socket = useSelector(selectSocket);
  const publicKey = useSelector(selectWalletPublicKey);
  const graceList = useSelector(selectGraceList);
  const raffleList = useSelector(selectRaffleList);
  const wonRaffleList = useSelector(selectWonRaffleList);
  const lotteryTickets = useSelector(selectLotteryTickets);
  const raffleNotifications: RaffleNotifications = useSelector(
    selectRaffleNotifications,
  );
  const prevRaffleNotifications: RaffleNotifications =
    usePrevious(raffleNotifications);

  useEffect(() => {
    dispatch(liquidationsActions.fetchGraceList());
    dispatch(liquidationsActions.fetchRaffleList());
    dispatch(liquidationsActions.fetchCollectionsList());
  }, [dispatch]);

  useEffect(() => {
    if (publicKey && socket) {
      socket.emit('won-raffles-subscribe', { wallet: publicKey, limit: 1000 });
      socket.emit('lottery-tickets-subscribe', publicKey);
      socket.emit('raffle-notifications-subscribe', publicKey);
    }
  }, [socket, publicKey]);

  useEffect(() => {
    if (raffleNotifications.notWinning) {
      notify({
        message: "Ooops. Your ticket didn't win :(",
        type: NotifyType.ERROR,
      });
    }

    if (raffleNotifications.winning) {
      notify({
        message: 'Congratulations! Your ticket has won! :)',
        type: NotifyType.SUCCESS,
      });
    }

    if (raffleNotifications.toBeRevealed) {
      if (prevRaffleNotifications?.toBeRevealed) {
        closeNotification(notificationIdRef.current);
      }
      const loaderNotificationId = Math.random().toString(36);
      notificationIdRef.current = loaderNotificationId;
      notify({
        message:
          raffleNotifications.toBeRevealed === 1
            ? 'Your ticket is trying to win a raffle...'
            : `Your ${raffleNotifications.toBeRevealed} tickets are trying to win a raffle...`,
        type: NotifyType.INFO,
        persist: true,
        key: loaderNotificationId,
      });
    }

    if (
      prevRaffleNotifications?.toBeRevealed &&
      !raffleNotifications.toBeRevealed
    ) {
      closeNotification(notificationIdRef.current);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raffleNotifications]);

  const handleTryLottery = () => {
    setTabValue(LIQUIDATIONS_TABS[0].value);
  };

  const renderTip = wonRaffleList.length
    ? {
        renderTip: {
          tabValue: LiquidationsTabsNames.RAFFLES,
          value: wonRaffleList.length.toString(),
        },
      }
    : {};

  return (
    <>
      <Tabs
        className={styles.tab}
        tabs={liquidationTabs}
        value={tabValue}
        setValue={setTabValue}
        type="secondary"
        {...renderTip}
      />
      {tabValue === LiquidationsTabsNames.LIQUIDATIONS &&
        (publicKey ? (
          <LiquidationsList
            withRafflesInfo
            fetchItemsFunc={(params) =>
              dispatch(liquidationsActions.fetchRaffleList(params))
            }
          >
            {raffleList.map((item) => (
              <LiquidationRaffleCard
                key={item.nftMint}
                data={item}
                disabled={lotteryTickets.quantity < 1}
              />
            ))}
          </LiquidationsList>
        ) : (
          <ConnectWalletSection text="Connect your wallet to check liquidations raffle" />
        ))}
      {tabValue === LiquidationsTabsNames.GRACE && (
        <LiquidationsList
          fetchItemsFunc={(params) =>
            dispatch(liquidationsActions.fetchGraceList(params))
          }
        >
          {graceList.map((item) => (
            <GraceCard key={item.nftMint} data={item} />
          ))}
        </LiquidationsList>
      )}
      {tabValue === LiquidationsTabsNames.RAFFLES &&
        (wonRaffleList.length ? (
          <LiquidationsList
            fetchItemsFunc={(params) =>
              dispatch(liquidationsActions.updateWonRaffleList(params))
            }
          >
            {wonRaffleList.map((item) => (
              <WonRaffleCard key={item.nftMint} data={item} />
            ))}
          </LiquidationsList>
        ) : (
          <NoWinningRaffles onClick={handleTryLottery} />
        ))}
    </>
  );
};

export default Liquidations;
