import { useFraktion } from './../fraktion/fraktion.hooks';
import {
  bidOnAuction as bidOnAuctionTransaction,
  startFraktionalizerAuction as startFraktionalizerAuctionTransaction,
  refundBid as refundBidTransaction,
  redeemRewardsFromAuctionShares as redeemRewardsFromAuctionSharesTransaction,
  unlockBacketAfterBuyoutAuction as unlockVaultTransaction,
  withdrawNFTFromCombinedBacket as redeemNftTransaction,
} from 'fraktionalizer-client-library';
import fraktionConfig from '../fraktion/config';
import { Connection, PublicKey } from '@solana/web3.js';
import { VaultData, VaultState } from '../fraktion';
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
        auction: vaultInfo.auction?.auction?.auctionPubkey || null,
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

const unlockVault = async (
  vaultInfo: VaultData,
  wallet: WalletContextState,
  connection: Connection,
) => {
  await unlockVaultTransaction({
    auction: vaultInfo.auction.auction.auctionPubkey,
    winning_bid: vaultInfo.auction.auction.currentWinningBidPubkey,
    userPubkey: wallet.publicKey.toBase58(),
    adminPubkey: fraktionConfig.ADMIN_PUBKEY,
    vault: vaultInfo.vaultPubkey,
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
    message: 'Vault unlocked successfully',
    type: 'success',
  });
};

const redeemNft = async (
  vaultInfo: VaultData,
  safetyBoxOrder: number,
  wallet: WalletContextState,
  connection: Connection,
) => {
  const { vaultPubkey, tokenTypeCount, safetyBoxes, fractionMint } = vaultInfo;

  if (tokenTypeCount < 1 || safetyBoxOrder < 0) {
    throw new Error('No NFTs to redeem');
  }

  const safetyBoxToRedeem = safetyBoxes.find(
    ({ order }) => order === safetyBoxOrder,
  );

  await redeemNftTransaction(
    connection,
    wallet.publicKey.toBase58(),
    vaultPubkey,
    [safetyBoxToRedeem.safetyBoxPubkey],
    [safetyBoxToRedeem.nftMint],
    [safetyBoxToRedeem.store],
    fractionMint,
    fraktionConfig.PROGRAM_PUBKEY,
    async (txn): Promise<void> => {
      const { blockhash } = await connection.getRecentBlockhash();
      txn.recentBlockhash = blockhash;
      txn.feePayer = wallet.publicKey;
      const signed = await wallet.signTransaction(txn);
      const txid = await connection.sendRawTransaction(signed.serialize());
      return void connection.confirmTransaction(txid);
    },
  );
  notify({
    message: 'NFT redeemed successfully',
    type: 'success',
  });
};

const unlockVaultAndRedeemNfts =
  (
    patchVault: (vaultInfo: VaultData) => void,
    wallet: WalletContextState,
    connection: Connection,
  ) =>
  async (vaultInfo: VaultData) => {
    try {
      const isVaultLocked =
        vaultInfo.realState !== VaultState.AuctionFinished &&
        vaultInfo.realState !== VaultState.Inactive;

      const isVaultInactive = vaultInfo.realState === VaultState.Inactive;

      //? Unlock vault if it's locked
      if (isVaultLocked) {
        await unlockVault(vaultInfo, wallet, connection);
        patchVault({
          ...vaultInfo,
          realState: VaultState.AuctionFinished,
          state: VaultState.AuctionFinished,
        });
      }

      for (
        let safetyBoxOrder = vaultInfo.tokenTypeCount - 1;
        safetyBoxOrder > -1;
        --safetyBoxOrder
      ) {
        await redeemNft(vaultInfo, safetyBoxOrder, wallet, connection);

        //? Need to set state every time because function fired and vaultData is contant in it's closure
        //? Don't change state if vault was inactive
        patchVault({
          ...vaultInfo,
          tokenTypeCount: safetyBoxOrder,
          realState: isVaultInactive
            ? vaultInfo.realState
            : VaultState.AuctionFinished,
          state: isVaultInactive
            ? vaultInfo.realState
            : VaultState.AuctionFinished,
        });
      }
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
  const { patchVault } = useFraktion();
  return {
    startFraktionalizerAuction: startFraktionalizerAuction(wallet, connection),
    bidOnAuction: bidOnAuction(wallet, connection),
    refundBid: refundBid(wallet, connection),
    redeemRewardsFromAuctionShares: redeemRewardsFromAuctionShares(
      wallet,
      connection,
    ),
    unlockVaultAndRedeemNfts: unlockVaultAndRedeemNfts(
      patchVault,
      wallet,
      connection,
    ),
  };
};
