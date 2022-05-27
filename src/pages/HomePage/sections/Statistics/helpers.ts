import { NFT_POOLS_STATS_URL, LOANS_STATS_URL } from './constants';
import { LoansStats, NftPoolsStats, Stats } from './model';
import { fetchSolanaPriceUSD } from '../../../../contexts/liquidityPools';

export const fetchNftPoolsStats = async (): Promise<NftPoolsStats | null> => {
  try {
    const result: NftPoolsStats = await (
      await fetch(NFT_POOLS_STATS_URL)
    ).json();

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Nft pools stats api error: ', error);
    return null;
  }
};

export const fetchLoansStats = async (): Promise<LoansStats | null> => {
  try {
    const result: LoansStats = await (await fetch(LOANS_STATS_URL)).json();

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Loans stats api error: ', error);
    return null;
  }
};

export const fetchStats = async (): Promise<Stats> => {
  try {
    const [solanaPriceUSD, nftPoolsStats, loansStats] = await Promise.all([
      fetchSolanaPriceUSD(),
      fetchNftPoolsStats(),
      fetchLoansStats(),
    ]);

    if (!solanaPriceUSD && !nftPoolsStats && !loansStats) {
      throw new Error('Error fetching statistics');
    }

    const TVL = (nftPoolsStats.poolsTvl + loansStats.TVL) * solanaPriceUSD;

    const nftsLocked =
      nftPoolsStats.lockedNftsInPools + loansStats.lockedNftsInLoans;

    return {
      TVL,
      nftsLocked,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return {
      nftsLocked: 0,
      TVL: 0,
    };
  }
};
