import { TOKEN_PROGRAM_ID } from './../getArweaveMetadata/arweave.constant';
import { Spl, SPL_ACCOUNT_LAYOUT } from '@raydium-io/raydium-sdk';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import {
  AccountInfoData,
  AccountInfoParsed,
  TokenView,
} from './accounts.model';
import { AccountLayout } from '@solana/spl-token';
import BN from 'bn.js';

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

type getAllUserTokens = (props: {
  connection: Connection;
  walletPublicKey: PublicKey;
}) => Promise<TokenView[]>;

export const getAllUserTokens: getAllUserTokens = async ({
  connection,
  walletPublicKey,
}) => {
  const { value: tokenAccounts } = await connection.getTokenAccountsByOwner(
    walletPublicKey,
    { programId: TOKEN_PROGRAM_ID },
    'singleGossip',
  );

  return (
    tokenAccounts?.map(({ pubkey, account }) => {
      const parsedData = AccountLayout.decode(account.data);

      const amountNum = parsedData.amount
        ? new BN(parsedData.amount, 10, 'le')?.toNumber()
        : -1;

      return {
        tokenAccountPubkey: pubkey.toBase58(),
        mint: new PublicKey(parsedData.mint).toBase58(),
        owner: new PublicKey(parsedData.owner).toBase58(),
        amount: amountNum,
        amountBN: new BN(parsedData.amount, 10, 'le'),
        delegateOption: !!parsedData.delegateOption,
        delegate: new PublicKey(parsedData.delegate).toBase58(),
        state: parsedData.state,
        isNativeOption: !!parsedData.isNativeOption,
        isNative: new BN(parsedData.isNative, 10, 'le').toNumber(),
        delegatedAmount: new BN(
          parsedData.delegatedAmount,
          10,
          'le',
        ).toNumber(),
        closeAuthorityOption: !!parsedData.closeAuthorityOption,
        closeAuthority: new PublicKey(parsedData.closeAuthority).toBase58(),
      };
    }) || []
  );
};
