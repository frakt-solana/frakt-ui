import {
  Liquidity,
  LiquidityAssociatedPoolKeysV4,
  Spl,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import {
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';
import moment from 'moment';

import { SOL_TOKEN } from '../../../../utils';
import {
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
import { getTokenAccount } from '../../liquidityPools.helpers';
export interface InitRaydiumLiquidityPoolParams {
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  baseAmount: BN;
  quoteAmount: BN;
  associatedPoolKeys: LiquidityAssociatedPoolKeysV4;
}

export interface InitRaydiumLiquidityPoolRawParams
  extends InitRaydiumLiquidityPoolParams,
    WalletAndConnection {}

export const rawInitRaydiumLiquidityPool = async ({
  connection,
  wallet,
  associatedPoolKeys,
  baseToken,
  quoteToken = SOL_TOKEN,
  baseAmount,
  quoteAmount,
}: InitRaydiumLiquidityPoolRawParams): Promise<void> => {
  const transaction = new Transaction();
  const signers: Keypair[] = [];

  const frontInstructions: TransactionInstruction[] = [];
  const endInstructions: TransactionInstruction[] = [];

  const baseTokenAccount = await Spl.getAssociatedTokenAccount({
    mint: new PublicKey(baseToken.address),
    owner: wallet.publicKey,
  });

  let quoteTokenAccount = await Spl.getAssociatedTokenAccount({
    mint: new PublicKey(quoteToken.address),
    owner: wallet.publicKey,
  });

  //? If quoteTokenMint is WSOL
  if (quoteToken.address === SOL_TOKEN.address) {
    const { newAccount: wsolAccount, instructions: wrapSolInstructions } =
      await Spl.makeCreateWrappedNativeAccountInstructions({
        connection,
        owner: wallet.publicKey,
        payer: wallet.publicKey,
        amount: quoteAmount,
      });

    quoteTokenAccount = wsolAccount.publicKey;

    for (const instruction of wrapSolInstructions) {
      frontInstructions.push(instruction);
    }

    endInstructions.push(
      Spl.makeCloseAccountInstruction({
        tokenAccount: wsolAccount.publicKey,
        owner: wallet.publicKey,
        payer: wallet.publicKey,
      }),
    );

    signers.push(wsolAccount);
  }

  frontInstructions.push(
    Spl.makeTransferInstruction({
      source: baseTokenAccount,
      destination: associatedPoolKeys.baseVault,
      owner: wallet.publicKey,
      amount: baseAmount,
    }),
  );

  frontInstructions.push(
    Spl.makeTransferInstruction({
      source: quoteTokenAccount,
      destination: associatedPoolKeys.quoteVault,
      owner: wallet.publicKey,
      amount: quoteAmount,
    }),
  );

  const lpAta = await Spl.getAssociatedTokenAccount({
    mint: associatedPoolKeys.lpMint,
    owner: wallet.publicKey,
  });

  const lpTokenAccount = await getTokenAccount({
    tokenMint: associatedPoolKeys.lpMint,
    owner: wallet.publicKey,
    connection,
  });

  //? if lp ata not exist, you need create it first
  if (!lpTokenAccount) {
    frontInstructions.push(
      Spl.makeCreateAssociatedTokenAccountInstruction({
        mint: associatedPoolKeys.lpMint,
        associatedAccount: lpAta,
        payer: wallet.publicKey,
        owner: wallet.publicKey,
      }),
    );
  }

  endInstructions.push(
    await Liquidity.makeInitPoolInstruction({
      poolKeys: associatedPoolKeys,
      userKeys: {
        lpTokenAccount: lpAta,
        payer: wallet.publicKey,
      },
      startTime: moment.now(),
    }),
  );

  for (const instruction of [...frontInstructions, ...endInstructions]) {
    transaction.add(instruction);
  }

  await signAndConfirmTransaction({
    transaction,
    signers,
    connection,
    wallet,
  });
};
