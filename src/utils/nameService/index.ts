import { Connection, PublicKey } from '@solana/web3.js';
import {
  getHandleAndRegistryKey,
  performReverseLookup,
  NAME_PROGRAM_ID,
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
} from '@bonfida/spl-name-service';

export interface NameServiceResponse {
  domain?: string;
  twitterHandle?: string;
}

export const TWITTER_ROOT_PARENT_REGISTRY_KEY = new PublicKey(
  '4YcexoW3r78zz16J2aqmukBLRwGq6rAvWzJpkYAXqebv',
);

export const SOL_TLD_AUTHORITY = new PublicKey(
  '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx',
);

export const ROOT_TLD_AUTHORITY = new PublicKey(
  'ZoAhWEqTVqHVqupYmEanDobY7dee5YKbQox9BNASZzU',
);

export async function findOwnedNameAccountsForUser(
  connection: Connection,
  userAccount: PublicKey,
): Promise<PublicKey[]> {
  const filters = [
    {
      memcmp: {
        offset: 32,
        bytes: userAccount.toBase58(),
      },
    },
  ];
  const accounts = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
    filters,
  });
  return accounts.map((a) => a.pubkey);
}

export const getNameServiceData = async (
  publicKey: string,
  connection: Connection,
): Promise<NameServiceResponse> => {
  const pubkey = new PublicKey(publicKey);
  const domainKeys = await findOwnedNameAccountsForUser(connection, pubkey);

  //   * тут нужен цикл который проходит по ключам и отдаёт первый не упавший
  if (domainKeys[0]) {
    const domain = await performReverseLookup(connection, domainKeys[0]);

    return {
      domain: domain ? `${domain}.sol` : undefined,
      twitterHandle: '',
    };
  }
};
