import { Provider } from '@project-serum/anchor';
import { TokenInfo } from '@solana/spl-token-registry';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import BN from 'bn.js';
import { utils, pools, raydium } from '@frakt-protocol/frakt-sdk';

import { UserNFT } from '../../../state/userTokens/types';
import { notify, SOL_TOKEN } from '../../../utils';
import { NftPoolData } from '../../../utils/cacher/nftPools';
import { NotifyType } from '../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../utils/transactions';
import { SELL_COMMISSION_PERCENT } from '../constants';
import { getTokenPrice } from '../helpers';

type SellNft = (props: {
  pool: NftPoolData;
  poolToken: TokenInfo;
  nft: UserNFT;
  connection: Connection;
  wallet: WalletContextState;
  raydiumLiquidityPoolKeys: raydium.LiquidityPoolKeysV4;
  needSwap?: boolean;
  swapSlippage?: number;
}) => Promise<boolean>;

export const sellNft: SellNft = async ({
  pool,
  nft,
  poolToken,
  connection,
  wallet,
  raydiumLiquidityPoolKeys,
  swapSlippage,
  needSwap = false,
}) => {
  try {
    const { pubkey: nftUserTokenAccount } = await utils.getTokenAccount({
      tokenMint: new PublicKey(nft.mint),
      owner: wallet.publicKey,
      connection,
    });

    const whitelistedCreatorsDictionary =
      pools.getWhitelistedCreatorsDictionary(pool);

    const whitelistedCreator: string | null = pools.isNFTWhitelistedByCreator(
      nft,
      whitelistedCreatorsDictionary,
    );

    const metadataInfo = whitelistedCreator
      ? await utils.deriveMetadataPubkeyFromMint(new PublicKey(nft.mint))
      : new PublicKey(nft.mint);

    const poolWhitelist = pool.poolWhitelist.find(({ whitelistedAddress }) => {
      return whitelistedCreator
        ? whitelistedAddress.toBase58() === whitelistedCreator
        : whitelistedAddress.toBase58() === nft.mint;
    });

    const { instructions: depositNftInstructions, signers: depositNftSigners } =
      await pools.depositNftToCommunityPoolIx({
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
        programId: new PublicKey(process.env.COMMUNITY_POOLS_PUBKEY),
        userPubkey: wallet.publicKey,
        provider: new Provider(connection, wallet, null),
      });
    const depositNftTransaction = new Transaction();
    depositNftTransaction.add(...depositNftInstructions);

    const { swapTransaction, swapTransationSigners } = await (async () => {
      if (needSwap) {
        const { amountWithSlippage: poolTokenPrice } = await getTokenPrice({
          poolData: {
            tokenInfo: poolToken,
            poolConfig: raydiumLiquidityPoolKeys,
          },
          slippage: swapSlippage || 1,
          isBuy: false,
          connection,
        });

        const poolTokenAmountBN = new BN(
          ((100 - SELL_COMMISSION_PERCENT) / 100) * 10 ** poolToken?.decimals,
        );

        const solAmountBN = new BN(
          parseFloat(poolTokenPrice) *
            ((100 - SELL_COMMISSION_PERCENT) / 100) *
            10 ** SOL_TOKEN.decimals,
        );

        const tokenAccounts = (
          await Promise.all(
            [SOL_TOKEN.address, poolToken.address].map((mint) =>
              utils.getTokenAccount({
                tokenMint: new PublicKey(mint),
                owner: wallet.publicKey,
                connection,
              }),
            ),
          )
        ).filter((tokenAccount) => tokenAccount);

        const amountIn = pools.getCurrencyAmount(poolToken, poolTokenAmountBN);
        const amountOut = pools.getCurrencyAmount(SOL_TOKEN, solAmountBN);

        const { transaction: swapTransaction, signers: swapTransationSigners } =
          await raydium.Liquidity.makeSwapTransaction({
            connection,
            poolKeys: raydiumLiquidityPoolKeys,
            userKeys: {
              tokenAccounts,
              owner: wallet.publicKey,
            },
            amountIn,
            amountOut,
            fixedSide: 'in',
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

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    if (needSwap) {
      const transactions = [depositNftTransaction, swapTransaction];
      transactions.forEach((transaction) => {
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;
      });
      depositNftTransaction.sign(...depositNftSigners);
      swapTransaction.sign(...swapTransationSigners);

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

      const txidSwap = await connection.sendRawTransaction(
        signedTransactions[1].serialize(),
        // { skipPreflight: true },
      );

      await connection.confirmTransaction(
        { signature: txidSwap, blockhash, lastValidBlockHeight },
        'finalized',
      );
    } else {
      depositNftTransaction.recentBlockhash = blockhash;
      depositNftTransaction.feePayer = wallet.publicKey;
      depositNftTransaction.sign(...depositNftSigners);

      const signedTransaction = await wallet.signTransaction(
        depositNftTransaction,
      );

      const txid = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        // { skipPreflight: true },
      );

      notify({
        message: 'Transaction sent',
        type: NotifyType.INFO,
      });

      await connection.confirmTransaction(
        { signature: txid, lastValidBlockHeight, blockhash },
        'finalized',
      );
    }

    notify({
      message: 'Sell made successfully',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Sell failed',
        type: NotifyType.ERROR,
      });
    }

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
