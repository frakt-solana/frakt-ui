import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useConnection } from './connection';
import { useWallet } from './wallet';
import {
  AccountInfo,
  ConfirmedSignatureInfo,
  ConfirmedTransaction,
  Connection,
  PublicKey,
} from '@solana/web3.js';
import { AccountLayout, MintInfo, MintLayout, u64 } from '@solana/spl-token';
import { TokenAccount } from '../models';
import { chunks } from '../utils/utils';
import { EventEmitter } from '../utils/eventEmitter';
import { useUserAccounts } from '../hooks';
import { programIds, WRAPPED_SOL_MINT } from '../utils/ids';

const AccountsContext = React.createContext<any>(null);

const pendingCalls = new Map<string, Promise<ParsedAccountBase>>();
const genericCache = new Map<string, ParsedAccountBase>();
const transactionCache = new Map<string, ParsedLocalTransaction | null>();

export interface ParsedLocalTransaction {
  transactionType: number;
  signature: ConfirmedSignatureInfo;
  confirmedTx: ConfirmedTransaction | null;
}

export interface ParsedAccountBase {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
  info: any; // TODO: change to unkown
}

export type AccountParser = (
  pubkey: PublicKey,
  data: AccountInfo<Buffer>,
) => ParsedAccountBase | undefined;

export interface ParsedAccount<T> extends ParsedAccountBase {
  info: T;
}

export const MintParser = (
  pubKey: PublicKey,
  info: AccountInfo<Buffer>,
): ParsedAccountBase => {
  const buffer = Buffer.from(info.data);

  const data = deserializeMint(buffer);

  return {
    pubkey: pubKey,
    account: {
      ...info,
    },
    info: data,
  } as ParsedAccountBase;
};

export const TokenAccountParser = (
  pubKey: PublicKey,
  info: AccountInfo<Buffer>,
): TokenAccount => {
  const buffer = Buffer.from(info.data);
  const data = deserializeAccount(buffer);

  return {
    pubkey: pubKey,
    account: {
      ...info,
    },
    info: data,
  } as TokenAccount;
};

export const GenericAccountParser = (
  pubKey: PublicKey,
  info: AccountInfo<Buffer>,
): ParsedAccountBase => {
  const buffer = Buffer.from(info.data);

  return {
    pubkey: pubKey,
    account: {
      ...info,
    },
    info: buffer,
  } as ParsedAccountBase;
};

export const keyToAccountParser = new Map<string, AccountParser>();

