import { Spl, SPL_ACCOUNT_LAYOUT } from '@raydium-io/raydium-sdk';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { AccountInfoData, AccountInfoParsed } from './accounts.model';

export const decodeSplTokenAccountData = (
  tokenAccountDataEncoded: Buffer,
): AccountInfoData => SPL_ACCOUNT_LAYOUT.decode(tokenAccountDataEncoded);

type ParseTokenAccount = (params: {
  tokenAccountPubkey: PublicKey;
  tokenAccountEncoded: AccountInfo<Buffer>;
}) => AccountInfoParsed | null;

export const parseTokenAccount: ParseTokenAccount = ({
  tokenAccountPubkey,
  tokenAccountEncoded,
}) =>
  tokenAccountEncoded
    ? {
        publicKey: tokenAccountPubkey,
        accountInfo: decodeSplTokenAccountData(tokenAccountEncoded.data),
      }
    : null;

export const getTokenAccount = async ({
  tokenMint,
  owner,
  connection,
}: {
  tokenMint: PublicKey;
  owner: PublicKey;
  connection: Connection;
}): Promise<AccountInfoParsed> => {
  const tokenAccountPubkey = await Spl.getAssociatedTokenAccount({
    mint: tokenMint,
    owner,
  });

  const tokenAccountEncoded = await connection.getAccountInfo(
    tokenAccountPubkey,
  );

  return parseTokenAccount({ tokenAccountPubkey, tokenAccountEncoded });
};

export const getTokenAccountBalance = (
  lpTokenAccountInfo: AccountInfoParsed,
  lpDecimals: number,
): number =>
  lpTokenAccountInfo?.accountInfo?.amount.toNumber() / 10 ** lpDecimals || 0;
