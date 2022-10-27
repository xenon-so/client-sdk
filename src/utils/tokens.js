"use strict";
exports.__esModule = true;
exports.getTokenFromMintAddress = exports.getTokenFromSymbol = exports.getDecimalsFromMint = exports.TOKENS = exports.mainnetTokens = void 0;
var isMainnet_1 = require("../isMainnet");
var devnetTokens = {
    WSOL: {
        symbol: 'WSOL',
        name: 'Wrapped Solana',
        mintAddress: 'So11111111111111111111111111111111111111112',
        decimals: 9,
        tokenType: 'GENERAL',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        extensions: {
            coingeckoId: 'solana'
        }
    },
    BTC: {
        symbol: 'BTC',
        name: 'Wrapped Bitcoin',
        mintAddress: '3UNBZ6o52WTWwjac2kPUb4FyodhU1vFkRJheu1Sh2TvU',
        decimals: 6,
        tokenType: 'GENERAL',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png',
        extensions: {
            coingeckoId: 'bitcoin'
        }
    },
    USDC: {
        symbol: 'USDC',
        name: 'USD Coin',
        tokenType: 'GENERAL',
        mintAddress: '8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
        extensions: {
            coingeckoId: 'usd-coin'
        },
        decimals: 6
    },
    SUSDC: {
        symbol: 'SUSDC',
        name: 'SUSDC Coin',
        mintAddress: '2tWC4JAdL4AxEFJySziYJfsAnW2MHKRo98vbAPiRDSk8',
        decimals: 6,
        tokenType: 'cTOKEN',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
        extensions: {
            coingeckoId: 'tether'
        }
    },
    SUSDT: {
        symbol: 'SUSDT',
        name: 'SUSDT',
        mintAddress: 'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS',
        decimals: 6,
        tokenType: 'cTOKEN',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
        extensions: {
            coingeckoId: 'tether'
        }
    },
    xUSDC: {
        symbol: 'xUSDC',
        name: 'xUSD Coin',
        mintAddress: 'DNhgy7QYtAfmkSHmEJJw7VPnNr6jYcYaj8J1GysZBYwh',
        decimals: 6,
        tokenType: 'GENERAL',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
        extensions: {
            coingeckoId: 'tether'
        }
    },
    USDC_USDT_SABER_LP: {
        symbol: 'USDC-USDT-SABER-LP',
        name: 'USDC-USDT-SABER-LP',
        tokenType: 'SABER_LP',
        mintAddress: 'YakofBo4X3zMxa823THQJwZ8QeoU8pxPdFdxJs7JW57',
        decimals: 6,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HXb1AM83cRUbGegTivuSanvLP1W8A4pyTGMveNWR1pyg/logo.png',
        extensions: {}
    }
};
exports.mainnetTokens = {
    xeUSDC: {
        symbol: 'xeUSDC',
        name: 'xeUSD Coin',
        mintAddress: '3hKa4sbhVdD5A5UybadpX73FxPyb1HE8CLPLkZi4aiGq',
        decimals: 6,
        tokenType: 'GENERAL',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
        extensions: {
            coingeckoId: 'tether'
        }
    },
    USDC: {
        chainId: 101,
        mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        tokenType: 'GENERAL',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
        extensions: {
            coingeckoId: 'usd-coin'
        }
    },
    USDT: {
        chainId: 101,
        mintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        symbol: 'USDT',
        name: 'USDT',
        decimals: 6,
        tokenType: 'GENERAL',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
        extensions: {
            coingeckoId: 'tether'
        }
    },
    BTC: {
        chainId: 101,
        mintAddress: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
        symbol: 'BTC',
        name: 'Wrapped Bitcoin (Sollet)',
        decimals: 6,
        tokenType: 'GENERAL',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png',
        extensions: {
            coingeckoId: 'bitcoin'
        }
    },
    ETH: {
        chainId: 101,
        mintAddress: '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk',
        symbol: 'ETH',
        name: 'Ether (Portal)',
        decimals: 6,
        tokenType: 'GENERAL',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs/logo.png',
        extensions: {
            coingeckoId: 'ethereum'
        }
    },
    WSOL: {
        chainId: 101,
        mintAddress: 'So11111111111111111111111111111111111111112',
        symbol: 'WSOL',
        name: 'Wrapped SOL',
        decimals: 9,
        tokenType: 'GENERAL',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        extensions: {
            coingeckoId: 'solana'
        }
    },
    mSOL: {
        chainId: 101,
        mintAddress: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
        symbol: 'mSOL',
        name: 'Marinade staked SOL (mSOL)',
        decimals: 9,
        tokenType: 'GENERAL',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png',
        extensions: {
            coingeckoId: 'msol'
        }
    },
    cUSDC: {
        chainId: 101,
        mintAddress: '993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk',
        symbol: 'cUSDC',
        name: 'Solend USDC',
        decimals: 6,
        tokenType: 'cTOKEN',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk/logo.png',
        extensions: {}
    },
    cUSDT: {
        chainId: 101,
        mintAddress: 'BTsbZDV7aCMRJ3VNy9ygV4Q2UeEo9GpR8D6VvmMZzNr8',
        symbol: 'cUSDT',
        name: 'Solend USDT',
        decimals: 6,
        tokenType: 'cTOKEN',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/BTsbZDV7aCMRJ3VNy9ygV4Q2UeEo9GpR8D6VvmMZzNr8/logo.png',
        extensions: {}
    },
    cSOL: {
        chainId: 101,
        mintAddress: '5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV',
        symbol: 'cSOL',
        name: 'Solend SOL',
        decimals: 9,
        tokenType: 'cTOKEN',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV/logo.png',
        extensions: {}
    },
    cmSOL: {
        chainId: 101,
        mintAddress: '3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h',
        symbol: 'cmSOL',
        name: 'Solend mSOL',
        decimals: 9,
        tokenType: 'cTOKEN',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h/logo.png'
    },
    USDC_USDT: {
        chainId: 103,
        mintAddress: '2poo1w1DL6yd2WNTCnNTzDqkC6MBXq7axo77P16yrBuf',
        symbol: 'USDC-USDT',
        name: 'USDC-USDT Saber LP',
        decimals: 6,
        tokenType: 'SABER_LP',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HXb1AM83cRUbGegTivuSanvLP1W8A4pyTGMveNWR1pyg/logo.png'
    },
    SOL_mSOL: {
        chainId: 101,
        mintAddress: '5ijRoAHVgd5T5CNtK5KDRUBZ7Bffb69nktMj5n6ks6m4',
        symbol: 'SOL-mSOL',
        tokenType: 'SABER_LP',
        name: 'Raydium LP Token V4 (SOL-mSOL)',
        decimals: 9,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/5ijRoAHVgd5T5CNtK5KDRUBZ7Bffb69nktMj5n6ks6m4/logo.png'
    },
    cSOL_cmSOL: {
        chainId: 101,
        mintAddress: 'SSoxcNry3qU1wN5Vj6zMJKTSqJPyPLks5KNfCJCmUPa',
        symbol: 'cSOL-cmSOL',
        name: 'Saber cSOL-cmSOL LP',
        tokenType: 'SABER_LP',
        decimals: 9,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SSoxcNry3qU1wN5Vj6zMJKTSqJPyPLks5KNfCJCmUPa/icon.png'
    },
    cUSDC_cUSDT: {
        chainId: 101,
        mintAddress: 'SUSeGZEV69Xy7rQfhDffyTysHgEP3nJUDMxEZJSvJr1',
        symbol: 'cUSDC-cUSDT',
        name: 'Saber cUSDC-cUSDT LP',
        decimals: 6,
        tokenType: 'SABER_LP',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SUSeGZEV69Xy7rQfhDffyTysHgEP3nJUDMxEZJSvJr1/icon.png'
    }
};
exports.TOKENS = isMainnet_1.isMainnet ? exports.mainnetTokens : devnetTokens;
var getDecimalsFromMint = function (mint) {
    for (var _i = 0, _a = Object.entries(exports.TOKENS); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value.mintAddress === mint) {
            return value.decimals;
        }
    }
};
exports.getDecimalsFromMint = getDecimalsFromMint;
var getTokenFromSymbol = function (symbol) {
    var _a;
    return (_a = Object.entries(exports.TOKENS).find(function (f) { return f[1].symbol === symbol; })) === null || _a === void 0 ? void 0 : _a[1];
};
exports.getTokenFromSymbol = getTokenFromSymbol;
var getTokenFromMintAddress = function (mintAddress) {
    var _a;
    return (_a = Object.entries(exports.TOKENS).find(function (f) { return f[1].mintAddress === mintAddress; })) === null || _a === void 0 ? void 0 : _a[1];
};
exports.getTokenFromMintAddress = getTokenFromMintAddress;
