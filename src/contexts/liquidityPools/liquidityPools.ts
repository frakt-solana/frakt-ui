import {
  harvestInFusion,
  stakeInFusion,
  unstakeInFusion,
} from '@frakters/fusion-pool';
import {
  Liquidity,
  LiquidityAssociatedPoolKeysV4,
  LiquidityPoolKeysV4,
  Spl,
} from '@raydium-io/raydium-sdk';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';

import { notify, SOL_TOKEN } from '../../utils';
import { getCurrencyAmount, getTokenAccount } from './liquidityPools.helpers';
import CONFIG from './config';
import {
  CreateLiquidityTransactionParams,
  LiquidityTransactionParams,
  RaydiumPoolInfo,
  RemoveLiquidityTransactionParams,
} from './liquidityPools.model';
import BN from 'bn.js';

const { PROGRAM_PUBKEY } = CONFIG;

export const fetchRaydiumPoolsInfo =
  (connection: Connection) =>
  async (
    raydiumPoolConfigs: LiquidityPoolKeysV4[],
  ): Promise<RaydiumPoolInfo[]> => {
    const raydiumPoolsInfo = await Liquidity.fetchMultipleInfo({
      connection,
      pools: raydiumPoolConfigs,
    });

    return raydiumPoolsInfo;
  };

export const raydiumSwap =
  (
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
  ) =>
  async ({
    baseToken,
    baseAmount,
    quoteToken = SOL_TOKEN,
    quoteAmount,
    poolConfig,
  }: LiquidityTransactionParams): Promise<void> => {
    try {
      const tokenAccounts = (
        await Promise.all(
          [baseToken.address, quoteToken.address].map((mint) =>
            getTokenAccount({
              tokenMint: new PublicKey(mint),
              owner: walletPublicKey,
              connection,
            }),
          ),
        )
      ).filter((tokenAccount) => tokenAccount);

      const amountIn = getCurrencyAmount(baseToken, baseAmount);
      const amountOut = getCurrencyAmount(quoteToken, quoteAmount);

      const { transaction, signers } = await Liquidity.makeSwapTransaction({
        connection,
        poolKeys: poolConfig,
        userKeys: {
          tokenAccounts,
          owner: walletPublicKey,
        },
        amountIn,
        amountOut,
        fixedSide: 'in',
      });

      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = walletPublicKey;
      transaction.sign(...signers);

      const signedTransaction = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        // { skipPreflight: true },
      );

      notify({
        message: 'Swap made successfully',
        type: 'success',
      });

      return void connection.confirmTransaction(txid);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      notify({
        message: 'Swap failed',
        type: 'error',
      });
    }
  };

export const addRaydiumLiquidity =
  (
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
  ) =>
  async ({
    baseToken,
    baseAmount,
    quoteToken = SOL_TOKEN,
    quoteAmount,
    poolConfig,
  }: LiquidityTransactionParams): Promise<void> => {
    try {
      const tokenAccounts = (
        await Promise.all(
          [baseToken.address, quoteToken.address, poolConfig.lpMint].map(
            (mint) =>
              getTokenAccount({
                tokenMint: new PublicKey(mint),
                owner: walletPublicKey,
                connection,
              }),
          ),
        )
      ).filter((tokenAccount) => tokenAccount);

      const amountInA = getCurrencyAmount(baseToken, baseAmount);
      const amountInB = getCurrencyAmount(SOL_TOKEN, quoteAmount);

      const { transaction, signers } =
        await Liquidity.makeAddLiquidityTransaction({
          connection,
          poolKeys: poolConfig,
          userKeys: {
            tokenAccounts,
            owner: walletPublicKey,
          },
          amountInA,
          amountInB,
          fixedSide: 'b',
        });

      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = walletPublicKey;
      transaction.sign(...signers);

      const signedTransaction = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        // { skipPreflight: true },
      );

      notify({
        message: 'Liquidity provided successfully',
        type: 'success',
      });

      return void connection.confirmTransaction(txid);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      notify({
        message: 'Transaction failed',
        type: 'error',
      });
    }
  };

