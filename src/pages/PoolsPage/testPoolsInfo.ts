import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

const tokeInfoTest = {
  address: 'ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj',
  chainId: 101,
  decimals: 8,
  extensions: {
    coingeckoId: 'frakt-token',
    coinmarketcap: 'https://coinmarketcap.com/currencies/frakt-token/',
    twitter: 'https://twitter.com/FraktArt',
    website: 'https://frakt.art',
  },
  logoURI:
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj/logo.png',
  name: 'FRAKT Token',
  symbol: 'FRKT',
  tags: ['utility-token'],
};

const poolConfigTest = {
  authority: new PublicKey('5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1'),
  baseMint: new PublicKey('ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj'),
  baseVault: new PublicKey('EAz41ABjVhXLWFXcVdC6WtYBjnVqBZQw7XxXBd8J8KMp'),
  id: new PublicKey('H3dhkXcC5MRN7VRXNbWVSvogH8mUQPzpn8PYQL7HfBVg'),
  // lpMint: new PublicKey('HYUKXgpjaxMXHttyrFYtv3z2rdhZ1U9QDH8zEc8BooQC'),
  lpMint: new PublicKey('C56Dq4P8kYpzt984PNBgQPb4v7vDdTaMNtucNYz9iSzT'),
  lpVault: new PublicKey('BNRZ1W1QCw9v6LNgor1fU91X49WyPUnTWEUJ6H7HVefj'),
  marketAsks: new PublicKey('9oPEuJtJQTaFWqhkA9omNzKoz8BLEFmGfFyPdVYxkk8B'),
  marketAuthority: new PublicKey(
    '3x6rbV78zDotLTfat9tXpWgCzqKYBJKEzaDEWStcumud',
  ),

  marketBaseVault: new PublicKey(
    'EgZKQ4zMUiNNXFzTJ89eyL4gjfF2yCrH1seQHTnwihAc',
  ),
  marketBids: new PublicKey('F4D6Qe2FcVSLDGByxCQoMeCdaLQF3Z7vuWnrXoEW3xss'),
  marketEventQueue: new PublicKey(
    '6Bb5UtTAu6VBJ71dh8vGji6JBRsajRGKXaxhtRkqwy7R',
  ),
  marketId: new PublicKey('FE5nRChviHFXnUDPRpPwHcPoQSxXwjAB5gdPFJLweEYK'),
  marketProgramId: new PublicKey(
    '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
  ),
  marketQuoteVault: new PublicKey(
    'FCnpLA4Xzo4GKctHwMydTx81NRgbAxsZTreT9zHAEV8d',
  ),
  marketVersion: 3,
  openOrders: new PublicKey('7yHu2fwMQDA7vx5RJMX1TyzDE2cJx6u1v4abTgfEP8rd'),
  programId: new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'),
  quoteMint: new PublicKey('So11111111111111111111111111111111111111112'),
  quoteVault: new PublicKey('6gBKhNH2U1Qrxg73Eo6BMuXLoW2H4DML18AnALSrbrXr'),
  targetOrders: new PublicKey('BXjSVXdMUYM3CpAs97SE5e9YnxC2NLqaT6tzwNiJNi6r'),
  version: 4,
  withdrawQueue: new PublicKey('9Pczi311AjZRXukgUws9QVPYBswXmMETZTM4TFcjqd4s'),
};

export const raydiumPoolInfoTest = {
  baseDecimals: 8,
  baseReserve: new BN('76200904639505'),
  lpDecimals: 8,
  lpSupply: new BN('45357132500696'),
  quoteDecimals: 9,
  quoteReserve: new BN('1031137885833'),
  status: new BN('1'),
};

export const poolsDataTest = [
  {
    poolData: {
      tokenInfo: tokeInfoTest,
      poolConfig: poolConfigTest,
    },
    poolStatsTest: {
      apy: 2,
      fee7d: 2,
      fee24h: 2,
      liquidity: 2,
    },
  },
];

