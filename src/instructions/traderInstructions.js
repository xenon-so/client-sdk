"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.handleOrcaClosePosition = exports.handleOrcaDecreaseLiquidity = exports.handleOrcaCollectRewards = exports.handleOrcaCollectFees = exports.handleOrcaUpdateFeesAndReward = exports.handleOrcaIncreaseLiquidity = exports.handleOrcaOpenPosition = exports.handleInitializeOrcaAdapter = exports.handleQuarryClaimRewards = exports.handleQuarryWithdraw = exports.handleQuarryDeposit = exports.handleInitializeQuarryAdapter = exports.handleQuarryInitMintsInMargin = exports.handleSaberWithdraw = exports.handleSaberDeposit = exports.handleInitializeSaberAdapter2 = exports.handleInitializeSaberAdapter = exports.solendWithdraw = exports.solendDeposit = exports.handleInitializeSolendAdapter2 = exports.handleAddTokenToMargin2 = exports.handleAddTokensToMargin = exports.handleMangoSettleAll = exports.handleMangoPrepCancelOrder = exports.handleMangoPlacePrepOrder = exports.handleMangoWithdraw = exports.handleMangoDeposit = exports.handleInitializeMangoAdapter = exports.updateAccountValuation = exports.withdraw = exports.repay = exports.borrow = exports.deposit = exports.initialiseMarginAccount = void 0;
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var tokens_1 = require("../utils/tokens");
var buffer_layout_1 = require("buffer-layout");
var spl_token_1 = require("@solana/spl-token");
var web3Utils_1 = require("../utils/web3Utils");
var bn_js_1 = require("bn.js");
var xenonLayout_1 = require("../layout/xenonLayout");
var perpMarkets_1 = require("../utils/perpMarkets");
var mango_client_1 = require("@blockworks-foundation/mango-client");
var mangoUtils_1 = require("../utils/mangoUtils");
var solendMarkets_1 = require("../utils/solendMarkets");
var bignumber_js_1 = require("bignumber.js");
var getTokenIndexes_1 = require("../utils/getTokenIndexes");
var isMainnet_1 = require("../isMainnet");
var whirlpools_sdk_1 = require("@orca-so/whirlpools-sdk");
var idsIndex = 0; //0 for maninnet, 2 for devnet
var ids = mango_client_1.IDS['groups'][idsIndex];
var initialiseMarginAccount = function (connection, xenonPDA, xenonPdaData, transaction, payer, currentAccountCount) { return __awaiter(void 0, void 0, void 0, function () {
    var marginAccounts, bnNumber, _a, marginPDA, nonce, dataLayout, data, instruction;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, connection.getProgramAccounts(constants_1.programId, {
                    filters: [
                        {
                            memcmp: {
                                offset: xenonLayout_1.MARGIN_DATA_LAYOUT.offsetOf('owner'),
                                bytes: payer.toString()
                            }
                        },
                    ],
                    commitment: 'processed'
                })];
            case 1:
                marginAccounts = _b.sent();
                if (marginAccounts.length !== 0) {
                    throw new Error('Margin Account already exist!!');
                }
                bnNumber = new bn_js_1["default"](currentAccountCount);
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([bnNumber.toArrayLike(Buffer, 'le', 4)], constants_1.programId)];
            case 2:
                _a = _b.sent(), marginPDA = _a[0], nonce = _a[1];
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('nonce_margin')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 3,
                    nonce_margin: nonce
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [4 /*yield*/, (0, exports.handleAddTokenToMargin2)(connection, xenonPDA, xenonPdaData, marginPDA, payer, new web3_js_1.PublicKey(tokens_1.TOKENS.USDC.mintAddress), transaction)];
            case 3:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.initialiseMarginAccount = initialiseMarginAccount;
var deposit = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, amount, transaction, mint) { return __awaiter(void 0, void 0, void 0, function () {
    var decimals, baseTokenAccount, marginVaultAccount, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!mint)
                    throw new Error("incorrect mint::".concat(mint));
                decimals = (0, tokens_1.getDecimalsFromMint)(mint);
                if (!decimals)
                    throw new Error("mint not found::".concat(mint));
                return [4 /*yield*/, (0, exports.handleAddTokenToMargin2)(connection, xenonPDA, xenonPdaData, marginPDA, payer, new web3_js_1.PublicKey(mint), transaction)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(payer, new web3_js_1.PublicKey(mint))];
            case 2:
                baseTokenAccount = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(mint))];
            case 3:
                marginVaultAccount = _a.sent();
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.nu64)('quantity')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 4,
                    quantity: amount * Math.pow(10, decimals)
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: baseTokenAccount, isSigner: false, isWritable: true },
                        { pubkey: marginVaultAccount, isSigner: false, isWritable: true },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.deposit = deposit;
var borrow = function (connection, xenonPDA, xenonPdaData, marginPDA, amount, payer, mango_account_ai, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var xenonVaultAccount, marginVaultAccount, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.updateAccountValuation)(connection, xenonPDA, xenonPdaData, marginPDA, transaction, mango_account_ai)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(xenonPDA, new web3_js_1.PublicKey(tokens_1.TOKENS.USDC.mintAddress))];
            case 2:
                xenonVaultAccount = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(tokens_1.TOKENS.USDC.mintAddress))];
            case 3:
                marginVaultAccount = _a.sent();
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('index'), (0, buffer_layout_1.nu64)('quantity')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 6,
                    index: 0,
                    quantity: amount * Math.pow(10, tokens_1.TOKENS.USDC.decimals)
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: xenonVaultAccount, isSigner: false, isWritable: true },
                        { pubkey: marginVaultAccount, isSigner: false, isWritable: true },
                        {
                            pubkey: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
                            isSigner: false,
                            isWritable: false
                        },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.borrow = borrow;
var repay = function (connection, xenonPDA, xenonPdaData, marginPDA, amount, payer, mango_account_ai, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var xenonVaultAccount, marginVaultAccount, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.updateAccountValuation)(connection, xenonPDA, xenonPdaData, marginPDA, transaction, mango_account_ai)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(xenonPDA, new web3_js_1.PublicKey(tokens_1.TOKENS.USDC.mintAddress))];
            case 2:
                xenonVaultAccount = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(tokens_1.TOKENS.USDC.mintAddress))];
            case 3:
                marginVaultAccount = _a.sent();
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('index'), (0, buffer_layout_1.nu64)('quantity')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 7,
                    index: 0,
                    quantity: amount * Math.pow(10, tokens_1.TOKENS.USDC.decimals)
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: xenonVaultAccount, isSigner: false, isWritable: true },
                        { pubkey: marginVaultAccount, isSigner: false, isWritable: true },
                        {
                            pubkey: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
                            isSigner: false,
                            isWritable: false
                        },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.repay = repay;
var withdraw = function (connection, xenonPDA, xenonPdaData, marginPDA, amount, payer, mint, transaction, mango_account_ai) { return __awaiter(void 0, void 0, void 0, function () {
    var decimals, baseTokenAccount, marginVaultAccount, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!mint)
                    throw new Error("incorrect mint::".concat(mint));
                decimals = (0, tokens_1.getDecimalsFromMint)(mint);
                if (!decimals)
                    throw new Error("mint not found::".concat(mint));
                return [4 /*yield*/, (0, exports.updateAccountValuation)(connection, xenonPDA, xenonPdaData, marginPDA, transaction, mango_account_ai)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, new web3_js_1.PublicKey(mint), payer, transaction)];
            case 2:
                baseTokenAccount = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(mint))];
            case 3:
                marginVaultAccount = _a.sent();
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.nu64)('quantity')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 5,
                    quantity: amount * Math.pow(10, decimals)
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: marginVaultAccount, isSigner: false, isWritable: true },
                        { pubkey: baseTokenAccount, isSigner: false, isWritable: true },
                        {
                            pubkey: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
                            isSigner: false,
                            isWritable: false
                        },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.withdraw = withdraw;
