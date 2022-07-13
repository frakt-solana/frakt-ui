import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import {
  selectSocket,
  selectWalletPublicKey,
} from '../../../../state/common/selectors';
import {
  selectGraceList,
  selectRaffleList,
  selectWonRaffleList,
  selectLotteryTickets,
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
  const socket = useSelector(selectSocket);
  const publicKey = useSelector(selectWalletPublicKey);
  const graceList = useSelector(selectGraceList);
  const raffleList = useSelector(selectRaffleList);
  const wonRaffleList = useSelector(selectWonRaffleList);
  const lotteryTickets = useSelector(selectLotteryTickets);

  useEffect(() => {
    dispatch(liquidationsActions.fetchGraceList());
    dispatch(liquidationsActions.fetchRaffleList());
  }, [dispatch]);

  useEffect(() => {
    if (publicKey && socket) {
      socket.emit('won-raffles-subscribe', { wallet: publicKey, limit: 20 });
      socket.emit('lottery-tickets-subscribe', publicKey);
    }
  }, [socket, publicKey]);

  const handleTryLottery = () => {
    setTabValue(LIQUIDATIONS_TABS[0].value);
  };

  return (
    <>
      <Tabs
        className={styles.tab}
        tabs={liquidationTabs}
        value={tabValue}
        setValue={setTabValue}
        type="secondary"
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
                disabled={!lotteryTickets.quantity}
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
          <LiquidationsList fetchItemsFunc={(params) => params}>
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
