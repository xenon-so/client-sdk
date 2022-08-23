import { PublicKey, Transaction } from '@solana/web3.js';
import fetch from 'cross-fetch';

export const buildJupSwapTransaction = async (
  user: PublicKey,
  inputMint: PublicKey,
  outputMint: PublicKey,
  amount: number,
  slippage: number = 0.5
) => {
  const { data } = await (
    await fetch(
      `https://quote-api.jup.ag/v1/quote?inputMint=${inputMint.toBase58()}&outputMint=${outputMint.toBase58()}&amount=${amount}&slippage=${slippage}`
    )
  ).json();
  const routes = data;

  if (!routes) return [];

  const transactions = await (
    await fetch('https://quote-api.jup.ag/v1/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // route from /quote api
        route: routes[0],
        // user public key to be used for the swap
        userPublicKey: user.toBase58(),
        // auto wrap and unwrap SOL. default is true
        wrapUnwrapSOL: true,
      }),
    })
  ).json();

  const { setupTransaction, swapTransaction, cleanupTransaction } =
    transactions;

  return [setupTransaction, swapTransaction, cleanupTransaction]
    .filter(Boolean)
    .map((t) => Transaction.from(Buffer.from(t, 'base64')));
};
