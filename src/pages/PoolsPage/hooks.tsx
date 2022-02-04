import { useEffect, useMemo, useState } from 'react';
import { Control, useForm } from 'react-hook-form';

import { ArrowDownSmallIcon } from '../../icons';
import { useDebounce } from '../../hooks';
import {
  useCurrentSolanaPrice,
  useLiquidityPools,
  comparePoolsArraysByApr,
  comparePoolsArraysByTotal,
  useLazyRaydiumPoolsInfoMap,
  PoolData,
  RaydiumPoolInfoMap,
  ProgramAccountData,
} from '../../contexts/liquidityPools';
import styles from './styles.module.scss';

export enum InputControlsNames {
  SHOW_STAKED = 'showStaked',
  SHOW_AWARDED_ONLY = 'showAwardedOnly',
  SORT = 'sort',
}

export type SortValue = {
  label: JSX.Element;
  value: string;
};

export type FormFieldValues = {
  [InputControlsNames.SHOW_STAKED]: boolean;
  [InputControlsNames.SHOW_AWARDED_ONLY]: boolean;
  [InputControlsNames.SORT]: SortValue;
};

export const usePoolsPage = (): {
  formControl: Control<FormFieldValues>;
  loading: boolean;
  poolsData: PoolData[];
  raydiumPoolsInfoMap: RaydiumPoolInfoMap;
  searchItems: (value?: string) => void;
  currentSolanaPriceUSD: number;
  activePoolTokenAddress: string | null;
  onPoolCardClick: (tokenAddress: string) => void;
  programAccount: ProgramAccountData;
} => {
  const { control, watch } = useForm({
    defaultValues: {
      [InputControlsNames.SHOW_STAKED]: true,
      [InputControlsNames.SHOW_AWARDED_ONLY]: true,
      [InputControlsNames.SORT]: SORT_VALUES[0],
    },
  });

  const [searchString, setSearchString] = useState<string>('');
  const sort = watch(InputControlsNames.SORT);
  const showAwardedOnly = watch(InputControlsNames.SHOW_AWARDED_ONLY);

  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();
  const {
    poolDataByMint,
    loading: poolDataByMintLoading,
    programAccounts,
  } = useLiquidityPools();

  const programAccount = useMemo(() => {
    const routerPubkeys = '3n3XMZPwRVqvSfgT9EZarQwCCw7uhGSESyZwhMX7MFd4';

    if (programAccounts) {
      const { routers, stakeAccounts } = programAccounts;

      const routerAccount = routers.find(
        ({ routerPubkey }) => routerPubkey === routerPubkeys,
      );
      console.log(routerAccount);

      const stakeAccount = stakeAccounts.find(
        ({ router }) => router === routerPubkeys,
      );

      console.log(stakeAccounts);

      return { router: routerAccount, stakeAccount };
    }
    2;
  }, [programAccounts]);

  const rawPoolsData = useMemo(() => {
    return poolDataByMint.size ? Array.from(poolDataByMint.values()) : [];
  }, [poolDataByMint]);

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const {
    loading: poolsInfoMapLoading,
    raydiumPoolsInfoMap,
    fetchPoolsInfoMap,
  } = useLazyRaydiumPoolsInfoMap();

  useEffect(() => {
    if (rawPoolsData.length) {
      const poolConfigs = rawPoolsData.map(({ poolConfig }) => poolConfig);

      fetchPoolsInfoMap(poolConfigs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawPoolsData]);

  const loading = poolsInfoMapLoading || poolDataByMintLoading;

  const poolsData = useMemo(() => {
    if (
      !rawPoolsData.length ||
      !currentSolanaPriceUSD ||
      !raydiumPoolsInfoMap.size
    ) {
      return [];
    }

    const [sortField, sortOrder] = sort.value.split('_');

    return rawPoolsData
      .filter(({ tokenInfo }) => {
        if (showAwardedOnly) {
          return false;
        }

        return tokenInfo.symbol.toUpperCase().includes(searchString);
      })
      .sort(({ poolConfig: poolConfigA }, { poolConfig: poolConfigB }) => {
        if (sortField === 'liquidity') {
          return comparePoolsArraysByTotal(
            raydiumPoolsInfoMap.get(poolConfigA.baseMint.toBase58()),
            raydiumPoolsInfoMap.get(poolConfigB.baseMint.toBase58()),
            currentSolanaPriceUSD,
            sortOrder === 'desc',
          );
        }
        if (sortField === 'apr') {
          return comparePoolsArraysByApr(
            raydiumPoolsInfoMap.get(poolConfigA.baseMint.toBase58()),
            raydiumPoolsInfoMap.get(poolConfigB.baseMint.toBase58()),
            currentSolanaPriceUSD,
            sortOrder === 'desc',
          );
        }
        return 0;
      });
  }, [
    rawPoolsData,
    searchString,
    sort,
    showAwardedOnly,
    currentSolanaPriceUSD,
    raydiumPoolsInfoMap,
  ]);

  const [activePoolTokenAddress, setActivePoolTokenAddress] = useState<
    string | null
  >();

  const onPoolCardClick = (tokenAddress: string) => {
    if (tokenAddress === activePoolTokenAddress) {
      setActivePoolTokenAddress(null);
    } else {
      setActivePoolTokenAddress(tokenAddress);
    }
  };

  return {
    formControl: control,
    loading,
    poolsData,
    raydiumPoolsInfoMap,
    searchItems,
    currentSolanaPriceUSD,
    activePoolTokenAddress,
    onPoolCardClick,
    programAccount,
  };
};

export const SORT_VALUES: SortValue[] = [
  {
    label: (
      <span>
        Liquidity <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'liquidity_desc',
  },
  {
    label: (
      <span>
        Liquidity <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'liquidity_asc',
  },
  {
    label: (
      <span>
        Trading Vol. <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'trading_desc',
  },
  {
    label: (
      <span>
        Trading Vol. <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'trading_asc',
  },
  {
    label: (
      <span>
        APR <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'apr_desc',
  },
  {
    label: (
      <span>
        APR <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'apr_asc',
  },
];