export const poolConfigsTest = [
  {
    authority: new PublicKey('5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1'),
    baseMint: new PublicKey('ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj'),
    baseVault: new PublicKey('EAz41ABjVhXLWFXcVdC6WtYBjnVqBZQw7XxXBd8J8KMp'),
    id: new PublicKey('H3dhkXcC5MRN7VRXNbWVSvogH8mUQPzpn8PYQL7HfBVg'),
    // lpMint: new PublicKey('HYUKXgpjaxMXHttyrFYtv3z2rdhZ1U9QDH8zEc8BooQC'),
    lpMint: new PublicKey('C56Dq4P8kYpzt984PNBgQPb4v7vDdTaMNtucNYz9iSzT'),
    lpVault: new PublicKey('BNRZ1W1QCw9v6LNgor1fU91X49WyPUnTWEUJ6H7HVefj'),
    marketAsks: new PublicKey('9oPEuJtJQTaFWqhkA9omNzKoz8BLEFmGfFyPdVYxkk8B'),
    marketAuthority: new PublicKey(
      '3x6rbV78zDotLTfat9tXpWgCzqKYBJKEzaDEWStcumud',
    ),

    marketBaseVault: new PublicKey(
      'EgZKQ4zMUiNNXFzTJ89eyL4gjfF2yCrH1seQHTnwihAc',
    ),
    marketBids: new PublicKey('F4D6Qe2FcVSLDGByxCQoMeCdaLQF3Z7vuWnrXoEW3xss'),
    marketEventQueue: new PublicKey(
      '6Bb5UtTAu6VBJ71dh8vGji6JBRsajRGKXaxhtRkqwy7R',
    ),
    marketId: new PublicKey('FE5nRChviHFXnUDPRpPwHcPoQSxXwjAB5gdPFJLweEYK'),
    marketProgramId: new PublicKey(
      '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    ),
    marketQuoteVault: new PublicKey(
      'FCnpLA4Xzo4GKctHwMydTx81NRgbAxsZTreT9zHAEV8d',
    ),
    marketVersion: 3,
    openOrders: new PublicKey('7yHu2fwMQDA7vx5RJMX1TyzDE2cJx6u1v4abTgfEP8rd'),
    programId: new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'),
    quoteMint: new PublicKey('So11111111111111111111111111111111111111112'),
    quoteVault: new PublicKey('6gBKhNH2U1Qrxg73Eo6BMuXLoW2H4DML18AnALSrbrXr'),
    targetOrders: new PublicKey('BXjSVXdMUYM3CpAs97SE5e9YnxC2NLqaT6tzwNiJNi6r'),
    version: 4,
    withdrawQueue: new PublicKey(
      '9Pczi311AjZRXukgUws9QVPYBswXmMETZTM4TFcjqd4s',
    ),
  },
  {
    authority: new PublicKey('5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1'),
    baseMint: new PublicKey('ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj'),
    baseVault: new PublicKey('EAz41ABjVhXLWFXcVdC6WtYBjnVqBZQw7XxXBd8J8KMp'),
    id: new PublicKey('H3dhkXcC5MRN7VRXNbWVSvogH8mUQPzpn8PYQL7HfBVg'),
    // lpMint: new PublicKey('HYUKXgpjaxMXHttyrFYtv3z2rdhZ1U9QDH8zEc8BooQC'),
    lpMint: new PublicKey('ypk2gSMYS1T1nKndKvChnRbjVRzDXjkXu5r2cJNxTog'),
    lpVault: new PublicKey('BNRZ1W1QCw9v6LNgor1fU91X49WyPUnTWEUJ6H7HVefj'),
    marketAsks: new PublicKey('9oPEuJtJQTaFWqhkA9omNzKoz8BLEFmGfFyPdVYxkk8B'),
    marketAuthority: new PublicKey(
      '3x6rbV78zDotLTfat9tXpWgCzqKYBJKEzaDEWStcumud',
    ),

    marketBaseVault: new PublicKey(
      'EgZKQ4zMUiNNXFzTJ89eyL4gjfF2yCrH1seQHTnwihAc',
    ),
    marketBids: new PublicKey('F4D6Qe2FcVSLDGByxCQoMeCdaLQF3Z7vuWnrXoEW3xss'),
    marketEventQueue: new PublicKey(
      '6Bb5UtTAu6VBJ71dh8vGji6JBRsajRGKXaxhtRkqwy7R',
    ),
    marketId: new PublicKey('FE5nRChviHFXnUDPRpPwHcPoQSxXwjAB5gdPFJLweEYK'),
    marketProgramId: new PublicKey(
      '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
    ),
    marketQuoteVault: new PublicKey(
      'FCnpLA4Xzo4GKctHwMydTx81NRgbAxsZTreT9zHAEV8d',
    ),
    marketVersion: 3,
    openOrders: new PublicKey('7yHu2fwMQDA7vx5RJMX1TyzDE2cJx6u1v4abTgfEP8rd'),
    programId: new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'),
    quoteMint: new PublicKey('So11111111111111111111111111111111111111112'),
    quoteVault: new PublicKey('6gBKhNH2U1Qrxg73Eo6BMuXLoW2H4DML18AnALSrbrXr'),
    targetOrders: new PublicKey('BXjSVXdMUYM3CpAs97SE5e9YnxC2NLqaT6tzwNiJNi6r'),
    version: 4,
    withdrawQueue: new PublicKey(
      '9Pczi311AjZRXukgUws9QVPYBswXmMETZTM4TFcjqd4s',
    ),
  },
];
