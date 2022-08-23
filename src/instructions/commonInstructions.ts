import {
  AccountMeta,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { programId, xenonPDA } from '../constants';
import { getXenonAccountData } from '../utils/accounts/getXenonAccountData';
import { struct, u8, nu64 } from 'buffer-layout';
import { solendProgramID } from '..';

export const updateGlobalPriceCache = async (
  connection: Connection,
  transaction: Transaction
) => {
  const xenonData: any = await getXenonAccountData(connection, xenonPDA);
  let keys: Array<AccountMeta> = [];
  keys.push({ pubkey: xenonPDA, isSigner: false, isWritable: true });
  for (let i = 0; i < xenonData.token_count; i++) {
    if (xenonData.token_list[i].token_type === 0) {
      keys.push({
        pubkey: xenonData.token_list[i].accounts[0],
        isSigner: false,
        isWritable: true,
      });
      keys.push({
        pubkey: xenonData.token_list[i].accounts[1],
        isSigner: false,
        isWritable: true,
      });
    } else if (xenonData.token_list[i].token_type === 1) {
      keys.push({
        pubkey: xenonData.token_list[i].mint,
        isSigner: false,
        isWritable: true,
      });
      keys.push({
        pubkey: xenonData.token_list[i].accounts[0],
        isSigner: false,
        isWritable: true,
      });
      keys.push({
        pubkey: xenonData.token_list[i].accounts[1],
        isSigner: false,
        isWritable: false,
      });
    } else if (xenonData.token_list[i].token_type === 2) {
      keys.push({
        pubkey: xenonData.token_list[i].accounts[0],
        isSigner: false,
        isWritable: true,
      });
      keys.push({
        pubkey: xenonData.token_list[i].accounts[1],
        isSigner: false,
        isWritable: true,
      });
      keys.push({
        pubkey: xenonData.token_list[i].accounts[2],
        isSigner: false,
        isWritable: true,
      });
      keys.push({
        pubkey: SYSVAR_CLOCK_PUBKEY,
        isSigner: false,
        isWritable: false,
      });
      keys.push({
        pubkey: solendProgramID,
        isSigner: false,
        isWritable: false,
      });
    }
  }

  const dataLayout = struct([u8('instruction')]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 19,
    },
    data
  );
  const instruction = new TransactionInstruction({
    keys,
    programId,
    data,
  });

  transaction.add(instruction);
  const additionalComputeBudgetInstruction = ComputeBudgetProgram.requestUnits({
    units: 800000,
    additionalFee: 0,
  });
  transaction.add(additionalComputeBudgetInstruction);
};