var updateAccountValuation = function (connection, xenonPDA, xenonPdaData, marginPDA, transaction, mango_account_ai, loadedAccountInfos) { return __awaiter(void 0, void 0, void 0, function () {
    var localQuarryAdapterPDA, quarryCheckPDA, accountInfos, _a, marginDataInfo, marginData, Obj, accountsToBePassed, i, currentAccCount, _b, adapterPDADataInfo, quarryNeedAccounts, checkPDADataInfo, checkPDAData, checkMintsToBePassed, j, ids_1, localMangoAdapterPDA, mangoCheckPDA, mangoNeedAccounts, marginATAs, i, layoutsArr, j, dataLayout, data, keys, instruction, additionalComputeBudgetInstruction;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.quarryAdapterProgramId)];
            case 1:
                localQuarryAdapterPDA = _c.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([localQuarryAdapterPDA[0].toBuffer()], constants_1.quarryAdapterProgramId)];
            case 2:
                quarryCheckPDA = _c.sent();
                if (!(loadedAccountInfos !== null && loadedAccountInfos !== void 0)) return [3 /*break*/, 3];
                _a = loadedAccountInfos;
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, connection.getMultipleAccountsInfo([marginPDA, localQuarryAdapterPDA[0], quarryCheckPDA[0]], 'processed')];
            case 4:
                _a = (_c.sent());
                _c.label = 5;
            case 5:
                accountInfos = _a;
                marginDataInfo = accountInfos[0];
                if (!marginDataInfo)
                    throw new Error('No margin account found!');
                marginData = xenonLayout_1.MARGIN_DATA_LAYOUT.decode(marginDataInfo.data);
                Obj = {};
                accountsToBePassed = [];
                i = 0;
                _c.label = 6;
            case 6:
                if (!(i < xenonPdaData.adapters.length)) return [3 /*break*/, 16];
                currentAccCount = 0;
                if (!marginData.active_adapters[i]) return [3 /*break*/, 14];
                _b = i;
                switch (_b) {
                    case 0: return [3 /*break*/, 7];
                    case 1: return [3 /*break*/, 7];
                    case 2: return [3 /*break*/, 8];
                    case 3: return [3 /*break*/, 9];
                }
                return [3 /*break*/, 12];
            case 7:
                currentAccCount = 0;
                return [3 /*break*/, 13];
            case 8:
                adapterPDADataInfo = accountInfos[1];
                if (!adapterPDADataInfo)
                    throw new Error('No adapterPDADataInfo account found!');
                quarryNeedAccounts = [
                    {
                        pubkey: constants_1.quarryAdapterProgramId,
                        isSigner: false,
                        isWritable: false
                    },
                    {
                        pubkey: localQuarryAdapterPDA[0],
                        isSigner: false,
                        isWritable: true
                    },
                    { pubkey: quarryCheckPDA[0], isSigner: false, isWritable: true },
                ];
                checkPDADataInfo = accountInfos[2];
                if (!checkPDADataInfo)
                    throw new Error('No checkPDADataInfo account found!');
                checkPDAData = xenonLayout_1.QUARRY_CHECK_DATA.decode(checkPDADataInfo.data);
                checkMintsToBePassed = 0;
                for (j = 0; j < checkPDAData.miners.length; j++) {
                    if (checkPDAData.miners[j].toBase58() !== web3_js_1.PublicKey["default"].toBase58()) {
                        checkMintsToBePassed++;
                        quarryNeedAccounts.push({
                            pubkey: checkPDAData.miners[j],
                            isSigner: false,
                            isWritable: true
                        });
                    }
                }
                currentAccCount = checkMintsToBePassed;
                accountsToBePassed = __spreadArray(__spreadArray([], accountsToBePassed, true), quarryNeedAccounts, true);
                return [3 /*break*/, 13];
            case 9:
                if (!mango_account_ai)
                    throw new Error('mango account needed but not found');
                ids_1 = mango_client_1.IDS['groups'][isMainnet_1.isMainnet ? 0 : 2];
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.mangoAdapterProgramId)];
            case 10:
                localMangoAdapterPDA = _c.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([localMangoAdapterPDA[0].toBuffer()], constants_1.mangoAdapterProgramId)];
            case 11:
                mangoCheckPDA = _c.sent();
                mangoNeedAccounts = [
                    //  mangoAdapterProgramId  localAdapterPDA  checkAccount
                    {
                        pubkey: constants_1.mangoAdapterProgramId,
                        isSigner: false,
                        isWritable: false
                    },
                    {
                        pubkey: localMangoAdapterPDA[0],
                        isSigner: false,
                        isWritable: true
                    },
                    { pubkey: mangoCheckPDA[0], isSigner: false, isWritable: true },
                    {
                        pubkey: new web3_js_1.PublicKey(ids_1.publicKey),
                        isSigner: false,
                        isWritable: false
                    },
                    { pubkey: mango_account_ai, isSigner: false, isWritable: true },
                    { pubkey: constants_1.mangoCache, isSigner: false, isWritable: false }, //mango_cache_ai
                ];
                currentAccCount = 3;
                accountsToBePassed = __spreadArray(__spreadArray([], accountsToBePassed, true), mangoNeedAccounts, true);
                return [3 /*break*/, 13];
            case 12: return [3 /*break*/, 13];
            case 13:
                Obj["protocol_acc_count_".concat(i)] = currentAccCount;
                return [3 /*break*/, 15];
            case 14:
                Obj["protocol_acc_count_".concat(i)] = 0;
                _c.label = 15;
            case 15:
                i++;
                return [3 /*break*/, 6];
            case 16:
                marginATAs = [];
                for (i = 0; i < marginData.token_count; i++) {
                    marginATAs.push({
                        pubkey: marginData.tokens[i].vault,
                        isSigner: false,
                        isWritable: false
                    });
                }
                layoutsArr = [(0, buffer_layout_1.u8)('instruction')];
                for (j = 0; j < Object.keys(Obj).length; j++) {
                    layoutsArr.push((0, buffer_layout_1.u8)("protocol_acc_count_".concat(j)));
                }
                dataLayout = (0, buffer_layout_1.struct)(layoutsArr);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode(__assign({ instruction: 9 }, Obj), data);
                keys = __spreadArray(__spreadArray([
                    { pubkey: xenonPDA, isSigner: false, isWritable: true },
                    { pubkey: marginPDA, isSigner: false, isWritable: true }
                ], marginATAs, true), accountsToBePassed, true);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: keys,
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                additionalComputeBudgetInstruction = web3_js_1.ComputeBudgetProgram.requestUnits({
                    units: 800000,
                    additionalFee: 0
                });
                transaction.add(additionalComputeBudgetInstruction);
                return [2 /*return*/];
        }
    });
}); };
exports.updateAccountValuation = updateAccountValuation;
var handleInitializeMangoAdapter = function (connection, xenonPDA, marginPDA, payer, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var gAdapterPDA, adapterPDA, checkPDA, client, mangoGroup, mango_group_ai, accountNumBN, mango_account_ai, XenonInfo, xenonData, marginInfo, marginData, gAdapterPDAData, dataLayout, data, keys, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gAdapterPDA = constants_1.mangoGAdapterPk;
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.mangoAdapterProgramId)];
            case 1:
                adapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.mangoAdapterProgramId)];
            case 2:
                checkPDA = _a.sent();
                client = new mango_client_1.MangoClient(connection, constants_1.mangoProgramID);
                return [4 /*yield*/, client.getMangoGroup(constants_1.MANGO_GROUP_ACCOUNT_V3)];
            case 3:
                mangoGroup = _a.sent();
                mango_group_ai = mangoGroup.publicKey;
                accountNumBN = new bn_js_1["default"](0);
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([
                        mango_group_ai.toBytes(),
                        marginPDA.toBytes(),
                        accountNumBN.toArrayLike(Buffer, 'le', 8),
                    ], constants_1.mangoProgramID)];
            case 4:
                mango_account_ai = _a.sent();
                return [4 /*yield*/, connection.getAccountInfo(xenonPDA, 'processed')];
            case 5:
                XenonInfo = _a.sent();
                if (!XenonInfo) {
                    throw new Error('Xenon not initialzied');
                }
                xenonData = xenonLayout_1.XENON_DATA_LAYOUT.decode(XenonInfo.data);
                return [4 /*yield*/, connection.getAccountInfo(marginPDA, 'processed')];
            case 6:
                marginInfo = _a.sent();
                if (!marginInfo) {
                    throw new Error('No margin PDA initialised');
                }
                marginData = xenonLayout_1.MARGIN_DATA_LAYOUT.decode(marginInfo.data);
                return [4 /*yield*/, connection.getAccountInfo(gAdapterPDA, 'processed')];
            case 7:
                gAdapterPDAData = _a.sent();
                if (!gAdapterPDAData) {
                    throw new Error('No gAdapter PDA initialised');
                }
                dataLayout = (0, buffer_layout_1.struct)([
                    (0, buffer_layout_1.u8)('instruction'),
                    (0, buffer_layout_1.u8)('adapter_index'),
                    (0, buffer_layout_1.u8)('count'),
                    (0, buffer_layout_1.u8)('token_1'),
                ]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 12,
                    adapter_index: 3,
                    count: 1,
                    token_1: (0, getTokenIndexes_1.getMarginPDATokenIndexHelper)(new web3_js_1.PublicKey(tokens_1.TOKENS.USDC.mintAddress), xenonData, marginData)
                }, data);
                keys = [
                    { pubkey: xenonPDA, isSigner: false, isWritable: false },
                    { pubkey: payer, isSigner: true, isWritable: true },
                    { pubkey: marginPDA, isSigner: false, isWritable: true },
                    { pubkey: constants_1.mangoAdapterProgramId, isSigner: false, isWritable: false },
                    { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                    { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                    { pubkey: checkPDA[0], isSigner: false, isWritable: true },
                    { pubkey: payer, isSigner: true, isWritable: true },
                    { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
                    { pubkey: constants_1.mangoProgramID, isSigner: false, isWritable: false },
                    { pubkey: mango_group_ai, isSigner: false, isWritable: true },
                    { pubkey: mango_account_ai[0], isSigner: false, isWritable: true }, //mango_account_ai
                ];
                instruction = new web3_js_1.TransactionInstruction({
                    keys: keys,
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleInitializeMangoAdapter = handleInitializeMangoAdapter;
var handleMangoDeposit = function (connection, xenonPDA, marginPDA, payer, transaction, tokenIndex, mango_account_ai, quantity) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, gAdapterPDA, adapterPDA, checkPDA, client, mangoGroup, marginUSDCATA, nodeBankInfo, nodeBank, dataLayout, data, keys, instruction;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ids = mango_client_1.IDS['groups'][isMainnet_1.isMainnet ? 0 : 2];
                gAdapterPDA = constants_1.mangoGAdapterPk;
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.mangoAdapterProgramId)];
            case 1:
                adapterPDA = _b.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.mangoAdapterProgramId)];
            case 2:
                checkPDA = _b.sent();
                client = new mango_client_1.MangoClient(connection, new web3_js_1.PublicKey(ids.mangoProgramId));
                return [4 /*yield*/, client.getMangoGroup(new web3_js_1.PublicKey(ids.publicKey))];
            case 3:
                mangoGroup = _b.sent();
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, new web3_js_1.PublicKey(tokens_1.TOKENS.USDC.mintAddress), marginPDA, transaction)];
            case 4:
                marginUSDCATA = _b.sent();
                return [4 /*yield*/, connection.getAccountInfo(new web3_js_1.PublicKey(ids.tokens[tokenIndex].nodeKeys[0]))];
            case 5:
                nodeBankInfo = _b.sent();
                if (!nodeBankInfo) {
                    throw new Error("No NodeBankInfo found for ".concat(ids.tokens[tokenIndex].nodeKeys[0]));
                }
                nodeBank = mango_client_1.NodeBankLayout.decode(nodeBankInfo.data);
                dataLayout = (0, buffer_layout_1.struct)([
                    (0, buffer_layout_1.u8)('instruction'),
                    (0, buffer_layout_1.u8)('adapter_index'),
                    (0, buffer_layout_1.u32)('instruction3'),
                    (0, buffer_layout_1.nu64)('quantity'),
                ]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    // account_id: xenonData.account_id,
                    adapter_index: 3,
                    // instruction2: 1,
                    instruction3: 2,
                    quantity: quantity * Math.pow(10, ((_a = ids.tokens[tokenIndex].decimals) !== null && _a !== void 0 ? _a : 6))
                }, data);
                keys = [
                    { pubkey: xenonPDA, isSigner: false, isWritable: false },
                    { pubkey: payer, isSigner: true, isWritable: false },
                    { pubkey: marginPDA, isSigner: false, isWritable: true },
                    { pubkey: constants_1.mangoAdapterProgramId, isSigner: false, isWritable: false },
                    { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                    { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                    { pubkey: checkPDA[0], isSigner: false, isWritable: false },
                    { pubkey: constants_1.mangoProgramID, isSigner: false, isWritable: false },
                    {
                        pubkey: new web3_js_1.PublicKey(ids.publicKey),
                        isSigner: false,
                        isWritable: false
                    },
                    { pubkey: mango_account_ai, isSigner: false, isWritable: true },
                    { pubkey: marginPDA, isSigner: false, isWritable: true },
                    { pubkey: mangoGroup.mangoCache, isSigner: false, isWritable: false },
                    {
                        pubkey: new web3_js_1.PublicKey(ids.tokens[tokenIndex].rootKey),
                        isSigner: false,
                        isWritable: false
                    },
                    {
                        pubkey: new web3_js_1.PublicKey(ids.tokens[tokenIndex].nodeKeys[0]),
                        isSigner: false,
                        isWritable: true
                    },
                    { pubkey: nodeBank.vault, isSigner: false, isWritable: true },
                    { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    { pubkey: marginUSDCATA, isSigner: false, isWritable: true }, //owner_token_account_ai
                ];
                instruction = new web3_js_1.TransactionInstruction({
                    keys: keys,
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleMangoDeposit = handleMangoDeposit;
var handleMangoWithdraw = function (connection, xenonPDA, marginPDA, payer, transaction, tokenIndex, checkAccount, mango_account_ai, quantity) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, gAdapterPDA, adapterPDA, checkPDA, client, mangoGroup, marginUSDCATA, nodeBankInfo, nodeBank, dataLayout, data, keys, instruction;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ids = mango_client_1.IDS['groups'][isMainnet_1.isMainnet ? 0 : 2];
                gAdapterPDA = constants_1.mangoGAdapterPk;
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.mangoAdapterProgramId)];
            case 1:
                adapterPDA = _b.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.mangoAdapterProgramId)];
            case 2:
                checkPDA = _b.sent();
                client = new mango_client_1.MangoClient(connection, new web3_js_1.PublicKey(ids.mangoProgramId));
                return [4 /*yield*/, client.getMangoGroup(new web3_js_1.PublicKey(ids.publicKey))];
            case 3:
                mangoGroup = _b.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(tokens_1.TOKENS.USDC.mintAddress))];
            case 4:
                marginUSDCATA = _b.sent();
                return [4 /*yield*/, connection.getAccountInfo(new web3_js_1.PublicKey(ids.tokens[tokenIndex].nodeKeys[0]))];
            case 5:
                nodeBankInfo = _b.sent();
                if (!nodeBankInfo) {
                    throw new Error("No NodeBankInfo found for ".concat(ids.tokens[tokenIndex].nodeKeys[0]));
                }
                nodeBank = mango_client_1.NodeBankLayout.decode(nodeBankInfo.data);
                dataLayout = (0, buffer_layout_1.struct)([
                    (0, buffer_layout_1.u8)('instruction'),
                    (0, buffer_layout_1.u8)('adapter_index'),
                    (0, buffer_layout_1.u32)('instruction3'),
                    (0, buffer_layout_1.nu64)('quantity'),
                    (0, buffer_layout_1.u8)('allow_borrow'),
                ]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    // account_id: xenonData.account_id,
                    adapter_index: 3,
                    // instruction2: 1,
                    instruction3: 3,
                    quantity: quantity * Math.pow(10, ((_a = ids.tokens[tokenIndex].decimals) !== null && _a !== void 0 ? _a : 6)),
                    allow_borrow: 0
                }, data);
                keys = __spreadArray([
                    { pubkey: xenonPDA, isSigner: false, isWritable: false },
                    { pubkey: payer, isSigner: true, isWritable: false },
                    { pubkey: marginPDA, isSigner: false, isWritable: true },
                    { pubkey: constants_1.mangoAdapterProgramId, isSigner: false, isWritable: false },
                    { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                    { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                    { pubkey: checkPDA[0], isSigner: false, isWritable: false },
                    { pubkey: constants_1.mangoProgramID, isSigner: false, isWritable: false },
                    {
                        pubkey: new web3_js_1.PublicKey(ids.publicKey),
                        isSigner: false,
                        isWritable: false
                    },
                    { pubkey: mango_account_ai, isSigner: false, isWritable: true },
                    { pubkey: marginPDA, isSigner: false, isWritable: true },
                    { pubkey: mangoGroup.mangoCache, isSigner: false, isWritable: false },
                    {
                        pubkey: new web3_js_1.PublicKey(ids.tokens[tokenIndex].rootKey),
                        isSigner: false,
                        isWritable: false
                    },
                    {
                        pubkey: new web3_js_1.PublicKey(ids.tokens[tokenIndex].nodeKeys[0]),
                        isSigner: false,
                        isWritable: true
                    },
                    { pubkey: nodeBank.vault, isSigner: false, isWritable: true },
                    { pubkey: marginUSDCATA, isSigner: false, isWritable: true },
                    { pubkey: mangoGroup.signerKey, isSigner: false, isWritable: true },
                    { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }
                ], (0, web3Utils_1.createDefaultKeys)(16), true);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: keys,
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleMangoWithdraw = handleMangoWithdraw;
var handleMangoPlacePrepOrder = function (connection, marginPDA, payer, transaction, checkAccount, mango_account_ai, price, side, orderPerpIndex, orderType, quantity, reduceOnly) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, gAdapterPDA, adapterPDA, checkPDA, client, mangoGroup, perpMarket, marginData, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ids = mango_client_1.IDS['groups'][isMainnet_1.isMainnet ? 0 : 2];
                gAdapterPDA = constants_1.mangoGAdapterPk;
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.mangoAdapterProgramId)];
            case 1:
                adapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.mangoAdapterProgramId)];
            case 2:
                checkPDA = _a.sent();
                client = new mango_client_1.MangoClient(connection, new web3_js_1.PublicKey(ids.mangoProgramId));
                return [4 /*yield*/, client.getMangoGroup(new web3_js_1.PublicKey(ids.publicKey))];
            case 3:
                mangoGroup = _a.sent();
                perpMarket = ids.perpMarkets.find(function (f) { return f.marketIndex === orderPerpIndex; });
                return [4 /*yield*/, connection.getAccountInfo(marginPDA, 'processed')];
            case 4:
                marginData = _a.sent();
                if (!marginData)
                    throw new Error('No margin account found!');
                dataLayout = (0, buffer_layout_1.struct)([
                    (0, buffer_layout_1.u8)('instruction'),
                    (0, buffer_layout_1.u8)('adapter_index'),
                    (0, buffer_layout_1.u32)('instruction3'),
                    (0, buffer_layout_1.nu64)('price'),
                    (0, buffer_layout_1.nu64)('quantity'),
                    (0, buffer_layout_1.nu64)('client_order_id'),
                    (0, buffer_layout_1.u8)('side'),
                    (0, buffer_layout_1.u8)('order_type'),
                    (0, buffer_layout_1.u8)('reduce_only'),
                ]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_index: 3,
                    instruction3: 12,
                    price: price,
                    quantity: quantity,
                    client_order_id: Date.now(),
                    side: side === 'buy' ? 0 : 1,
                    order_type: (0, mangoUtils_1.mapOrderType)(orderType),
                    reduce_only: reduceOnly
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: __spreadArray([
                        { pubkey: constants_1.xenonPDA, isSigner: false, isWritable: false },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.mangoAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: checkPDA[0], isSigner: false, isWritable: false },
                        { pubkey: constants_1.mangoProgramID, isSigner: false, isWritable: false },
                        {
                            pubkey: new web3_js_1.PublicKey(ids.publicKey),
                            isSigner: false,
                            isWritable: false
                        },
                        { pubkey: mango_account_ai, isSigner: false, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: mangoGroup.mangoCache, isSigner: false, isWritable: false },
                        {
                            pubkey: new web3_js_1.PublicKey(perpMarket.publicKey),
                            isSigner: false,
                            isWritable: true
                        },
                        {
                            pubkey: new web3_js_1.PublicKey(perpMarket.bidsKey),
                            isSigner: false,
                            isWritable: true
                        },
                        {
                            pubkey: new web3_js_1.PublicKey(perpMarket.asksKey),
                            isSigner: false,
                            isWritable: true
                        },
                        {
                            pubkey: new web3_js_1.PublicKey(perpMarket.eventsKey),
                            isSigner: false,
                            isWritable: true
                        }
                    ], (0, web3Utils_1.createDefaultKeys)(16), true),
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleMangoPlacePrepOrder = handleMangoPlacePrepOrder;
var handleMangoPrepCancelOrder = function (connection, marginPDA, payer, transaction, checkAccount, mango_account_ai, orderPerpIndex, clientId) { return __awaiter(void 0, void 0, void 0, function () {
    var ids, gAdapterPDA, adapterPDA, checkPDA, perpMarket, marginData, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ids = mango_client_1.IDS['groups'][isMainnet_1.isMainnet ? 0 : 2];
                gAdapterPDA = constants_1.mangoGAdapterPk;
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.mangoAdapterProgramId)];
            case 1:
                adapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.mangoAdapterProgramId)];
            case 2:
                checkPDA = _a.sent();
                perpMarket = ids.perpMarkets.find(function (f) { return f.marketIndex === orderPerpIndex; });
                return [4 /*yield*/, connection.getAccountInfo(marginPDA, 'processed')];
            case 3:
                marginData = _a.sent();
                if (!marginData)
                    throw new Error('No margin account found!');
                dataLayout = (0, buffer_layout_1.struct)([
                    (0, buffer_layout_1.u8)('instruction'),
                    (0, buffer_layout_1.u8)('adapter_index'),
                    (0, buffer_layout_1.u32)('instruction3'),
                    (0, buffer_layout_1.nu64)('clientOrderId'),
                    (0, buffer_layout_1.u8)('invalidIdOk'),
                ]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_index: 3,
                    instruction3: 13,
                    //TODO
                    clientOrderId: clientId,
                    invalidIdOk: 0
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: __spreadArray([
                        { pubkey: constants_1.xenonPDA, isSigner: false, isWritable: false },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.mangoAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: checkPDA[0], isSigner: false, isWritable: false },
                        { pubkey: constants_1.mangoProgramID, isSigner: false, isWritable: false },
                        {
                            pubkey: new web3_js_1.PublicKey(ids.publicKey),
                            isSigner: false,
                            isWritable: false
                        },
                        { pubkey: mango_account_ai, isSigner: false, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        {
                            pubkey: new web3_js_1.PublicKey(perpMarket.publicKey),
                            isSigner: false,
                            isWritable: true
                        },
                        {
                            pubkey: new web3_js_1.PublicKey(perpMarket.bidsKey),
                            isSigner: false,
                            isWritable: true
                        },
                        {
                            pubkey: new web3_js_1.PublicKey(perpMarket.asksKey),
                            isSigner: false,
                            isWritable: true
                        }
                    ], (0, web3Utils_1.createDefaultKeys)(6), true),
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleMangoPrepCancelOrder = handleMangoPrepCancelOrder;
var handleMangoSettleAll = function (connection, mango_account_ai, wallet) { return __awaiter(void 0, void 0, void 0, function () {
    var mangoClient, mangoGroup, mangoCache, mangoAccount, markets, loadedMarkets, sig;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mangoClient = new mango_client_1.MangoClient(connection, constants_1.mangoProgramID);
                return [4 /*yield*/, mangoClient.getMangoGroup(constants_1.MANGO_GROUP_ACCOUNT_V3)];
            case 1:
                mangoGroup = _a.sent();
                return [4 /*yield*/, mangoGroup.loadCache(connection)];
            case 2:
                mangoCache = _a.sent();
                return [4 /*yield*/, mangoClient.getMangoAccount(mango_account_ai, constants_1.SERUM_PROGRAM_ID_V3)];
            case 3:
                mangoAccount = _a.sent();
                markets = perpMarkets_1.PERP_MARKETS.slice(0, 3);
                return [4 /*yield*/, Promise.all(markets.map(function (f) {
                        return mangoClient.getPerpMarket(new web3_js_1.PublicKey(f.publicKey), f.baseDecimals, f.quoteDecimals);
                    }))];
            case 4:
                loadedMarkets = _a.sent();
                return [4 /*yield*/, mangoGroup.loadRootBanks(connection)];
            case 5:
                _a.sent();
                return [4 /*yield*/, mangoClient.settleAllPerpPnl(mangoGroup, mangoCache, mangoAccount, loadedMarkets, mangoGroup.rootBankAccounts[15], wallet)];
            case 6:
                sig = _a.sent();
                return [2 /*return*/, sig];
        }
    });
}); };
exports.handleMangoSettleAll = handleMangoSettleAll;
var handleAddTokensToMargin = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, mints, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var addTokensToMargin, marginInfo, marginData, dataLayout, currentIndex, _loop_1, _i, mints_1, mint;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                addTokensToMargin = [];
                return [4 /*yield*/, connection.getAccountInfo(marginPDA, 'processed')];
            case 1:
                marginInfo = _a.sent();
                if (!marginInfo)
                    throw new Error('No margin account found!');
                marginData = xenonLayout_1.MARGIN_DATA_LAYOUT.decode(marginInfo.data);
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('index')]);
                currentIndex = marginData.token_count;
                _loop_1 = function (mint) {
                    var index, marginAccountToken, data, marginVaultAccount, instruction;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                index = xenonPdaData.token_list
                                    .map(function (f) { return f.mint.toBase58(); })
                                    .findIndex(function (o) { return o === mint.toBase58(); });
                                if (index === -1) {
                                    throw new Error('Adding incorrect mint');
                                }
                                marginAccountToken = marginData.tokens.find(function (f) { return f.index === index; });
                                if (marginAccountToken && marginAccountToken.is_active) {
                                    addTokensToMargin.push({
                                        addingTokenToMargin: false,
                                        index: marginData.tokens.findIndex(function (f) { return f.index === index; }),
                                        mint: mint
                                    });
                                    return [2 /*return*/, "continue"];
                                }
                                data = Buffer.alloc(dataLayout.span);
                                dataLayout.encode({
                                    instruction: 16,
                                    index: index
                                }, data);
                                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, mint, marginPDA, transaction)];
                            case 1:
                                marginVaultAccount = _b.sent();
                                instruction = new web3_js_1.TransactionInstruction({
                                    keys: [
                                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                                        { pubkey: payer, isSigner: false, isWritable: true },
                                        { pubkey: marginVaultAccount, isSigner: false, isWritable: false },
                                    ],
                                    programId: constants_1.programId,
                                    data: data
                                });
                                transaction.add(instruction);
                                addTokensToMargin.push({ addingTokenToMargin: true, index: currentIndex, mint: mint });
                                currentIndex++;
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, mints_1 = mints;
                _a.label = 2;
            case 2:
                if (!(_i < mints_1.length)) return [3 /*break*/, 5];
                mint = mints_1[_i];
                return [5 /*yield**/, _loop_1(mint)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                addTokensToMargin;
                return [2 /*return*/, addTokensToMargin];
        }
    });
}); };
exports.handleAddTokensToMargin = handleAddTokensToMargin;
var handleAddTokenToMargin2 = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, mint, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var marginInfo, marginData, dataLayout, index, marginAccountToken, data, marginVaultAccount, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connection.getAccountInfo(marginPDA, 'processed')];
            case 1:
                marginInfo = _a.sent();
                if (!marginInfo)
                    throw new Error('No margin account found!');
                marginData = xenonLayout_1.MARGIN_DATA_LAYOUT.decode(marginInfo.data);
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('index')]);
                index = xenonPdaData.token_list
                    .map(function (f) { return f.mint.toBase58(); })
                    .findIndex(function (o) { return o === mint.toBase58(); });
                if (index === -1) {
                    throw new Error('Adding incorrect mint');
                }
                marginAccountToken = marginData.tokens.find(function (f) { return f.index === index; });
                if (marginAccountToken && marginAccountToken.is_active) {
                    return [2 /*return*/, {
                            addingTokenToMargin: false,
                            index: marginData.tokens.findIndex(function (f) { return f.index === index; }),
                            mint: mint
                        }];
                }
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 16,
                    index: index
                }, data);
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, mint, marginPDA, transaction)];
            case 2:
                marginVaultAccount = _a.sent();
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: false, isWritable: true },
                        { pubkey: marginVaultAccount, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/, { addingTokenToMargin: true, index: marginData.token_count, mint: mint }];
        }
    });
}); };
exports.handleAddTokenToMargin2 = handleAddTokenToMargin2;
// rewrite this 
var handleInitializeSolendAdapter2 = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, solendReserve) { return __awaiter(void 0, void 0, void 0, function () {
    var handleAddTokensToMarginResults, _i, _a, mint, handleAddTokenToMarginResult, alreadyAddedTokens, _b, handleAddTokensToMarginResults_1, iterator, filteredAdding, newlyAddingTokens, i, element, adapterPDA, gAdapterPDA, adaData, indexes, alreadyInitialisedMints, _c, _d, x, _e, _f, x, xx, _g, indexes_1, iterator, someLayout, _h, indexes_2, i, dataLayout, data, instruction;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                handleAddTokensToMarginResults = [];
                _i = 0, _a = [
                    solendReserve.mint,
                    solendReserve.collateralMintAddress,
                ];
                _j.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                mint = _a[_i];
                return [4 /*yield*/, (0, exports.handleAddTokenToMargin2)(connection, xenonPDA, xenonPdaData, marginPDA, payer, new web3_js_1.PublicKey(mint), transaction)];
            case 2:
                handleAddTokenToMarginResult = _j.sent();
                handleAddTokensToMarginResults.push(handleAddTokenToMarginResult);
                _j.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                handleAddTokensToMarginResults = handleAddTokensToMarginResults.sort(function (x, y) {
                    return x.addingTokenToMargin === y.addingTokenToMargin
                        ? 0
                        : x.addingTokenToMargin
                            ? -1
                            : 1;
                });
                alreadyAddedTokens = [];
                for (_b = 0, handleAddTokensToMarginResults_1 = handleAddTokensToMarginResults; _b < handleAddTokensToMarginResults_1.length; _b++) {
                    iterator = handleAddTokensToMarginResults_1[_b];
                    if (iterator.addingTokenToMargin === false) {
                        alreadyAddedTokens.push(iterator);
                    }
                }
                filteredAdding = handleAddTokensToMarginResults.filter(function (f) { return f.addingTokenToMargin === true; });
                newlyAddingTokens = [];
                for (i = 0; i < filteredAdding.length; i++) {
                    element = filteredAdding[i];
                    newlyAddingTokens.push(__assign(__assign({}, element), { index: element.index + i }));
                }
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.solendAdapterProgramId)];
            case 5:
                adapterPDA = _j.sent();
                gAdapterPDA = constants_1.solendGAdapterPk;
                return [4 /*yield*/, connection.getAccountInfo(adapterPDA[0])];
            case 6:
                adaData = _j.sent();
                indexes = [];
                if (adaData) {
                    alreadyInitialisedMints = xenonLayout_1.ADAPTER_ACCOUNT_LAYOUT.decode(adaData === null || adaData === void 0 ? void 0 : adaData.data).mints.map(function (k) { return k.toBase58(); });
                    for (_c = 0, _d = __spreadArray(__spreadArray([], alreadyAddedTokens, true), newlyAddingTokens, true); _c < _d.length; _c++) {
                        x = _d[_c];
                        if (!alreadyInitialisedMints.includes(x.mint.toBase58())) {
                            indexes.push(x.index);
                        }
                    }
                }
                else {
                    for (_e = 0, _f = __spreadArray(__spreadArray([], alreadyAddedTokens, true), newlyAddingTokens, true); _e < _f.length; _e++) {
                        x = _f[_e];
                        indexes.push(x.index);
                    }
                }
                if (indexes.length === 0) {
                    return [2 /*return*/];
                }
                xx = [];
                xx.push((0, buffer_layout_1.u8)('instruction'));
                xx.push((0, buffer_layout_1.u8)('adapter_index'));
                xx.push((0, buffer_layout_1.u8)('count'));
                for (_g = 0, indexes_1 = indexes; _g < indexes_1.length; _g++) {
                    iterator = indexes_1[_g];
                    xx.push((0, buffer_layout_1.u8)("token_".concat(iterator)));
                }
                someLayout = {
                    instruction: 12,
                    adapter_index: 0,
                    count: indexes.length
                };
                for (_h = 0, indexes_2 = indexes; _h < indexes_2.length; _h++) {
                    i = indexes_2[_h];
                    someLayout['token_' + i] = i;
                }
                dataLayout = (0, buffer_layout_1.struct)(xx);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode(someLayout, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: false },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.solendAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: web3_js_1.PublicKey["default"], isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleInitializeSolendAdapter2 = handleInitializeSolendAdapter2;
var solendDeposit = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, amount, solendReserve) { return __awaiter(void 0, void 0, void 0, function () {
    var adapterPDA, gAdapterPDA, marginData, dataLayout, decimals, data, sourceLiquidityAcc, DestCollateralAcc, reserveLiqSupplyAcc, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.handleInitializeSolendAdapter2)(connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, solendReserve)];
            case 1:
                _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.solendAdapterProgramId)];
            case 2:
                adapterPDA = _a.sent();
                gAdapterPDA = constants_1.solendGAdapterPk;
                return [4 /*yield*/, connection.getAccountInfo(marginPDA, 'processed')];
            case 3:
                marginData = _a.sent();
                if (!marginData)
                    throw new Error('No margin account found!');
                dataLayout = (0, buffer_layout_1.struct)([
                    (0, buffer_layout_1.u8)('instruction'),
                    (0, buffer_layout_1.u8)('adapter_index'),
                    (0, buffer_layout_1.u8)('instruction3'),
                    (0, buffer_layout_1.nu64)('liquidity_amount'),
                ]);
                decimals = (0, tokens_1.getDecimalsFromMint)(solendReserve.mint);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_index: 0,
                    instruction3: 4,
                    liquidity_amount: amount * Math.pow(10, decimals)
                }, data);
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(solendReserve.mint))];
            case 4:
                sourceLiquidityAcc = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(solendReserve.collateralMintAddress))];
            case 5:
                DestCollateralAcc = _a.sent();
                reserveLiqSupplyAcc = new web3_js_1.PublicKey(solendReserve.liquidityAddress);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: false },
                        { pubkey: constants_1.solendAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: web3_js_1.PublicKey["default"], isSigner: false, isWritable: true },
                        { pubkey: constants_1.solendProgramID, isSigner: false, isWritable: false },
                        { pubkey: sourceLiquidityAcc, isSigner: false, isWritable: true },
                        { pubkey: DestCollateralAcc, isSigner: false, isWritable: true },
                        {
                            pubkey: new web3_js_1.PublicKey(solendReserve.address),
                            isSigner: false,
                            isWritable: true
                        },
                        { pubkey: reserveLiqSupplyAcc, isSigner: false, isWritable: true },
                        {
                            pubkey: new web3_js_1.PublicKey(solendReserve.collateralMintAddress),
                            isSigner: false,
                            isWritable: true
                        },
                        { pubkey: solendMarkets_1.SOLEND_MARKET, isSigner: false, isWritable: false },
                        { pubkey: solendMarkets_1.SOLEND_DERIEVED_MARKET, isSigner: false, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.solendDeposit = solendDeposit;
var solendWithdraw = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, amount, solendReserve) { return __awaiter(void 0, void 0, void 0, function () {
    var adapterPDA, gAdapterPDA, marginData, dataLayout, decimals, data, sourceCollateralAcc, DestLiquidityAcc, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.handleInitializeSolendAdapter2)(connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, solendReserve)];
            case 1:
                _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.solendAdapterProgramId)];
            case 2:
                adapterPDA = _a.sent();
                gAdapterPDA = constants_1.solendGAdapterPk;
                return [4 /*yield*/, connection.getAccountInfo(marginPDA, 'processed')];
            case 3:
                marginData = _a.sent();
                if (!marginData)
                    throw new Error('No margin account found!');
                dataLayout = (0, buffer_layout_1.struct)([
                    (0, buffer_layout_1.u8)('instruction'),
                    (0, buffer_layout_1.u8)('adapter_index'),
                    (0, buffer_layout_1.u8)('instruction3'),
                    (0, buffer_layout_1.nu64)('collateral_amount'),
                ]);
                decimals = (0, tokens_1.getDecimalsFromMint)(solendReserve.mint);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_index: 0,
                    instruction3: 5,
                    collateral_amount: amount * Math.pow(10, decimals)
                }, data);
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(solendReserve.collateralMintAddress))];
            case 4:
                sourceCollateralAcc = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(solendReserve.mint))];
            case 5:
                DestLiquidityAcc = _a.sent();
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: false },
                        { pubkey: constants_1.solendAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: true },
                        { pubkey: constants_1.solendProgramID, isSigner: false, isWritable: false },
                        { pubkey: sourceCollateralAcc, isSigner: false, isWritable: true },
                        { pubkey: DestLiquidityAcc, isSigner: false, isWritable: true },
                        {
                            pubkey: new web3_js_1.PublicKey(solendReserve.address),
                            isSigner: false,
                            isWritable: true
                        },
                        {
                            pubkey: new web3_js_1.PublicKey(solendReserve.collateralMintAddress),
                            isSigner: false,
                            isWritable: true
                        },
                        {
                            pubkey: new web3_js_1.PublicKey(solendReserve.liquidityAddress),
                            isSigner: false,
                            isWritable: true
                        },
                        { pubkey: solendMarkets_1.SOLEND_MARKET, isSigner: false, isWritable: false },
                        { pubkey: solendMarkets_1.SOLEND_DERIEVED_MARKET, isSigner: false, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.solendWithdraw = solendWithdraw;
var handleInitializeSaberAdapter = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, saber_lp) { return __awaiter(void 0, void 0, void 0, function () {
    var saberLpNeededTokens, marginInfo, marginPdaData, _i, _a, _b, i, mint;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                saberLpNeededTokens = __spreadArray(__spreadArray([], saber_lp.lpToken.extensions.underlyingTokens, true), [
                    saber_lp.lpToken.address,
                ], false);
                return [4 /*yield*/, connection.getAccountInfo(marginPDA, 'processed')];
            case 1:
                marginInfo = _c.sent();
                if (!marginInfo)
                    throw new Error('No margin account found!');
                marginPdaData = xenonLayout_1.MARGIN_DATA_LAYOUT.decode(marginInfo.data);
                _i = 0, _a = saberLpNeededTokens.entries();
                _c.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                _b = _a[_i], i = _b[0], mint = _b[1];
                if (!((0, getTokenIndexes_1.getMarginPDATokenIndexHelper)(new web3_js_1.PublicKey(mint), xenonPdaData, marginPdaData) === -1)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, exports.handleAddTokenToMargin2)(connection, xenonPDA, xenonPdaData, marginPDA, payer, new web3_js_1.PublicKey(mint), transaction)];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.handleInitializeSaberAdapter = handleInitializeSaberAdapter;
var handleInitializeSaberAdapter2 = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, saber_lp) { return __awaiter(void 0, void 0, void 0, function () {
    var saberLpNeededTokens, tokenData, marginInfo, marginPdaData, localAdapterPDA, gAdapterPDA, marginAccTokenIndexToBeAdded, tokensToBeInitCount, localAdapterPDADataInfo, localAdapterPDAData, _loop_2, _i, _a, _b, i, mint, _loop_3, _c, _d, _e, i, mint, obj, layoutArr, i, dataLayout, data, someLayout, instruction;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                saberLpNeededTokens = __spreadArray(__spreadArray([], saber_lp.lpToken.extensions.underlyingTokens, true), [
                    saber_lp.lpToken.address,
                ], false);
                return [4 /*yield*/, (0, exports.handleAddTokensToMargin)(connection, xenonPDA, xenonPdaData, marginPDA, payer, saberLpNeededTokens.map(function (f) { return new web3_js_1.PublicKey(f); }), transaction)];
            case 1:
                tokenData = _f.sent();
                return [4 /*yield*/, connection.getAccountInfo(marginPDA, 'processed')];
            case 2:
                marginInfo = _f.sent();
                if (!marginInfo)
                    throw new Error('No margin account found!');
                marginPdaData = xenonLayout_1.MARGIN_DATA_LAYOUT.decode(marginInfo.data);
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.saberAdapterProgramId)];
            case 3:
                localAdapterPDA = _f.sent();
                gAdapterPDA = constants_1.saberGAdapterPk;
                marginAccTokenIndexToBeAdded = [];
                tokensToBeInitCount = 0;
                return [4 /*yield*/, connection.getAccountInfo(localAdapterPDA[0], 'processed')];
            case 4:
                localAdapterPDADataInfo = _f.sent();
                if (localAdapterPDADataInfo) {
                    localAdapterPDAData = xenonLayout_1.ADAPTER_ACCOUNT_LAYOUT.decode(localAdapterPDADataInfo === null || localAdapterPDADataInfo === void 0 ? void 0 : localAdapterPDADataInfo.data);
                    _loop_2 = function (i, mint) {
                        //check if already token is initialised inside LocalAdpater
                        if ((0, getTokenIndexes_1.getLocalAdapterTokenIndexHelper)(new web3_js_1.PublicKey(mint), localAdapterPDAData) === -1) {
                            var token = tokenData.find(function (k) { return k.mint.toBase58() === mint; });
                            // already added
                            if (token) {
                                tokensToBeInitCount++;
                                marginAccTokenIndexToBeAdded.push({ mint: mint, index: token.index });
                            }
                        }
                        else {
                            //case 3 : exist on margin and adapter
                            // no need to add
                        }
                    };
                    //  current_last_margin_pda_index = 4
                    for (_i = 0, _a = saberLpNeededTokens.entries(); _i < _a.length; _i++) {
                        _b = _a[_i], i = _b[0], mint = _b[1];
                        _loop_2(i, mint);
                    }
                    if (tokensToBeInitCount === 0) {
                        return [2 /*return*/];
                    }
                }
                else {
                    _loop_3 = function (i, mint) {
                        var token = tokenData.find(function (f) { return f.mint.toBase58() === mint; });
                        if (token) {
                            marginAccTokenIndexToBeAdded.push({ mint: mint, index: token.index });
                        }
                    };
                    //  step 2-b :: localAdapterAcc doesn't exist so Add all mints
                    for (_c = 0, _d = saberLpNeededTokens.entries(); _c < _d.length; _c++) {
                        _e = _d[_c], i = _e[0], mint = _e[1];
                        _loop_3(i, mint);
                    }
                }
                if (marginAccTokenIndexToBeAdded.length === 0) {
                    return [2 /*return*/];
                }
                obj = {};
                layoutArr = [(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('adapter_index'), (0, buffer_layout_1.u8)('count')];
                for (i = 0; i < marginAccTokenIndexToBeAdded.length; i++) {
                    layoutArr.push((0, buffer_layout_1.u8)("token_".concat(i)));
                    obj["token_".concat(i)] = marginAccTokenIndexToBeAdded[i].index;
                }
                dataLayout = (0, buffer_layout_1.struct)(layoutArr);
                data = Buffer.alloc(dataLayout.span);
                someLayout = __assign({ instruction: 12, adapter_index: 1, count: marginAccTokenIndexToBeAdded.length }, obj);
                dataLayout.encode(someLayout, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: false },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.saberAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                        { pubkey: localAdapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: web3_js_1.PublicKey["default"], isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleInitializeSaberAdapter2 = handleInitializeSaberAdapter2;
var handleSaberDeposit = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, saber_lp, amountA, amountB) { return __awaiter(void 0, void 0, void 0, function () {
    var adapterPDA, gAdapterPDA, token_a_user, token_b_user, user_pool, xx, dataLayout, data, token_a_amount, token_b_amount, min_mint_amount, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.handleInitializeSaberAdapter2)(connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, saber_lp)];
            case 1:
                _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.saberAdapterProgramId)];
            case 2:
                adapterPDA = _a.sent();
                gAdapterPDA = constants_1.saberGAdapterPk;
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(saber_lp.tokens[0].address))];
            case 3:
                token_a_user = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(saber_lp.tokens[1].address))];
            case 4:
                token_b_user = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(saber_lp.lpToken.address))];
            case 5:
                user_pool = _a.sent();
                xx = [];
                xx.push((0, buffer_layout_1.u8)('instruction'));
                xx.push((0, buffer_layout_1.u8)('adapter_index'));
                xx.push((0, buffer_layout_1.u8)('instruction3'));
                xx.push((0, buffer_layout_1.nu64)('token_a_amount'));
                xx.push((0, buffer_layout_1.nu64)('token_b_amount'));
                xx.push((0, buffer_layout_1.nu64)('min_mint_amount'));
                dataLayout = (0, buffer_layout_1.struct)(xx);
                data = Buffer.alloc(dataLayout.span);
                token_a_amount = amountA * Math.pow(10, saber_lp.tokens[0].decimals);
                token_b_amount = amountB * Math.pow(10, saber_lp.tokens[1].decimals);
                min_mint_amount = (token_a_amount + token_b_amount) * (95 / 100);
                dataLayout.encode({
                    instruction: 10,
                    adapter_index: 1,
                    instruction3: 2,
                    token_a_amount: token_a_amount,
                    token_b_amount: token_b_amount,
                    min_mint_amount: min_mint_amount
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.saberAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: web3_js_1.PublicKey["default"], isSigner: false, isWritable: false },
                        { pubkey: constants_1.saberProgramID, isSigner: false, isWritable: false },
                        {
                            pubkey: new web3_js_1.PublicKey(saber_lp.swap.config.swapAccount),
                            isSigner: false,
                            isWritable: false
                        },
                        {
                            pubkey: new web3_js_1.PublicKey(saber_lp.swap.config.authority),
                            isSigner: false,
                            isWritable: false
                        },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: token_a_user, isSigner: false, isWritable: true },
                        { pubkey: token_b_user, isSigner: false, isWritable: true },
                        {
                            pubkey: new web3_js_1.PublicKey(saber_lp.swap.state.tokenA.reserve),
                            isSigner: false,
                            isWritable: true
                        },
                        {
                            pubkey: new web3_js_1.PublicKey(saber_lp.swap.state.tokenB.reserve),
                            isSigner: false,
                            isWritable: true
                        },
                        {
                            pubkey: new web3_js_1.PublicKey(saber_lp.lpToken.address),
                            isSigner: false,
                            isWritable: true
                        },
                        { pubkey: user_pool, isSigner: false, isWritable: true },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleSaberDeposit = handleSaberDeposit;
