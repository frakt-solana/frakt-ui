import { Tab, Tabs, useTabs } from '../../../../components/Tabs';
import GraceCard from '../GraceCard/GraceCard';
import LiquidationRaffleCard from '../LiquidationRaffleCard/LiquidationRaffleCard';
import LiquidationsList from '../LiquidationsList/LiquidationsList';
import NoWinningRaffles from '../NoWinningRaffles/NoWinningRaffles';
import WonRaffleCard from '../WonRaffleCard/WonRaffleCard';
import styles from './Liquidations.module.scss';

export enum LiquidationsTabsNames {
  GRACE = 'grace',
  LIQUIDATIONS = 'liquidations',
  RAFFLES = 'raffles',
}

const Liquidations = () => {
  const {
    tabs: loanTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: LIQUIDATIONS_TABS,
    defaultValue: LIQUIDATIONS_TABS[0].value,
  });

  return (
    <div>
      <Tabs
        className={styles.tab}
        tabs={loanTabs}
        value={tabValue}
        setValue={setTabValue}
      />
      <LiquidationsList>
        {tabValue === LiquidationsTabsNames.LIQUIDATIONS && (
          <LiquidationRaffleCard />
        )}
        {tabValue === LiquidationsTabsNames.GRACE && <GraceCard />}
        {tabValue === LiquidationsTabsNames.RAFFLES && <WonRaffleCard />}
      </LiquidationsList>
    </div>
  );
};

export default Liquidations;

const LIQUIDATIONS_TABS: Tab[] = [
  {
    label: 'Liquidations raffle',
    value: 'liquidations',
  },
  {
    label: 'Grace List',
    value: 'grace',
  },
  {
    label: 'Won raffles',
    value: 'raffles',
  },
];
