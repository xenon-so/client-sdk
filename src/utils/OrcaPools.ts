import { isMainnet } from "../isMainnet";

export interface OrcaWhirlpool {
  address: string;
  tokenA: Token;
  tokenB: Token;
  whitelisted: boolean;
  tickSpacing: number;
  price: number;
  lpFeeRate: number;
  protocolFeeRate: number;
  whirlpoolsConfig: string;
  modifiedTimeMs: number;
  tvl: number;
  volume: Duration;
  volumeDenominatedA: Duration;
  volumeDenominatedB: Duration;
  priceRange: PriceRange;
  feeApr: Duration;
  reward0Apr: Duration;
  reward1Apr: Duration;
  reward2Apr: Duration;
  totalApr: Duration;
  tokenAPriceUSD: {
    price: number,
    dex: number,
    coingecko: number
  },
  tokenBPriceUSD: {
    price: number,
    dex: number,
    coingecko: number
  },
}

interface Token {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  coingeckoId: string;
  whitelisted: boolean;
  poolToken: boolean;
}

interface Duration {
  day: number;
  week: number;
  month: number;
}

interface PriceRange {
  day: DayOrWeekOrMonth;
  week: DayOrWeekOrMonth;
  month: DayOrWeekOrMonth;
}

interface DayOrWeekOrMonth {
  min: number;
  max: number;
}

const devnetPoolList: OrcaWhirlpool[] = [
];

export const mainnetPoolList: OrcaWhirlpool[] = [
  {
    "address": "HJPjoWUrhoZzkNfRpHuieeFk9WcZWjwy6PBjZ81ngndJ",
    "tokenA": {
        "mint": "So11111111111111111111111111111111111111112",
        "symbol": "SOL",
        "name": "Wrapped Solana",
        "decimals": 9,
        "logoURI": "https://assets.coingecko.com/coins/images/21629/large/solana.jpg?1639626543",
        "coingeckoId": "wrapped-solana",
        "whitelisted": true,
        "poolToken": false
    },
    "tokenB": {
        "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "symbol": "USDC",
        "name": "USD Coin",
        "decimals": 6,
        "logoURI": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
        "coingeckoId": "usd-coin",
        "whitelisted": true,
        "poolToken": false
    },
    "whitelisted": true,
    "tickSpacing": 64,
    "price": 32.80229304851715,
    "lpFeeRate": 0.003,
    "protocolFeeRate": 0.03,
    "whirlpoolsConfig": "2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ",
    "modifiedTimeMs": 1667229396796,
    "tvl": 3740393.6871301373,
    "volume": {
        "day": 6746930.154514405,
        "week": 44003211.147090934,
        "month": 104583586.27066979
    },
    "volumeDenominatedA": {
        "day": 196403.6572101967,
        "week": 1280936.8706001018,
        "month": 3043891.602750313
    },
    "volumeDenominatedB": {
        "day": 6746930.154514405,
        "week": 44003211.147090934,
        "month": 104583586.27066979
    },
    "priceRange": {
        "day": {
            "min": 32.204052217496745,
            "max": 34.050448197539936
        },
        "week": {
            "min": 28.127616276680182,
            "max": 34.050448197539936
        },
        "month": {
            "min": 27.214778572540332,
            "max": 34.430127898683445
        }
    },
    "feeApr": {
        "day": 1.9060535779595829,
        "week": 1.4736848871530988,
        "month": 0.7394736580434327
    },
    "reward0Apr": {
        "day": 0,
        "week": 0,
        "month": 0
    },
    "reward1Apr": {
        "day": 0,
        "week": 0,
        "month": 0
    },
    "reward2Apr": {
        "day": 0,
        "week": 0,
        "month": 0
    },
    "totalApr": {
        "day": 1.9060535779595829,
        "week": 1.4736848871530988,
        "month": 0.7394736580434327
    },
    "tokenAPriceUSD": {
        "price": 32.80229304851715,
        "dex": 32.80229304851715,
        "coingecko": 32.73
    },
    "tokenBPriceUSD": {
        "price": 1,
        "dex": 1,
        "coingecko": 0.999346
    }
  }
];


  export const ORCA_POOLS_LIST: OrcaWhirlpool[] = isMainnet
    ? mainnetPoolList
    : devnetPoolList;