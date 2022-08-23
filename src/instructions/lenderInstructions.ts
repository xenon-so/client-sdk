import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { programId } from '../constants';
import { TOKENS } from '../utils/tokens';
import {
  createAssociatedTokenAccountIfNotExist,
  findAssociatedTokenAddress,
} from '../utils/web3Utils';
import { struct, u8, nu64 } from 'buffer-layout';

export const deposit = async (
  connection: Connection,
  xenonPDA: PublicKey,
  transaction: Transaction,
  owner: PublicKey,
  amount: number
) => {
  const xeUSDC = new PublicKey(TOKENS.xeUSDC.mintAddress);

  // const baseTokenAccount = await findAssociatedTokenAddress(owner, new PublicKey(TOKENS['USDC'].mintAddress));
  const vaultAccount = await findAssociatedTokenAddress(
    xenonPDA,
    new PublicKey(TOKENS['USDC'].mintAddress)
  );

  const baseTokenAccount = await createAssociatedTokenAccountIfNotExist(
    connection,
    owner,
    new PublicKey(TOKENS['USDC'].mintAddress),
    owner,
    transaction
  );
  const xeUsdcAccount = await createAssociatedTokenAccountIfNotExist(
    connection,
    owner,
    xeUSDC,
    owner,
    transaction
  );

  const dataLayout = struct([u8('instruction'), nu64('quantity')]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 1,
      quantity: amount * 10 ** TOKENS.USDC.decimals,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true }, //xenon State Account
      { pubkey: owner, isSigner: true, isWritable: true },

      { pubkey: baseTokenAccount, isSigner: false, isWritable: true },
      { pubkey: vaultAccount, isSigner: false, isWritable: true },
      { pubkey: xeUsdcAccount, isSigner: false, isWritable: true },
      { pubkey: xeUSDC, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data,
  });
  transaction.add(instruction);
};

export const withdraw = async (
  connection: Connection,
  xenonPDA: PublicKey,
  transaction: Transaction,
  key: PublicKey,
  amount: number
) => {
  const xeUSDC = new PublicKey(TOKENS.xeUSDC.mintAddress);

  const baseTokenAccount = await findAssociatedTokenAddress(
    key,
    new PublicKey(TOKENS['USDC'].mintAddress)
  );
  const vaultAccount = await findAssociatedTokenAddress(
    xenonPDA,
    new PublicKey(TOKENS['USDC'].mintAddress)
  );

  const xeUsdcAccount = await createAssociatedTokenAccountIfNotExist(
    connection,
    key,
    xeUSDC,
    key,
    transaction
  );

  const dataLayout = struct([u8('instruction'), nu64('quantity')]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 2,
      quantity: amount * 10 ** TOKENS['USDC'].decimals,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true }, //xenon State Account
      { pubkey: key, isSigner: true, isWritable: true },

      { pubkey: baseTokenAccount, isSigner: false, isWritable: true },
      { pubkey: vaultAccount, isSigner: false, isWritable: true },
      { pubkey: xeUsdcAccount, isSigner: false, isWritable: true },
      { pubkey: xeUSDC, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data,
  });
  transaction.add(instruction);
};
