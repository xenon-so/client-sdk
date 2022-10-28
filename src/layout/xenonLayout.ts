// @ts-nocheck
import { Blob, seq, struct, u32, u8, u16, nu64, ns64  } from 'buffer-layout';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

class PublicKeyLayout extends Blob {
  constructor(property: string) {
    super(32, property);
  }

  decode(b: Buffer, offset?: number) {
    return new PublicKey(super.decode(b, offset));
  }

  encode(src: any, b: Buffer, offset?: number) {
    return super.encode(src.toBuffer(), b, offset);
  }
}

export function publicKeyLayout(property = '') {
  return new PublicKeyLayout(property);
}

class BNLayout extends Blob {
  constructor(number: number, property: string) {
    super(number, property);
    // restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }

  decode(b: Buffer, offset?: number) {
    return new BN(super.decode(b, offset), 10, 'le');
  }

  encode(src: BN, b: Buffer, offset?: number) {
    return super.encode(src.toArrayLike(Buffer, 'le', this['span']), b, offset);
  }
}

class U64F64Layout extends Blob {
  constructor(property: string) {
    super(16, property);
  }

  decode(b: Buffer, offset?: number) {
    const raw = new BN(super.decode(b, offset), 10, 'le');

    // @ts-ignore
    return raw / Math.pow(2, 64);
  }

  encode(src: BN, b: Buffer, offset?: number) {
    return super.encode(src.toArrayLike(Buffer, 'le', this['span']), b, offset);
  }
}

class DecimalsLayout extends Blob {
  constructor(property: string) {
    super(16, property);
  }

  decode(b: Buffer, offset?: number) {
    const raw = new BN(super.decode(b, offset), 10, 'le');

    // @ts-ignore
    return raw / Math.pow(2, 32);
  }

