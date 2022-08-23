import { SOLEND_RESERVES } from './solendMarkets';
import { TOKENS } from './tokens';

export const TOKEN_BTC = '3UNBZ6o52WTWwjac2kPUb4FyodhU1vFkRJheu1Sh2TvU';
export const TOKEN_ETH = 'Cu84KB3tDL6SbFgToHMLYVDJJXdJjenNzSKikeAvzmkA';
export const TOKEN_SOL = 'So11111111111111111111111111111111111111112';
export const ORACLE_USDC = 'BjUgj6YCnFBZ49wF54ddBVA9qu8TeqkFtkbqmZcee8uW';
export const ORACLE_BTC = '8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee';
export const ORACLE_ETH = 'HNStfhaLnqwF2ZtJUizaA9uHDAVB976r2AgTUx9LrdEo';
export const ORACLE_SOL = 'GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR';
export const SABER_USDC = '2tWC4JAdL4AxEFJySziYJfsAnW2MHKRo98vbAPiRDSk8';
export const SABER_USDT = 'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS';
export const SABER_USDC_USDT_LP = 'YakofBo4X3zMxa823THQJwZ8QeoU8pxPdFdxJs7JW57';
export const ORACLE_SABER_USDC = 'BjUgj6YCnFBZ49wF54ddBVA9qu8TeqkFtkbqmZcee8uW';
export const ORACLE_SABER_USDT = 'ETAaeeuQBwsh9mC2gCov9WdhJENZuffRMXY2HgjCcSL9';
export const SABER_USDC_USDT_LP_RESERVE_1 =
  '6aFutFMWR7PbWdBQhdfrcKrAor9WYa2twtSinTMb9tXv';
export const SABER_USDC_USDT_LP_RESERVE_2 =
  'HXbhpnLTxSDDkTg6deDpsXzJRBf8j7T6Dc3GidwrLWeo';

export const TOKEN_INFOS = [
  {
    symbol: 'USDC',
    mintAddress: TOKENS.USDC.mintAddress,
    tokenType: 0,
    decimals: TOKENS.USDC.decimals,
    account_1: ORACLE_USDC, // ORACLE_ACC
    account_2: '',
    account_3: '',
  },
  {
    symbol: 'BTC',
    mintAddress: TOKENS.BTC.mintAddress,
    tokenType: 0,
    decimals: TOKENS.BTC.decimals,
    account_1: ORACLE_BTC, // ORACLE_ACC
    account_2: '', //
    account_3: '', //
  },
  {
    symbol: 'ETH',
    mintAddress: TOKENS.ETH.mintAddress,
    tokenType: 0,
    decimals: TOKENS.ETH.decimals,
    account_1: ORACLE_ETH, // ORACLE_ACC
    account_2: '', //
    account_3: '', //
  },
  {
    symbol: 'WSOL',
    mintAddress: TOKENS.WSOL.mintAddress,
    tokenType: 0,
    decimals: TOKENS.WSOL.decimals,
    account_1: ORACLE_SOL, // ORACLE_ACC
    account_2: '', //
    account_3: '', //
  },
  {
    symbol: 'SABER_USDC',
    mintAddress: SABER_USDC,
    tokenType: 0,
    decimals: TOKENS.USDC.decimals,
    account_1: ORACLE_SABER_USDC, // ORACLE_ACC
    account_2: '', //
    account_3: '', //
  },
  {
    symbol: 'SABER_USDT',
    mintAddress: SABER_USDC,
    tokenType: 0,
    decimals: TOKENS.USDC.decimals,
    account_1: ORACLE_SABER_USDT, // ORACLE_ACC
    account_2: '', //
    account_3: '', //
  },
  {
    symbol: 'SABER_USDC_USDT_LP',
    mintAddress: SABER_USDC_USDT_LP,
    tokenType: 1,
    decimals: TOKENS.USDC.decimals,
    account_1: SABER_USDC_USDT_LP_RESERVE_1, // RESERVES_A
    account_2: SABER_USDC_USDT_LP_RESERVE_2, // RESERVES_B
    account_3: '', // FEE_ACC
  },
  {
    symbol: 'SOLEND_USDC',
    mintAddress: SOLEND_RESERVES.USDC.collateralMintAddress,
    tokenType: 2,
    decimals: TOKENS.USDC.decimals,
    account_1: SOLEND_RESERVES.USDC.address, // RESERVES_A
    account_2: TOKENS.USDC.mintAddress, // UNDERLYING_TOKEN
    account_3: '',
  },
];

export const SABER_LPS = TOKEN_INFOS.filter((f) => f.tokenType === 1);