var handleSaberWithdraw = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, saber_lp, lpAmount) { return __awaiter(void 0, void 0, void 0, function () {
    var gAdapterPDA, adapterPDA, token_a_user, token_b_user, user_pool, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.handleInitializeSaberAdapter2)(connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, saber_lp)];
            case 1:
                _a.sent();
                gAdapterPDA = constants_1.saberGAdapterPk;
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.saberAdapterProgramId)];
            case 2:
                adapterPDA = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(saber_lp.tokens[0].address))];
            case 3:
                token_a_user = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(saber_lp.tokens[1].address))];
            case 4:
                token_b_user = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(saber_lp.lpToken.address))];
            case 5:
                user_pool = _a.sent();
                dataLayout = (0, buffer_layout_1.struct)([
                    (0, buffer_layout_1.u8)('instruction'),
                    (0, buffer_layout_1.u8)('adapter_index'),
                    (0, buffer_layout_1.u8)('instruction3'),
                    (0, buffer_layout_1.nu64)('pool_token_amount'),
                    (0, buffer_layout_1.nu64)('minimum_token_a_amount'),
                    (0, buffer_layout_1.nu64)('minimum_token_b_amount'),
                ]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_index: 1,
                    instruction3: 3,
                    pool_token_amount: lpAmount * Math.pow(10, saber_lp.lpToken.decimals),
                    minimum_token_a_amount: 1,
                    minimum_token_b_amount: 1
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.saberAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: web3_js_1.PublicKey["default"], isSigner: false, isWritable: false },
                        { pubkey: constants_1.saberProgramID, isSigner: false, isWritable: false },
                        {
                            pubkey: new web3_js_1.PublicKey(saber_lp.swap.config.swapAccount),
                            isSigner: false,
                            isWritable: false
                        },
                        {
                            pubkey: new web3_js_1.PublicKey(saber_lp.swap.config.authority),
                            isSigner: false,
                            isWritable: false
                        },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        {
                            pubkey: new web3_js_1.PublicKey(saber_lp.lpToken.address),
                            isSigner: false,
                            isWritable: true
                        },
                        { pubkey: user_pool, isSigner: false, isWritable: true },
                        {
                            pubkey: new web3_js_1.PublicKey(saber_lp.swap.state.tokenA.reserve),
                            isSigner: false,
                            isWritable: true
                        },
                        {
                            pubkey: new web3_js_1.PublicKey(saber_lp.swap.state.tokenB.reserve),
                            isSigner: false,
                            isWritable: true
                        },
                        { pubkey: token_a_user, isSigner: false, isWritable: true },
                        { pubkey: token_b_user, isSigner: false, isWritable: true },
                        {
                            pubkey: new web3_js_1.PublicKey(saber_lp.swap.state.tokenA.adminFeeAccount),
                            isSigner: false,
                            isWritable: true
                        },
                        {
                            pubkey: new web3_js_1.PublicKey(saber_lp.swap.state.tokenB.adminFeeAccount),
                            isSigner: false,
                            isWritable: true
                        },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleSaberWithdraw = handleSaberWithdraw;
