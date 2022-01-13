import {
  Liquidity,
  LiquidityPoolKeysV4,
  Spl,
  WSOL,
} from '@raydium-io/raydium-sdk';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';
import { notify } from '../../utils';

import { RaydiumPoolInfo } from './liquidityPools.model';

export const fetchRaydiumPoolsInfo =
  (connection: Connection) =>
  async (
    raydiumPoolConfigs: LiquidityPoolKeysV4[],
  ): Promise<RaydiumPoolInfo[]> => {
    const raydiumPoolsInfo = await Liquidity.getMultipleInfo({
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
  async (
    amount: BN, //? How many tokens or SOL user pays
    minAmountOut = new BN(0), //? Min amount of bougth tokens/SOL that user wants to receive
    raydiumPoolConfig: LiquidityPoolKeysV4,
    isBuy: boolean, //? if true then you buy token using SOL else sell token and get SOL
  ): Promise<void> => {
    try {
      const transaction = new Transaction();
      // The close account instruction needs to be at the end
      // so the frontInstructions and endInstructions design is used
      const frontInstructions: TransactionInstruction[] = [];
      const endInstructions: TransactionInstruction[] = [];

      const signers: Keypair[] = [];

      const baseTokenAccount = await Spl.getAssociatedTokenAccount({
        mint: raydiumPoolConfig.baseMint,
        owner: walletPublicKey,
      });
      let quoteTokenAccount = await Spl.getAssociatedTokenAccount({
        mint: raydiumPoolConfig.quoteMint,
        owner: walletPublicKey,
      });

      // In general only Quote Token is WSOL
      // but the special case Base Token may also be WSOL
      // I will not write Base here first
      if (raydiumPoolConfig.quoteMint.toBase58() === WSOL.mint) {
        // WSOL always create new, instead of using ATA!!
        const { newAccount, instructions } =
          await Spl.makeCreateWrappedNativeAccountInstructions({
            connection,
            owner: walletPublicKey,
            payer: walletPublicKey,
            // If it is buy, i.e. the input is WSOL
            // then it should be consistent with amountIn here
            // otherwise, i.e. sell, it is 0
            // amount: lamports,
            // amount: 1 * 1e7,
            amount: isBuy ? amount : 0,
          });

        quoteTokenAccount = newAccount.publicKey;

        for (const instruction of instructions) {
          frontInstructions.push(instruction);
        }

        endInstructions.push(
          Spl.makeCloseAccountInstruction({
            tokenAccount: newAccount.publicKey,
            owner: walletPublicKey,
            payer: walletPublicKey,
          }),
        );

        signers.push(newAccount);
      } else {
        // If the ATA has not yet been created
        // you will need to create them first
        frontInstructions.push(
          Spl.makeCreateAssociatedTokenAccountInstruction({
            mint: raydiumPoolConfig.quoteMint,
            associatedAccount: quoteTokenAccount,
            owner: walletPublicKey,
            payer: walletPublicKey,
          }),
        );
      }

      const tokenAccountInfo = await connection.getAccountInfo(
        baseTokenAccount,
      );

      if (
        raydiumPoolConfig.baseMint.toBase58() !== WSOL.mint &&
        !tokenAccountInfo
      ) {
        frontInstructions.push(
          Spl.makeCreateAssociatedTokenAccountInstruction({
            mint: raydiumPoolConfig.baseMint,
            associatedAccount: baseTokenAccount,
            owner: walletPublicKey,
            payer: walletPublicKey,
          }),
        );
      }

      frontInstructions.push(
        Liquidity.makeSwapInstruction({
          poolKeys: raydiumPoolConfig,
          userKeys: {
            // No need to change according to side
            baseTokenAccount,
            // No need to change according to side
            quoteTokenAccount,
            owner: walletPublicKey,
          },
          amountIn: amount,
          minAmountOut,
          side: isBuy ? 'buy' : 'sell',
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
