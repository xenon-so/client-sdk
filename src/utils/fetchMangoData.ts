import {
  MangoClient,
  IDS,
  MangoGroup,
} from '@blockworks-foundation/mango-client';
import { PublicKey, Transaction } from '@solana/web3.js';
import { SERUM_PROGRAM_ID_V3 } from '../constants';
import { isMainnet } from '../isMainnet';
import { XenonTraderClient } from '../xenonTraderClient';
import { PERP_MARKETS } from './perpMarkets';

export const fetchMangoPositions = async (
  publicKey: PublicKey,
  mangoAccPubKey: PublicKey,
  client: MangoClient,
  mangoGroup: MangoGroup,
  xenonClient: XenonTraderClient
) => {
  const mangoAccount = await client.getMangoAccount(
    mangoAccPubKey,
    SERUM_PROGRAM_ID_V3
  );

  const openPositions: { closePosition: Function }[] = [];
  const pendingOpenOrders: { cancelOrder: Function }[] = [];

  for (let i = 0; i < PERP_MARKETS.length; i++) {
    const perpMarketInfo = PERP_MARKETS[i];
    const index = PERP_MARKETS[i].marketIndex;
    const perpAccount = mangoAccount.perpAccounts[index];

    const perpMarket = await client.getPerpMarket(
      new PublicKey(perpMarketInfo.publicKey),
      perpMarketInfo.baseDecimals,
      perpMarketInfo.quoteDecimals
    );

    const openOrders = await perpMarket.loadOrdersForAccount(
      xenonClient.connection,
      mangoAccount
    );
    const ids = IDS['groups'][isMainnet ? 0 : 2];
    for (let index = 0; index < openOrders.length; index++) {
      const openOrder = openOrders[index];
      const perpMarket = ids.perpMarkets.find(
        (f) => f.marketIndex === perpMarketInfo.marketIndex
      )!;
      pendingOpenOrders.push({
        cancelOrder: async () => {
          const transaction = new Transaction();
          await xenonClient.mangoCancelOrder(
            transaction,
            perpMarket.marketIndex,
            openOrder.clientId!.toNumber()
          );
          transaction.feePayer = publicKey;
          return transaction;
        },
      });
    }

    const side = perpAccount.getBasePositionUi(perpMarket) < 0 ? 'buy' : 'sell';
    const positionSize =
      perpAccount.getBasePositionUi(perpMarket) * (side === 'sell' ? 1 : -1);
    const [nativePrice, nativeQuantity] = perpMarket.uiToNativePriceQuantity(
      1,
      positionSize
    );
    if (positionSize === 0) continue;
    openPositions.push({
      closePosition: async () => {
        const perpMarketInfoA = PERP_MARKETS.find(
          (i) => i.baseSymbol === perpMarketInfo.baseSymbol
        );
        const transaction = new Transaction();
        transaction.feePayer = publicKey;
        await xenonClient.mangoPlaceOrder(
          transaction,
          1,
          side,
          perpMarketInfoA!.marketIndex,
          'market',
          nativeQuantity.toNumber(),
          1
        );

        return transaction;
      },
    });
  }

  return { openPositions, pendingOpenOrders };
};
