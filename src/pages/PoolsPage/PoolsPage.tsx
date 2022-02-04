import { FC } from 'react';

import { ControlledSelect } from '../../components/Select/Select';
import { ControlledToggle } from '../../components/Toggle/Toggle';
import { AppLayout } from '../../components/Layout/AppLayout';
import { SearchInput } from '../../components/SearchInput';
import { Container } from '../../components/Layout';
import styles from './styles.module.scss';
import Pool from './Pool';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll';
import { SORT_VALUES, InputControlsNames, usePoolsPage } from './hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export const tokeInfoTest = {
  address: 'ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj',
  chainId: 101,
  decimals: 8,
  extensions: {
    coingeckoId: 'frakt-token',
    coinmarketcap: 'https://coinmarketcap.com/currencies/frakt-token/',
    twitter: 'https://twitter.com/FraktArt',
    website: 'https://frakt.art',
  },
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj/logo.png',
  name: 'FRAKT Token',
  symbol: 'FRKT',
  tags: ['utility-token'],
};

const poolConfigTest = {
  authority: new PublicKey('5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1'),
  baseMint: new PublicKey('ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj'),
  baseVault: new PublicKey('EAz41ABjVhXLWFXcVdC6WtYBjnVqBZQw7XxXBd8J8KMp'),
  id: new PublicKey('H3dhkXcC5MRN7VRXNbWVSvogH8mUQPzpn8PYQL7HfBVg'),
  lpMint: new PublicKey('HYUKXgpjaxMXHttyrFYtv3z2rdhZ1U9QDH8zEc8BooQC'),
  lpVault: new PublicKey('BNRZ1W1QCw9v6LNgor1fU91X49WyPUnTWEUJ6H7HVefj'),
  marketAsks: new PublicKey('9oPEuJtJQTaFWqhkA9omNzKoz8BLEFmGfFyPdVYxkk8B'),
  marketAuthority: new PublicKey(
    '3x6rbV78zDotLTfat9tXpWgCzqKYBJKEzaDEWStcumud',
  ),

  marketBaseVault: new PublicKey(
    'EgZKQ4zMUiNNXFzTJ89eyL4gjfF2yCrH1seQHTnwihAc',
  ),
  marketBids: new PublicKey('F4D6Qe2FcVSLDGByxCQoMeCdaLQF3Z7vuWnrXoEW3xss'),
  marketEventQueue: new PublicKey(
    '6Bb5UtTAu6VBJ71dh8vGji6JBRsajRGKXaxhtRkqwy7R',
  ),
  marketId: new PublicKey('FE5nRChviHFXnUDPRpPwHcPoQSxXwjAB5gdPFJLweEYK'),
  marketProgramId: new PublicKey(
    '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
  ),
  marketQuoteVault: new PublicKey(
    'FCnpLA4Xzo4GKctHwMydTx81NRgbAxsZTreT9zHAEV8d',
  ),
  marketVersion: 3,
  openOrders: new PublicKey('7yHu2fwMQDA7vx5RJMX1TyzDE2cJx6u1v4abTgfEP8rd'),
  programId: new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'),
  quoteMint: new PublicKey('So11111111111111111111111111111111111111112'),
  quoteVault: new PublicKey('6gBKhNH2U1Qrxg73Eo6BMuXLoW2H4DML18AnALSrbrXr'),
  targetOrders: new PublicKey('BXjSVXdMUYM3CpAs97SE5e9YnxC2NLqaT6tzwNiJNi6r'),
  version: 4,
  withdrawQueue: new PublicKey('9Pczi311AjZRXukgUws9QVPYBswXmMETZTM4TFcjqd4s'),
};

const raydiumPoolInfoTest = {
  baseDecimals: 8,
  baseReserve: new BN('76200904639505'),
  lpDecimals: 8,
  lpSupply: new BN('45357132500696'),
  quoteDecimals: 9,
  quoteReserve: new BN('1031137885833'),
  status: new BN('1'),
};

const PoolsPage: FC = () => {
  const { connected } = useWallet();
  const { itemsToShow, next } = useFakeInfinityScroll(9);
  const {
    formControl,
    loading,
    poolsData,
    raydiumPoolsInfoMap,
    searchItems,
    currentSolanaPriceUSD,
    activePoolTokenAddress,
    onPoolCardClick,
    programAccount,
  } = usePoolsPage();

  const poolsDataTest = [
    {
      tokenInfo: tokeInfoTest,
      poolConfig: poolConfigTest,
    },
  ];

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>Liquidity</h1>
        <div className={styles.sortWrapper}>
          <SearchInput
            size="large"
            onChange={(e) => searchItems(e.target.value || '')}
            className={styles.search}
            placeholder="Filter by symbol"
          />
          <div className={styles.filters}>
            {connected && (
              <ControlledToggle
                control={formControl}
                name={InputControlsNames.SHOW_STAKED}
                label="Staked only"
                className={styles.filter}
              />
            )}
            <ControlledToggle
              control={formControl}
              name={InputControlsNames.SHOW_AWARDED_ONLY}
              label="Awarded only"
              className={styles.filter}
            />
            <ControlledSelect
              valueContainerClassName={styles.sortingSelectContainer}
              className={styles.sortingSelect}
              control={formControl}
              name={InputControlsNames.SORT}
              label="Sort by"
              options={SORT_VALUES}
            />
          </div>
        </div>

        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          next={next}
          isLoading={loading}
          emptyMessage={'No Liquidity pool found'}
        >
          {poolsDataTest.map((poolData) => (
            <Pool
              key={poolData.tokenInfo.address}
              poolData={poolData}
              raydiumPoolInfo={raydiumPoolInfoTest}
              currentSolanaPriceUSD={currentSolanaPriceUSD}
              isOpen={activePoolTokenAddress === poolData.tokenInfo.address}
              onPoolCardClick={() =>
                onPoolCardClick(poolData.tokenInfo.address)
              }
              programAccount={programAccount}
            />
          ))}
        </FakeInfinityScroll>
      </Container>
    </AppLayout>
  );
};

export default PoolsPage;
