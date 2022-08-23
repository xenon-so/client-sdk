import { Connection, Transaction } from '@solana/web3.js';

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getUnixTs = () => {
  return new Date().getTime() / 1000;
};

export async function awaitTransactionSignatureConfirmation({
  connection,
  txid,
  timeout,
  confirmations = 1,
}) {
  let done = false;
  const result = await new Promise((resolve, reject) => {
    // eslint-disable-next-line
    (async () => {
      setTimeout(() => {
        if (done) {
          return;
        }
        done = true;
        // console.log('Timed out for txid', txid);
        reject({ timeout: true });
      }, timeout);

      while (!done) {
        // eslint-disable-next-line
        (async () => {
          try {
            const signatureStatuses = await connection.getSignatureStatuses([
              txid,
            ]);
            const result = signatureStatuses && signatureStatuses.value[0];
            if (!done) {
              if (!result) {
                // console.log('REST null result for', txid, result);
              } else if (result.err) {
                // console.log('REST error for', txid, result);
                done = true;
                reject(result.err);
              }
              // @ts-ignore
              else if (
                !(
                  result.confirmations >= confirmations ||
                  result.confirmationStatus === 'finalized'
                )
              ) {
              } else {
                console.log('confirmed', txid, result);
                done = true;
                resolve(result);
              }
            }
          } catch (e) {
            if (!done) {
              // console.log('REST connection error: txid', txid, e);
            }
          }
        })();
        await sleep(1000);
      }
    })();
  });
  done = true;
  return result;
}

export async function awaitTransactionSignatureConfirmation2(
  connection: Connection,
  txid: string,
  timeout: number,
  confirmLevel: string = 'confirmed'
) {
  let done = false;

  const confirmLevels = ['finalized'];

  if (confirmLevel === 'confirmed') {
    confirmLevels.push('confirmed');
  } else if (confirmLevel === 'processed') {
    confirmLevels.push('confirmed');
    confirmLevels.push('processed');
  }
  const result = await new Promise((resolve, reject) => {
    (async () => {
      setTimeout(() => {
        if (done) {
          return;
        }
        done = true;
        // console.log('Timed out for txid', txid);
        reject({ timeout: true });
      }, timeout);
      try {
        connection.onSignature(
          txid,
          (result) => {
            // console.log('WS confirmed', txid, result);
            done = true;
            if (result.err) {
              reject(result.err);
            } else {
              resolve(result);
            }
          },
          'processed'
        );
        // console.log('Set up WS connection', txid);
      } catch (e) {
        done = true;
        // console.log('WS error in setup', txid, e);
      }
      while (!done) {
        // eslint-disable-next-line no-loop-func
        (async () => {
          try {
            const signatureStatuses = await connection.getSignatureStatuses([
              txid,
            ]);
            const result = signatureStatuses && signatureStatuses.value[0];
            if (!done) {
              if (!result) {
                // console.log('REST null result for', txid, result);
              } else if (result.err) {
                // console.log('REST error for', txid, result);
                done = true;
                reject(result.err);
              } else if (
                !(
                  result.confirmations ||
                  confirmLevels.includes(result.confirmationStatus)
                )
              ) {
                // console.log('REST not confirmed', txid, result);
              } else {
                // console.log('REST confirmed', txid, result);
                done = true;
                resolve(result);
              }
            }
          } catch (e) {
            if (!done) {
              // console.log('REST connection error: txid', txid, e);
            }
          }
        })();
        await sleep(1000);
      }
    })();
  });

  done = true;
  return result;
}

interface xx {
  connection: Connection;
  transaction: Transaction;
  wallet: any;
  enableSigning: boolean;
}

export const doSomething = async ({
  connection,
  transaction,
  wallet,
  enableSigning = true,
}: xx) => {
  if (!transaction.recentBlockhash) {
    let hash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = hash.blockhash;
  }
  if (enableSigning) {
    transaction = await wallet.signTransaction(transaction);
  }
  const rawTransaction = transaction.serialize();

  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: false,
  });
  return { txid, rawTransaction };
};

export const sendRawTransaction = async ({
  connection,
  txid,
  rawTransaction,
}) => {
  const timeout = 60000,
    confirmLevel = 'processed';
  const startTime = getUnixTs();
  let done = false;
  (async () => {
    await sleep(1000);
    while (!done && getUnixTs() - startTime < timeout) {
      connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
      });
      await sleep(1000);
    }
  })();
  try {
    await awaitTransactionSignatureConfirmation({
      connection,
      txid,
      timeout,
      confirmations: 10,
    });
    // notify(successMessage);
  } catch (err) {
    if (err.timeout) {
      throw new Error('Transaction timed out');
      // notify(txid+" "+ " - Timed out", "error");
    }
    throw new Error('Transaction Failed');
    // notify(txid+" "+failMessage, "error");
  } finally {
    done = true;
  }
};

export const sendSignedTransactionAndNotify = async ({
  connection,
  transaction,
  wallet,
  enableSigning = true,
}) => {
  if (!transaction) {
    throw Error('no transaction');
  }
  const { txid, rawTransaction } = await doSomething({
    connection,
    transaction,
    wallet,
    enableSigning,
  });
  console.log(`XEN:: - TRX :: https://explorer.solana.com/tx/${txid}`);

  await new Promise(function (resolve, reject) {
    (async () => {
      try {
        await sendRawTransaction({ connection, txid, rawTransaction });
        console.log(`----------TRX ${txid} CONFRIMED--------`);
        resolve(true);
      } catch (error) {
        reject(error);
        throw error;
      }
    })();
  });
  // console.log('Latency', txid, getUnixTs() - startTime);
  return txid;
};

// each transaction should have a success and fail message
// and then sign all transaction

export async function signAndSendMultipleTransactions(
  connection: Connection,
  wallet: any,
  transactions: Transaction[], // = [{transaction: ..., successMessage : "...", failMessage: "..."}]
  confirmation = 'singleGossip'
) {
  try {
    const signatures = [];

    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      await sendSignedTransactionAndNotify({
        connection,
        transaction: transaction,
        wallet,
        enableSigning: false,
      });
    }
    return signatures;
  } catch (error) {
    console.error('error');
    throw error;
  }
}
