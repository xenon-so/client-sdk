import { Wallet } from '@project-serum/anchor';
import { Connection, Keypair, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { closeAllPositionsAndSellAllAssets } from './templates/liquidator';
import { XenonLiquidatorClient } from './xenonLiquidatorClient';

const main2 = async () => {
  const WALLET_PRIVATE_KEY =
    '3s';
  // console.log("WALLET_PRIVATE_KEY::",process.env.WALLET_PRIVATE_KEY)
  const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
  const USER_KEYPAIR = Keypair.fromSecretKey(USER_PRIVATE_KEY);

  const wallet = new Wallet(USER_KEYPAIR);
  const connection = new Connection(
    'https://investinpro.genesysgo.net',
    'processed'
  );
  const client = new XenonLiquidatorClient(connection, USER_KEYPAIR.publicKey);
  await client.load();

  await closeAllPositionsAndSellAllAssets(USER_KEYPAIR.publicKey, client);
};
// main2()