var handleQuarryInitMintsInMargin = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, saber_lp) { return __awaiter(void 0, void 0, void 0, function () {
    var marginInfo, marginPdaData, adapterPDA, index, marginAccountTokenIndex;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connection.getAccountInfo(marginPDA, 'processed')];
            case 1:
                marginInfo = _a.sent();
                if (!marginInfo)
                    throw new Error('No margin account found!');
                marginPdaData = xenonLayout_1.MARGIN_DATA_LAYOUT.decode(marginInfo.data);
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.quarryAdapterProgramId)];
            case 2:
                adapterPDA = _a.sent();
                index = (0, getTokenIndexes_1.getXenonPDATokenIndexHelper)(xenonPdaData, new web3_js_1.PublicKey(saber_lp.lpToken.address));
                if (index === -1) {
                    throw new Error('Adding incorrect mint Not Found on XenonPDA');
                }
                marginAccountTokenIndex = (0, getTokenIndexes_1.getMarginPDATokenIndexHelper)(new web3_js_1.PublicKey(saber_lp.lpToken.address), xenonPdaData, marginPdaData);
                if (marginAccountTokenIndex !== -1) {
                    throw new Error('token already init in margin');
                }
                return [4 /*yield*/, (0, exports.handleAddTokenToMargin2)(connection, xenonPDA, xenonPdaData, marginPDA, payer, new web3_js_1.PublicKey(saber_lp.lpToken.address), transaction)];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.handleQuarryInitMintsInMargin = handleQuarryInitMintsInMargin;
