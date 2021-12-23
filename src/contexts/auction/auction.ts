import {
  bidOnAuction as bidOnAuctionTransaction,
  startFraktionalizerAuction as startFraktionalizerAuctionTransaction,
  refundBid as refundBidTransaction,
  redeemRewardsFromAuctionShares as redeemRewardsFromAuctionSharesTransaction,
  closeAuctionFraktionalizer as closeAuctionFraktionalizerTransaction,
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
  async (
    vaultInfo: VaultData,
    price: number,
    isAuctionInitialized: boolean,
  ) => {
    const supply = vaultInfo.fractionsSupply.toNumber();
    const perShare = Math.round(price / supply);
    const startingAuctionBidCap = perShare * supply;

    try {
      await startFraktionalizerAuctionTransaction({
        connection,
        startingAuctionBidPerShare: perShare,
        startingAuctionBidCap: startingAuctionBidCap,
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
        isAuctionInitialized,
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
  async (vaultInfo: VaultData, price: number) => {
    try {
      const supply = vaultInfo.fractionsSupply.toNumber();
      const perShare = Math.ceil((price * 1e9) / supply);
      const bidCap = perShare * supply;

      await bidOnAuctionTransaction({
        connection,
        winning_bid: vaultInfo.auction.auction.currentWinningBidPubkey,
        bidPerShare: perShare,
        bidCap,
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
        message: 'Bid placed successfully',
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
      return false;
    }
  };

const refundBid =
  (wallet: WalletContextState, connection: Connection) =>
  async (vaultInfo: VaultData, bid: string) => {
    try {
      await refundBidTransaction({
        connection,
        bid,
        userPubkey: wallet.publicKey.toString(),
        vault: vaultInfo.vaultPubkey,
        auction: vaultInfo.auction.auction.auctionPubkey,
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
        message: 'Bid refunded successfully',
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
      return false;
    }
  };

const redeemRewardsFromAuctionShares =
  (wallet: WalletContextState, connection: Connection) =>
  async (vaultInfo: VaultData) => {
    try {
      await redeemRewardsFromAuctionSharesTransaction({
        connection,
        userPubkey: wallet.publicKey.toString(),
        vault: vaultInfo.vaultPubkey,
        winning_bid: vaultInfo.auction.auction.currentWinningBidPubkey,
        auction: vaultInfo.auction.auction.auctionPubkey,
        redeemTreasury: vaultInfo.redeemTreasury,
        fractionMint: vaultInfo.fractionMint,
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
        message: 'Redeemed SOL successfully',
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

const closeAuctionFraktionalizer =
  (wallet: WalletContextState, connection: Connection) =>
  async (vaultInfo: VaultData) => {
    try {
      await closeAuctionFraktionalizerTransaction({
        connection,
        userPubkey: wallet.publicKey,
        adminPubkey: fraktionConfig.ADMIN_PUBKEY,
        vault: vaultInfo.vaultPubkey,
        winning_bid: vaultInfo.auction.auction.currentWinningBidPubkey,
        nftMintPubkey: vaultInfo.safetyBoxes[0].nftMint,
        storePubkey: vaultInfo.safetyBoxes[0].store,
        safetyDepositBoxPubkey: vaultInfo.safetyBoxes[0].safetyBoxPubkey,
        auction: vaultInfo.auction.auction.auctionPubkey,
        fractionMint: vaultInfo.fractionMint,
        vaultProgramId: fraktionConfig.PROGRAM_PUBKEY,
        sendTxn: async (txn): Promise<void> => {
          const { blockhash } = await connection.getRecentBlockhash();
          txn.recentBlockhash = blockhash;
          txn.feePayer = wallet.publicKey;
          const signed = await wallet.signTransaction(txn);
          const txid = await connection.sendRawTransaction(signed.serialize());
          return void connection.confirmTransaction(txid);
        },
      });
      notify({
        message: 'NFT redeemed successfully',
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

//eslint-disable-next-line
export const useAuction = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  return {
    startFraktionalizerAuction: startFraktionalizerAuction(wallet, connection),
    bidOnAuction: bidOnAuction(wallet, connection),
    refundBid: refundBid(wallet, connection),
    redeemRewardsFromAuctionShares: redeemRewardsFromAuctionShares(
      wallet,
      connection,
    ),
    closeAuctionFraktionalizer: closeAuctionFraktionalizer(wallet, connection),
  };
};
