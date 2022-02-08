import { Liquidity, Spl } from '@raydium-io/raydium-sdk';
import {
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

import { SOL_TOKEN, wrapAsyncWithTryCatch } from '../../../../utils';
import { signAndConfirmTransaction } from '../../../../utils/transactions';
import { getTokenAccount } from '../../liquidityPools.helpers';
import {
  InitRaydiumLiquidityParams,
  WrappedLiquidityTranscationParams,
} from '../../liquidityPools.model';

export const rowInitRaydiumLiquidityPool = async ({
  connection,
  walletPublicKey,
  signTransaction,
  associatedPoolKeys,
  baseToken,
  quoteToken = SOL_TOKEN,
  baseAmount,
  quoteAmount,
}: InitRaydiumLiquidityParams): Promise<void> => {
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

  await signAndConfirmTransaction({
    transaction,
    signers,
    connection,
    walletPublicKey,
    signTransaction,
  });
};

const wrappedAsyncWithTryCatch = wrapAsyncWithTryCatch(
  rowInitRaydiumLiquidityPool,
  {
    onSuccessMessage: 'Liquidity provided successfully',
    onErrorMessage: 'Transaction failed',
  },
);

export const initRaydiumLiquidityPool =
  ({
    connection,
    walletPublicKey,
    signTransaction,
  }: InitRaydiumLiquidityParams) =>
  (
    params: Omit<InitRaydiumLiquidityParams, WrappedLiquidityTranscationParams>,
  ): Promise<void> =>
    wrappedAsyncWithTryCatch({
      connection,
      walletPublicKey,
      signTransaction,
      ...params,
    });