export const removeRaydiumLiquidity =
  (
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
  ) =>
  async ({
    baseToken,
    quoteToken = SOL_TOKEN,
    poolConfig,
    amount,
  }: RemoveLiquidityTransactionParams): Promise<void> => {
    try {
      const tokenAccounts = (
        await Promise.all(
          [baseToken.address, quoteToken.address, poolConfig.lpMint].map(
            (mint) =>
              getTokenAccount({
                tokenMint: new PublicKey(mint),
                owner: walletPublicKey,
                connection,
              }),
          ),
        )
      ).filter((tokenAccount) => tokenAccount);

      const { transaction, signers } =
        await Liquidity.makeRemoveLiquidityTransaction({
          connection,
          poolKeys: poolConfig,
          userKeys: {
            tokenAccounts: tokenAccounts,
            owner: walletPublicKey,
          },
          amountIn: amount,
        });

      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = walletPublicKey;
      transaction.sign(...signers);

      const signedTransaction = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        // { skipPreflight: true },
      );

      notify({
        message: 'Liquidity withdrawn successfully',
        type: 'success',
      });

      return void connection.confirmTransaction(txid);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      notify({
        message: 'Transaction failed',
        type: 'error',
      });
    }
  };

export const stakeLiquidity =
  (
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
  ) =>
  async ({ amount, router }): Promise<void> => {
    try {
      await stakeInFusion(
        walletPublicKey,
        connection,
        new PublicKey(PROGRAM_PUBKEY),
        new PublicKey(router.token_mint_input),
        new PublicKey(router.token_mint_output),
        amount,
        new PublicKey(router.routerPubkey),
        new PublicKey(router.pool_config_input),
        new PublicKey(router.pool_config_output),
        async (txn) => {
          const { blockhash } = await connection.getRecentBlockhash();
          txn.recentBlockhash = blockhash;
          txn.feePayer = walletPublicKey;
          const signed = await signTransaction(txn);
          const txid = await connection.sendRawTransaction(signed.serialize());
          return void connection.confirmTransaction(txid);
        },
      );

      notify({ message: 'successfully', type: 'success' });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      notify({
        message: 'Transaction failed',
        type: 'error',
      });
    }
  };

