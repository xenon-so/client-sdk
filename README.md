# Xenon SDK

Javascript SDK for interacting with XENON programs

## Installation

### Yarn
```
yarn add @xenon/client-sdk
```
### npm
```
npm install @xenon/client-sdk
```

## Basic usage

### Trader Deposit
```js
import { XenonTraderClient } from '@xenon/client-sdk'

...
const xenonTraderClient = new XenonTraderClient(connection, publicKey)

await xenonTraderClient.load();

const transaction = new Transaction();

await client.traderDeposit(transaction, amount, mintAddress, selectedToken === 'SOL' ? true : false);

sendTransaction()...
...

```


