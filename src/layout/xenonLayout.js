"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.ORCA_CHECK_ACCOUNT = exports.ORCA_POSITION_LAYOUT = exports.ORCA_ADAPTER_ACCOUNT = exports.QUARRY_REWARDER_ACCOUNT = exports.QUARRY_MINER_ACCOUNT = exports.QUARRY_ACCOUNT = exports.SOLEND_ADAPTOR_CHECK_ACCOUNT = exports.MANGO_ADAPTOR_CHECK_ACCOUNT = exports.MANGO_ADAPTER_ACCOUNT_LAYOUT = exports.QUARRY_ADAPTER_ACCOUNT = exports.SABER_ADAPTER_ACCOUNT = exports.SOLEND_ADAPTER_ACCOUNT = exports.ADAPTER_ACCOUNT_LAYOUT = exports.QUARRY_CHECK_DATA = exports.MARGIN_DATA_LAYOUT = exports.XENON_DATA_LAYOUT = exports.TOKEN_INFO_LAYOUT = exports.RESERVE_INFO_LAYOUT = exports.ADAPTER_INFO_LAYOUT = exports.ACCOUNT_LAYOUT = exports.TOKEN_ACCOUNT_LAYOUT = exports.i32 = exports.U128U8 = exports.u128 = exports.u64 = exports.U64F64 = exports.publicKeyLayout = void 0;
// @ts-nocheck
var buffer_layout_1 = require("buffer-layout");
var web3_js_1 = require("@solana/web3.js");
var bn_js_1 = require("bn.js");
var PublicKeyLayout = /** @class */ (function (_super) {
    __extends(PublicKeyLayout, _super);
    function PublicKeyLayout(property) {
        return _super.call(this, 32, property) || this;
    }
    PublicKeyLayout.prototype.decode = function (b, offset) {
        return new web3_js_1.PublicKey(_super.prototype.decode.call(this, b, offset));
    };
    PublicKeyLayout.prototype.encode = function (src, b, offset) {
        return _super.prototype.encode.call(this, src.toBuffer(), b, offset);
    };
    return PublicKeyLayout;
}(buffer_layout_1.Blob));
function publicKeyLayout(property) {
    if (property === void 0) { property = ''; }
    return new PublicKeyLayout(property);
}
exports.publicKeyLayout = publicKeyLayout;
var BNLayout = /** @class */ (function (_super) {
    __extends(BNLayout, _super);
    function BNLayout(number, property) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, number, property) || this;
        // restore prototype chain
        Object.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    BNLayout.prototype.decode = function (b, offset) {
        return new bn_js_1["default"](_super.prototype.decode.call(this, b, offset), 10, 'le');
    };
    BNLayout.prototype.encode = function (src, b, offset) {
        return _super.prototype.encode.call(this, src.toArrayLike(Buffer, 'le', this['span']), b, offset);
    };
    return BNLayout;
}(buffer_layout_1.Blob));
var U64F64Layout = /** @class */ (function (_super) {
    __extends(U64F64Layout, _super);
    function U64F64Layout(property) {
        return _super.call(this, 16, property) || this;
    }
    U64F64Layout.prototype.decode = function (b, offset) {
        var raw = new bn_js_1["default"](_super.prototype.decode.call(this, b, offset), 10, 'le');
        // @ts-ignore
        return raw / Math.pow(2, 64);
    };
    U64F64Layout.prototype.encode = function (src, b, offset) {
        return _super.prototype.encode.call(this, src.toArrayLike(Buffer, 'le', this['span']), b, offset);
    };
    return U64F64Layout;
}(buffer_layout_1.Blob));
var DecimalsLayout = /** @class */ (function (_super) {
    __extends(DecimalsLayout, _super);
    function DecimalsLayout(property) {
        return _super.call(this, 16, property) || this;
    }
    DecimalsLayout.prototype.decode = function (b, offset) {
        var raw = new bn_js_1["default"](_super.prototype.decode.call(this, b, offset), 10, 'le');
        // @ts-ignore
        return raw / Math.pow(2, 32);
    };
    DecimalsLayout.prototype.encode = function (src, b, offset) {
        return _super.prototype.encode.call(this, src.toArrayLike(Buffer, 'le', this['span']), b, offset);
    };
    return DecimalsLayout;
}(buffer_layout_1.Blob));
function U64F64(property) {
    if (property === void 0) { property = ''; }
    return new U64F64Layout(property);
}
exports.U64F64 = U64F64;
function u64(property) {
    if (property === void 0) { property = ''; }
    return new BNLayout(8, property);
}
exports.u64 = u64;
function u128(property) {
    if (property === void 0) { property = ''; }
    return new BNLayout(16, property);
}
exports.u128 = u128;
function U128U8(property) {
    if (property === void 0) { property = ''; }
    return new DecimalsLayout(property);
}
exports.U128U8 = U128U8;
function i32(property) {
    if (property === void 0) { property = ""; }
    return new BNLayout(4, property, true);
}
exports.i32 = i32;
var Decimal = [u128('val'), (0, buffer_layout_1.u8)('scale')];
// SPL 
exports.TOKEN_ACCOUNT_LAYOUT = (0, buffer_layout_1.struct)([
    publicKeyLayout('mint'),
    publicKeyLayout('owner'),
    (0, buffer_layout_1.nu64)('amount'),
    (0, buffer_layout_1.u32)('delegateOption'),
    publicKeyLayout('delegate'),
    (0, buffer_layout_1.u8)('state'),
    (0, buffer_layout_1.u32)('isNativeOption'),
    u64('isNative'),
    u64('delegatedAmount'),
    (0, buffer_layout_1.u32)('closeAuthorityOption'),
    publicKeyLayout('closeAuthority'),
]);
// SPL
exports.ACCOUNT_LAYOUT = (0, buffer_layout_1.struct)([
    publicKeyLayout('mint'),
    publicKeyLayout('owner'),
    u64('amount'),
    (0, buffer_layout_1.u32)('delegateOption'),
    publicKeyLayout('delegate'),
    (0, buffer_layout_1.u8)('state'),
    (0, buffer_layout_1.u32)('isNativeOption'),
    u64('isNative'),
    u64('delegatedAmount'),
    (0, buffer_layout_1.u32)('closeAuthorityOption'),
    publicKeyLayout('closeAuthority'),
]);
exports.ADAPTER_INFO_LAYOUT = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('status'),
    (0, buffer_layout_1.struct)(Decimal, 'weight'),
    publicKeyLayout('program_id'),
]);
exports.RESERVE_INFO_LAYOUT = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('isActive'),
    (0, buffer_layout_1.u8)('tokenIndex'),
    publicKeyLayout('mint_key'),
    publicKeyLayout('vault'),
    publicKeyLayout('fee'),
    (0, buffer_layout_1.struct)(Decimal, 'deposits'),
    (0, buffer_layout_1.struct)(Decimal, 'borrows'),
    (0, buffer_layout_1.struct)(Decimal, 'deposit_index'),
    (0, buffer_layout_1.struct)(Decimal, 'borrow_index'),
    u64('borrow_limit'),
    u64('last_updated_ts'),
]);
exports.TOKEN_INFO_LAYOUT = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('token_type'),
    (0, buffer_layout_1.u8)('decimals'),
    (0, buffer_layout_1.u8)('is_active'),
    (0, buffer_layout_1.seq)((0, buffer_layout_1.u8)(), 16, 'adapter_used'),
    publicKeyLayout('mint'),
    (0, buffer_layout_1.seq)(publicKeyLayout(), 3, 'accounts'),
    (0, buffer_layout_1.struct)(Decimal, 'price'),
    (0, buffer_layout_1.struct)(Decimal, 'asset_weight'),
    u64('last_updated_slot'),
]);
exports.XENON_DATA_LAYOUT = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('is_initialized'),
    (0, buffer_layout_1.u8)('magic'),
    (0, buffer_layout_1.u8)('bump'),
    (0, buffer_layout_1.u8)('token_count'),
    (0, buffer_layout_1.u32)('account_id_count'),
    publicKeyLayout('admin'),
    (0, buffer_layout_1.seq)(exports.RESERVE_INFO_LAYOUT, 2, 'reserve'),
    (0, buffer_layout_1.seq)(exports.ADAPTER_INFO_LAYOUT, 16, 'adapters'),
    (0, buffer_layout_1.seq)(exports.TOKEN_INFO_LAYOUT, 32, 'token_list'),
    (0, buffer_layout_1.seq)(u64(), 64, 'xpadding'),
]);
exports.MARGIN_DATA_LAYOUT = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('is_initialized'),
    (0, buffer_layout_1.u8)('bump'),
    (0, buffer_layout_1.u8)('borrow_active'),
    (0, buffer_layout_1.u8)('token_count'),
    (0, buffer_layout_1.u32)('account_id'),
    u64('last_updated'),
    publicKeyLayout('xenon_pda'),
    publicKeyLayout('owner'),
    (0, buffer_layout_1.seq)((0, buffer_layout_1.struct)([
        (0, buffer_layout_1.u8)('is_active'),
        (0, buffer_layout_1.u8)('index'),
        (0, buffer_layout_1.seq)((0, buffer_layout_1.u8)(), 6, 'padding'),
        publicKeyLayout('vault'),
    ]), 16, 'tokens'),
    (0, buffer_layout_1.seq)((0, buffer_layout_1.u8)(), 16, 'active_adapters'),
    // pub val: u128,
    // pub scale: u8,
    (0, buffer_layout_1.struct)([u128('val'), (0, buffer_layout_1.u8)('scale')], 'assets'),
    // decimalLayout('assets'),
    (0, buffer_layout_1.seq)((0, buffer_layout_1.struct)([u128('val'), (0, buffer_layout_1.u8)('scale')]), 2, 'borrows'),
    (0, buffer_layout_1.seq)((0, buffer_layout_1.u8)(), 19, 'swap_guard'),
]);
exports.QUARRY_CHECK_DATA = (0, buffer_layout_1.struct)([(0, buffer_layout_1.seq)(publicKeyLayout(), 16, 'miners')]);
exports.ADAPTER_ACCOUNT_LAYOUT = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('is_initialized'),
    (0, buffer_layout_1.u8)('bump'),
    (0, buffer_layout_1.u8)('adapter_type'),
    publicKeyLayout('owner'),
    (0, buffer_layout_1.u8)('count'),
    (0, buffer_layout_1.seq)(publicKeyLayout(), 16, 'mints'),
    (0, buffer_layout_1.seq)(u64(), 16, 'balances'),
    publicKeyLayout('check_account'),
]);
exports.SOLEND_ADAPTER_ACCOUNT = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('is_initialized'),
    (0, buffer_layout_1.u8)('bump'),
    (0, buffer_layout_1.u8)('status'),
    (0, buffer_layout_1.u8)('adapter'),
    (0, buffer_layout_1.u8)('count'),
    publicKeyLayout('admin'),
    publicKeyLayout('lending_market'),
    (0, buffer_layout_1.seq)(publicKeyLayout(), 16, 'mints'),
    (0, buffer_layout_1.seq)(publicKeyLayout(), 8, 'reserves'),
]);
exports.SABER_ADAPTER_ACCOUNT = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('is_initialized'),
    (0, buffer_layout_1.u8)('bump'),
    (0, buffer_layout_1.u8)('status'),
    (0, buffer_layout_1.u8)('adapter'),
    (0, buffer_layout_1.u8)('count'),
    publicKeyLayout('admin'),
    (0, buffer_layout_1.seq)(publicKeyLayout(), 16, 'swap_infos'),
    (0, buffer_layout_1.seq)(publicKeyLayout(), 16, 'mints'),
]);
exports.QUARRY_ADAPTER_ACCOUNT = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('is_initialized'),
    (0, buffer_layout_1.u8)('bump'),
    (0, buffer_layout_1.u8)('status'),
    (0, buffer_layout_1.u8)('adapter'),
    (0, buffer_layout_1.u8)('count'),
    publicKeyLayout('admin'),
    publicKeyLayout('rewarder_account'),
    (0, buffer_layout_1.seq)(publicKeyLayout(), 16, 'quarries'),
    (0, buffer_layout_1.seq)(publicKeyLayout(), 16, 'mints'),
]);
exports.MANGO_ADAPTER_ACCOUNT_LAYOUT = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('is_initialized'),
    (0, buffer_layout_1.u8)('bump'),
    (0, buffer_layout_1.u8)('status'),
    (0, buffer_layout_1.u8)('adapter_type'),
    (0, buffer_layout_1.u8)('mint_count'),
    (0, buffer_layout_1.u8)('perp_count'),
    publicKeyLayout('admin'),
    publicKeyLayout('mango_group'),
    (0, buffer_layout_1.seq)(publicKeyLayout(), 16, 'mints'),
    (0, buffer_layout_1.seq)((0, buffer_layout_1.u8)(), 16, 'mango_ids'),
    (0, buffer_layout_1.seq)(publicKeyLayout(), 16, 'perp_markets'),
]);
exports.MANGO_ADAPTOR_CHECK_ACCOUNT = (0, buffer_layout_1.struct)([
    publicKeyLayout('mango_account'),
]);
exports.SOLEND_ADAPTOR_CHECK_ACCOUNT = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.seq)(publicKeyLayout(), 2, 'lending_market'),
    (0, buffer_layout_1.seq)((0, buffer_layout_1.struct)([
        publicKeyLayout('lending_market'),
        (0, buffer_layout_1.seq)(publicKeyLayout(), 16, 'reserve'),
    ]), 2, 'reserve_info'),
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
exports.QUARRY_ACCOUNT = (0, buffer_layout_1.struct)([
    u64('dummy'),
    publicKeyLayout('rewarder'),
    publicKeyLayout('token_mint_key'),
    (0, buffer_layout_1.u8)('bump'),
    (0, buffer_layout_1.u16)('index'),
    (0, buffer_layout_1.u8)('token_mint_decimals'),
    u64('famine_ts'),
    u64('last_update_ts'),
    u128('rewards_per_token_stored'),
    u64('annual_rewards_rate'),
    u64('rewards_share'),
    u64('total_tokens_deposited'),
    u64('num_miners'),
]);
// quarry Protocol
exports.QUARRY_MINER_ACCOUNT = (0, buffer_layout_1.struct)([
    u64('dummy'),
    publicKeyLayout('quarry'),
    publicKeyLayout('authority'),
    (0, buffer_layout_1.u8)('bump'),
    publicKeyLayout('token_vault_key'),
    u64('rewards_earned'),
    u128('rewards_per_token_paid'),
    u64('balance'),
    u64('index'),
]);
// quarry Protocol
exports.QUARRY_REWARDER_ACCOUNT = (0, buffer_layout_1.struct)([
    u64('dummy'),
    publicKeyLayout('base'),
    (0, buffer_layout_1.u8)('bump'),
    publicKeyLayout('authority'),
    publicKeyLayout('pending_authority'),
    (0, buffer_layout_1.u16)('num_quarries'),
    u64('annual_rewards_rate'),
    u64('total_rewards_shares'),
    publicKeyLayout('mint_wrapper'),
    publicKeyLayout('rewards_token_mint'),
    publicKeyLayout('claim_fee_token_account'),
    u64('max_claim_fee_millibps'),
    publicKeyLayout('pause_authority'),
    (0, buffer_layout_1.u8)('is_paused'),
]);
exports.ORCA_ADAPTER_ACCOUNT = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('is_initialized'),
    (0, buffer_layout_1.u8)('bump'),
    (0, buffer_layout_1.u8)('status'),
    (0, buffer_layout_1.u8)('adapter'),
    (0, buffer_layout_1.u8)('count'),
    publicKeyLayout('admin'),
    (0, buffer_layout_1.seq)(publicKeyLayout(), 16, 'whirlpools'),
    (0, buffer_layout_1.seq)(publicKeyLayout(), 16, 'mints'),
]);
exports.ORCA_POSITION_LAYOUT = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('is_initialized'),
    (0, buffer_layout_1.u8)('position_index'),
    (0, buffer_layout_1.seq)((0, buffer_layout_1.u8)(), 6, 'padding'),
    publicKeyLayout('position_mint'),
    publicKeyLayout('whirlpool'),
    (0, buffer_layout_1.i32)('tick_lower_index'),
    (0, buffer_layout_1.i32)('tick_upper_index'),
    u128('liquidity'),
]);
exports.ORCA_CHECK_ACCOUNT = (0, buffer_layout_1.struct)([
    // u16('position_count'),
    // u16('position_size_count'), 
    // u32('account_size'),
    (0, buffer_layout_1.seq)(POSITION_LAYOUT, 2, 'positions'),
]);
