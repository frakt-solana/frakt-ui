import { Provider } from '@project-serum/anchor';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { depositNftToCommunityPoolIx } from '@frakters/community-pools-client-library-v2';
import BN from 'bn.js';
import { Liquidity, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { deriveMetadataPubkeyFromMint } from '@frakters/community-pools-client-library-v2/lib/utils/utils';

import {
  FusionPool,
  getCurrencyAmount,
  getTokenAccount,
  RaydiumPoolInfo,
} from '../../../../contexts/liquidityPools';
import { notify, SOL_TOKEN } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../../utils/transactions';
import { SELL_COMMISSION_PERCENT } from '../../constants';
import { calcRatio } from '../components';
import { NftPoolData } from '../../../../utils/cacher/nftPools';
import { UserNFT } from '../../../../contexts/userTokens';
import {
  getWhitelistedCreatorsDictionary,
  isNFTWhitelistedByCreator,
} from '../../../../contexts/nftPools';

type SellNftAndDeposit = (props: {
  wallet: WalletContextState;
  connection: Connection;
  poolToken: TokenInfo;
  pool: NftPoolData;
  liquidityFusionPool: FusionPool;
  nft: UserNFT;
  raydiumLiquidityPoolKeys: LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
}) => Promise<boolean>;

export const sellNftAndDeposit: SellNftAndDeposit = async ({
  wallet,
  connection,
  pool,
  nft,
  poolToken,
  liquidityFusionPool,
  raydiumLiquidityPoolKeys,
  raydiumPoolInfo,
}): Promise<boolean> => {
  try {
    const depositTransaction = new Transaction();

    const { value: nftLargestAccounts } =
      await connection.getTokenLargestAccounts(new PublicKey(nft?.mint));

    const nftUserTokenAccount = nftLargestAccounts?.[0]?.address || null;

    const whitelistedCreatorsDictionary =
      getWhitelistedCreatorsDictionary(pool);

    const whitelistedCreator: string | null = isNFTWhitelistedByCreator(
      nft,
      whitelistedCreatorsDictionary,
    );

    const metadataInfo = whitelistedCreator
      ? await deriveMetadataPubkeyFromMint(new PublicKey(nft.mint))
      : new PublicKey(nft.mint);

    const poolWhitelist = pool.poolWhitelist.find(({ whitelistedAddress }) => {
      return whitelistedCreator
        ? whitelistedAddress.toBase58() === whitelistedCreator
        : whitelistedAddress.toBase58() === nft.mint;
    });

    const tokenMintInputFusion = new PublicKey(
      liquidityFusionPool?.router?.tokenMintInput,
    );

    const {
      instructions: depositInstructions,
      signers: depositInstructionsSigners,
    } = await depositNftToCommunityPoolIx(
      {
        communityPool: pool.publicKey,
        nftMint: new PublicKey(nft.mint),
        nftUserTokenAccount,
        poolWhitelist: poolWhitelist.publicKey,
        fractionMint: pool.fractionMint,
        metadataInfo,
        fusionProgramId: new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
        tokenMintInputFusion,
        feeConfig: new PublicKey(process.env.FEE_CONFIG_GENERAL),
        adminAddress: new PublicKey(process.env.FEE_ADMIN_GENERAL),
      },
      {
        programId: new PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
        userPubkey: wallet.publicKey,
        provider: new Provider(connection, wallet, null),
      },
    );

    depositTransaction.add(...depositInstructions);

    const tokenAccounts = (
      await Promise.all(
        [
          poolToken.address,
          SOL_TOKEN.address,
          raydiumLiquidityPoolKeys.lpMint,
        ].map((mint) =>
          getTokenAccount({
            tokenMint: new PublicKey(mint),
            owner: wallet.publicKey,
            connection,
          }),
        ),
      )
    ).filter((tokenAccount) => tokenAccount);

    const poolTokenAmount = 1 - SELL_COMMISSION_PERCENT / 100;
    const poolTokenAmountBN = new BN(
      poolTokenAmount * 10 ** poolToken?.decimals,
    );

    const solTokenAmount = poolTokenAmount * calcRatio(raydiumPoolInfo);

    const solTokenAmountBN = new BN(solTokenAmount * 10 ** SOL_TOKEN?.decimals);

    const amountInA = getCurrencyAmount(poolToken, poolTokenAmountBN);
    const amountInB = getCurrencyAmount(SOL_TOKEN, solTokenAmountBN);

    const {
      transaction: addLiquidityTransaction,
      signers: addLiquidityTransactionSigners,
    } = await Liquidity.makeAddLiquidityTransaction({
      connection,
      poolKeys: raydiumLiquidityPoolKeys,
      userKeys: {
        tokenAccounts,
        owner: wallet.publicKey,
      },
      amountInA,
      amountInB,
      fixedSide: 'b',
    });

    const transactions = [depositTransaction, addLiquidityTransaction];

    const { blockhash } = await connection.getRecentBlockhash();

    transactions.forEach((transaction) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
    });

    depositTransaction.sign(...depositInstructionsSigners);
    addLiquidityTransaction.sign(...addLiquidityTransactionSigners);

    const signedTransactions = await wallet.signAllTransactions(transactions);

    const txids = await Promise.all(
      signedTransactions.map((signedTransaction) =>
        connection.sendRawTransaction(
          signedTransaction.serialize(),
          // { skipPreflight: true },
        ),
      ),
    );

    notify({
      message: 'Transactions sent',
      type: NotifyType.INFO,
    });

    await Promise.all(
      txids.map((txid) => connection.confirmTransaction(txid, 'finalized')),
    );

    notify({
      message: 'Liquidity provided successfully',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Liquidity providing failed',
        type: NotifyType.ERROR,
      });
    }

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