var handleInitializeQuarryAdapter = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, saber_lp) { return __awaiter(void 0, void 0, void 0, function () {
    var adapterPDA, gAdapterPDA, checkPDA, marginInfo, marginData, index, marginAccountTokenIndex, localAdapterPDADataInfo, localAdapterPDAData, quarryAccount, minerAccount, minerVault, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.quarryAdapterProgramId)];
            case 1:
                adapterPDA = _a.sent();
                gAdapterPDA = constants_1.quarryGAdapterPk;
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.quarryAdapterProgramId)];
            case 2:
                checkPDA = _a.sent();
                return [4 /*yield*/, connection.getAccountInfo(marginPDA, 'processed')];
            case 3:
                marginInfo = _a.sent();
                if (!marginInfo)
                    throw new Error('No margin account found!');
                marginData = xenonLayout_1.MARGIN_DATA_LAYOUT.decode(marginInfo.data);
                index = (0, getTokenIndexes_1.getXenonPDATokenIndexHelper)(xenonPdaData, new web3_js_1.PublicKey(saber_lp.lpToken.address));
                if (index === -1) {
                    throw new Error('Adding incorrect mint Not Found on XenonPDA');
                }
                marginAccountTokenIndex = (0, getTokenIndexes_1.getMarginPDATokenIndexHelper)(new web3_js_1.PublicKey(saber_lp.lpToken.address), xenonPdaData, marginData);
                if (marginAccountTokenIndex === -1) {
                    throw new Error('token not found in margin');
                }
                return [4 /*yield*/, connection.getAccountInfo(adapterPDA[0], 'processed')];
            case 4:
                localAdapterPDADataInfo = _a.sent();
                if (localAdapterPDADataInfo) {
                    localAdapterPDAData = xenonLayout_1.ADAPTER_ACCOUNT_LAYOUT.decode(localAdapterPDADataInfo === null || localAdapterPDADataInfo === void 0 ? void 0 : localAdapterPDADataInfo.data);
                    if ((0, getTokenIndexes_1.getLocalAdapterTokenIndexHelper)(new web3_js_1.PublicKey(saber_lp.lpToken.address), localAdapterPDAData) !== -1) {
                        // mint already init so skip the trx
                        return [2 /*return*/];
                    }
                }
                else {
                    // no adapter acc created yet so don't skip init all the mints passed
                }
                quarryAccount = new web3_js_1.PublicKey(saber_lp.quarry);
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from('Miner'), quarryAccount.toBuffer(), marginPDA.toBuffer()], constants_1.quarryProgramId)];
            case 5:
                minerAccount = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(minerAccount[0], new web3_js_1.PublicKey(saber_lp.lpToken.address))];
            case 6:
                minerVault = _a.sent();
                dataLayout = (0, buffer_layout_1.struct)([
                    (0, buffer_layout_1.u8)('instruction'),
                    (0, buffer_layout_1.u8)('adapter_index'),
                    (0, buffer_layout_1.u8)('count'),
                    (0, buffer_layout_1.u8)('token_1'),
                ]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 12,
                    adapter_index: 2,
                    count: 1,
                    token_1: marginAccountTokenIndex
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: false },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.quarryAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: checkPDA[0], isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: constants_1.quarryProgramId, isSigner: false, isWritable: false },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: minerAccount[0], isSigner: false, isWritable: true },
                        { pubkey: quarryAccount, isSigner: false, isWritable: true },
                        { pubkey: constants_1.QUARRY_REWARDER, isSigner: false, isWritable: true },
                        {
                            pubkey: new web3_js_1.PublicKey(saber_lp.lpToken.address),
                            isSigner: false,
                            isWritable: true
                        },
                        { pubkey: minerVault, isSigner: false, isWritable: true }, //pool mint
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleInitializeQuarryAdapter = handleInitializeQuarryAdapter;
var handleQuarryDeposit = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, saber_lp, lpAmount) { return __awaiter(void 0, void 0, void 0, function () {
    var adapterPDA, gAdapterPDA, checkPDA, quarryAccount, minerAccount, minerVault, lpTokenAccount, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.handleInitializeQuarryAdapter)(connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, saber_lp)];
            case 1:
                _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.quarryAdapterProgramId)];
            case 2:
                adapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from('quarry')], constants_1.quarryAdapterProgramId)];
            case 3:
                gAdapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.quarryAdapterProgramId)];
            case 4:
                checkPDA = _a.sent();
                quarryAccount = new web3_js_1.PublicKey(saber_lp.quarry);
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from('Miner'), quarryAccount.toBuffer(), marginPDA.toBuffer()], constants_1.quarryProgramId)];
            case 5:
                minerAccount = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(minerAccount[0], new web3_js_1.PublicKey(saber_lp.lpToken.address))];
            case 6:
                minerVault = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(saber_lp.lpToken.address))];
            case 7:
                lpTokenAccount = _a.sent();
                dataLayout = (0, buffer_layout_1.struct)([
                    (0, buffer_layout_1.u8)('instruction'),
                    (0, buffer_layout_1.u8)('adapter_id'),
                    (0, buffer_layout_1.u32be)('instruction1'),
                    (0, buffer_layout_1.u32be)('instruction2'),
                    (0, buffer_layout_1.nu64)('deposit_amount'),
                ]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_id: 2,
                    instruction1: new bignumber_js_1["default"]('0x887e5ba2'),
                    instruction2: new bignumber_js_1["default"]('0x28830d7f'),
                    deposit_amount: lpAmount * Math.pow(10, saber_lp.lpToken.decimals)
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.quarryAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: checkPDA[0], isSigner: false, isWritable: true },
                        { pubkey: constants_1.quarryProgramId, isSigner: false, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: minerAccount[0], isSigner: false, isWritable: true },
                        { pubkey: quarryAccount, isSigner: false, isWritable: true },
                        { pubkey: minerVault, isSigner: false, isWritable: true },
                        { pubkey: lpTokenAccount, isSigner: false, isWritable: true },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: constants_1.QUARRY_REWARDER, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleQuarryDeposit = handleQuarryDeposit;