export const cache = {
  emitter: new EventEmitter(),
  query: async (
    connection: Connection,
    pubKey: string | PublicKey,
    parser?: AccountParser,
    // eslint-disable-next-line require-await
  ): Promise<ParsedAccountBase> => {
    let id: PublicKey;
    if (typeof pubKey === 'string') {
      id = new PublicKey(pubKey);
    } else {
      id = pubKey;
    }

    const address = id.toBase58();

    const account = genericCache.get(address);
    if (account) {
      return account;
    }

    let query = pendingCalls.get(address);
    if (query) {
      return query;
    }

    // TODO: refactor to use multiple accounts query with flush like behavior
    query = connection.getAccountInfo(id).then((data) => {
      if (!data) {
        throw new Error('Account not found');
      }

      return cache.add(id, data, parser);
    }) as Promise<TokenAccount>;
    pendingCalls.set(address, query as any);

    return query;
  },
  add: (
    id: PublicKey | string,
    obj: AccountInfo<Buffer>,
    parser?: AccountParser,
  ): ParsedAccountBase => {
    if (obj.data.length === 0) {
      return;
    }

    const address = typeof id === 'string' ? id : id?.toBase58();
    const deserialize = parser ? parser : keyToAccountParser.get(address);
    if (!deserialize) {
      throw new Error(
        'Deserializer needs to be registered or passed as a parameter',
      );
    }

    cache.registerParser(id, deserialize);
    pendingCalls.delete(address);
    const account = deserialize(new PublicKey(address), obj);
    if (!account) {
      return;
    }

    const isNew = !genericCache.has(address);

    genericCache.set(address, account);
    cache.emitter.raiseCacheUpdated(address, isNew, deserialize);
    return account;
  },
  get: (pubKey: string | PublicKey): ParsedAccountBase => {
    let key: string;
    if (typeof pubKey !== 'string') {
      key = pubKey.toBase58();
    } else {
      key = pubKey;
    }

    return genericCache.get(key);
  },
  delete: (pubKey: string | PublicKey): boolean => {
    let key: string;
    if (typeof pubKey !== 'string') {
      key = pubKey.toBase58();
    } else {
      key = pubKey;
    }

    if (genericCache.get(key)) {
      genericCache.delete(key);
      cache.emitter.raiseCacheDeleted(key);
      return true;
    }
    return false;
  },

  byParser: (parser: AccountParser): string[] => {
    const result: string[] = [];
    for (const id of keyToAccountParser.keys()) {
      if (keyToAccountParser.get(id) === parser) {
        result.push(id);
      }
    }

    return result;
  },
  registerParser: (
    pubkey: PublicKey | string,
    parser: AccountParser,
  ): string | PublicKey => {
    if (pubkey) {
      const address = typeof pubkey === 'string' ? pubkey : pubkey?.toBase58();
      keyToAccountParser.set(address, parser);
    }

    return pubkey;
  },
  addTransaction: (
    signature: string,
    tx: ParsedLocalTransaction | null,
  ): ParsedLocalTransaction => {
    transactionCache.set(signature, tx);
    return tx;
  },
  addBulkTransactions: (
    txs: Array<ParsedLocalTransaction>,
  ): ParsedLocalTransaction[] => {
    for (const tx of txs) {
      transactionCache.set(tx.signature.signature, tx);
    }
    return txs;
  },
  getTransaction: (signature: string): ParsedLocalTransaction => {
    return transactionCache.get(signature);
  },
  getAllTransactions: (): Map<string, ParsedLocalTransaction> => {
    return transactionCache;
  },
  clear: (): void => {
    genericCache.clear();
    transactionCache.clear();
    cache.emitter.raiseCacheCleared();
  },
};

export const useAccountsContext = (): any => {
  return useContext(AccountsContext);
};

function wrapNativeAccount(
  pubkey: PublicKey,
  account?: AccountInfo<Buffer>,
): TokenAccount | undefined {
  if (!account) {
    return undefined;
  }

  return {
    pubkey: pubkey,
    account,
    info: {
      address: pubkey,
      mint: WRAPPED_SOL_MINT,
      owner: pubkey,
      amount: new u64(account.lamports),
      delegate: null,
      delegatedAmount: new u64(0),
      isInitialized: true,
      isFrozen: false,
      isNative: true,
      rentExemptReserve: null,
      closeAuthority: null,
    },
  };
}

const UseNativeAccount = (): {
  nativeAccount: AccountInfo<Buffer>;
} => {
  const connection = useConnection();
  const { wallet, publicKey } = useWallet();

  const [nativeAccount, setNativeAccount] = useState<AccountInfo<Buffer>>();

  const updateCache = useCallback(
    (account) => {
      if (!connection || !publicKey) {
        return;
      }

      const wrapped = wrapNativeAccount(publicKey, account);
      if (wrapped !== undefined) {
        const id = publicKey.toBase58();
        cache.registerParser(id, TokenAccountParser);
        genericCache.set(id, wrapped as TokenAccount);
        cache.emitter.raiseCacheUpdated(id, false, TokenAccountParser);
      }
    },
    [publicKey, connection],
  );

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.getAccountInfo(publicKey).then((acc) => {
      if (acc) {
        updateCache(acc);
        setNativeAccount(acc);
      }
    });
    connection.onAccountChange(publicKey, (acc) => {
      if (acc) {
        updateCache(acc);
        setNativeAccount(acc);
      }
    });
  }, [setNativeAccount, wallet, publicKey, connection, updateCache]);

  return { nativeAccount };
};

