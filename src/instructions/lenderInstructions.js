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
exports.withdraw = exports.deposit = void 0;
var spl_token_1 = require("@solana/spl-token");
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var tokens_1 = require("../utils/tokens");
var web3Utils_1 = require("../utils/web3Utils");
var buffer_layout_1 = require("buffer-layout");
var deposit = function (connection, xenonPDA, transaction, owner, amount) { return __awaiter(void 0, void 0, void 0, function () {
    var xeUSDC, vaultAccount, baseTokenAccount, xeUsdcAccount, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                xeUSDC = new web3_js_1.PublicKey(tokens_1.TOKENS.xeUSDC.mintAddress);
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(xenonPDA, new web3_js_1.PublicKey(tokens_1.TOKENS['USDC'].mintAddress))];
            case 1:
                vaultAccount = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, owner, new web3_js_1.PublicKey(tokens_1.TOKENS['USDC'].mintAddress), owner, transaction)];
            case 2:
                baseTokenAccount = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, owner, xeUSDC, owner, transaction)];
            case 3:
                xeUsdcAccount = _a.sent();
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.nu64)('quantity')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 1,
                    quantity: amount * Math.pow(10, tokens_1.TOKENS.USDC.decimals)
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: owner, isSigner: true, isWritable: true },
                        { pubkey: baseTokenAccount, isSigner: false, isWritable: true },
                        { pubkey: vaultAccount, isSigner: false, isWritable: true },
                        { pubkey: xeUsdcAccount, isSigner: false, isWritable: true },
                        { pubkey: xeUSDC, isSigner: false, isWritable: true },
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
var withdraw = function (connection, xenonPDA, transaction, key, amount) { return __awaiter(void 0, void 0, void 0, function () {
    var xeUSDC, baseTokenAccount, vaultAccount, xeUsdcAccount, dataLayout, data, instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                xeUSDC = new web3_js_1.PublicKey(tokens_1.TOKENS.xeUSDC.mintAddress);
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(key, new web3_js_1.PublicKey(tokens_1.TOKENS['USDC'].mintAddress))];
            case 1:
                baseTokenAccount = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.findAssociatedTokenAddress)(xenonPDA, new web3_js_1.PublicKey(tokens_1.TOKENS['USDC'].mintAddress))];
            case 2:
                vaultAccount = _a.sent();
                return [4 /*yield*/, (0, web3Utils_1.createAssociatedTokenAccountIfNotExist)(connection, key, xeUSDC, key, transaction)];
            case 3:
                xeUsdcAccount = _a.sent();
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction'), (0, buffer_layout_1.nu64)('quantity')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 2,
                    quantity: amount * Math.pow(10, tokens_1.TOKENS['USDC'].decimals)
                }, data);
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [
                        { pubkey: xenonPDA, isSigner: false, isWritable: true },
                        { pubkey: key, isSigner: true, isWritable: true },
                        { pubkey: baseTokenAccount, isSigner: false, isWritable: true },
                        { pubkey: vaultAccount, isSigner: false, isWritable: true },
                        { pubkey: xeUsdcAccount, isSigner: false, isWritable: true },
                        { pubkey: xeUSDC, isSigner: false, isWritable: true },
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