var handleQuarryWithdraw = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, saber_lp, lpAmount) { return __awaiter(void 0, void 0, void 0, function () {
    var adapterPDA, gAdapterPDA, checkPDA, quarryAccount, minerAccount, minerVault, lpTokenAccount, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.handleInitializeQuarryAdapter)(connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, saber_lp)];
            case 1:
                _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.quarryAdapterProgramId)];
            case 2:
                adapterPDA = _a.sent();
                gAdapterPDA = constants_1.quarryGAdapterPk;
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.quarryAdapterProgramId)];
            case 3:
                checkPDA = _a.sent();
                quarryAccount = new web3_js_1.PublicKey(saber_lp.quarry);
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from('Miner'), quarryAccount.toBuffer(), marginPDA.toBuffer()], constants_1.quarryProgramId)];
            case 4:
                minerAccount = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, new web3_js_1.PublicKey(saber_lp.lpToken.address), minerAccount[0], transaction)];
            case 5:
                minerVault = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(marginPDA, new web3_js_1.PublicKey(saber_lp.lpToken.address))];
            case 6:
                lpTokenAccount = _a.sent();
                dataLayout = (0, buffer_layout_1.struct)([
                    (0, buffer_layout_1.u8)('instruction'),
                    (0, buffer_layout_1.u8)('adapter_id'),
                    (0, buffer_layout_1.u32be)('instruction1'),
                    (0, buffer_layout_1.u32be)('instruction2'),
                    (0, buffer_layout_1.nu64)('withdraw_amount'),
                ]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_id: 2,
                    instruction1: new bignumber_js_1["default"]('0x0204e13d'),
                    instruction2: new bignumber_js_1["default"]('0x13b66aaa'),
                    withdraw_amount: lpAmount * Math.pow(10, saber_lp.lpToken.decimals)
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.quarryAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: checkPDA[0], isSigner: false, isWritable: true },
                        { pubkey: constants_1.quarryProgramId, isSigner: false, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: minerAccount[0], isSigner: false, isWritable: true },
                        { pubkey: quarryAccount, isSigner: false, isWritable: true },
                        { pubkey: minerVault, isSigner: false, isWritable: true },
                        { pubkey: lpTokenAccount, isSigner: false, isWritable: true },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: constants_1.QUARRY_REWARDER, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleQuarryWithdraw = handleQuarryWithdraw;
var handleQuarryClaimRewards = function (connection, xenonPDA, xenonPdaData, marginPDA, payer, transaction, saber_lp, lpAmount) { return __awaiter(void 0, void 0, void 0, function () {
    var adapterPDA, gAdapterPDA, checkPDA, quarryAccount, minerAccount, rewardTokenAccount, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.quarryAdapterProgramId)];
            case 1:
                adapterPDA = _a.sent();
                gAdapterPDA = constants_1.quarryGAdapterPk;
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.quarryAdapterProgramId)];
            case 2:
                checkPDA = _a.sent();
                quarryAccount = new web3_js_1.PublicKey(saber_lp.quarry);
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from('Miner'), quarryAccount.toBuffer(), marginPDA.toBuffer()], constants_1.quarryProgramId)];
            case 3:
                minerAccount = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, constants_1.QUARRY_REWARD_MINT, payer, transaction)];
            case 4:
                rewardTokenAccount = _a.sent();
                dataLayout = (0, buffer_layout_1.struct)([
                    (0, buffer_layout_1.u8)('instruction'),
                    (0, buffer_layout_1.u8)('adapter_id'),
                    (0, buffer_layout_1.u32be)('instruction1'),
                    (0, buffer_layout_1.u32be)('instruction2'),
                ]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_id: 2,
                    instruction1: new bignumber_js_1["default"]('0x45319ee5'),
                    instruction2: new bignumber_js_1["default"]('0xd48588e3')
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.quarryAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: checkPDA[0], isSigner: false, isWritable: true },
                        { pubkey: constants_1.quarryProgramId, isSigner: false, isWritable: false },
                        { pubkey: constants_1.QUARRY_MINT_WRAPPER, isSigner: false, isWritable: true },
                        {
                            pubkey: constants_1.QUARRY_MINT_WRAPPER_PROGRAM,
                            isSigner: false,
                            isWritable: false
                        },
                        { pubkey: constants_1.QUARRY_MINTER, isSigner: false, isWritable: true },
                        { pubkey: constants_1.QUARRY_REWARD_MINT, isSigner: false, isWritable: true },
                        { pubkey: rewardTokenAccount, isSigner: false, isWritable: true },
                        { pubkey: constants_1.QUARRY_REWARDER_ATA, isSigner: false, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: minerAccount[0], isSigner: false, isWritable: true },
                        { pubkey: quarryAccount, isSigner: false, isWritable: true },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: constants_1.QUARRY_REWARDER, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleQuarryClaimRewards = handleQuarryClaimRewards;
// All Orca Methods
// NOTE : should handle adding to margin token to Margin Acc & Adapter if not exist 
var handleInitializeOrcaAdapter = function (connection, xenonPDA, marginPDA, payer, transaction, OrcaWhirlpool) { return __awaiter(void 0, void 0, void 0, function () {
    var adapterPDA, gAdapterPDA, checkPDA, bnNumber, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.orcaAdapterProgramId)];
            case 1:
                adapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from("orca")], constants_1.orcaAdapterProgramId)];
            case 2:
                gAdapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.orcaAdapterProgramId)];
            case 3:
                checkPDA = _a.sent();
                console.log("marginPDA :", marginPDA);
                console.log("adapterPDA:", adapterPDA);
                bnNumber = new bn_js_1["default"](0);
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('adapter_index'), (0, buffer_layout_1.u8)('count'), (0, buffer_layout_1.u8)('token_index_1'), (0, buffer_layout_1.u8)('token_index_2')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 12,
                    adapter_index: 4,
                    count: 2,
                    token_index_1: 2,
                    token_index_2: 3
                }, data);
                console.log("xenonPDA::", xenonPDA);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: false },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.orcaAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: checkPDA[0], isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleInitializeOrcaAdapter = handleInitializeOrcaAdapter;
