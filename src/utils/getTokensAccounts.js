"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getTokenAccountInfo = exports.getOwnedTokenAccounts = exports.getOwnedAccountsFilters = exports.parseTokenAccountData = void 0;
var mango_client_1 = require("@blockworks-foundation/mango-client");
var web3_js_1 = require("@solana/web3.js");
var bignumber_js_1 = require("bignumber.js");
var buffer_layout_1 = require("buffer-layout");
var constants_1 = require("../constants");
var tokens_1 = require("./tokens");
var TOKEN_ACCOUNT_LAYOUT = (0, buffer_layout_1.struct)([
    (0, mango_client_1.publicKeyLayout)('mint'),
    (0, mango_client_1.publicKeyLayout)('owner'),
    (0, buffer_layout_1.nu64)('amount'),
    (0, buffer_layout_1.u32)('delegateOption'),
    (0, mango_client_1.publicKeyLayout)('delegate'),
    (0, buffer_layout_1.u8)('state'),
    (0, buffer_layout_1.u32)('isNativeOption'),
    (0, mango_client_1.u64)('isNative'),
    (0, mango_client_1.u64)('delegatedAmount'),
    (0, buffer_layout_1.u32)('closeAuthorityOption'),
    (0, mango_client_1.publicKeyLayout)('closeAuthority'),
]);
function parseTokenAccountData(data) {
    var _a = TOKEN_ACCOUNT_LAYOUT.decode(data), mint = _a.mint, owner = _a.owner, amount = _a.amount;
    var tokenInfo = Object.values(tokens_1.TOKENS).find(function (f) { return f.mintAddress === mint.toBase58(); });
    var decimals = tokenInfo ? tokenInfo.decimals : 6;
    return {
        mint: new web3_js_1.PublicKey(mint),
        owner: new web3_js_1.PublicKey(owner),
        amount: amount,
        uiAmount: new bignumber_js_1["default"](amount).div(new bignumber_js_1["default"](Math.pow(10, decimals))).toNumber()
    };
}
exports.parseTokenAccountData = parseTokenAccountData;
function getOwnedAccountsFilters(publicKey) {
    return [
        {
            memcmp: {
                offset: TOKEN_ACCOUNT_LAYOUT.offsetOf('owner'),
                bytes: publicKey.toBase58()
            }
        },
        {
            dataSize: TOKEN_ACCOUNT_LAYOUT.span
        },
    ];
}
exports.getOwnedAccountsFilters = getOwnedAccountsFilters;
function getOwnedTokenAccounts(connection, publicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var filters, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filters = getOwnedAccountsFilters(publicKey);
                    return [4 /*yield*/, connection.getProgramAccounts(constants_1.TOKEN_PROGRAM_ID, {
                            filters: filters
                        })];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp.map(function (_a) {
                            var pubkey = _a.pubkey, _b = _a.account, data = _b.data, executable = _b.executable, owner = _b.owner, lamports = _b.lamports;
                            return ({
                                publicKey: new web3_js_1.PublicKey(pubkey),
                                accountInfo: {
                                    data: data,
                                    executable: executable,
                                    owner: new web3_js_1.PublicKey(owner),
                                    lamports: lamports
                                }
                            });
                        })];
            }
        });
    });
}
exports.getOwnedTokenAccounts = getOwnedTokenAccounts;
function getTokenAccountInfo(connection, ownerAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var splAccounts, parsedSplAccounts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!ownerAddress)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, Promise.all([
                            getOwnedTokenAccounts(connection, ownerAddress),
                        ])];
                case 1:
                    splAccounts = (_a.sent())[0];
                    parsedSplAccounts = splAccounts.map(function (_a) {
                        var publicKey = _a.publicKey, accountInfo = _a.accountInfo;
                        var tokenInfo = Object.values(tokens_1.TOKENS).find(function (i) {
                            return i.mintAddress ===
                                parseTokenAccountData(accountInfo.data).mint.toBase58();
                        });
                        return {
                            pubkey: publicKey,
                            account: accountInfo,
                            parsedAccountInfo: parseTokenAccountData(accountInfo.data),
                            effectiveMint: parseTokenAccountData(accountInfo.data).mint,
                            tokenInfo: tokenInfo
                        };
                    });
                    return [2 /*return*/, parsedSplAccounts.filter(function (f) {
                            return Object.values(tokens_1.TOKENS)
                                .map(function (k) { return k.mintAddress; })
                                .includes(f.parsedAccountInfo.mint.toBase58());
                        })];
            }
        });
    });
}
exports.getTokenAccountInfo = getTokenAccountInfo;
