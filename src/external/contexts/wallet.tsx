import { PublicKey, Transaction } from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';
import EventEmitter from 'eventemitter3';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { notify } from '../utils/notifications';
import { useConnectionConfig } from './connection';
import { useLocalStorageState } from '../utils/utils';
import { SolongWalletAdapter } from '../wallet-adapters/solong';
import { PhantomWalletAdapter } from '../wallet-adapters/phantom';

const ASSETS_URL =
  'https://raw.githubusercontent.com/solana-labs/oyster/main/assets/wallets/';
export const WALLET_PROVIDERS = [
  {
    name: 'Phantom',
    url: 'https://phantom.app/',
    icon: `https://raydium.io/_nuxt/img/phantom.d9e3c61.png`,
    adapter: PhantomWalletAdapter,
  },
  {
    name: 'Solflare',
    url: 'https://solflare.com/access-wallet',
    icon: `${ASSETS_URL}solflare.svg`,
  },
  {
    name: 'Sollet',
    url: 'https://www.sollet.io',
    icon: `${ASSETS_URL}sollet.svg`,
  },
];
// {
//   name: 'MathWallet',
//   url: 'https://mathwallet.org',
//   icon: `${ASSETS_URL}mathwallet.svg`,
// },
// {
//   name: 'Ledger',
//   url: 'https://www.ledger.com',
//   icon: `${ASSETS_URL}ledger.svg`,
//   adapter: LedgerWalletAdapter,
// },

export interface WalletAdapter extends EventEmitter {
  publicKey: PublicKey | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  connect: () => any;
  disconnect: () => any;
}

export const WalletContext = React.createContext<{
  wallet: WalletAdapter | undefined;
  connected: boolean;
  select: () => void;
  provider: typeof WALLET_PROVIDERS[number] | undefined;
  isModalVisible: boolean;
  closeModal: () => void;
  providerUrl: any;
  setProviderUrl: any;
  setAutoConnect: any;
}>({
  wallet: undefined,
  connected: false,
  select() {},
  provider: undefined,
  isModalVisible: false,
  closeModal() {},
  providerUrl: null,
  setProviderUrl() {},
  setAutoConnect: null,
});

//TODO: Describe type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function WalletProvider({ children = null as any }): JSX.Element {
  const { endpoint } = useConnectionConfig();

  const [autoConnect, setAutoConnect] = useState(false);
  const [providerUrl, setProviderUrl] = useLocalStorageState('walletProvider');

  const provider = useMemo(
    () => WALLET_PROVIDERS.find(({ url }) => url === providerUrl),
    [providerUrl],
  );

  const wallet = useMemo(
    function () {
      if (provider) {
        return new (provider.adapter || Wallet)(
          providerUrl,
          endpoint,
        ) as WalletAdapter;
      }
    },
    [provider, providerUrl, endpoint],
  );

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (wallet) {
      wallet.on('connect', () => {
        if (wallet.publicKey) {
          setConnected(true);
          const walletPublicKey = wallet.publicKey.toBase58();
          const keyToDisplay =
            walletPublicKey.length > 20
              ? `${walletPublicKey.substring(
                  0,
                  7,
                )}.....${walletPublicKey.substring(
                  walletPublicKey.length - 7,
                  walletPublicKey.length,
                )}`
              : walletPublicKey;

          notify({
            message: 'Wallet update',
            description: 'Connected to wallet ' + keyToDisplay,
          });
        }
      });

      wallet.on('disconnect', () => {
        setConnected(false);
        notify({
          message: 'Wallet update',
          description: 'Disconnected from wallet',
        });
      });
    }

    return (): void => {
      setConnected(false);
      if (wallet) {
        wallet.disconnect();
      }
    };
  }, [wallet]);

  useEffect(() => {
    if (wallet && autoConnect) {
      wallet.connect();
      setAutoConnect(false);
    }

    return (): void => {};
  }, [wallet, autoConnect]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const select = useCallback(() => setIsModalVisible(true), []);
  const close = useCallback(() => setIsModalVisible(false), []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        select,
        provider,
        isModalVisible,
        closeModal: close,
        providerUrl,
        setProviderUrl,
        setAutoConnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): {
  wallet: WalletAdapter;
  connected: boolean;
  provider:
    | {
        name: string;
        url: string;
        icon: string;
        adapter?: undefined;
      }
    | {
        name: string;
        url: string;
        icon: string;
        adapter: typeof SolongWalletAdapter;
      }
    | {
        name: string;
        url: string;
        icon: string;
        adapter: typeof PhantomWalletAdapter;
      };
  isModalVisible: boolean;
  closeModal: () => void;
  setProviderUrl: any;
  setAutoConnect: any;
  select: () => void;
  publicKey: PublicKey;
  connect: () => void;
  disconnect: () => void;
} {
  const {
    wallet,
    connected,
    provider,
    select,
    isModalVisible,
    closeModal,
    setAutoConnect,
    setProviderUrl,
  } = useContext(WalletContext);
  return {
    wallet,
    connected,
    provider,
    isModalVisible,
    closeModal,
    setProviderUrl,
    setAutoConnect,
    select,
    publicKey: wallet?.publicKey,
    connect(): void {
      wallet ? wallet.connect() : select();
    },
    disconnect(): void {
      wallet?.disconnect();
    },
  };
}
