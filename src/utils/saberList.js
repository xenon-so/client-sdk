"use strict";
exports.__esModule = true;
exports.SABER_LP_LIST = exports.mainnetLpList = void 0;
var isMainnet_1 = require("../isMainnet");
var devnetLpList = [
    {
        id: 'usdc_usdt',
        name: 'USDC-USDT',
        logoURI: 'https://raw.githubusercontent.com/saber-hq/saber-lp-token-list/master/assets/devnet/YakofBo4X3zMxa823THQJwZ8QeoU8pxPdFdxJs7JW57/icon.png',
        tokens: [
            {
                symbol: 'USDC',
                name: 'USD Coin (Saber Devnet)',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/103/2tWC4JAdL4AxEFJySziYJfsAnW2MHKRo98vbAPiRDSk8.png',
                address: '2tWC4JAdL4AxEFJySziYJfsAnW2MHKRo98vbAPiRDSk8',
                decimals: 6,
                chainId: 103,
                tags: ['saber-mkt-usd', 'stablecoin'],
                extensions: {
                    currency: 'USD',
                    website: 'https://saber.so/',
                    coingeckoId: 'usd-coin'
                }
            },
            {
                symbol: 'USDT',
                name: 'USDT (Saber Devnet)',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/103/EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS.svg',
                address: 'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS',
                decimals: 6,
                chainId: 103,
                tags: ['saber-mkt-usd', 'stablecoin'],
                extensions: {
                    currency: 'USD',
                    website: 'https://saber.so/',
                    coingeckoId: 'tether'
                }
            },
        ],
        tokenIcons: [
            {
                symbol: 'USDC',
                name: 'USD Coin (Saber Devnet)',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/103/2tWC4JAdL4AxEFJySziYJfsAnW2MHKRo98vbAPiRDSk8.png',
                address: '2tWC4JAdL4AxEFJySziYJfsAnW2MHKRo98vbAPiRDSk8',
                decimals: 6,
                chainId: 103,
                tags: ['saber-mkt-usd', 'stablecoin'],
                extensions: {
                    currency: 'USD',
                    website: 'https://saber.so/',
                    coingeckoId: 'usd-coin'
                }
            },
            {
                symbol: 'USDT',
                name: 'USDT (Saber Devnet)',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/103/EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS.svg',
                address: 'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS',
                decimals: 6,
                chainId: 103,
                tags: ['saber-mkt-usd', 'stablecoin'],
                extensions: {
                    currency: 'USD',
                    website: 'https://saber.so/',
                    coingeckoId: 'tether'
                }
            },
        ],
        underlyingIcons: [
            {
                symbol: 'USDC',
                name: 'USD Coin (Saber Devnet)',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/103/2tWC4JAdL4AxEFJySziYJfsAnW2MHKRo98vbAPiRDSk8.png',
                address: '2tWC4JAdL4AxEFJySziYJfsAnW2MHKRo98vbAPiRDSk8',
                decimals: 6,
                chainId: 103,
                tags: ['saber-mkt-usd', 'stablecoin'],
                extensions: {
                    currency: 'USD',
                    website: 'https://saber.so/',
                    coingeckoId: 'usd-coin'
                }
            },
            {
                symbol: 'USDT',
                name: 'USDT (Saber Devnet)',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/103/EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS.svg',
                address: 'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS',
                decimals: 6,
                chainId: 103,
                tags: ['saber-mkt-usd', 'stablecoin'],
                extensions: {
                    currency: 'USD',
                    website: 'https://saber.so/',
                    coingeckoId: 'tether'
                }
            },
        ],
        currency: 'USD',
        lpToken: {
            symbol: 'USDC-USDT',
            name: 'Saber USDC-USDT LP',
            logoURI: 'https://registry.saber.so/token-icons/slp.png',
            decimals: 6,
            address: 'YakofBo4X3zMxa823THQJwZ8QeoU8pxPdFdxJs7JW57',
            chainId: 103,
            tags: ['saber-stableswap-lp'],
            extensions: {
                website: 'https://app.saber.so/pools/usdc_usdt',
                underlyingTokens: [
                    '2tWC4JAdL4AxEFJySziYJfsAnW2MHKRo98vbAPiRDSk8',
                    'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS',
                ],
                source: 'saber'
            }
        },
        plotKey: '99CaY6yjPLJzAJU3y2qhuLMFcfoCof4tnbR21FrtiGJd',
        swap: {
            config: {
                swapAccount: 'VeNkoB1HvSP6bSeGybQDnx9wTWFsQb2NBCemeCDSuKL',
                authority: '72E8LfHqoxQCxnxmBbDG6WSHnDx1rWPUHNKwYvoL5qDm',
                swapProgramID: 'SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ',
                tokenProgramID: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
            },
            state: {
                isInitialized: true,
                isPaused: false,
                nonce: 254,
                futureAdminDeadline: 0,
                futureAdminAccount: '11111111111111111111111111111111',
                poolTokenMint: 'YakofBo4X3zMxa823THQJwZ8QeoU8pxPdFdxJs7JW57',
                adminAccount: '8stm1cGSc85QL9yJKphHvkZsHRXX7aFp5FhyhnMun1KN',
                tokenA: {
                    adminFeeAccount: 'Cea3Bt6MjHMwwULZ5qpeEA7pkioWwf6feR94oy6YJxwZ',
                    mint: '2tWC4JAdL4AxEFJySziYJfsAnW2MHKRo98vbAPiRDSk8',
                    reserve: '6aFutFMWR7PbWdBQhdfrcKrAor9WYa2twtSinTMb9tXv'
                },
                tokenB: {
                    adminFeeAccount: 'J53kBEY831Mr3RdZtUjEkJeuweKNxTeYNbV9vLYLhp5W',
                    mint: 'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS',
                    reserve: 'HXbhpnLTxSDDkTg6deDpsXzJRBf8j7T6Dc3GidwrLWeo'
                },
                initialAmpFactor: '64',
                targetAmpFactor: '64',
                startRampTimestamp: 0,
                stopRampTimestamp: 0,
                fees: {
                    trade: {
                        formatted: '0.2000000000',
                        numerator: '20',
                        denominator: '10000'
                    },
                    adminTrade: {
                        formatted: '50.0000000000',
                        numerator: '50',
                        denominator: '100'
                    },
                    withdraw: {
                        formatted: '0.5000000000',
                        numerator: '50',
                        denominator: '10000'
                    },
                    adminWithdraw: {
                        formatted: '50.0000000000',
                        numerator: '50',
                        denominator: '100'
                    }
                }
            }
        },
        quarry: '8QfbpS8fBNcqee9qHjYG5pgBWTKyM193E7zjwzxeUZ3X'
    },
];
exports.mainnetLpList = [
    {
        id: 'usdc_usdt',
        name: 'USDT-USDC',
        logoURI: 'https://raw.githubusercontent.com/saber-hq/saber-lp-token-list/master/assets/mainnet/2poo1w1DL6yd2WNTCnNTzDqkC6MBXq7axo77P16yrBuf/icon.png',
        tokens: [
            {
                name: 'USD Coin',
                symbol: 'USDC',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v.png',
                decimals: 6,
                address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
                chainId: 101,
                tags: ['stablecoin', 'saber-mkt-usd'],
                extensions: {
                    website: 'https://www.centre.io/',
                    serumV3Usdt: '77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS',
                    coingeckoId: 'usd-coin',
                    currency: 'USD'
                }
            },
            {
                name: 'USDT',
                symbol: 'USDT',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB.svg',
                decimals: 6,
                address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
                chainId: 101,
                tags: ['stablecoin', 'saber-mkt-usd'],
                extensions: {
                    website: 'https://tether.to/',
                    serumV3Usdc: '77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS',
                    coingeckoId: 'tether',
                    currency: 'USD'
                }
            },
        ],
        tokenIcons: [
            {
                name: 'USDT',
                symbol: 'USDT',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB.svg',
                decimals: 6,
                address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
                chainId: 101,
                tags: ['stablecoin', 'saber-mkt-usd'],
                extensions: {
                    website: 'https://tether.to/',
                    serumV3Usdc: '77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS',
                    coingeckoId: 'tether',
                    currency: 'USD'
                }
            },
            {
                name: 'USD Coin',
                symbol: 'USDC',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v.png',
                decimals: 6,
                address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
                chainId: 101,
                tags: ['stablecoin', 'saber-mkt-usd'],
                extensions: {
                    website: 'https://www.centre.io/',
                    serumV3Usdt: '77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS',
                    coingeckoId: 'usd-coin',
                    currency: 'USD'
                }
            },
        ],
        underlyingIcons: [
            {
                name: 'USDT',
                symbol: 'USDT',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB.svg',
                decimals: 6,
                address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
                chainId: 101,
                tags: ['stablecoin', 'saber-mkt-usd'],
                extensions: {
                    website: 'https://tether.to/',
                    serumV3Usdc: '77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS',
                    coingeckoId: 'tether',
                    currency: 'USD'
                }
            },
            {
                name: 'USD Coin',
                symbol: 'USDC',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v.png',
                decimals: 6,
                address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
                chainId: 101,
                tags: ['stablecoin', 'saber-mkt-usd'],
                extensions: {
                    website: 'https://www.centre.io/',
                    serumV3Usdt: '77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS',
                    coingeckoId: 'usd-coin',
                    currency: 'USD'
                }
            },
        ],
        currency: 'USD',
        lpToken: {
            symbol: 'USDT-USDC',
            name: 'Saber USDT-USDC LP',
            logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/2poo1w1DL6yd2WNTCnNTzDqkC6MBXq7axo77P16yrBuf.png',
            decimals: 6,
            address: '2poo1w1DL6yd2WNTCnNTzDqkC6MBXq7axo77P16yrBuf',
            chainId: 101,
            tags: ['saber-stableswap-lp'],
            extensions: {
                website: 'https://app.saber.so/pools/usdc_usdt',
                underlyingTokens: [
                    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
                    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
                ],
                source: 'saber'
            }
        },
        plotKey: 'EZEBiZieuKrMGyCd72696Vm8HuiimfQGjVrejmp7Abjd',
        swap: {
            config: {
                swapAccount: 'YAkoNb6HKmSxQN9L8hiBE5tPJRsniSSMzND1boHmZxe',
                authority: '5C1k9yV7y4CjMnKv8eGYDgWND8P89Pdfj79Trk2qmfGo',
                swapProgramID: 'SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ',
                tokenProgramID: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
            },
            state: {
                isInitialized: true,
                isPaused: false,
                nonce: 255,
                futureAdminDeadline: 0,
                futureAdminAccount: '11111111111111111111111111111111',
                poolTokenMint: '2poo1w1DL6yd2WNTCnNTzDqkC6MBXq7axo77P16yrBuf',
                adminAccount: '7tpzQQEQFJTi32eo89yFuV4ST41NSC7c6xd9Sny36iXW',
                tokenA: {
                    adminFeeAccount: 'XZuQG7CQrAA6y6tHM9CLrDjDUWwuUU2SBoV7pLaGDQT',
                    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
                    reserve: 'CfWX7o2TswwbxusJ4hCaPobu2jLCb1hfXuXJQjVq3jQF'
                },
                tokenB: {
                    adminFeeAccount: '63aJYYuZddSnCGyE8FNrCVQWnXhjh6CQSRwcDeSMhdVC',
                    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
                    reserve: 'EnTrdMMpdhugeH6Ban6gYZWXughWxKtVGfCwFn78ZmY3'
                },
                initialAmpFactor: '05dc',
                targetAmpFactor: '1388',
                startRampTimestamp: 1652992259,
                stopRampTimestamp: 1653251456,
                fees: {
                    trade: {
                        formatted: '0.0010000000',
                        numerator: '1',
                        denominator: '100000'
                    },
                    adminTrade: {
                        formatted: '0.0000000000',
                        numerator: '0',
                        denominator: '10000000'
                    },
                    withdraw: {
                        formatted: '0.5000000000',
                        numerator: '50000',
                        denominator: '10000000'
                    },
                    adminWithdraw: {
                        formatted: '50.0000000000',
                        numerator: '5000000',
                        denominator: '10000000'
                    }
                }
            }
        },
        quarry: 'Hs1X5YtXwZACueUtS9azZyXFDWVxAMLvm3tttubpK7ph'
    },
    {
        id: 'solend_usdc_usdt',
        name: 'cUSDC-cUSDT',
        logoURI: 'https://raw.githubusercontent.com/saber-hq/saber-lp-token-list/master/assets/mainnet/SUSeGZEV69Xy7rQfhDffyTysHgEP3nJUDMxEZJSvJr1/icon.png',
        tokens: [
            {
                name: 'Solend USDC',
                symbol: 'cUSDC',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk.png',
                decimals: 6,
                address: '993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk',
                chainId: 101,
                tags: ['solend', 'lending', 'collateral-tokens', 'saber-mkt-usd'],
                extensions: {
                    website: 'https://solend.fi',
                    source: 'solend',
                    currency: 'USD',
                    sourceUrl: 'https://solend.fi/dashboard',
                    coingeckoId: 'usd-coin'
                }
            },
            {
                name: 'Solend USDT',
                symbol: 'cUSDT',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/BTsbZDV7aCMRJ3VNy9ygV4Q2UeEo9GpR8D6VvmMZzNr8.png',
                decimals: 6,
                address: 'BTsbZDV7aCMRJ3VNy9ygV4Q2UeEo9GpR8D6VvmMZzNr8',
                chainId: 101,
                tags: ['solend', 'lending', 'collateral-tokens', 'saber-mkt-usd'],
                extensions: {
                    website: 'https://solend.fi',
                    source: 'solend',
                    currency: 'USD',
                    sourceUrl: 'https://solend.fi/dashboard',
                    coingeckoId: 'tether'
                }
            },
        ],
        tokenIcons: [
            {
                name: 'Solend USDC',
                symbol: 'cUSDC',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk.png',
                decimals: 6,
                address: '993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk',
                chainId: 101,
                tags: ['solend', 'lending', 'collateral-tokens', 'saber-mkt-usd'],
                extensions: {
                    website: 'https://solend.fi',
                    source: 'solend',
                    currency: 'USD',
                    sourceUrl: 'https://solend.fi/dashboard',
                    coingeckoId: 'usd-coin'
                }
            },
            {
                name: 'Solend USDT',
                symbol: 'cUSDT',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/BTsbZDV7aCMRJ3VNy9ygV4Q2UeEo9GpR8D6VvmMZzNr8.png',
                decimals: 6,
                address: 'BTsbZDV7aCMRJ3VNy9ygV4Q2UeEo9GpR8D6VvmMZzNr8',
                chainId: 101,
                tags: ['solend', 'lending', 'collateral-tokens', 'saber-mkt-usd'],
                extensions: {
                    website: 'https://solend.fi',
                    source: 'solend',
                    currency: 'USD',
                    sourceUrl: 'https://solend.fi/dashboard',
                    coingeckoId: 'tether'
                }
            },
        ],
        underlyingIcons: [
            {
                name: 'Solend USDC',
                symbol: 'cUSDC',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk.png',
                decimals: 6,
                address: '993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk',
                chainId: 101,
                tags: ['solend', 'lending', 'collateral-tokens', 'saber-mkt-usd'],
                extensions: {
                    website: 'https://solend.fi',
                    source: 'solend',
                    currency: 'USD',
                    sourceUrl: 'https://solend.fi/dashboard',
                    coingeckoId: 'usd-coin'
                }
            },
            {
                name: 'Solend USDT',
                symbol: 'cUSDT',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/BTsbZDV7aCMRJ3VNy9ygV4Q2UeEo9GpR8D6VvmMZzNr8.png',
                decimals: 6,
                address: 'BTsbZDV7aCMRJ3VNy9ygV4Q2UeEo9GpR8D6VvmMZzNr8',
                chainId: 101,
                tags: ['solend', 'lending', 'collateral-tokens', 'saber-mkt-usd'],
                extensions: {
                    website: 'https://solend.fi',
                    source: 'solend',
                    currency: 'USD',
                    sourceUrl: 'https://solend.fi/dashboard',
                    coingeckoId: 'tether'
                }
            },
        ],
        currency: 'USD',
        lpToken: {
            symbol: 'cUSDC-cUSDT',
            name: 'Saber cUSDC-cUSDT LP',
            logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/SUSeGZEV69Xy7rQfhDffyTysHgEP3nJUDMxEZJSvJr1.png',
            decimals: 6,
            address: 'SUSeGZEV69Xy7rQfhDffyTysHgEP3nJUDMxEZJSvJr1',
            chainId: 101,
            tags: ['saber-stableswap-lp', 'saber-lp-solend'],
            extensions: {
                website: 'https://app.saber.so/pools/solend_usdc_usdt',
                underlyingTokens: [
                    '993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk',
                    'BTsbZDV7aCMRJ3VNy9ygV4Q2UeEo9GpR8D6VvmMZzNr8',
                ],
                source: 'saber'
            }
        },
        plotKey: '8yYT2m4gGGKQyvFNzMnGiXkyDzCywa4abL9QqLz9ckWA',
        swap: {
            config: {
                swapAccount: 'RooZXUCc5RK1onxyVxB5G8CtGES3ptNgVnZLXMe2cws',
                authority: 'CKiGW6G7mp7eyFYeby782hro9VkaSL8HGrYBPP95bXho',
                swapProgramID: 'SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ',
                tokenProgramID: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
            },
            state: {
                isInitialized: true,
                isPaused: false,
                nonce: 254,
                futureAdminDeadline: 0,
                futureAdminAccount: '11111111111111111111111111111111',
                poolTokenMint: 'SUSeGZEV69Xy7rQfhDffyTysHgEP3nJUDMxEZJSvJr1',
                adminAccount: 'G95sdzNFamfvuK2HDeskhKvBcriCSUXEpy1EF768dePf',
                tokenA: {
                    adminFeeAccount: '97c3ygVrAhE4wvg8vXzud7FSryKvPwUypsVN5GF7E8vU',
                    mint: '993dVFL2uXWYeoXuEBFXR4BijeXdTv4s6BzsCjJZuwqk',
                    reserve: '4XqU6QN4QJKva4fF4eyCnPtJG99pKecuUuCPDax5BEqU'
                },
                tokenB: {
                    adminFeeAccount: '5rXtWfRPrELaK9kWK8DGfBt8CeeL6MvWHzfsCvZjef2M',
                    mint: 'BTsbZDV7aCMRJ3VNy9ygV4Q2UeEo9GpR8D6VvmMZzNr8',
                    reserve: 'F7k8DuuawVEZ3new4A9ahWVojCkEG8BrLsCwyhRvmEHa'
                },
                initialAmpFactor: '32',
                targetAmpFactor: '32',
                startRampTimestamp: 0,
                stopRampTimestamp: 0,
                fees: {
                    trade: {
                        formatted: '0.0400000000',
                        numerator: '4',
                        denominator: '10000'
                    },
                    adminTrade: {
                        formatted: '0.0000000000',
                        numerator: '0',
                        denominator: '10000'
                    },
                    withdraw: {
                        formatted: '0.0000000000',
                        numerator: '0',
                        denominator: '10000'
                    },
                    adminWithdraw: {
                        formatted: '0.0000000000',
                        numerator: '0',
                        denominator: '10000'
                    }
                }
            }
        },
        quarry: 'ByuGnzyRgj73HKmQnLLC61Qgn6EtteeQ7qx9TPHwDYzN'
    },
    {
        id: 'solend_sol_msol',
        name: 'cSOL-cmSOL',
        logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV.png',
        tokens: [
            {
                name: 'Solend SOL',
                symbol: 'cSOL',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV.png',
                decimals: 9,
                address: '5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV',
                chainId: 101,
                tags: ['solend', 'lending', 'collateral-tokens', 'saber-mkt-sol'],
                extensions: {
                    website: 'https://solend.fi',
                    coingeckoId: 'solana',
                    source: 'solend',
                    currency: 'SOL',
                    sourceUrl: 'https://solend.fi/dashboard'
                }
            },
            {
                name: 'Solend mSOL',
                symbol: 'cmSOL',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h.png',
                decimals: 9,
                address: '3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h',
                chainId: 101,
                tags: ['solend', 'lending', 'collateral-tokens', 'saber-mkt-sol'],
                extensions: {
                    website: 'https://solend.fi',
                    coingeckoId: 'solana',
                    source: 'solend',
                    currency: 'SOL',
                    sourceUrl: 'https://solend.fi/dashboard'
                }
            },
        ],
        tokenIcons: [
            {
                name: 'Solend SOL',
                symbol: 'cSOL',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV.png',
                decimals: 9,
                address: '5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV',
                chainId: 101,
                tags: ['solend', 'lending', 'collateral-tokens', 'saber-mkt-sol'],
                extensions: {
                    website: 'https://solend.fi',
                    coingeckoId: 'solana',
                    source: 'solend',
                    currency: 'SOL',
                    sourceUrl: 'https://solend.fi/dashboard'
                }
            },
            {
                name: 'Solend mSOL',
                symbol: 'cmSOL',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h.png',
                decimals: 9,
                address: '3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h',
                chainId: 101,
                tags: ['solend', 'lending', 'collateral-tokens', 'saber-mkt-sol'],
                extensions: {
                    website: 'https://solend.fi',
                    coingeckoId: 'solana',
                    source: 'solend',
                    currency: 'SOL',
                    sourceUrl: 'https://solend.fi/dashboard'
                }
            },
        ],
        underlyingIcons: [
            {
                name: 'Solend SOL',
                symbol: 'cSOL',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV.png',
                decimals: 9,
                address: '5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV',
                chainId: 101,
                tags: ['solend', 'lending', 'collateral-tokens', 'saber-mkt-sol'],
                extensions: {
                    website: 'https://solend.fi',
                    coingeckoId: 'solana',
                    source: 'solend',
                    currency: 'SOL',
                    sourceUrl: 'https://solend.fi/dashboard'
                }
            },
            {
                name: 'Solend mSOL',
                symbol: 'cmSOL',
                logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h.png',
                decimals: 9,
                address: '3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h',
                chainId: 101,
                tags: ['solend', 'lending', 'collateral-tokens', 'saber-mkt-sol'],
                extensions: {
                    website: 'https://solend.fi',
                    coingeckoId: 'solana',
                    source: 'solend',
                    currency: 'SOL',
                    sourceUrl: 'https://solend.fi/dashboard'
                }
            },
        ],
        currency: 'SOL',
        lpToken: {
            symbol: 'cSOL-cmSOL',
            name: 'Saber cSOL-cmSOL LP',
            logoURI: 'https://cdn.jsdelivr.net/gh/saber-hq/spl-token-icons@master/icons/101/SSoxcNry3qU1wN5Vj6zMJKTSqJPyPLks5KNfCJCmUPa.png',
            decimals: 9,
            address: 'SSoxcNry3qU1wN5Vj6zMJKTSqJPyPLks5KNfCJCmUPa',
            chainId: 101,
            tags: ['saber-stableswap-lp', 'saber-lp-solend'],
            extensions: {
                website: 'https://app.saber.so/pools/solend_sol_msol',
                underlyingTokens: [
                    '5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV',
                    '3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h',
                ],
                source: 'saber'
            }
        },
        plotKey: '2sstSyXaP9iEGXzvjzapM2FsPJZFrXCorNGtfDTLV8BX',
        swap: {
            config: {
                swapAccount: 'Roockn5vpbWxKybZqMy3xaYuSaq1Lhoc7CL3C6bAUXX',
                authority: '5wYPXCAA59FnC8e2ZHszcNJ68HSeqPnHffnBrnagcJe6',
                swapProgramID: 'SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ',
                tokenProgramID: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
            },
            state: {
                isInitialized: true,
                isPaused: false,
                nonce: 254,
                futureAdminDeadline: 0,
                futureAdminAccount: '11111111111111111111111111111111',
                poolTokenMint: 'SSoxcNry3qU1wN5Vj6zMJKTSqJPyPLks5KNfCJCmUPa',
                adminAccount: '5joKg3wtysaUiTRw1k3JshYHEpK2ws1vSdAt17acPwf2',
                tokenA: {
                    adminFeeAccount: '8hJHEfc6YJRsngLtRAZAR7uKUgkgnR5YFQvtSVE6aCcJ',
                    mint: '5h6ssFpeDeRbzsEHDbTQNH7nVGgsKrZydxdSTnLm6QdV',
                    reserve: 'DAizXCPHT5ATkKoW9XAGTdrA7Lbj3cNygjD8RQFH8nZJ'
                },
                tokenB: {
                    adminFeeAccount: '5SECXwa7A4f7h5gdGDsV2BrkB5dUJJJzGcKp85jmZahb',
                    mint: '3JFC4cB56Er45nWVe29Bhnn5GnwQzSmHVf6eUq9ac91h',
                    reserve: 'Gh4iXm7PAHjAbagz9FfbpLSuuRE8rdKkDcSukp8Dzq9R'
                },
                initialAmpFactor: '32',
                targetAmpFactor: '32',
                startRampTimestamp: 0,
                stopRampTimestamp: 0,
                fees: {
                    trade: {
                        formatted: '0.0400000000',
                        numerator: '4',
                        denominator: '10000'
                    },
                    adminTrade: {
                        formatted: '0.0000000000',
                        numerator: '0',
                        denominator: '10000'
                    },
                    withdraw: {
                        formatted: '0.0000000000',
                        numerator: '0',
                        denominator: '10000'
                    },
                    adminWithdraw: {
                        formatted: '0.0000000000',
                        numerator: '0',
                        denominator: '10000'
                    }
                }
            }
        },
        quarry: '7Cvc9vEFztaUEY5r27sj8BXUYpNMxRWTLSUwvQi19ug7'
    },
];
exports.SABER_LP_LIST = isMainnet_1.isMainnet
    ? exports.mainnetLpList
    : devnetLpList;
