import { Connection, PublicKey } from '@solana/web3.js';
import { programId } from '../../constants';
import { MARGIN_DATA_LAYOUT } from '../../layout/xenonLayout';

export const getTraderMarginPDA = async (
  connection: Connection,
  trader: PublicKey
): Promise<PublicKey | undefined> => {
  const marginAccounts = await connection.getProgramAccounts(programId, {
    filters: [
      {
        memcmp: {
          offset: MARGIN_DATA_LAYOUT.offsetOf('owner'),
          bytes: trader.toString(),
        },
      },
    ],
    commitment: 'processed',
  });

  if (marginAccounts.length == 0) return undefined;
  let firstMarginAcc = { account_id: 10 ** 30, index: 0 };
  let xenonDatas = [];
  for (let i = 0; i < marginAccounts.length; i++) {
    let xenonInfo = await connection.getAccountInfo(
      marginAccounts[i].pubkey,
      'processed'
    );
    if (xenonInfo) {
      let data = MARGIN_DATA_LAYOUT.decode(xenonInfo.data);
      xenonDatas.push(data);
      if (data.account_id <= firstMarginAcc.account_id) {
        firstMarginAcc.account_id = data.account_id;
        firstMarginAcc.index = i;
      }
    }
  }
  return marginAccounts[firstMarginAcc.index].pubkey;
};
