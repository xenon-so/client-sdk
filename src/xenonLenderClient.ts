import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { programId, xenonPDA } from './constants';
import * as lenderInstructions from './instructions/lenderInstructions';
import * as commonInstructions from './instructions/commonInstructions';

/**
 * Class for interacting with Xenon's lending functionalities
 *
 * ### Example
 * ```js
 * import { XenonLenderClient } from '@xenon/sdk'
 *
 * ...
 * const xenonLenderClient = new XenonLenderClient(connection, publicKey)
 * await xenonLenderClient.load();
 * const transaction = new Transaction();
 * await client.lend(transaction, amount, mintAddress);
 * sendTransaction(transaction)...
 * ```
 *
 * @param connection - connection
 * @param lender - lender's publickey
 */

export class XenonLenderClient {
  connection: Connection;
  lender: PublicKey;

  constructor(connection: Connection, lender: PublicKey) {
    this.connection = connection;
    this.lender = lender;
  }

  async lend(transaction: Transaction, amount: number) {
    return lenderInstructions.deposit(
      this.connection,
      xenonPDA,
      transaction,
      this.lender,
      amount
    );
  }

  async withdraw(transaction: Transaction, amount: number) {
    return lenderInstructions.withdraw(
      this.connection,
      xenonPDA,
      transaction,
      this.lender,
      amount
    );
  }

  async updateGlobalPrices(transaction: Transaction, amount: number) {
    return commonInstructions.updateGlobalPriceCache(
      this.connection,
      transaction
    );
  }
}
