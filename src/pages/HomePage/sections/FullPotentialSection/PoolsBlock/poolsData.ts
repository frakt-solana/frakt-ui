import {
  CommunityPoolState,
  LotteryTicketState,
  NftPoolData,
  PoolWhitelistType,
  SafetyDepositBoxState,
} from '../../../../../utils/cacher/nftPools';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export const POOLS_DATA: NftPoolData[] = [
  {
    publicKey: new PublicKey('DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144'),
    authority: new PublicKey('DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144'),
    createdAt: new BN(1),
    fractionMint: new PublicKey('DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144'),
    fractionsSupply: new BN(1),
    state: CommunityPoolState.ACTIVE,
    tokenProgram: new PublicKey('DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144'),
    tokenTypeCount: new BN(1),
    lotteryTickets: [
      {
        publicKey: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144',
        ),
        communityPool: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144',
        ),
        lotteryTicketState: LotteryTicketState.REVEALED,
        ticketHolder: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144',
        ),
        winningSafetyBox: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144',
        ),
      },
    ],
    poolWhitelist: [
      {
        publicKey: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144',
        ),
        communityPool: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144',
        ),
        whitelistType: PoolWhitelistType.SINGLE_NFT_WHITELIST,
        whitelistedAddress: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144',
        ),
      },
    ],
    safetyBoxes: [
      {
        nftAttributes: [],
        nftCollectionName: 'string',
        nftDescription: 'string',
        nftImage:
          'https://arweave.net/dMhiKMZcgjRmGqtxuV_WIVehH9BFGCzzSg_kbrzX5BE',
        nftIsVerified: true,
        nftName: 'string',
        publicKey: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144',
        ),
        communityPool: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144',
        ),
        nftMint: new PublicKey('DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144'),
        safetyBoxState: SafetyDepositBoxState.LOCKED,
        storeNftTokenAccount: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRKvRBE9n8TN4RKvRBE9n8TN144',
        ),
      },
    ],
  },
  {
    publicKey: new PublicKey('DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144'),
    authority: new PublicKey('DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144'),
    createdAt: new BN(1),
    fractionMint: new PublicKey('DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144'),
    fractionsSupply: new BN(1),
    state: CommunityPoolState.ACTIVE,
    tokenProgram: new PublicKey('DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144'),
    tokenTypeCount: new BN(1),
    lotteryTickets: [
      {
        publicKey: new PublicKey(
          'DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144',
        ),
        communityPool: new PublicKey(
          'DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144',
        ),
        lotteryTicketState: LotteryTicketState.REVEALED,
        ticketHolder: new PublicKey(
          'DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144',
        ),
        winningSafetyBox: new PublicKey(
          'DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144',
        ),
      },
    ],
    poolWhitelist: [
      {
        publicKey: new PublicKey(
          'DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144',
        ),
        communityPool: new PublicKey(
          'DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144',
        ),
        whitelistType: PoolWhitelistType.SINGLE_NFT_WHITELIST,
        whitelistedAddress: new PublicKey(
          'DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144',
        ),
      },
    ],
    safetyBoxes: [
      {
        nftAttributes: [],
        nftCollectionName: 'string',
        nftDescription: 'string',
        nftImage:
          'https://www.arweave.net/M5iY4J5U3OG0VtUol3qb1swUneGt3uRgBPdEhs-0Bn4?ext=png',
        nftIsVerified: true,
        nftName: 'string',
        publicKey: new PublicKey(
          'DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144',
        ),
        communityPool: new PublicKey(
          'DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144',
        ),
        nftMint: new PublicKey('DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144'),
        safetyBoxState: SafetyDepositBoxState.LOCKED,
        storeNftTokenAccount: new PublicKey(
          'DLRCcdmBJvoBE9n8TN4RR6nHTpKRKvRKvRBE9n8TN144',
        ),
      },
    ],
  },
  {
    publicKey: new PublicKey('DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144'),
    authority: new PublicKey('DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144'),
    createdAt: new BN(1),
    fractionMint: new PublicKey('DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144'),
    fractionsSupply: new BN(1),
    state: CommunityPoolState.ACTIVE,
    tokenProgram: new PublicKey('DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144'),
    tokenTypeCount: new BN(1),
    lotteryTickets: [
      {
        publicKey: new PublicKey(
          'DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144',
        ),
        communityPool: new PublicKey(
          'DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144',
        ),
        lotteryTicketState: LotteryTicketState.REVEALED,
        ticketHolder: new PublicKey(
          'DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144',
        ),
        winningSafetyBox: new PublicKey(
          'DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144',
        ),
      },
    ],
    poolWhitelist: [
      {
        publicKey: new PublicKey(
          'DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144',
        ),
        communityPool: new PublicKey(
          'DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144',
        ),
        whitelistType: PoolWhitelistType.SINGLE_NFT_WHITELIST,
        whitelistedAddress: new PublicKey(
          'DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144',
        ),
      },
    ],
    safetyBoxes: [
      {
        nftAttributes: [],
        nftCollectionName: 'string',
        nftDescription: 'string',
        nftImage:
          'https://www.arweave.net/xzXz-ASGKfjM9MSSqSvJKV-n9smOZS04kXIrjw2nsxs?ext=png',
        nftIsVerified: true,
        nftName: 'string',
        publicKey: new PublicKey(
          'DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144',
        ),
        communityPool: new PublicKey(
          'DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144',
        ),
        nftMint: new PublicKey('DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144'),
        safetyBoxState: SafetyDepositBoxState.LOCKED,
        storeNftTokenAccount: new PublicKey(
          'DLRCcdmBJvoR6nE9n8THTpKRKvRBE9n8TN4RKvRBN144',
        ),
      },
    ],
  },
  {
    publicKey: new PublicKey('DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144'),
    authority: new PublicKey('DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144'),
    createdAt: new BN(1),
    fractionMint: new PublicKey('DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144'),
    fractionsSupply: new BN(1),
    state: CommunityPoolState.ACTIVE,
    tokenProgram: new PublicKey('DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144'),
    tokenTypeCount: new BN(1),
    lotteryTickets: [
      {
        publicKey: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144',
        ),
        communityPool: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144',
        ),
        lotteryTicketState: LotteryTicketState.REVEALED,
        ticketHolder: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144',
        ),
        winningSafetyBox: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144',
        ),
      },
    ],
    poolWhitelist: [
      {
        publicKey: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144',
        ),
        communityPool: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144',
        ),
        whitelistType: PoolWhitelistType.SINGLE_NFT_WHITELIST,
        whitelistedAddress: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144',
        ),
      },
    ],
    safetyBoxes: [
      {
        nftAttributes: [],
        nftCollectionName: 'string',
        nftDescription: 'string',
        nftImage:
          'https://arweave.net/YXirXLulU3FiaOdfAZyY3Tjd4V6kY1Wq9DdQbQST-Ck',
        nftIsVerified: true,
        nftName: 'string',
        publicKey: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144',
        ),
        communityPool: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144',
        ),
        nftMint: new PublicKey('DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144'),
        safetyBoxState: SafetyDepositBoxState.LOCKED,
        storeNftTokenAccount: new PublicKey(
          'DLRCcdmBJvoR6nHTpKRK9n8TN4RKvRBE9vRBEn8TN144',
        ),
      },
    ],
  },
];
