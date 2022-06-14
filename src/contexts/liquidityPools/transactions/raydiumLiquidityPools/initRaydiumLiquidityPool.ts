import { TokenInfo } from '@solana/spl-token-registry';
import moment from 'moment';
import { utils, raydium, BN, web3 } from '@frakt-protocol/frakt-sdk';

import { SOL_TOKEN } from '../../../../utils';
import {
  signAndConfirmTransaction,
  WalletAndConnection,
} from '../../../../utils/transactions';
export interface InitRaydiumLiquidityPoolParams {
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
  baseAmount: BN;
  quoteAmount: BN;
  associatedPoolKeys: raydium.LiquidityAssociatedPoolKeysV4;
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
  const transaction = new web3.Transaction();
  const signers: web3.Keypair[] = [];

  const frontInstructions: web3.TransactionInstruction[] = [];
  const endInstructions: web3.TransactionInstruction[] = [];

  const baseTokenAccount = await raydium.Spl.getAssociatedTokenAccount({
    mint: new web3.PublicKey(baseToken.address),
    owner: wallet.publicKey,
  });

  let quoteTokenAccount = await raydium.Spl.getAssociatedTokenAccount({
    mint: new web3.PublicKey(quoteToken.address),
    owner: wallet.publicKey,
  });

  //? If quoteTokenMint is WSOL
  if (quoteToken.address === SOL_TOKEN.address) {
    const { newAccount: wsolAccount, instructions: wrapSolInstructions } =
      await raydium.Spl.makeCreateWrappedNativeAccountInstructions({
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
      raydium.Spl.makeCloseAccountInstruction({
        tokenAccount: wsolAccount.publicKey,
        owner: wallet.publicKey,
        payer: wallet.publicKey,
      }),
    );

    signers.push(wsolAccount);
  }

  frontInstructions.push(
    raydium.Spl.makeTransferInstruction({
      source: baseTokenAccount,
      destination: associatedPoolKeys.baseVault,
      owner: wallet.publicKey,
      amount: baseAmount,
    }),
  );

  frontInstructions.push(
    raydium.Spl.makeTransferInstruction({
      source: quoteTokenAccount,
      destination: associatedPoolKeys.quoteVault,
      owner: wallet.publicKey,
      amount: quoteAmount,
    }),
  );

  const lpAta = await raydium.Spl.getAssociatedTokenAccount({
    mint: associatedPoolKeys.lpMint,
    owner: wallet.publicKey,
  });

  const lpTokenAccount = await utils.getTokenAccount({
    tokenMint: associatedPoolKeys.lpMint,
    owner: wallet.publicKey,
    connection,
  });

  //? if lp ata not exist, you need create it first
  if (!lpTokenAccount) {
    frontInstructions.push(
      raydium.Spl.makeCreateAssociatedTokenAccountInstruction({
        mint: associatedPoolKeys.lpMint,
        associatedAccount: lpAta,
        payer: wallet.publicKey,
        owner: wallet.publicKey,
      }),
    );
  }

  endInstructions.push(
    await raydium.Liquidity.makeInitPoolInstruction({
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
