import { web3 } from '@frakt-protocol/frakt-sdk';
import {
  getHandleAndRegistryKey,
  performReverseLookup,
  NAME_PROGRAM_ID,
} from '@bonfida/spl-name-service';
import { NameServiceResponse } from './nameService.model';
import { nameServiceCache } from './nameService.cache';

export const getOwnerAvatar = (twitterHandle: string): string =>
  `https://unavatar.io/twitter/${twitterHandle}`;

const findOwnedNameAccountsForUser = async (
  connection: web3.Connection,
  userAccount: web3.PublicKey,
): Promise<web3.PublicKey[]> => {
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
  return accounts.map((account) => account.pubkey);
};

const lookupForDomainName = async (
  domainKeys: web3.PublicKey[],
  connection: web3.Connection,
): Promise<string | null> => {
  for (const domainKey of domainKeys) {
    try {
      const domain = await performReverseLookup(connection, domainKey);

      return domain || null;
    } catch {
      return null;
    }
  }
};

const lookupForTwitterHandle = async (
  pubkey: web3.PublicKey,
  connection: web3.Connection,
): Promise<string | null> => {
  try {
    const [handle] = await getHandleAndRegistryKey(connection, pubkey);

    return handle || null;
  } catch {
    return null;
  }
};

export const getNameServiceData = async (
  walletPublicKey: string,
  connection: web3.Connection,
): Promise<NameServiceResponse> => {
  if (nameServiceCache[walletPublicKey]) {
    return nameServiceCache[walletPublicKey];
  } else {
    const pubkey = new web3.PublicKey(walletPublicKey);

    const domainKeys = await findOwnedNameAccountsForUser(connection, pubkey);

    const domain = await lookupForDomainName(domainKeys, connection);
    const twitterHandle = await lookupForTwitterHandle(pubkey, connection);

    const nameServiceResponse = {
      domain: domain ? `${domain}.sol` : null,
      twitterHandle: twitterHandle || null,
    };

    nameServiceCache[walletPublicKey] = nameServiceResponse;

    return nameServiceResponse;
  }
};