// NOTE : should be called before handleOrcaIncreaseLiquidity
// ASSUMING all the margin tokens are Initialized
var handleOrcaOpenPosition = function (connection, xenonPDA, marginPDA, payer, transaction, OrcaWhirlpool, tickLowerIndex, tickUpperIndex) { return __awaiter(void 0, void 0, void 0, function () {
    var signers, positionMintNew, positionPda, positionMetadataPda, positionTokenAccountAddress, adapterPDA, gAdapterPDA, checkPDA, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                //save positionMint
                console.log("handle Orca Open Position clicked");
                signers = [];
                positionMintNew = web3_js_1.Keypair.generate();
                console.log("positionMintNew::", positionMintNew.publicKey.toBase58());
                signers.push(positionMintNew);
                positionPda = whirlpools_sdk_1.PDAUtil.getPosition(constants_1.orcaProgramId, positionMintNew.publicKey);
                console.log("positionPDA:", positionPda.publicKey.toBase58());
                positionMetadataPda = whirlpools_sdk_1.PDAUtil.getPositionMetadata(positionMintNew.publicKey);
                console.log("positionMetadata: ", positionMetadataPda.publicKey.toBase58());
                return [4 /*yield*/, spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, positionMintNew.publicKey, marginPDA, true)];
            case 1:
                positionTokenAccountAddress = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.orcaAdapterProgramId)];
            case 2:
                adapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from("orca")], constants_1.orcaAdapterProgramId)];
            case 3:
                gAdapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.orcaAdapterProgramId)];
            case 4:
                checkPDA = _a.sent();
                console.log("checkPDA:", checkPDA);
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('adapter_index'), (0, buffer_layout_1.u32be)('instruction1'), (0, buffer_layout_1.u32be)('instruction2'), (0, buffer_layout_1.u8)('position_bump'), (0, buffer_layout_1.u8)('metadata_bump'), (0, xenonLayout_1.i32)('tick_lower_index'), (0, xenonLayout_1.i32)('tick_upper_index')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_index: 4,
                    instruction1: new bn_js_1["default"]('0xf21d8630'),
                    instruction2: new bn_js_1["default"]('0x3a6e0e3c'),
                    position_bump: positionPda.bump,
                    metadata_bump: positionMetadataPda.bump,
                    tick_lower_index: tickLowerIndex,
                    tick_upper_index: tickUpperIndex
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.orcaAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: checkPDA[0], isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: constants_1.orcaProgramId, isSigner: false, isWritable: false },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: positionPda.publicKey, isSigner: false, isWritable: true },
                        { pubkey: positionMintNew.publicKey, isSigner: false, isWritable: true },
                        { pubkey: positionMetadataPda.publicKey, isSigner: false, isWritable: true },
                        { pubkey: positionTokenAccountAddress, isSigner: false, isWritable: true },
                        { pubkey: new web3_js_1.PublicKey(OrcaWhirlpool.address), isSigner: false, isWritable: true },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: web3_js_1.SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
                        { pubkey: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: constants_1.METAPLEX_TOKEN_METADATA, isSigner: false, isWritable: false },
                        { pubkey: new web3_js_1.PublicKey('3axbTs2z5GBy6usVbNVoqEgZMng3vZvMnAoX29BFfwhr'), isSigner: false, isWritable: true }, //metadata update auth : TODO ??
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/, positionMintNew.publicKey];
        }
    });
}); };
exports.handleOrcaOpenPosition = handleOrcaOpenPosition;
// NOTE : should be called after handleOrcaOpenPosition
//  ASSUMING all the margin tokens are Initialized
var handleOrcaIncreaseLiquidity = function (connection, xenonPDA, marginPDA, payer, transaction, WhirlpoolClient, OrcaWhirlpool, positionMint, maxTokenAAmount, maxTokenBAmount) { return __awaiter(void 0, void 0, void 0, function () {
    var pool, poolData, token_a_vault, token_b_vault, positionPda, positionTokenAccountAddress, position, positionData, adapterPDA, gAdapterPDA, checkPDA, token_a_user, token_b_user, tickSpacing, tick_array_lower, tick_array_upper, currTick, tickLowerIndex, tickUpperIndex, tokenAmount, liquidityAmount, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("handle Orca Increase Liquidity clicked");
                return [4 /*yield*/, WhirlpoolClient.getPool(OrcaWhirlpool.address)];
            case 1:
                pool = _a.sent();
                poolData = pool.getData();
                token_a_vault = poolData.tokenVaultA;
                token_b_vault = poolData.tokenVaultB;
                positionPda = whirlpools_sdk_1.PDAUtil.getPosition(constants_1.orcaProgramId, positionMint);
                console.log("positionPDA:", positionPda);
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, positionMint, marginPDA, transaction)];
            case 2:
                positionTokenAccountAddress = _a.sent();
                console.log("positionTokenAccountAddress:", positionTokenAccountAddress);
                return [4 /*yield*/, WhirlpoolClient.getPosition(positionPda.publicKey)];
            case 3:
                position = _a.sent();
                positionData = position.getData();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.orcaAdapterProgramId)];
            case 4:
                adapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from("orca")], constants_1.orcaAdapterProgramId)];
            case 5:
                gAdapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.orcaAdapterProgramId)];
            case 6:
                checkPDA = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, new web3_js_1.PublicKey(OrcaWhirlpool.tokenMintA), marginPDA, transaction)];
            case 7:
                token_a_user = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, new web3_js_1.PublicKey(OrcaWhirlpool.tokenMintB), marginPDA, transaction)];
            case 8:
                token_b_user = _a.sent();
                console.log("token_a_user: ", token_a_user.toBase58());
                console.log("token_b_user: ", token_b_user.toBase58());
                tickSpacing = poolData.tickSpacing;
                tick_array_lower = whirlpools_sdk_1.PDAUtil.getTickArrayFromTickIndex(positionData.tickLowerIndex, tickSpacing, new web3_js_1.PublicKey('HJPjoWUrhoZzkNfRpHuieeFk9WcZWjwy6PBjZ81ngndJ'), constants_1.orcaProgramId);
                tick_array_upper = whirlpools_sdk_1.PDAUtil.getTickArrayFromTickIndex(positionData.tickUpperIndex, tickSpacing, new web3_js_1.PublicKey('HJPjoWUrhoZzkNfRpHuieeFk9WcZWjwy6PBjZ81ngndJ'), constants_1.orcaProgramId);
                console.log("tick_array_lower:", tick_array_lower);
                console.log("tick_array_upper:", tick_array_upper);
                currTick = poolData.tickCurrentIndex;
                tickLowerIndex = positionData.tickLowerIndex;
                tickUpperIndex = positionData.tickUpperIndex;
                tokenAmount = (0, whirlpools_sdk_1.toTokenAmount)(maxTokenAAmount, maxTokenBAmount);
                liquidityAmount = whirlpools_sdk_1.PoolUtil.estimateLiquidityFromTokenAmounts(currTick, tickLowerIndex, tickUpperIndex, tokenAmount);
                console.log("liquidityAmount ::", liquidityAmount.toString());
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('adapter_index'), (0, buffer_layout_1.u32be)('instruction1'), (0, buffer_layout_1.u32be)('instruction2'), (0, xenonLayout_1.u128)('liquidity_amount'), (0, buffer_layout_1.nu64)('token_max_a'), (0, buffer_layout_1.nu64)('token_max_b')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_index: 4,
                    instruction1: new bn_js_1["default"]('0x2e9cf376'),
                    instruction2: new bn_js_1["default"]('0x0dcdfbb2'),
                    liquidity_amount: liquidityAmount,
                    token_max_a: maxTokenAAmount,
                    token_max_b: maxTokenBAmount
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.orcaAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: checkPDA[0], isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: constants_1.orcaProgramId, isSigner: false, isWritable: false },
                        { pubkey: new web3_js_1.PublicKey(OrcaWhirlpool.address), isSigner: false, isWritable: true },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: positionPda.publicKey, isSigner: false, isWritable: true },
                        { pubkey: positionTokenAccountAddress, isSigner: false, isWritable: true },
                        { pubkey: token_a_user, isSigner: false, isWritable: true },
                        { pubkey: token_b_user, isSigner: false, isWritable: true },
                        { pubkey: token_a_vault, isSigner: false, isWritable: true },
                        { pubkey: token_b_vault, isSigner: false, isWritable: true },
                        { pubkey: tick_array_lower.publicKey, isSigner: false, isWritable: true },
                        { pubkey: tick_array_upper.publicKey, isSigner: false, isWritable: true }, //tick_array_upper
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleOrcaIncreaseLiquidity = handleOrcaIncreaseLiquidity;
// Withdarw Flow -------------
var handleOrcaUpdateFeesAndReward = function (connection, xenonPDA, marginPDA, payer, transaction, WhirlpoolClient, OrcaWhirlpool, positionMint) { return __awaiter(void 0, void 0, void 0, function () {
    var adapterPDA, gAdapterPDA, checkPDA, positionPda, positionMetadataPda, pool, poolData, position, positionData, tickSpacing, tick_array_lower, tick_array_upper, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("handle Orca update clicked");
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.orcaAdapterProgramId)];
            case 1:
                adapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from("orca")], constants_1.orcaAdapterProgramId)];
            case 2:
                gAdapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.orcaAdapterProgramId)];
            case 3:
                checkPDA = _a.sent();
                positionPda = whirlpools_sdk_1.PDAUtil.getPosition(constants_1.orcaProgramId, positionMint);
                console.log("positionPDA:", positionPda.publicKey.toBase58());
                positionMetadataPda = whirlpools_sdk_1.PDAUtil.getPositionMetadata(positionMint);
                console.log("positionMetadata: ", positionMetadataPda.publicKey.toBase58());
                return [4 /*yield*/, WhirlpoolClient.getPool(OrcaWhirlpool.address)];
            case 4:
                pool = _a.sent();
                poolData = pool.getData();
                return [4 /*yield*/, WhirlpoolClient.getPosition(positionPda.publicKey)];
            case 5:
                position = _a.sent();
                positionData = position.getData();
                tickSpacing = poolData.tickSpacing;
                tick_array_lower = whirlpools_sdk_1.PDAUtil.getTickArrayFromTickIndex(positionData.tickLowerIndex, tickSpacing, new web3_js_1.PublicKey(OrcaWhirlpool.address), constants_1.orcaProgramId);
                tick_array_upper = whirlpools_sdk_1.PDAUtil.getTickArrayFromTickIndex(positionData.tickUpperIndex, tickSpacing, new web3_js_1.PublicKey(OrcaWhirlpool.address), constants_1.orcaProgramId);
                console.log("tick_array_lower:", tick_array_lower);
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('adapter_index'), (0, buffer_layout_1.u32be)('instruction1'), (0, buffer_layout_1.u32be)('instruction2')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_index: 4,
                    instruction1: new bn_js_1["default"]('0x9ae6fa0d'),
                    instruction2: new bn_js_1["default"]('0xecd14bdf')
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.orcaAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: checkPDA[0], isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.orcaProgramId, isSigner: false, isWritable: false },
                        { pubkey: new web3_js_1.PublicKey(OrcaWhirlpool.address), isSigner: false, isWritable: true },
                        { pubkey: positionPda.publicKey, isSigner: false, isWritable: true },
                        { pubkey: tick_array_lower.publicKey, isSigner: false, isWritable: true },
                        { pubkey: tick_array_upper.publicKey, isSigner: false, isWritable: true }, //tick_array_upper
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleOrcaUpdateFeesAndReward = handleOrcaUpdateFeesAndReward;
var handleOrcaCollectFees = function (connection, xenonPDA, marginPDA, payer, transaction, WhirlpoolClient, OrcaWhirlpool, positionMint) { return __awaiter(void 0, void 0, void 0, function () {
    var adapterPDA, gAdapterPDA, checkPDA, positionPda, positionTokenAccountAddress, token_a_user, token_b_user, pool, poolData, token_a_vault, token_b_vault, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("handle Orca collect fees clicked");
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.orcaAdapterProgramId)];
            case 1:
                adapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from("orca")], constants_1.orcaAdapterProgramId)];
            case 2:
                gAdapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.orcaAdapterProgramId)];
            case 3:
                checkPDA = _a.sent();
                positionPda = whirlpools_sdk_1.PDAUtil.getPosition(constants_1.orcaProgramId, positionMint);
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, positionMint, marginPDA, transaction)];
            case 4:
                positionTokenAccountAddress = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, new web3_js_1.PublicKey(OrcaWhirlpool.tokenMintA), marginPDA, transaction)];
            case 5:
                token_a_user = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, new web3_js_1.PublicKey(OrcaWhirlpool.tokenMintB), marginPDA, transaction)];
            case 6:
                token_b_user = _a.sent();
                return [4 /*yield*/, WhirlpoolClient.getPool(OrcaWhirlpool.address)];
            case 7:
                pool = _a.sent();
                poolData = pool.getData();
                token_a_vault = poolData.tokenVaultA;
                token_b_vault = poolData.tokenVaultB;
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('adapter_index'), (0, buffer_layout_1.u32be)('instruction1'), (0, buffer_layout_1.u32be)('instruction2')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_index: 4,
                    instruction1: 0xa498cf63,
                    instruction2: 0x1eba13b6
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.orcaAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: checkPDA[0], isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: constants_1.orcaProgramId, isSigner: false, isWritable: false },
                        { pubkey: new web3_js_1.PublicKey('HJPjoWUrhoZzkNfRpHuieeFk9WcZWjwy6PBjZ81ngndJ'), isSigner: false, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: positionPda.publicKey, isSigner: false, isWritable: true },
                        { pubkey: positionTokenAccountAddress, isSigner: false, isWritable: true },
                        { pubkey: token_a_user, isSigner: false, isWritable: true },
                        { pubkey: token_a_vault, isSigner: false, isWritable: true },
                        { pubkey: token_b_user, isSigner: false, isWritable: true },
                        { pubkey: token_b_vault, isSigner: false, isWritable: true },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleOrcaCollectFees = handleOrcaCollectFees;
