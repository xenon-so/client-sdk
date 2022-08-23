import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
} from '@solana/spl-token';
import {
  Account,
  AccountInfo,
  Commitment,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { RENT_PROGRAM_ID, SYSTEM_PROGRAM_ID } from '../constants';
import { struct, u8 } from 'buffer-layout';

export async function findProgramAddress(
  seeds: Buffer[],
  programId: PublicKey
) {
  const [publicKey, nonce] = await PublicKey.findProgramAddress(
    seeds,
    programId
  );
  return { publicKey, nonce };
}

export async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
) {
  const { publicKey } = await findProgramAddress(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      tokenMintAddress.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return publicKey;
}

export async function createAssociatedTokenAccountIfNotExist(
  connection: Connection,
  payer: PublicKey,
  tokenMintAddress: PublicKey,
  owner: PublicKey,
  transaction: Transaction
) {
  const associatedTokenAddress = await findAssociatedTokenAddress(
    owner,
    tokenMintAddress
  );

  const tokenAccount = await connection.getAccountInfo(
    associatedTokenAddress,
    'processed'
  );

  if (tokenAccount == null) {
    const keys = [
      {
        pubkey: payer,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: associatedTokenAddress,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: owner,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: tokenMintAddress,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SYSTEM_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: RENT_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
    ];
    transaction.add(
      new TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
      })
    );
    //await signAndSendTransaction(wallet, transaction)
  }
  return associatedTokenAddress;
}

export async function createAccountInstruction(
  connection: Connection,
  payer: PublicKey,
  space: number,
  programId: PublicKey,
  lamports: number | null,
  transaction: Transaction,
  signers: any[]
) {
  const account = new Account();
  const instruction = SystemProgram.createAccount({
    fromPubkey: payer,
    newAccountPubkey: account.publicKey,
    lamports: lamports
      ? lamports
      : await connection.getMinimumBalanceForRentExemption(space),
    space,
    programId,
  });

  transaction.add(instruction);
  signers.push(account);

  return account.publicKey;
}

export async function getMultipleAccounts(
  connection: Connection,
  publicKeys: PublicKey[],
  commitment?: Commitment
): Promise<
  {
    publicKey: PublicKey;
    context: { slot: number };
    accountInfo: AccountInfo<Buffer>;
  }[]
> {
  const len = publicKeys.length;
  if (len === 0) {
    return [];
  }
  if (len > 100) {
    const mid = Math.floor(publicKeys.length / 2);
    return Promise.all([
      getMultipleAccounts(connection, publicKeys.slice(0, mid), commitment),
      getMultipleAccounts(connection, publicKeys.slice(mid, len), commitment),
    ]).then((a) => a[0].concat(a[1]));
  }
  const publicKeyStrs = publicKeys.map((pk) => pk.toBase58());
  // load connection commitment as a default
  commitment ||= connection.commitment;

  const args = commitment ? [publicKeyStrs, { commitment }] : [publicKeyStrs];
  // @ts-ignore
  const resp = await connection._rpcRequest('getMultipleAccounts', args);
  if (resp.error) {
    throw new Error(resp.error.message);
  }
  if (resp.result) {
    const nullResults = resp.result.value.filter((r) => r?.account === null);
    if (nullResults.length > 0)
      throw new Error(
        `gma returned ${
          nullResults.length
        } null results. ex: ${nullResults[0]?.pubkey.toString()}`
      );
  }
  return resp.result.value.map((f, i) => {
    if (f === null) {
      return undefined;
    }
    const { data, executable, lamports, owner } = f;
    return {
      publicKey: publicKeys[i],
      context: resp.result.context,
      accountInfo: {
        data: Buffer.from(data[0], 'base64'),
        executable,
        owner: new PublicKey(owner),
        lamports,
      },
    };
  });
}

export const createDefaultKeys = (count: number) => {
  const keys = [...Array(count).keys()].map((f) => {
    return { pubkey: PublicKey.default, isSigner: false, isWritable: false };
  });
  return keys;
};

export const wrapSol = async (
  connection: Connection,
  trader: PublicKey,
  amount: number,
  transaction: Transaction
) => {
  let ata = await createAssociatedTokenAccountIfNotExist(
    connection,
    trader, // payer
    NATIVE_MINT, // mint
    trader, // owner
    transaction
  );

  const dataLayout = struct([u8('instruction')]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 17,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: ata, isSigner: false, isWritable: true }, //xenon State Account
    ],
    programId: TOKEN_PROGRAM_ID,
    data,
  });

  transaction.add(
    // trasnfer SOL
    SystemProgram.transfer({
      fromPubkey: trader,
      toPubkey: ata,
      lamports: amount * 1e9,
    })
  );
  transaction.add(instruction);
};
