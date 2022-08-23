import {
  PublicKey,
  RpcResponseAndContext,
  TokenAmount,
  AccountInfo,
} from '@solana/web3.js';
import { quarryProgramId } from '../constants';
import {
  buildGetTokenSupply,
  buildGetTokenAccountBalance,
  buildGetAccountInfo,
  decodeTokenSupplyResponse,
  decodeTokenAccountBalanceResponse,
  splitToChunks,
  decodeAccountInfoResponse,
} from '../rpcUtils';
import { SABER_LP_LIST, Saber_LP } from './saberList';
import { findAssociatedTokenAddress } from './web3Utils';
import fetch from 'cross-fetch';

export const getSaberData = async (marginPK: PublicKey) => {
  const requests = [];
  for (let i = 0; i < SABER_LP_LIST.length; i++) {
    const pool: Saber_LP = SABER_LP_LIST[i];
    requests.push(buildGetTokenSupply(new PublicKey(pool.lpToken.address)));
  }

  for (let i = 0; i < SABER_LP_LIST.length; i++) {
    const pool: Saber_LP = SABER_LP_LIST[i];
    requests.push(buildGetTokenAccountBalance(pool.swap.state.tokenA.reserve));
    requests.push(buildGetTokenAccountBalance(pool.swap.state.tokenB.reserve));
  }

  for (let i = 0; i < SABER_LP_LIST.length; i++) {
    const pool: Saber_LP = SABER_LP_LIST[i];

    const quarryAccount = new PublicKey(pool.quarry);
    // const quarryInfo = await connection.getAccountInfo(quarryAccount, 'processed');
    const minerAccount = await PublicKey.findProgramAddress(
      [Buffer.from('Miner'), quarryAccount.toBuffer(), marginPK.toBuffer()],
      quarryProgramId
    );
    const minerVault = await findAssociatedTokenAddress(
      minerAccount[0],
      new PublicKey(pool.lpToken.address)
    );

    requests.push(buildGetAccountInfo(quarryAccount));
    // await connection.getTokenAccountBalance(minerVault, 'processed')
    requests.push(buildGetTokenAccountBalance(minerVault.toBase58()));

    requests.push(buildGetAccountInfo(minerAccount[0]));
  }

  const baseRequestsData: any[] = await (
    await fetch('https://ssc-dao.genesysgo.net', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requests),
    })
  ).json();

  const supplyTokens = baseRequestsData
    .slice(0, SABER_LP_LIST.length)
    .map((f) => decodeTokenSupplyResponse(f));
  const reserveBalances = baseRequestsData
    .slice(SABER_LP_LIST.length, SABER_LP_LIST.length * 3)
    .map((f) => decodeTokenAccountBalanceResponse(f));
  const remaining = baseRequestsData.slice(SABER_LP_LIST.length * 3);
  const parsedData: {
    lpTokenSupply: RpcResponseAndContext<TokenAmount>;
    tokenAReserveBalance: RpcResponseAndContext<TokenAmount> | undefined;
    tokenBReserveBalance: RpcResponseAndContext<TokenAmount> | undefined;
    quarryAccountInfo: AccountInfo<Buffer> | null;
    minerVaultBalance: RpcResponseAndContext<TokenAmount> | undefined;
    minerAccountInfo: AccountInfo<Buffer> | null;
  }[] = [];

  const reserveBalancesChunks = splitToChunks(reserveBalances, 3);
  const last3s = splitToChunks(remaining, 3);
  for (let i = 0; i < SABER_LP_LIST.length; i++) {
    parsedData.push({
      lpTokenSupply: supplyTokens[i],
      tokenAReserveBalance: reserveBalancesChunks[i][0],
      tokenBReserveBalance: reserveBalancesChunks[i][1],
      quarryAccountInfo: decodeAccountInfoResponse(last3s[i][0]),
      minerVaultBalance: decodeTokenAccountBalanceResponse(last3s[i][1]),
      minerAccountInfo: decodeAccountInfoResponse(last3s[i][2]),
    });
  }
  return parsedData;
};