// TODO : Should be called multiple times for multiple rewards ?? or handle internally ??
var handleOrcaCollectRewards = function (connection, xenonPDA, marginPDA, payer, transaction, WhirlpoolClient, OrcaWhirlpool, positionMint) { return __awaiter(void 0, void 0, void 0, function () {
    var adapterPDA, gAdapterPDA, checkPDA, positionPda, positionTokenAccountAddress, pool, poolData, rewardInfos, i, reward_owner, reward_vault, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("handle Orca collect rewards clicked");
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.orcaAdapterProgramId)];
            case 1:
                adapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from("orca")], constants_1.orcaAdapterProgramId)];
            case 2:
                gAdapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.orcaAdapterProgramId)];
            case 3:
                checkPDA = _a.sent();
                positionPda = whirlpools_sdk_1.PDAUtil.getPosition(constants_1.orcaProgramId, positionMint);
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, positionMint, marginPDA, transaction)];
            case 4:
                positionTokenAccountAddress = _a.sent();
                console.log("positionTokn:", positionTokenAccountAddress);
                return [4 /*yield*/, WhirlpoolClient.getPool(OrcaWhirlpool.address)];
            case 5:
                pool = _a.sent();
                poolData = pool.getData();
                rewardInfos = poolData.rewardInfos;
                i = 0;
                _a.label = 6;
            case 6:
                if (!(i < rewardInfos.length)) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, new web3_js_1.PublicKey(rewardInfos[i].mint), payer, transaction)];
            case 7:
                reward_owner = _a.sent();
                reward_vault = new web3_js_1.PublicKey(rewardInfos[i].vault);
                console.log("reward_owner:", reward_owner.toBase58());
                console.log("rewrd_vault:", reward_vault.toBase58());
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('adapter_index'), (0, buffer_layout_1.u32be)('instruction1'), (0, buffer_layout_1.u32be)('instruction2'), (0, buffer_layout_1.u8)('reward_index')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_index: 4,
                    instruction1: 0x46058457,
                    instruction2: 0x56ebb122,
                    reward_index: i
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.orcaAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: checkPDA[0], isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: constants_1.orcaProgramId, isSigner: false, isWritable: false },
                        { pubkey: new web3_js_1.PublicKey(OrcaWhirlpool.address), isSigner: false, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: positionPda.publicKey, isSigner: false, isWritable: true },
                        { pubkey: positionTokenAccountAddress, isSigner: false, isWritable: true },
                        { pubkey: reward_owner, isSigner: false, isWritable: true },
                        { pubkey: reward_vault, isSigner: false, isWritable: true },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                _a.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 6];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.handleOrcaCollectRewards = handleOrcaCollectRewards;
var handleOrcaDecreaseLiquidity = function (connection, xenonPDA, marginPDA, payer, transaction, WhirlpoolClient, OrcaWhirlpool, positionMint, withdrawFull, liquidityAmountBN, tokenMinA, tokenMinB) {
    if (withdrawFull === void 0) { withdrawFull = true; }
    if (liquidityAmountBN === void 0) { liquidityAmountBN = (new bn_js_1["default"](0)); }
    if (tokenMinA === void 0) { tokenMinA = 0; }
    if (tokenMinB === void 0) { tokenMinB = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var positionPda, positionTokenAccountAddress, position, positionData, liquidity_amount, adapterPDA, gAdapterPDA, checkPDA, token_a_user, token_b_user, pool, poolData, token_a_vault, token_b_vault, tickSpacing, tick_array_lower, tick_array_upper, dataLayout, data, instruction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("handle Orca decrease Liquidity clicked");
                    positionPda = whirlpools_sdk_1.PDAUtil.getPosition(constants_1.orcaProgramId, positionMint);
                    return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, positionMint, marginPDA, transaction)];
                case 1:
                    positionTokenAccountAddress = _a.sent();
                    return [4 /*yield*/, WhirlpoolClient.getPosition(positionPda.publicKey)];
                case 2:
                    position = _a.sent();
                    positionData = position.getData();
                    liquidity_amount = positionData.liquidity;
                    console.log("SOL USDC positionData:", liquidity_amount.toString());
                    return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.orcaAdapterProgramId)];
                case 3:
                    adapterPDA = _a.sent();
                    return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from("orca")], constants_1.orcaAdapterProgramId)];
                case 4:
                    gAdapterPDA = _a.sent();
                    return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.orcaAdapterProgramId)];
                case 5:
                    checkPDA = _a.sent();
                    return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, new web3_js_1.PublicKey(OrcaWhirlpool.tokenMintA), marginPDA, transaction)];
                case 6:
                    token_a_user = _a.sent();
                    return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, new web3_js_1.PublicKey(OrcaWhirlpool.tokenMintB), marginPDA, transaction)];
                case 7:
                    token_b_user = _a.sent();
                    console.log("token_a_user: ", token_a_user.toBase58());
                    console.log("token_b_user: ", token_b_user.toBase58());
                    return [4 /*yield*/, WhirlpoolClient.getPool(OrcaWhirlpool.address)];
                case 8:
                    pool = _a.sent();
                    poolData = pool.getData();
                    token_a_vault = poolData.tokenVaultA;
                    token_b_vault = poolData.tokenVaultB;
                    tickSpacing = 64;
                    tick_array_lower = whirlpools_sdk_1.PDAUtil.getTickArrayFromTickIndex(positionData.tickLowerIndex, tickSpacing, new web3_js_1.PublicKey(OrcaWhirlpool.address), constants_1.orcaProgramId);
                    tick_array_upper = whirlpools_sdk_1.PDAUtil.getTickArrayFromTickIndex(positionData.tickUpperIndex, tickSpacing, new web3_js_1.PublicKey(OrcaWhirlpool.address), constants_1.orcaProgramId);
                    dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('adapter_index'), (0, buffer_layout_1.u32be)('instruction1'), (0, buffer_layout_1.u32be)('instruction2'), (0, xenonLayout_1.u128)('liqiuidity_amount'), (0, buffer_layout_1.nu64)('token_min_a'), (0, buffer_layout_1.nu64)('token_min_b')]);
                    data = Buffer.alloc(dataLayout.span);
                    dataLayout.encode({
                        instruction: 10,
                        adapter_index: 4,
                        instruction1: 0xa026d06f,
                        instruction2: 0x685b2c01,
                        liqiuidity_amount: withdrawFull ? liquidity_amount : liquidityAmountBN,
                        token_min_a: tokenMinA,
                        token_min_b: tokenMinB
                    }, data);
                    instruction = new web3_js_1.TransactionInstruction({
                        keys: [
                            { pubkey: xenonPDA, isSigner: false, isWritable: true },
                            { pubkey: payer, isSigner: true, isWritable: false },
                            { pubkey: marginPDA, isSigner: false, isWritable: true },
                            { pubkey: constants_1.orcaAdapterProgramId, isSigner: false, isWritable: false },
                            { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
                            { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                            { pubkey: checkPDA[0], isSigner: false, isWritable: true },
                            { pubkey: payer, isSigner: true, isWritable: true },
                            { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
                            { pubkey: constants_1.orcaProgramId, isSigner: false, isWritable: false },
                            { pubkey: new web3_js_1.PublicKey(OrcaWhirlpool.address), isSigner: false, isWritable: true },
                            { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                            { pubkey: marginPDA, isSigner: false, isWritable: true },
                            { pubkey: positionPda.publicKey, isSigner: false, isWritable: true },
                            { pubkey: positionTokenAccountAddress, isSigner: false, isWritable: true },
                            { pubkey: token_a_user, isSigner: false, isWritable: true },
                            { pubkey: token_b_user, isSigner: false, isWritable: true },
                            { pubkey: token_a_vault, isSigner: false, isWritable: true },
                            { pubkey: token_b_vault, isSigner: false, isWritable: true },
                            { pubkey: tick_array_lower.publicKey, isSigner: false, isWritable: true },
                            { pubkey: tick_array_upper.publicKey, isSigner: false, isWritable: true }, //tick_array_upper
                        ],
                        programId: constants_1.programId,
                        data: data
                    });
                    transaction.add(instruction);
                    return [2 /*return*/];
            }
        });
    });
};
exports.handleOrcaDecreaseLiquidity = handleOrcaDecreaseLiquidity;
var handleOrcaClosePosition = function (connection, xenonPDA, marginPDA, payer, transaction, WhirlpoolClient, OrcaWhirlpool, positionMint) { return __awaiter(void 0, void 0, void 0, function () {
    var adapterPDA, gAdapterPDA, checkPDA, positionPda, positionTokenAccountAddress, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("handle Orca close position clicked");
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([marginPDA.toBuffer()], constants_1.orcaAdapterProgramId)];
            case 1:
                adapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([Buffer.from("orca")], constants_1.orcaAdapterProgramId)];
            case 2:
                gAdapterPDA = _a.sent();
                return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], constants_1.orcaAdapterProgramId)];
            case 3:
                checkPDA = _a.sent();
                positionPda = whirlpools_sdk_1.PDAUtil.getPosition(constants_1.orcaProgramId, positionMint);
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, payer, positionMint, marginPDA, transaction)];
            case 4:
                positionTokenAccountAddress = _a.sent();
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.u8)('adapter_index'), (0, buffer_layout_1.u32be)('instruction1'), (0, buffer_layout_1.u32be)('instruction2')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 10,
                    adapter_index: 4,
                    instruction1: 0x7b865100,
                    instruction2: 0x31446262
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: constants_1.orcaAdapterProgramId, isSigner: false, isWritable: false },
                        { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
                        { pubkey: checkPDA[0], isSigner: false, isWritable: true },
                        { pubkey: payer, isSigner: true, isWritable: true },
                        { pubkey: constants_1.SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
                        { pubkey: constants_1.orcaProgramId, isSigner: false, isWritable: false },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: marginPDA, isSigner: false, isWritable: true },
                        { pubkey: positionPda.publicKey, isSigner: false, isWritable: true },
                        { pubkey: positionMint, isSigner: false, isWritable: true },
                        { pubkey: positionTokenAccountAddress, isSigner: false, isWritable: true },
                        { pubkey: spl_token_1.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
                    ],
                    programId: constants_1.programId,
                    data: data
                });
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.handleOrcaClosePosition = handleOrcaClosePosition;