export const harvestLiquidity =
  (
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
  ) =>
  async ({ router, stakeAccount }): Promise<void> => {
    try {
      await harvestInFusion(
        walletPublicKey,
        connection,
        new PublicKey(PROGRAM_PUBKEY),
        new PublicKey(router.token_mint_input),
        new PublicKey(router.token_mint_output),
        new PublicKey(router.routerPubkey),
        [new PublicKey(stakeAccount.stakePubkey)],
        new PublicKey(router.pool_config_input),
        new PublicKey(router.pool_config_output),
        async (txn) => {
          const { blockhash } = await connection.getRecentBlockhash();
          txn.recentBlockhash = blockhash;
          txn.feePayer = walletPublicKey;
          const signed = await signTransaction(txn);
          const txid = await connection.sendRawTransaction(signed.serialize());
          return void connection.confirmTransaction(txid);
        },
      );

      notify({
        message: 'Liquidity harvest successfully',
        type: 'success',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      notify({
        message: 'Transaction failed',
        type: 'error',
      });
    }
  };

export const unstakeLiquidity =
  (
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
  ) =>
  async ({ router, stakeAccount }): Promise<void> => {
    try {
      await unstakeInFusion(
        walletPublicKey,
        new PublicKey(PROGRAM_PUBKEY),
        new PublicKey(router.token_mint_input),
        new PublicKey(router.token_mint_output),
        new PublicKey(router.routerPubkey),
        [new PublicKey(stakeAccount.stakePubkey)],
        new PublicKey(router.pool_config_input),
        new PublicKey(router.pool_config_output),
        async (txn) => {
          const { blockhash } = await connection.getRecentBlockhash();
          txn.recentBlockhash = blockhash;
          txn.feePayer = walletPublicKey;
          const signed = await signTransaction(txn);
          const txid = await connection.sendRawTransaction(signed.serialize());
          return void connection.confirmTransaction(txid);
        },
      );

      notify({ message: 'successfully', type: 'success' });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      notify({
        message: 'Transaction failed',
        type: 'error',
      });
    }
  };

export const createRaydiumLiquidityPool =
  (
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
  ) =>
  async ({
    baseAmount,
    quoteAmount,
    baseToken,
    quoteToken = SOL_TOKEN,
    marketId,
  }: CreateLiquidityTransactionParams): Promise<void> => {
    try {
      const associatedPoolKeys = await Liquidity.getAssociatedPoolKeys({
        version: 4,
        marketId,
        baseMint: new PublicKey(baseToken.address),
        quoteMint: new PublicKey(quoteToken.address),
      });

      // const marketAccountInfo = await connection.getAccountInfo(marketId);
      // console.log(SPL_ACCOUNT_LAYOUT.decode(marketAccountInfo.data));

      await createEmptyRaydiumLiquidityPool({
        connection,
        walletPublicKey,
        signTransaction,
        associatedPoolKeys,
      });

      await initRaydiumLiquidityPool({
        connection,
        walletPublicKey,
        signTransaction,
        associatedPoolKeys,
        baseToken,
        quoteToken,
        baseAmount,
        quoteAmount,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      notify({
        message: 'Transaction failed',
        type: 'error',
      });
    }
  };

const createEmptyRaydiumLiquidityPool = async ({
  connection,
  walletPublicKey,
  signTransaction,
  associatedPoolKeys,
}: {
  connection: Connection;
  walletPublicKey: PublicKey;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  associatedPoolKeys: LiquidityAssociatedPoolKeysV4;
}) => {
  const transaction = new Transaction();

  transaction.add(
    await Liquidity.makeCreatePoolInstruction({
      poolKeys: associatedPoolKeys,
      userKeys: {
        payer: walletPublicKey,
      },
    }),
  );

  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = walletPublicKey;

  const signedTransaction = await signTransaction(transaction);
  const txid = await connection.sendRawTransaction(
    signedTransaction.serialize(),
    // { skipPreflight: true },
  );

  notify({
    message: 'Liquidity pool created',
    type: 'success',
  });

  return void connection.confirmTransaction(txid);
};

const initRaydiumLiquidityPool = async ({
  connection,
  walletPublicKey,
  signTransaction,
  associatedPoolKeys,
  baseToken,
  quoteToken = SOL_TOKEN,
  baseAmount,
  quoteAmount,
}: {
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  baseAmount: BN;
  quoteAmount: BN;
  connection: Connection;
  walletPublicKey: PublicKey;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  associatedPoolKeys: LiquidityAssociatedPoolKeysV4;
}) => {
  const transaction = new Transaction();
  const signers: Keypair[] = [];

  const frontInstructions: TransactionInstruction[] = [];
  const endInstructions: TransactionInstruction[] = [];

  const baseTokenAccount = await Spl.getAssociatedTokenAccount({
    mint: new PublicKey(baseToken.address),
    owner: walletPublicKey,
  });

  let quoteTokenAccount = await Spl.getAssociatedTokenAccount({
    mint: new PublicKey(quoteToken.address),
    owner: walletPublicKey,
  });

  //? If quoteTokenMint is WSOL
  if (quoteToken.address === SOL_TOKEN.address) {
    const { newAccount: wsolAccount, instructions: wrapSolInstructions } =
      await Spl.makeCreateWrappedNativeAccountInstructions({
        connection,
        owner: walletPublicKey,
        payer: walletPublicKey,
        amount: quoteAmount,
      });

    quoteTokenAccount = wsolAccount.publicKey;

    for (const instruction of wrapSolInstructions) {
      frontInstructions.push(instruction);
    }

    endInstructions.push(
      Spl.makeCloseAccountInstruction({
        tokenAccount: wsolAccount.publicKey,
        owner: walletPublicKey,
        payer: walletPublicKey,
      }),
    );

    signers.push(wsolAccount);
  }

  frontInstructions.push(
    Spl.makeTransferInstruction({
      source: baseTokenAccount,
      destination: associatedPoolKeys.baseVault,
      owner: walletPublicKey,
      amount: baseAmount,
    }),
  );

  frontInstructions.push(
    Spl.makeTransferInstruction({
      source: quoteTokenAccount,
      destination: associatedPoolKeys.quoteVault,
      owner: walletPublicKey,
      amount: quoteAmount,
    }),
  );

  const lpAta = await Spl.getAssociatedTokenAccount({
    mint: associatedPoolKeys.lpMint,
    owner: walletPublicKey,
  });

  const lpTokenAccount = await getTokenAccount({
    tokenMint: associatedPoolKeys.lpMint,
    owner: walletPublicKey,
    connection,
  });

  //? if lp ata not exist, you need create it first
  if (!lpTokenAccount) {
    frontInstructions.push(
      Spl.makeCreateAssociatedTokenAccountInstruction({
        mint: associatedPoolKeys.lpMint,
        associatedAccount: lpAta,
        payer: walletPublicKey,
        owner: walletPublicKey,
      }),
    );
  }

  endInstructions.push(
    await Liquidity.makeInitPoolInstruction({
      poolKeys: associatedPoolKeys,
      userKeys: {
        lpTokenAccount: lpAta,
        payer: walletPublicKey,
      },
    }),
  );

  for (const instruction of [...frontInstructions, ...endInstructions]) {
    transaction.add(instruction);
  }

  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = walletPublicKey;
  transaction.sign(...signers);

  const signedTransaction = await signTransaction(transaction);
  const txid = await connection.sendRawTransaction(
    signedTransaction.serialize(),
    // { skipPreflight: true },
  );

  notify({
    message: 'Liquidity provided successfully',
    type: 'success',
  });

  return void connection.confirmTransaction(txid);
};
