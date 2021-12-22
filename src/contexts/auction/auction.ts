import {
  bidOnAuction as bidOnAuctionTransaction,
  startFraktionalizerAuction as startFraktionalizerAuctionTransaction,
} from 'fraktionalizer-client-library';
import fraktionConfig from '../fraktion/config';
import { Connection, PublicKey } from '@solana/web3.js';
import { VaultData } from '../fraktion';
import {
  useConnection,
  useWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import { notify } from '../../utils';

const startFraktionalizerAuction =
  (wallet: WalletContextState, connection: Connection) =>
  async (vaultInfo: VaultData, price: number) => {
    const perShare = price / vaultInfo.fractionsSupply.toNumber();
    try {
      await startFraktionalizerAuctionTransaction({
        connection,
        startingAuctionBidPerShare: perShare,
        startingAuctionBidCap: price,
        userPubkey: wallet.publicKey.toString(),
        adminPubkey: fraktionConfig.ADMIN_PUBKEY,
        vaultAuthority: new PublicKey(vaultInfo.authority),
        vault: vaultInfo.vaultPubkey,
        auction: vaultInfo.auction.auction.auctionPubkey,
        fractionMint: vaultInfo.fractionMint,
        fractionTreasury: vaultInfo.fractionTreasury,
        redeemTreasury: vaultInfo.redeemTreasury,
        priceMint: vaultInfo.priceMint,
        vaultProgramId: fraktionConfig.PROGRAM_PUBKEY,
        sendTxn: async (txn, signers): Promise<void> => {
          const { blockhash } = await connection.getRecentBlockhash();
          txn.recentBlockhash = blockhash;
          txn.feePayer = wallet.publicKey;
          txn.sign(...signers);
          const signed = await wallet.signTransaction(txn);
          const txid = await connection.sendRawTransaction(signed.serialize());
          return void connection.confirmTransaction(txid);
        },
        isAuctionInitialized: true,
      });
      notify({
        message: 'Auction started successfully',
        type: 'success',
      });
      return true;
    } catch (error) {
      notify({
        message: 'Transaction failed',
        type: 'error',
      });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

const bidOnAuction =
  (wallet: WalletContextState, connection: Connection) =>
  async (vaultInfo: VaultData, price: number, winningBidPubKey: string) => {
    try {
      const perShare = price / vaultInfo.lockedPricePerShare.toNumber();
      await bidOnAuctionTransaction({
        connection,
        winning_bid: winningBidPubKey,
        bidPerShare: perShare,
        bidCap: price,
        adminPubkey: fraktionConfig.ADMIN_PUBKEY,
        userPubkey: wallet.publicKey,
        vault: vaultInfo.vaultPubkey,
        auction: vaultInfo.auction.auction.auctionPubkey,
        fractionMint: vaultInfo.fractionMint,
        fractionTreasury: vaultInfo.fractionTreasury,
        redeemTreasury: vaultInfo.redeemTreasury,
        priceMint: vaultInfo.priceMint,
        vaultProgramId: fraktionConfig.PROGRAM_PUBKEY,
        sendTxn: async (txn, signers): Promise<void> => {
          const { blockhash } = await connection.getRecentBlockhash();
          txn.recentBlockhash = blockhash;
          txn.feePayer = wallet.publicKey;
          txn.sign(...signers);
          const signed = await wallet.signTransaction(txn);
          const txid = await connection.sendRawTransaction(signed.serialize());
          return void connection.confirmTransaction(txid);
        },
      });
      notify({
        message: 'Bit placed successfully',
        type: 'success',
      });
      return true;
    } catch (error) {
      notify({
        message: 'Transaction failed',
        type: 'error',
      });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

export const useAuction = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  return {
    startFraktionalizerAuction: startFraktionalizerAuction(wallet, connection),
    bidOnAuction: bidOnAuction(wallet, connection),
  };
};
