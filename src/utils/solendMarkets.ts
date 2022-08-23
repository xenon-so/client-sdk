import { PublicKey } from '@solana/web3.js';
import { isMainnet } from '../isMainnet';
import { mainnetTokens } from './tokens';

export interface SOLEND_RESERVE {
  mint: string;
  address: string;
  collateralMintAddress: string;
  collateralSupplyAddress: string;
  liquidityAddress: string;
  liquidityFeeReceiverAddress: string;
}
export interface SOLEND_RESERVES {
  [key: string]: SOLEND_RESERVE;
}

export const SOLEND_MARKET = new PublicKey(
  isMainnet
    ? '4UpD2fh7xH3VP9QQaXtsS1YY3bxzWhtfpks7FatyKvdY'
    : '6fafHRaToKecERFCx8mAwCBnCKYHktw3nATQp8a8J1Mx'
);
export const SOLEND_DERIEVED_MARKET = new PublicKey(
  isMainnet
    ? 'DdZR6zRFiUt4S5mg7AV1uKB2z1f1WzcNYCaTEEWPAuby'
    : 'EgzabDYqP5SG6U2ZPW2H3hnuWy2cky2Gqet2pyp7GDtZ'
);

const devnet_reserves: SOLEND_RESERVES = {
  USDC: {
    mint: '8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN',
    address: '5QJ7ZTcSjUabbQoakVmzfAqZFYc9vv62rta6VBtZJibN',
    collateralMintAddress: '3U4H4N47cG75NbmdTAZgrktpRPR7vYPbih9tqH4qGPqW',
    collateralSupplyAddress: '8ke4e75cXjss36J6B6d31GB6EH7rPmcJU7TNzYETDZvr',
    liquidityAddress: 'FFonSo4aE8c5Zs8iHMFafj3NRAhHmCpeBogGLU5xMYur',
    liquidityFeeReceiverAddress: 'BKTTY5gibk5UQRMvPHwva7Y1qU5JySNQQddpTSPALunS',
  },
  BTC: {
    mint: '3UNBZ6o52WTWwjac2kPUb4FyodhU1vFkRJheu1Sh2TvU',
    address: '3SQzwB4cpToBBmAuX2BRHWhcb7FvLnf6y5hMkcbvDm14',
    collateralMintAddress: 'GVje4h3Sy8mFZgEAdpacZLq7jRLczkU9HcuAZSr6f9YM',
    collateralSupplyAddress: '8ke4e75cXjss36J6B6d31GB6EH7rPmcJU7TNzYETDZvr',
    liquidityAddress: '7ZgqrvQ66xjqTptxQWwrjA9hADXn5CtCXzMxPxsHJpec',
    liquidityFeeReceiverAddress: 'BKTTY5gibk5UQRMvPHwva7Y1qU5JySNQQddpTSPALunS',
  },
  SOL: {
    mint: 'SOL',
    address: '8PbodeaosQP19SjYFx855UMqWxH2HynZLdBXmsrbac36',
    collateralMintAddress: '5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV',
    collateralSupplyAddress: 'B1ATuYXNkacjjJS78MAmqu8Lu8PvEPt51u4oBasH1m1g',
    liquidityAddress: '8UviNr47S8eL6J3WfDxMRa3hvLta1VDJwNWqsDgtN3Cv',
    liquidityFeeReceiverAddress: '5wo1tFpi4HaVKnemqaXeQnBEpezrJXcXvuztYaPhvgC7',
  },
};

export const mainnet_reserves: SOLEND_RESERVES = {
  USDT: {
    mint: mainnetTokens.USDT.mintAddress,
    address: '8K9WC8xoh2rtQNY7iEGXtPvfbDCi563SdWhCAhuMP2xE',
    collateralMintAddress: 'BTsbZDV7aCMRJ3VNy9ygV4Q2UeEo9GpR8D6VvmMZzNr8',
    collateralSupplyAddress: 'CXDxj6cepVv9nWh4QYqWS2MpeoVKBLKJkMfo3c6Y1Lud',
    liquidityAddress: '3CdpSW5dxM7RTxBgxeyt8nnnjqoDbZe48tsBs9QUrmuN',
    liquidityFeeReceiverAddress: 'Cpyk5WRGmdK2yFGTJCrmgyABPiNEF5eCyCMMZLxpdkXu',
  },
  USDC: {
    mint: mainnetTokens.USDC.mintAddress,
    address: 'BgxfHJDzm44T7XG68MYKx7YisTjZu73tVovyZSjJMpmw',
    collateralMintAddress: '993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk',
    collateralSupplyAddress: 'UtRy8gcEu9fCkDuUrU8EmC7Uc6FZy5NCwttzG7i6nkw',
    liquidityAddress: '8SheGtsopRUDzdiD6v6BR9a6bqZ9QwywYQY99Fp5meNf',
    liquidityFeeReceiverAddress: '5Gdxn4yquneifE6uk9tK8X4CqHfWKjW2BvYU25hAykwP',
  },
  SOL: {
    mint: mainnetTokens.WSOL.mintAddress,
    address: '8PbodeaosQP19SjYFx855UMqWxH2HynZLdBXmsrbac36',
    collateralMintAddress: '5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV',
    collateralSupplyAddress: 'B1ATuYXNkacjjJS78MAmqu8Lu8PvEPt51u4oBasH1m1g',
    liquidityAddress: '8UviNr47S8eL6J3WfDxMRa3hvLta1VDJwNWqsDgtN3Cv',
    liquidityFeeReceiverAddress: '5wo1tFpi4HaVKnemqaXeQnBEpezrJXcXvuztYaPhvgC7',
  },
  mSOL: {
    mint: mainnetTokens.mSOL.mintAddress,
    address: 'CCpirWrgNuBVLdkP2haxLTbD6XqEgaYuVXixbbpxUB6',
    collateralMintAddress: '3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h',
    collateralSupplyAddress: 'FG7yuhS6udX8v2LQYxqwpcsdC2J1pUREoGrRYsQjr1uh',
    liquidityAddress: '3R5SVe3qABRUYozgeMNVkSotVoa4HhTFFgWgx2G2QMov',
    liquidityFeeReceiverAddress: '83r2poRUiqaghyymPtfhhRtHdReFAKbgGGCQajkczW5w',
  },
};
export const SOLEND_RESERVES: SOLEND_RESERVES = isMainnet
  ? mainnet_reserves
  : devnet_reserves;

export const getSolendReserveByAddress = (
  address: string
): SOLEND_RESERVE | undefined => {
  const key = Object.keys(SOLEND_RESERVES).find(
    (f) => SOLEND_RESERVES[f].address === address
  );
  if (key) {
    return SOLEND_RESERVES[key];
  } else {
    undefined;
  }
};
