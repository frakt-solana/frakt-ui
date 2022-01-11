import {
  Liquidity,
  LiquidityPoolKeysV4,
  Spl,
  WSOL,
} from '@raydium-io/raydium-sdk';
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';

import { notify } from '../../utils';
import { RawUserTokensByMint } from '../userTokens';

export const fetchRaydiumPools = async (
  connection: Connection,
): Promise<LiquidityPoolKeysV4[]> => {
  return await Liquidity.getPools(connection);
};

export const fetchPoolInfo = async (
  connection: Connection,
  poolConfig: LiquidityPoolKeysV4,
): Promise<any> => {
  // getInfo not exist in Liquidity
  // const info = await Liquidity.getInfo(connection, poolConfig);
  // return info;
};

export const swap = async (
  connection: Connection,
  walletPublicKey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  userTokensMap: RawUserTokensByMint,
  amount: BN,
  minAmountOut = new BN(0),
  poolConfig: LiquidityPoolKeysV4,
  isBuy: boolean,
): Promise<void> => {
  try {
    const transaction = new Transaction();
    // The close account instruction needs to be at the end
    // so the frontInstructions and endInstructions design is used
    const frontInstructions: TransactionInstruction[] = [];
    const endInstructions: TransactionInstruction[] = [];

    const signers = [];

    const baseTokenAccount = await Spl.getAssociatedTokenAccount({
      mint: poolConfig.baseMint,
      owner: walletPublicKey,
    });
    let quoteTokenAccount = await Spl.getAssociatedTokenAccount({
      mint: poolConfig.quoteMint,
      owner: walletPublicKey,
    });

    // In general only Quote Token is WSOL
    // but the special case Base Token may also be WSOL
    // I will not write Base here first
    if (poolConfig.quoteMint.toBase58() === WSOL.mint) {
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
          mint: poolConfig.quoteMint,
          associatedAccount: quoteTokenAccount,
          owner: walletPublicKey,
          payer: walletPublicKey,
        }),
      );
    }

    const tokenAccountInfo = await connection.getAccountInfo(baseTokenAccount);

    if (poolConfig.baseMint.toBase58() !== WSOL.mint && !tokenAccountInfo) {
      frontInstructions.push(
        Spl.makeCreateAssociatedTokenAccountInstruction({
          mint: poolConfig.baseMint,
          associatedAccount: baseTokenAccount,
          owner: walletPublicKey,
          payer: walletPublicKey,
        }),
      );
    }

    frontInstructions.push(
      Liquidity.makeSwapInstruction({
        poolKeys: poolConfig,
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
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);

    notify({
      message: 'Swap failed',
      type: 'error',
    });
  }
};
