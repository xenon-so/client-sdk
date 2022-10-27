// import { AnchorProvider, getProvider } from '@project-serum/anchor';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
// import bs58 from 'bs58';
// import { ORCA_POSITION_LAYOUT } from './layout/xenonLayout';
// import { closeAllPositionsAndSellAllAssets } from './templates/liquidator';
// import { XenonLiquidatorClient } from './xenonLiquidatorClient';
// import { Provider } from "@project-serum/anchor";
// import { MangoAccountLayout, MangoClient } from '@blockworks-foundation/mango-client';
// import { MANGO_GROUP_ACCOUNT_V3, MANGO_PROGRAM_ID_V3 } from './constants';
import { buildWhirlpoolClient, ORCA_WHIRLPOOL_PROGRAM_ID, WhirlpoolContext } from '@orca-so/whirlpools-sdk';

// Anchor Wallet Definition

// export interface Wallet {
//     signTransaction(tx: Transaction): Promise<Transaction>;
//     signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
//     publicKey: PublicKey;
// }
// export const Wallet :any = {
//     // signTransaction : new Promise(new Transaction()),
//     // signAllTransactions : [],
//     publicKey: new PublicKey('...')
// }   

const main2 = async () => {
  // const WALLET_PRIVATE_KEY =
  //   '3s';
  // console.log("WALLET_PRIVATE_KEY::",process.env.WALLET_PRIVATE_KEY)
  // const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
  // const USER_KEYPAIR = Keypair.fromSecretKey(USER_PRIVATE_KEY);

  // const wallet = new Wallet(USER_KEYPAIR);
  const connection = new Connection(
    'https://investinpro.genesysgo.net',
    'processed'
  );
  // const client = new XenonLiquidatorClient(connection, USER_KEYPAIR.publicKey);
  // await client.load();

  // await closeAllPositionsAndSellAllAssets(USER_KEYPAIR.publicKey, client);

  // const provider = getProvider()
  // const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());

  //  const x = new Wallet(Keypair.generate())
    // const ctx = WhirlpoolContext.from(connection, Wallet, ORCA_WHIRLPOOL_PROGRAM_ID);
    // const client = buildWhirlpoolClient(ctx);
    // const pool = await client.getPool("HJPjoWUrhoZzkNfRpHuieeFk9WcZWjwy6PBjZ81ngndJ");
    // const poolData = pool.getData();
    // console.log("poolData:",poolData)

    // const position = await client.getPosition('BKu6Q66cR1Map8j6nNG4EMs7KY32GMohGTxAwvQtVNuJ');
    // const positionData = position.getData()
    // console.log("positionData:",positionData)

  //  pos : BKu6Q66cR1Map8j6nNG4EMs7KY32GMohGTxAwvQtVNuJ
  // posTA : FTt83v32M7s3BxPHH2EJgx3Qa8NZzDB2dNwbBsA8Vqr4
  // const info = await connection.getAccountInfo(new PublicKey('BKu6Q66cR1Map8j6nNG4EMs7KY32GMohGTxAwvQtVNuJ'));
  // console.log("span :",ORCA_POSITION_LAYOUT.span);
  // const data = ORCA_POSITION_LAYOUT.decode(info.data);
  // console.log("data:",data);
  // console.log("liq:",data.whirlpool.toBase58());
  // console.log("liq:",data.liquidity.toString());
  // console.log("liq:",data.liquidity.toString());

  

  // // Derive the Whirlpool address from token mints
  // const orca = new OrcaWhirlpoolClient({ network: OrcaNetwork.MAINNET });
  // orca.position.
  // const poolAddress = await orca.pool.derivePDA(ORCA_MINT, USDC_MINT, false)
  //   .publicKey;

  // // Fetch an instance of the pool
  // const poolData = await orca.getPool(poolAddress);
  // if (!poolData) {
  //   return;
  // }
  // console.log(poolData.liquidity);
  // console.log(poolData.price);
  // console.log(poolData.tokenVaultAmountA);
  // console.log(poolData.tokenVaultAmountB);

    // const client = new MangoClient(connection, MANGO_PROGRAM_ID_V3);
    // const mangoGroup = await client.getMangoGroup(MANGO_GROUP_ACCOUNT_V3);

    // const x = await client.getMangoAccountsForOwner(mangoGroup, new PublicKey('4eCkG6WcTHWoyWTeN6RCZi3s3twtsLwgG486xocpKAw7'))
    // console.log("x::",x.length);
    // for(let i=0;i<x.length;i++){
    //   console.log("i:",i,x[i].publicKey.toBase58())
    // }


};
// main2()
