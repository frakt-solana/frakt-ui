import { TOKEN_PROGRAM_ID } from './../getArweaveMetadata/arweave.constant';
import { web3, raydium, BN } from '@frakt-protocol/frakt-sdk';
import {
  AccountInfoData,
  AccountInfoParsed,
  TokenView,
} from './accounts.model';
import { AccountLayout } from '@solana/spl-token';

export const decodeSplTokenAccountData = (
  tokenAccountDataEncoded: Buffer,
): AccountInfoData =>
  raydium.SPL_ACCOUNT_LAYOUT.decode(tokenAccountDataEncoded);

type ParseTokenAccount = (params: {
  tokenAccountPubkey: web3.PublicKey;
  tokenAccountEncoded: web3.AccountInfo<Buffer>;
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
  tokenMint: web3.PublicKey;
  owner: web3.PublicKey;
  connection: web3.Connection;
}): Promise<AccountInfoParsed> => {
  const tokenAccountPubkey = await raydium.Spl.getAssociatedTokenAccount({
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
  connection: web3.Connection;
  walletPublicKey: web3.PublicKey;
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

      const amountNum = (() => {
        try {
          return new BN(parsedData.amount, 10, 'le')?.toNumber();
        } catch (error) {
          return -1;
        }
      })();

      return {
        tokenAccountPubkey: pubkey.toBase58(),
        mint: new web3.PublicKey(parsedData.mint).toBase58(),
        owner: new web3.PublicKey(parsedData.owner).toBase58(),
        amount: amountNum,
        amountBN: new BN(parsedData.amount, 10, 'le'),
        delegateOption: !!parsedData.delegateOption,
        delegate: new web3.PublicKey(parsedData.delegate).toBase58(),
        state: parsedData.state,
        isNativeOption: !!parsedData.isNativeOption,
        isNative: new BN(parsedData.isNative, 10, 'le').toNumber(),
        delegatedAmount: new BN(
          parsedData.delegatedAmount,
          10,
          'le',
        ).toNumber(),
        closeAuthorityOption: !!parsedData.closeAuthorityOption,
        closeAuthority: new web3.PublicKey(
          parsedData.closeAuthority,
        ).toBase58(),
      };
    }) || []
  );
};
