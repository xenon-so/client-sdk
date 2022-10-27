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
exports.wrapSol = exports.createDefaultKeys = exports.getMultipleAccounts = exports.createAccountInstruction = exports.createAssociatedTokenAccountIfNotExist = exports.findAssociatedTokenAddress = exports.findProgramAddress = void 0;
var spl_token_1 = require("@solana/spl-token");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var buffer_layout_1 = require("buffer-layout");
function findProgramAddress(seeds, programId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, publicKey, nonce;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress(seeds, programId)];
                case 1:
                    _a = _b.sent(), publicKey = _a[0], nonce = _a[1];
                    return [2 /*return*/, { publicKey: publicKey, nonce: nonce }];
            }
        });
    });
}
exports.findProgramAddress = findProgramAddress;
function findAssociatedTokenAddress(walletAddress, tokenMintAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var publicKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findProgramAddress([
                        walletAddress.toBuffer(),
                        spl_token_1.TOKEN_PROGRAM_ID.toBuffer(),
                        tokenMintAddress.toBuffer(),
                    ], spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID)];
                case 1:
                    publicKey = (_a.sent()).publicKey;
                    return [2 /*return*/, publicKey];
            }
        });
    });
}
exports.findAssociatedTokenAddress = findAssociatedTokenAddress;
function createAssociatedTokenAccountIfNotExist(connection, payer, tokenMintAddress, owner, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var associatedTokenAddress, tokenAccount, keys;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findAssociatedTokenAddress(owner, tokenMintAddress)];
                case 1:
                    associatedTokenAddress = _a.sent();
                    return [4 /*yield*/, connection.getAccountInfo(associatedTokenAddress, 'processed')];
                case 2:
                    tokenAccount = _a.sent();
                    if (tokenAccount == null) {
                        keys = [
                            {
                                pubkey: payer,
                                isSigner: true,
                                isWritable: true
                            },
                            {
                                pubkey: associatedTokenAddress,
                                isSigner: false,
                                isWritable: true
                            },
                            {
                                pubkey: owner,
                                isSigner: false,
                                isWritable: false
                            },
                            {
                                pubkey: tokenMintAddress,
                                isSigner: false,
                                isWritable: false
                            },
                            {
                                pubkey: constants_1.SYSTEM_PROGRAM_ID,
                                isSigner: false,
                                isWritable: false
                            },
                            {
                                pubkey: spl_token_1.TOKEN_PROGRAM_ID,
                                isSigner: false,
                                isWritable: false
                            },
                            {
                                pubkey: constants_1.RENT_PROGRAM_ID,
                                isSigner: false,
                                isWritable: false
                            },
                        ];
                        transaction.add(new web3_js_1.TransactionInstruction({
                            keys: keys,
                            programId: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
                            data: Buffer.from([])
                        }));
                        //await signAndSendTransaction(wallet, transaction)
                    }
                    return [2 /*return*/, associatedTokenAddress];
            }
        });
    });
}
exports.createAssociatedTokenAccountIfNotExist = createAssociatedTokenAccountIfNotExist;
function createAccountInstruction(connection, payer, space, programId, lamports, transaction, signers) {
    return __awaiter(this, void 0, void 0, function () {
        var account, instruction, _a, _b, _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    account = new web3_js_1.Account();
                    _b = (_a = web3_js_1.SystemProgram).createAccount;
                    _d = {
                        fromPubkey: payer,
                        newAccountPubkey: account.publicKey
                    };
                    if (!lamports) return [3 /*break*/, 1];
                    _c = lamports;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(space)];
                case 2:
                    _c = _e.sent();
                    _e.label = 3;
                case 3:
                    instruction = _b.apply(_a, [(_d.lamports = _c,
                            _d.space = space,
                            _d.programId = programId,
                            _d)]);
                    transaction.add(instruction);
                    signers.push(account);
                    return [2 /*return*/, account.publicKey];
            }
        });
    });
}
exports.createAccountInstruction = createAccountInstruction;
function getMultipleAccounts(connection, publicKeys, commitment) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var len, mid, publicKeyStrs, args, resp, nullResults;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    len = publicKeys.length;
                    if (len === 0) {
                        return [2 /*return*/, []];
                    }
                    if (len > 100) {
                        mid = Math.floor(publicKeys.length / 2);
                        return [2 /*return*/, Promise.all([
                                getMultipleAccounts(connection, publicKeys.slice(0, mid), commitment),
                                getMultipleAccounts(connection, publicKeys.slice(mid, len), commitment),
                            ]).then(function (a) { return a[0].concat(a[1]); })];
                    }
                    publicKeyStrs = publicKeys.map(function (pk) { return pk.toBase58(); });
                    // load connection commitment as a default
                    commitment || (commitment = connection.commitment);
                    args = commitment ? [publicKeyStrs, { commitment: commitment }] : [publicKeyStrs];
                    return [4 /*yield*/, connection._rpcRequest('getMultipleAccounts', args)];
                case 1:
                    resp = _b.sent();
                    if (resp.error) {
                        throw new Error(resp.error.message);
                    }
                    if (resp.result) {
                        nullResults = resp.result.value.filter(function (r) { return (r === null || r === void 0 ? void 0 : r.account) === null; });
                        if (nullResults.length > 0)
                            throw new Error("gma returned ".concat(nullResults.length, " null results. ex: ").concat((_a = nullResults[0]) === null || _a === void 0 ? void 0 : _a.pubkey.toString()));
                    }
                    return [2 /*return*/, resp.result.value.map(function (f, i) {
                            if (f === null) {
                                return undefined;
                            }
                            var data = f.data, executable = f.executable, lamports = f.lamports, owner = f.owner;
                            return {
                                publicKey: publicKeys[i],
                                context: resp.result.context,
                                accountInfo: {
                                    data: Buffer.from(data[0], 'base64'),
                                    executable: executable,
                                    owner: new web3_js_1.PublicKey(owner),
                                    lamports: lamports
                                }
                            };
                        })];
            }
        });
    });
}
exports.getMultipleAccounts = getMultipleAccounts;
var createDefaultKeys = function (count) {
    var keys = __spreadArray([], Array(count).keys(), true).map(function (f) {
        return { pubkey: web3_js_1.PublicKey["default"], isSigner: false, isWritable: false };
    });
    return keys;
};
exports.createDefaultKeys = createDefaultKeys;
var wrapSol = function (connection, trader, amount, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var ata, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createAssociatedTokenAccountIfNotExist(connection, trader, // payer
                spl_token_1.NATIVE_MINT, // mint
                trader, // owner
                transaction)];
            case 1:
                ata = _a.sent();
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 17
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: ata, isSigner: false, isWritable: true }, //xenon State Account
                    ],
                    programId: spl_token_1.TOKEN_PROGRAM_ID,
                    data: data
                });
                transaction.add(
                // trasnfer SOL
                web3_js_1.SystemProgram.transfer({
                    fromPubkey: trader,
                    toPubkey: ata,
                    lamports: amount * 1e9
                }));
                transaction.add(instruction);
                return [2 /*return*/];
        }
    });
}); };
exports.wrapSol = wrapSol;
