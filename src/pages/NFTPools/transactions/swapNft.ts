import {
  getLotteryTicketIx,
  depositNftToCommunityPoolIx,
} from '@frakters/community-pools-client-library-v2';
import { deriveMetadataPubkeyFromMint } from '@frakters/community-pools-client-library-v2/lib/utils/utils';
import { Provider } from '@project-serum/anchor';
import { Liquidity, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import BN from 'bn.js';

import {
  getCurrencyAmount,
  getTokenAccount,
} from '../../../contexts/liquidityPools';
import {
  getWhitelistedCreatorsDictionary,
  isNFTWhitelistedByCreator,
} from '../../../contexts/nftPools';
import { UserNFT } from '../../../contexts/userTokens';
import { notify, SOL_TOKEN } from '../../../utils';
import { NftPoolData } from '../../../utils/cacher/nftPools';
import { NotifyType } from '../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../utils/transactions';
import { SELL_COMMISSION_PERCENT } from '../constants';
import { getTokenPrice } from '../helpers';

type SwapNft = (props: {
  pool: NftPoolData;
  poolToken: TokenInfo;
  connection: Connection;
  nft: UserNFT;
  wallet: WalletContextState;
  raydiumLiquidityPoolKeys: LiquidityPoolKeysV4;
  needSwap?: boolean;
  swapSlippage?: number;
}) => Promise<boolean>;

export const swapNft: SwapNft = async ({
  pool,
  poolToken,
  nft,
  connection,
  wallet,
  raydiumLiquidityPoolKeys,
  swapSlippage,
  needSwap = false,
}) => {
  try {
    const { swapTransaction, swapTransationSigners } = await (async () => {
      if (needSwap) {
        const { amountWithSlippage: solAmount } = await getTokenPrice({
          poolData: {
            tokenInfo: poolToken,
            poolConfig: raydiumLiquidityPoolKeys,
          },
          slippage: swapSlippage || 1,
          isBuy: true,
          connection,
        });

        const solAmountBN = new BN(
          parseFloat(solAmount) *
            (SELL_COMMISSION_PERCENT / 100) *
            10 ** SOL_TOKEN.decimals,
        );

        const poolTokenAmountBN = new BN(
          (SELL_COMMISSION_PERCENT / 100) * 10 ** poolToken.decimals,
        );

        const tokenAccounts = (
          await Promise.all(
            [SOL_TOKEN.address, poolToken.address].map((mint) =>
              getTokenAccount({
                tokenMint: new PublicKey(mint),
                owner: wallet.publicKey,
                connection,
              }),
            ),
          )
        ).filter((tokenAccount) => tokenAccount);

        const amountIn = getCurrencyAmount(SOL_TOKEN, solAmountBN);
        const amountOut = getCurrencyAmount(poolToken, poolTokenAmountBN);

        const { transaction: swapTransaction, signers: swapTransationSigners } =
          await Liquidity.makeSwapTransaction({
            connection,
            poolKeys: raydiumLiquidityPoolKeys,
            userKeys: {
              tokenAccounts,
              owner: wallet.publicKey,
            },
            amountIn,
            amountOut,
            fixedSide: 'out',
          });

        return {
          swapTransaction,
          swapTransationSigners,
        };
      }

      return {
        swapTransaction: null,
        swapTransationSigners: null,
      };
    })();

    const { pubkey: userFractionsTokenAccount } = await getTokenAccount({
      tokenMint: pool.fractionMint,
      owner: wallet.publicKey,
      connection,
    });

    const {
      instructions: getLotteryTicketInstructions,
      signers: getLotteryTicketSigners,
    } = await getLotteryTicketIx(
      {
        communityPool: pool.publicKey,
        userFractionsTokenAccount,
        fractionMint: pool.fractionMint,
        fusionProgramId: new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
        tokenMintInputFusion: raydiumLiquidityPoolKeys?.lpMint,
        feeConfig: new PublicKey(process.env.FEE_CONFIG_GENERAL),
        adminAddress: new PublicKey(process.env.FEE_ADMIN_GENERAL),
      },
      {
        programId: new PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
        userPubkey: wallet.publicKey,
        provider: new Provider(connection, wallet, null),
      },
    );

    const getLotteryTicketTransaction = new Transaction();
    getLotteryTicketTransaction.add(...getLotteryTicketInstructions);

    const { pubkey: nftUserTokenAccount } = await getTokenAccount({
      tokenMint: new PublicKey(nft.mint),
      owner: wallet.publicKey,
      connection,
    });

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

    const { instructions: depositNftInstructions, signers: depositNftSigners } =
      await depositNftToCommunityPoolIx(
        {
          nftMint: new PublicKey(nft.mint),
          communityPool: pool.publicKey,
          poolWhitelist: poolWhitelist.publicKey,
          nftUserTokenAccount,
          fractionMint: pool.fractionMint,
          metadataInfo,
          fusionProgramId: new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
          tokenMintInputFusion: raydiumLiquidityPoolKeys?.lpMint,
          feeConfig: new PublicKey(process.env.FEE_CONFIG_GENERAL),
          adminAddress: new PublicKey(process.env.FEE_ADMIN_GENERAL),
        },
        {
          programId: new PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
          userPubkey: wallet.publicKey,
          provider: new Provider(connection, wallet, null),
        },
      );
    const depositNftTransaction = new Transaction();
    depositNftTransaction.add(...depositNftInstructions);

    const transactions = [
      depositNftTransaction,
      needSwap && swapTransaction,
      getLotteryTicketTransaction,
    ].filter((txn) => txn);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    transactions.forEach((transaction) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;
    });

    depositNftTransaction.sign(...depositNftSigners);
    needSwap && swapTransaction.sign(...swapTransationSigners);
    getLotteryTicketTransaction.sign(...getLotteryTicketSigners);

    const signedTransactions = await wallet.signAllTransactions(transactions);

    const txidDeposit = await connection.sendRawTransaction(
      signedTransactions[0].serialize(),
      // { skipPreflight: true },
    );

    notify({
      message: 'Transactions sent',
      type: NotifyType.INFO,
    });

    await connection.confirmTransaction(
      { signature: txidDeposit, blockhash, lastValidBlockHeight },
      'finalized',
    );

    if (needSwap) {
      const txidSwap = await connection.sendRawTransaction(
        signedTransactions[1].serialize(),
      );

      await connection.confirmTransaction(
        { signature: txidSwap, blockhash, lastValidBlockHeight },
        'finalized',
      );
    }

    const txidGetLotteryTicket = await connection.sendRawTransaction(
      signedTransactions[signedTransactions.length - 1].serialize(),
      // { skipPreflight: true },
    );

    await connection.confirmTransaction(
      { signature: txidGetLotteryTicket, blockhash, lastValidBlockHeight },
      'finalized',
    );

    notify({
      message: 'Swap made successfully',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Swap failed',
        type: NotifyType.ERROR,
      });
    }

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
