import { Liquidity, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { notify, SOL_TOKEN } from '../../utils';
import { getCurrencyAmount, getTokenAccount } from './liquidityPools.helpers';

import {
  LiquidityTransactionParams,
  RaydiumPoolInfo,
} from './liquidityPools.model';

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

      const currencyAmountIn = getCurrencyAmount(baseToken, baseAmount);
      const currencyAmountOut = getCurrencyAmount(quoteToken, quoteAmount);

      const { transaction, signers } = await Liquidity.makeSwapTransaction({
        connection,
        poolKeys: poolConfig,
        userKeys: {
          tokenAccounts,
          owner: walletPublicKey,
        },
        currencyAmountIn,
        currencyAmountOut,
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

      const currencyAmountInA = getCurrencyAmount(baseToken, baseAmount);
      const currencyAmountInB = getCurrencyAmount(SOL_TOKEN, quoteAmount);

      const { transaction, signers } =
        await Liquidity.makeAddLiquidityTransaction({
          connection,
          poolKeys: poolConfig,
          userKeys: {
            tokenAccounts,
            owner: walletPublicKey,
          },
          currencyAmountInA,
          currencyAmountInB,
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

// export const provideRaydiumLiquidity_OLD =
//   (
//     connection: Connection,
//     walletPublicKey: PublicKey,
//     signTransaction: (transaction: Transaction) => Promise<Transaction>,
//   ) =>
//   async (
//     baseAmount: BN,
//     quoteAmount: BN,
//     baseTokenMint: string,
//     quoteTokenMint: string = SOL_TOKEN.address,
//     marketId: PublicKey,
//   ): Promise<void> => {
//     try {
//       const associatedPoolKeys = await Liquidity.getAssociatedPoolKeys({
//         version: 4,
//         marketId,
//         baseMint: new PublicKey(baseTokenMint),
//         quoteMint: new PublicKey(quoteTokenMint),
//       });

//       // console.log(associatedPoolKeys.lpMint.toBase58());

//       const transaction = new Transaction();
//       const signers: Keypair[] = [];

//       const frontInstructions: TransactionInstruction[] = [];
//       const endInstructions: TransactionInstruction[] = [];

//       const baseTokenAccount = await Spl.getAssociatedTokenAccount({
//         mint: new PublicKey(baseTokenMint),
//         owner: walletPublicKey,
//       });

//       let quoteTokenAccount = await Spl.getAssociatedTokenAccount({
//         mint: new PublicKey(quoteTokenMint),
//         owner: walletPublicKey,
//       });

//       // console.log(quoteTokenAccount);

//       //? If quoteTokenMint is WSOL
//       if (quoteTokenMint === SOL_TOKEN.address) {
//         const { newAccount: wsolAccount, instructions: wrapSolInstructions } =
//           await Spl.makeCreateWrappedNativeAccountInstructions({
//             connection,
//             owner: walletPublicKey,
//             payer: walletPublicKey,
//             amount: quoteAmount,
//           });

//         quoteTokenAccount = wsolAccount.publicKey;

//         for (const instruction of wrapSolInstructions) {
//           frontInstructions.push(instruction);
//         }

//         endInstructions.push(
//           Spl.makeCloseAccountInstruction({
//             tokenAccount: wsolAccount.publicKey,
//             owner: walletPublicKey,
//             payer: walletPublicKey,
//           }),
//         );

//         signers.push(wsolAccount);
//       }

//       // //TODO: If LP doesn't exist
//       // transaction.add(
//       //   await Liquidity.makeCreatePoolInstruction({
//       //     poolKeys: associatedPoolKeys,
//       //     userKeys: {
//       //       payer: walletPublicKey,
//       //     },
//       //   }),
//       // );

//       //TODO: get tokenAccounts of base and quote token

//       frontInstructions.push(
//         Spl.makeTransferInstruction({
//           source: baseTokenAccount,
//           destination: associatedPoolKeys.baseVault,
//           owner: walletPublicKey,
//           amount: baseAmount,
//         }),
//       );
//       frontInstructions.push(
//         Spl.makeTransferInstruction({
//           source: quoteTokenAccount,
//           destination: associatedPoolKeys.quoteVault,
//           owner: walletPublicKey,
//           amount: quoteAmount,
//         }),
//       );

//       //? if lp ata not exist, you need create it first
//       const lpAta = await Spl.getAssociatedTokenAccount({
//         mint: associatedPoolKeys.lpMint,
//         owner: walletPublicKey,
//       });

//       // frontInstructions.push(
//       //   Spl.makeCreateAssociatedTokenAccountInstruction({
//       //     mint: associatedPoolKeys.lpMint,
//       //     associatedAccount: lpAta,
//       //     payer: walletPublicKey,
//       //     owner: walletPublicKey,
//       //   }),
//       // );

//       const initPoolInstruction = await Liquidity.makeInitPoolInstruction({
//         poolKeys: associatedPoolKeys,
//         userKeys: {
//           lpTokenAccount: lpAta,
//           payer: walletPublicKey,
//         },
//       });

//       endInstructions.push(initPoolInstruction);

//       for (const instruction of [...frontInstructions, ...endInstructions]) {
//         transaction.add(instruction);
//       }

//       const { blockhash } = await connection.getRecentBlockhash();
//       transaction.recentBlockhash = blockhash;
//       transaction.feePayer = walletPublicKey;
//       transaction.sign(...signers);

//       const signedTransaction = await signTransaction(transaction);
//       const txid = await connection.sendRawTransaction(
//         signedTransaction.serialize(),
//         { skipPreflight: true },
//       );

//       notify({
//         message: 'Liquidity provided successfully',
//         type: 'success',
//       });

//       return void connection.confirmTransaction(txid);
//     } catch (error) {
//       // eslint-disable-next-line no-console
//       console.error(error);

//       notify({
//         message: 'Transaction failed',
//         type: 'error',
//       });
//     }
//   };