  encode(src: BN, b: Buffer, offset?: number) {
    return super.encode(src.toArrayLike(Buffer, 'le', this['span']), b, offset);
  }
}

export function U64F64(property = '') {
  return new U64F64Layout(property);
}

export function u64(property = '') {
  return new BNLayout(8, property);
}

export function u128(property = '') {
  return new BNLayout(16, property);
}

export function U128U8(property = '') {
  return new DecimalsLayout(property);
}
export function i32(property = "") {
  return new BNLayout(4, property, true);
}

const Decimal = [u128('val'), u8('scale')];


// SPL 
export const TOKEN_ACCOUNT_LAYOUT = struct([
  publicKeyLayout('mint'),
  publicKeyLayout('owner'),
  nu64('amount'),
  u32('delegateOption'),
  publicKeyLayout('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKeyLayout('closeAuthority'),
]);

// SPL
export const ACCOUNT_LAYOUT = struct([
  publicKeyLayout('mint'),
  publicKeyLayout('owner'),
  u64('amount'),
  u32('delegateOption'),
  publicKeyLayout('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKeyLayout('closeAuthority'),
]);


export const ADAPTER_INFO_LAYOUT = struct([
  u8('status'),
  struct(Decimal, 'weight'),
  publicKeyLayout('program_id'),
]);

export const RESERVE_INFO_LAYOUT = struct([
  u8('isActive'),
  u8('tokenIndex'),
  publicKeyLayout('mint_key'),
  publicKeyLayout('vault'),
  publicKeyLayout('fee'),

  struct(Decimal, 'deposits'),
  struct(Decimal, 'borrows'),

  struct(Decimal, 'deposit_index'),
  struct(Decimal, 'borrow_index'),

  u64('borrow_limit'),
  u64('last_updated_ts'),
]);

export const TOKEN_INFO_LAYOUT = struct([
  u8('token_type'),
  u8('decimals'),
  u8('is_active'),
  seq(u8(), 16, 'adapter_used'),
  publicKeyLayout('mint'),
  seq(publicKeyLayout(), 3, 'accounts'),
  struct(Decimal, 'price'),
  struct(Decimal, 'asset_weight'),
  u64('last_updated_slot'),
]);

export const XENON_DATA_LAYOUT = struct([
  u8('is_initialized'),
  u8('magic'),
  u8('bump'),
  u8('token_count'),
  u32('account_id_count'),
  publicKeyLayout('admin'),

  seq(RESERVE_INFO_LAYOUT, 2, 'reserve'),
  seq(ADAPTER_INFO_LAYOUT, 16, 'adapters'),
  seq(TOKEN_INFO_LAYOUT, 32, 'token_list'),

  seq(u64(), 64, 'xpadding'),
]);

export const MARGIN_DATA_LAYOUT = struct([
  u8('is_initialized'),
  u8('bump'),
  u8('borrow_active'),
  u8('token_count'),
  u32('account_id'),

  u64('last_updated'),

  publicKeyLayout('xenon_pda'),
  publicKeyLayout('owner'),
  seq(
    struct([
      u8('is_active'),
      u8('index'),
      seq(u8(), 6, 'padding'),

      publicKeyLayout('vault'),
    ]),
    16,
    'tokens'
  ),
  seq(u8(), 16, 'active_adapters'),
  // pub val: u128,
  // pub scale: u8,
  struct([u128('val'), u8('scale')], 'assets'),
  // decimalLayout('assets'),
  seq(struct([u128('val'), u8('scale')]), 2, 'borrows'),
  seq(u8(), 19, 'swap_guard'),
]);

export const QUARRY_CHECK_DATA = struct([seq(publicKeyLayout(), 16, 'miners')]);

export const ADAPTER_ACCOUNT_LAYOUT = struct([
  u8('is_initialized'),
  u8('bump'),
  u8('adapter_type'),
  publicKeyLayout('owner'),

  u8('count'),
  seq(publicKeyLayout(), 16, 'mints'),
  seq(u64(), 16, 'balances'),

  publicKeyLayout('check_account'),
]);

export const SOLEND_ADAPTER_ACCOUNT = struct([
  u8('is_initialized'),
  u8('bump'),
  u8('status'),
  u8('adapter'),
  u8('count'),
  publicKeyLayout('admin'),

  publicKeyLayout('lending_market'),
  seq(publicKeyLayout(), 16, 'mints'),
  seq(publicKeyLayout(), 8, 'reserves'),
]);

export const SABER_ADAPTER_ACCOUNT = struct([
  u8('is_initialized'),
  u8('bump'),
  u8('status'),
  u8('adapter'),
  u8('count'),
  publicKeyLayout('admin'),

  seq(publicKeyLayout(), 16, 'swap_infos'),
  seq(publicKeyLayout(), 16, 'mints'),
]);

export const QUARRY_ADAPTER_ACCOUNT = struct([
  u8('is_initialized'),
  u8('bump'),
  u8('status'),
  u8('adapter'),
  u8('count'),
  publicKeyLayout('admin'),
  publicKeyLayout('rewarder_account'),

  seq(publicKeyLayout(), 16, 'quarries'),
  seq(publicKeyLayout(), 16, 'mints'),
]);


export const MANGO_ADAPTER_ACCOUNT_LAYOUT = struct([
  u8('is_initialized'),
  u8('bump'),
  u8('status'),
  u8('adapter_type'),
  u8('mint_count'),
  u8('perp_count'),
  publicKeyLayout('admin'),
  publicKeyLayout('mango_group'),

  seq(publicKeyLayout(), 16, 'mints'),
  seq(u8(), 16, 'mango_ids'),
  seq(publicKeyLayout(), 16, 'perp_markets'),
]);

export const MANGO_ADAPTOR_CHECK_ACCOUNT = struct([
  publicKeyLayout('mango_account'),
]);

export const SOLEND_ADAPTOR_CHECK_ACCOUNT = struct([
  seq(publicKeyLayout(), 2, 'lending_market'),
  seq(
    struct([
      publicKeyLayout('lending_market'),
      seq(publicKeyLayout(), 16, 'reserve'),
    ]),
    2,
    'reserve_info'
  ),
]);

// pub struct Quarry {
//   pub rewarder: Pubkey,
//   pub token_mint_key: Pubkey,
//   pub bump: u8,
//   pub index: u16,
//   pub token_mint_decimals: u8, // This field is never used.
//   pub famine_ts: i64,
//   pub last_update_ts: i64,
//   pub rewards_per_token_stored: u128,
//   pub annual_rewards_rate: u64,
//   pub rewards_share: u64,
//   pub total_tokens_deposited: u64,
//   pub num_miners: u64,
// }

// quarry Protocol
export const QUARRY_ACCOUNT = struct([
  u64('dummy'),
  publicKeyLayout('rewarder'),
  publicKeyLayout('token_mint_key'),
  u8('bump'),
  u16('index'),
  u8('token_mint_decimals'),
  u64('famine_ts'),
  u64('last_update_ts'),
  u128('rewards_per_token_stored'),
  u64('annual_rewards_rate'),
  u64('rewards_share'),
  u64('total_tokens_deposited'),
  u64('num_miners'),
]);
// quarry Protocol
export const QUARRY_MINER_ACCOUNT = struct([
  u64('dummy'),
  publicKeyLayout('quarry'),
  publicKeyLayout('authority'),
  u8('bump'),
  publicKeyLayout('token_vault_key'),
  u64('rewards_earned'),
  u128('rewards_per_token_paid'),
  u64('balance'),
  u64('index'),
]);
// quarry Protocol
export const QUARRY_REWARDER_ACCOUNT = struct([
  u64('dummy'),
  publicKeyLayout('base'),
  u8('bump'),
  publicKeyLayout('authority'),
  publicKeyLayout('pending_authority'),
  u16('num_quarries'),
  u64('annual_rewards_rate'),
  u64('total_rewards_shares'),
  publicKeyLayout('mint_wrapper'),
  publicKeyLayout('rewards_token_mint'),
  publicKeyLayout('claim_fee_token_account'),
  u64('max_claim_fee_millibps'),
  publicKeyLayout('pause_authority'),
  u8('is_paused'),
]);


export const ORCA_ADAPTER_ACCOUNT = struct([
  u8('is_initialized'),
  u8('bump'),
  u8('status'),
  u8('adapter'),
  u8('count'),
  publicKeyLayout('admin'),

  seq(publicKeyLayout(), 16, 'whirlpools'),
  seq(publicKeyLayout(), 16, 'mints'),
])

export const ORCA_POSITION_LAYOUT = struct([
  u8('is_initialized'),
  u8('position_index'), 
  seq(u8(), 6, 'padding'),

  publicKeyLayout('position_mint'),
  publicKeyLayout('whirlpool'),
  
  i32('tick_lower_index'),
  i32('tick_upper_index'),

  u128('liquidity'),
])

export const ORCA_CHECK_ACCOUNT = struct([
  // u16('position_count'),
  // u16('position_size_count'), 
  // u32('account_size'),
  seq(ORCA_POSITION_LAYOUT, 2, 'positions'),
])

