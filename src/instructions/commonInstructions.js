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
exports.updateGlobalPriceCache = void 0;
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("../constants");
var getXenonAccountData_1 = require("../utils/accounts/getXenonAccountData");
var buffer_layout_1 = require("buffer-layout");
var __1 = require("..");
var updateGlobalPriceCache = function (connection, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var xenonData, keys, i, dataLayout, data, instruction, additionalComputeBudgetInstruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, getXenonAccountData_1.getXenonAccountData)(connection, constants_1.xenonPDA)];
            case 1:
                xenonData = _a.sent();
                keys = [];
                keys.push({ pubkey: constants_1.xenonPDA, isSigner: false, isWritable: true });
                for (i = 0; i < xenonData.token_count; i++) {
                    if (xenonData.token_list[i].token_type === 0) {
                        keys.push({
                            pubkey: xenonData.token_list[i].accounts[0],
                            isSigner: false,
                            isWritable: true
                        });
                        keys.push({
                            pubkey: xenonData.token_list[i].accounts[1],
                            isSigner: false,
                            isWritable: true
                        });
                    }
                    else if (xenonData.token_list[i].token_type === 1) {
                        keys.push({
                            pubkey: xenonData.token_list[i].mint,
                            isSigner: false,
                            isWritable: true
                        });
                        keys.push({
                            pubkey: xenonData.token_list[i].accounts[0],
                            isSigner: false,
                            isWritable: true
                        });
                        keys.push({
                            pubkey: xenonData.token_list[i].accounts[1],
                            isSigner: false,
                            isWritable: false
                        });
                    }
                    else if (xenonData.token_list[i].token_type === 2) {
                        keys.push({
                            pubkey: xenonData.token_list[i].accounts[0],
                            isSigner: false,
                            isWritable: true
                        });
                        keys.push({
                            pubkey: xenonData.token_list[i].accounts[1],
                            isSigner: false,
                            isWritable: true
                        });
                        keys.push({
                            pubkey: xenonData.token_list[i].accounts[2],
                            isSigner: false,
                            isWritable: true
                        });
                        keys.push({
                            pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY,
                            isSigner: false,
                            isWritable: false
                        });
                        keys.push({
                            pubkey: __1.solendProgramID,
                            isSigner: false,
                            isWritable: false
                        });
                    }
                }
                dataLayout = (0, buffer_layout_1.struct)([(0, buffer_layout_1.u8)('instruction')]);
                data = Buffer.alloc(dataLayout.span);
                dataLayout.encode({
                    instruction: 19
                }, data);
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
exports.updateGlobalPriceCache = updateGlobalPriceCache;
