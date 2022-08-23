/*
  A sample template for liquidating accounts
*/

import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from '@solana/web3.js';
import bs58 from 'bs58';
import {
  MANGO_GROUP_ACCOUNT_V3,
  SERUM_PROGRAM_ID_V3,
  XenonLiquidatorClient,
  XenonTraderClient,
} from '../index';

const WALLET_PRIVATE_KEY =
  process.env.WALLET_PRIVATE_KEY ||
  '3VKSssLGgTAnVHNS2iVP959dT3kXUZYo83QEdBUntnXrfAWDeSo8Daov6pgAeHxv6617c8xvXpN6a9q2zXLYeFps';

const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
const USER_KEYPAIR = Keypair.fromSecretKey(USER_PRIVATE_KEY);

// const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(process.env.WALLET_PRIVATE_KEY || '')))

console.log(process.env.WALLET_PRIVATE_KEY);

const connection = new Connection('https://ssc-dao.genesysgo.net', 'processed');

const sendTransactions = async (transactions: Transaction[]) => {
  await Promise.all(
    transactions.map((f) =>
      sendAndConfirmTransaction(connection, f, [USER_KEYPAIR], {
        skipPreflight: true,
        maxRetries: 3,
      }).then((sign) =>
        console.log(
          'signature tx url:: ',
          `https://explorer.solana.com/tx/${sign}`
        )
      )
    )
  );
};

const closePositionsLinearly = async (
  liquidatorClient: XenonLiquidatorClient,
  xenonTraderClient: XenonTraderClient
) => {
  // close quarry
  const quarryTransactions = await liquidatorClient.closeAllQuarryPositions({
    marginAccount: xenonTraderClient.marginPDA,
  });
  await sendTransactions(quarryTransactions);

  // close saber
  const saberTransactions = await liquidatorClient.closeAllSaberPositions({
    marginAccount: xenonTraderClient.marginPDA,
  });
  await sendTransactions(saberTransactions);

  // close solend
  const solendTransactions = await liquidatorClient.closeAllSolendPositions({
    marginAccount: xenonTraderClient.marginPDA,
  });
  await sendTransactions(solendTransactions);
};

const closeAllMangoAndSettle = async (
  liquidatorClient: XenonLiquidatorClient,
  xenonTraderClient: XenonTraderClient
) => {
  if (xenonTraderClient.mangoAccount) {
    const mangoTransactions = await liquidatorClient.closeAllMangoPositions(
      xenonTraderClient
    );
    await sendTransactions([...mangoTransactions]);

    // settle all mango pnls, these directly send the transactions
    await xenonTraderClient.mangoSettleAll(USER_KEYPAIR);
    // calculate withdrawable amount from mango
    const mangoGroup = await xenonTraderClient.mangoClient.getMangoGroup(
      MANGO_GROUP_ACCOUNT_V3
    );
    const mangoAccount = await xenonTraderClient.mangoClient.getMangoAccount(
      xenonTraderClient.mangoCheckAccountData.mango_account,
      SERUM_PROGRAM_ID_V3
    );
    const cache = await mangoGroup.loadCache(connection);
    const totalUsdcValue = mangoAccount
      .getAssetsVal(mangoGroup, cache)
      .toNumber();

    // withdraw from mango
    const mangoWithdrawTransaction = new Transaction();
    await xenonTraderClient.mangoWithdraw(
      mangoWithdrawTransaction,
      0,
      totalUsdcValue
    );

    await sendTransactions([mangoWithdrawTransaction]);
  }
};

export const closeAllPositionsAndSellAllAssets = async (
  userPublicKey: PublicKey,
  liquidatorClient: XenonLiquidatorClient
) => {
  const xenonTraderClient = new XenonTraderClient(connection, userPublicKey);
  await xenonTraderClient.load();
  await xenonTraderClient.loadMangoAdaptor();

  await Promise.all([
    closePositionsLinearly(liquidatorClient, xenonTraderClient),
    closeAllMangoAndSettle(liquidatorClient, xenonTraderClient),
  ]);

  // sell all tokens using jupiter
  const { withdrawInstructions, convertToUSDCTransactions } =
    await liquidatorClient.withdrawAllAssets(true);

  await Promise.all([sendTransactions(withdrawInstructions)]);

  for (const tr of convertToUSDCTransactions) {
    for (const t of tr) {
      const sign = await sendAndConfirmTransaction(
        connection,
        t,
        [USER_KEYPAIR],
        { skipPreflight: true }
      );
      console.log('signature tx url:: ', `https://solscan.io/tx/${sign}`);
    }
  }
};

const main = async () => {
  const client = new XenonLiquidatorClient(connection, USER_KEYPAIR.publicKey);
  await client.load();

  const marginAccounts = await client.getAllMarginAccounts();

  for (const marginAccount of marginAccounts) {
    const transaction = new Transaction();
    transaction.feePayer = USER_KEYPAIR.publicKey;

    await client.liquidateMarginAccount({
      marginAccount: marginAccount.pubkey,
      transaction,
    });
    try {
      const simulate = await connection.simulateTransaction(transaction);
      if (
        simulate.value.err == null &&
        !JSON.stringify(simulate.value.logs).includes('cache price stale')
      ) {
        let hash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = hash.blockhash;
        const sign = await sendAndConfirmTransaction(
          connection,
          transaction,
          [USER_KEYPAIR],
          { skipPreflight: true }
        );
        console.log(
          'signature tx url:: ',
          `https://solscan.io/tx/${sign}?cluster=devnet`
        );

        closeAllPositionsAndSellAllAssets(USER_KEYPAIR.publicKey, client);
      }
    } catch (error) {
      console.error('could not liquidate ::: ', error);
    }
  }
};

// setInterval(() => {
//   main()
// }, 1 * 60 * 1000);