const PRECACHED_OWNERS = new Set<string>();
const precacheUserTokenAccounts = async (
  connection: Connection,
  owner?: PublicKey,
): Promise<void> => {
  if (!owner) {
    return;
  }

  // used for filtering account updates over websocket
  PRECACHED_OWNERS.add(owner.toBase58());

  // user accounts are update via ws subscription
  const accounts = await connection.getTokenAccountsByOwner(owner, {
    programId: programIds().token,
  });
  accounts.value.forEach((info) => {
    cache.add(info.pubkey.toBase58(), info.account, TokenAccountParser);
  });
};

//TODO: Describe type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function AccountsProvider({ children = null as any }): JSX.Element {
  const connection = useConnection();
  const { publicKey, wallet, connected } = useWallet();
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
  const [userAccounts, setUserAccounts] = useState<TokenAccount[]>([]);
  const { nativeAccount } = UseNativeAccount();

  const selectUserAccounts = useCallback(() => {
    if (!publicKey) {
      return [];
    }

    const address = publicKey.toBase58();

    return cache
      .byParser(TokenAccountParser)
      .map((id) => cache.get(id))
      .filter((a) => a && a.info.owner.toBase58() === address)
      .map((a) => a as TokenAccount);
  }, [publicKey]);

  useEffect(() => {
    const accounts = selectUserAccounts().filter(
      (a) => a !== undefined,
    ) as TokenAccount[];
    setUserAccounts(accounts);
  }, [nativeAccount, wallet, tokenAccounts, selectUserAccounts]);

  useEffect(() => {
    if (!connection || !publicKey) {
      setTokenAccounts([]);
    } else {
      precacheUserTokenAccounts(connection, publicKey).then(() => {
        setTokenAccounts(selectUserAccounts());
      });

      // This can return different types of accounts: token-account, mint, multisig
      // TODO: web3.js expose ability to filter.
      // this should use only filter syntax to only get accounts that are owned by user
      const tokenSubID = connection.onProgramAccountChange(
        programIds().token,
        (info) => {
          // TODO: fix type in web3.js
          const id = info.accountId as unknown as string;
          // TODO: do we need a better way to identify layout (maybe a enum identifing type?)
          if (info.accountInfo.data.length === AccountLayout.span) {
            const data = deserializeAccount(info.accountInfo.data);

            if (PRECACHED_OWNERS.has(data.owner.toBase58())) {
              cache.add(id, info.accountInfo, TokenAccountParser);
              setTokenAccounts(selectUserAccounts());
            }
          }
        },
        'singleGossip',
      );

      return (): void => {
        connection.removeProgramAccountChangeListener(tokenSubID);
      };
    }
  }, [connection, connected, publicKey, selectUserAccounts]);

  return (
    <AccountsContext.Provider
      value={{
        userAccounts,
        nativeAccount,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

export function useNativeAccount(): {
  account: AccountInfo<Buffer>;
} {
  const context = useContext(AccountsContext);
  return {
    account: context.nativeAccount as AccountInfo<Buffer>,
  };
}

export const getMultipleAccounts = async (
  //TODO: Describe type
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  connection: any,
  keys: string[],
  commitment: string,
): Promise<{
  keys: string[];
  array: AccountInfo<Buffer>[];
}> => {
  const result = await Promise.all(
    chunks(keys, 99).map((chunk) =>
      getMultipleAccountsCore(connection, chunk, commitment),
    ),
  );

  const array = result
    .map(
      (a) =>
        a.array
          .map((acc) => {
            if (!acc) {
              return undefined;
            }

            const { data, ...rest } = acc;
            return {
              ...rest,
              data: Buffer.from(data[0], 'base64'),
            } as AccountInfo<Buffer>;
          })
          .filter((_) => _) as AccountInfo<Buffer>[],
    )
    .flat();
  return { keys, array };
};

const getMultipleAccountsCore = async (
  connection: any,
  keys: string[],
  commitment: string,
): Promise<{
  keys: string[];
  array: AccountInfo<string[]>[];
}> => {
  const args = connection._buildArgs([keys], commitment, 'base64');

  const unsafeRes = await connection._rpcRequest('getMultipleAccounts', args);
  if (unsafeRes.error) {
    throw new Error(
      'failed to get info about account ' + unsafeRes.error.message,
    );
  }

  if (unsafeRes.result.value) {
    const array = unsafeRes.result.value as AccountInfo<string[]>[];
    return { keys, array };
  }

  // TODO: fix
  throw new Error();
};

export function useMint(key?: string | PublicKey): MintInfo {
  const connection = useConnection();
  const [mint, setMint] = useState<MintInfo>();

  const id = typeof key === 'string' ? key : key?.toBase58();

  useEffect(() => {
    if (!id) {
      return;
    }

    cache
      .query(connection, id, MintParser)
      .then((acc) => setMint(acc.info as any))
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err));

    const dispose = cache.emitter.onCache((e) => {
      if (e.id === id) {
        cache
          .query(connection, id, MintParser)
          .then((mint) => setMint(mint.info as any));
      }
    });
    return (): void => {
      dispose();
    };
  }, [connection, id]);

  return mint;
}

export const useAccountByMint = (mint: string): TokenAccount => {
  const { userAccounts } = useUserAccounts();
  const index = userAccounts.findIndex(
    (acc) => acc.info.mint.toBase58() === mint,
  );

  if (index !== -1) {
    return userAccounts[index];
  }

  return;
};

export function useAccount(pubKey?: PublicKey): TokenAccount {
  const connection = useConnection();
  const [account, setAccount] = useState<TokenAccount>();

  const key = pubKey?.toBase58();
  useEffect(() => {
    const query = async (): Promise<void> => {
      try {
        if (!key) {
          return;
        }

        const acc = await cache
          .query(connection, key, TokenAccountParser)
          // eslint-disable-next-line no-console
          .catch((err) => console.error(err));
        if (acc) {
          setAccount(acc);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };

    query();

    const dispose = cache.emitter.onCache((e) => {
      if (e.id === key) {
        query();
      }
    });
    return (): void => {
      dispose();
    };
  }, [connection, key]);

  return account;
}

// TODO: expose in spl package
const deserializeAccount = (data: Buffer): any => {
  const accountInfo = AccountLayout.decode(data);
  accountInfo.mint = new PublicKey(accountInfo.mint);
  accountInfo.owner = new PublicKey(accountInfo.owner);
  accountInfo.amount = u64.fromBuffer(accountInfo.amount);

  if (accountInfo.delegateOption === 0) {
    accountInfo.delegate = null;
    accountInfo.delegatedAmount = new u64(0);
  } else {
    accountInfo.delegate = new PublicKey(accountInfo.delegate);
    accountInfo.delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
  }

  accountInfo.isInitialized = accountInfo.state !== 0;
  accountInfo.isFrozen = accountInfo.state === 2;

  if (accountInfo.isNativeOption === 1) {
    accountInfo.rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
    accountInfo.isNative = true;
  } else {
    accountInfo.rentExemptReserve = null;
    accountInfo.isNative = false;
  }

  if (accountInfo.closeAuthorityOption === 0) {
    accountInfo.closeAuthority = null;
  } else {
    accountInfo.closeAuthority = new PublicKey(accountInfo.closeAuthority);
  }

  return accountInfo;
};

// TODO: expose in spl package
const deserializeMint = (data: Buffer): MintInfo => {
  if (data.length !== MintLayout.span) {
    return;
    // throw new Error("Not a valid Mint");
  }

  const mintInfo = MintLayout.decode(data);

  if (mintInfo.mintAuthorityOption === 0) {
    mintInfo.mintAuthority = null;
  } else {
    mintInfo.mintAuthority = new PublicKey(mintInfo.mintAuthority);
  }

  mintInfo.supply = u64.fromBuffer(mintInfo.supply);
  mintInfo.isInitialized = mintInfo.isInitialized !== 0;

  if (mintInfo.freezeAuthorityOption === 0) {
    mintInfo.freezeAuthority = null;
  } else {
    mintInfo.freezeAuthority = new PublicKey(mintInfo.freezeAuthority);
  }

  return mintInfo as MintInfo;
};
