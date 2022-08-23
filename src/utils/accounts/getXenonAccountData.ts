import { Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { XENON_DATA_LAYOUT } from '../../layout/xenonLayout';

interface DECIMALS {
  value: BN;
  scale: number;
}
interface TOKEN {
  token_type: number;
  decimals: number;
  is_active: number;
  adapter_used: number[];
  mint: PublicKey;
  account_1: PublicKey;
  account_2: PublicKey;
  account_3: PublicKey;
  price: DECIMALS;
  asset_weight: DECIMALS;
}

interface XENON_DATA {
  is_initialized: number;
  bump: number;
  account_id_count: number;
  padding: number[];
  admin: PublicKey;
  vault: PublicKey;
  mint_key: PublicKey;
  total_deposits: number;
  total_borrows: number;
  maint_coll_ratio: number;
  init_coll_ratio: number;
  deposit_index: number;
  borrow_index: number;
  last_updated: BN;
  program_ids: PublicKey[];
  token_list: TOKEN[];
  xpadding: BN[];
}

export const getXenonAccountData = async (
  connection: Connection,
  xenonPDA: PublicKey
): Promise<XENON_DATA> => {
  const res = await connection.getAccountInfo(xenonPDA, 'processed');
  const data: XENON_DATA = XENON_DATA_LAYOUT.decode(res?.data);
  return data;
};
