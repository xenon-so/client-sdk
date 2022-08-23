import {
  AccountInfo,
  PublicKey,
  RpcResponseAndContext,
  TokenAmount,
  Transaction,
} from '@solana/web3.js';
import { v4 as uuidv4 } from 'uuid';

export interface RPCRequest {
  method: string;
  jsonrpc: string;
  params: Array<ParamClass | string | string[]>;
  id: string;
}

export interface ParamClass {
  encoding: string;
  commitment: string;
  filters?: RPCFilter[];
}

export interface RPCFilter {
  memcmp?: Memcmp;
  dataSize?: number;
}

export interface Memcmp {
  offset: number;
  bytes: string;
}

export const buildGetProgramAccountsRequest = (
  programId: PublicKey,
  filters: RPCFilter[]
) => {
  if (filters.length === 0) {
    throw new Error('Get Program Accounts should have filters!');
  }
  const request: RPCRequest = {
    method: 'getProgramAccounts',
    jsonrpc: '2.0',
    params: [
      programId.toBase58(),
      {
        encoding: 'base64',
        commitment: 'recent',
        filters: filters,
      },
    ],
    id: uuidv4(),
  };

  return request;
};

export const buildGetMultipleAccounts = (accounts: string[]) => {
  if (accounts.length === 0) {
    throw new Error('No accounts to get');
  }
  const request: RPCRequest = {
    method: 'getMultipleAccounts',
    jsonrpc: '2.0',
    params: [
      accounts,
      {
        encoding: 'base64',
        commitment: 'recent',
      },
    ],
    id: uuidv4(),
  };

  return request;
};

export const buildGetAccountInfo = (publicKey: PublicKey) => {
  const request: RPCRequest = {
    method: 'getAccountInfo',
    jsonrpc: '2.0',
    params: [
      publicKey.toBase58(),
      {
        encoding: 'base64',
        commitment: 'recent',
      },
    ],
    id: uuidv4(),
  };

  return request;
};

export const buildGetTokenSupply = (publicKey: PublicKey) => {
  const request: RPCRequest = {
    method: 'getTokenSupply',
    jsonrpc: '2.0',
    params: [
      publicKey.toBase58(),
      {
        encoding: 'base64',
        commitment: 'recent',
      },
    ],
    id: uuidv4(),
  };
  return request;
};

export const buildGetTokenAccountBalance = (publicKey: string) => {
  const request: RPCRequest = {
    method: 'getTokenAccountBalance',
    jsonrpc: '2.0',
    params: [
      publicKey,
      {
        encoding: 'base64',
        commitment: 'recent',
      },
    ],
    id: uuidv4(),
  };
  return request;
};

export const buildSimulateTransaction = (transaction: Transaction) => {
  const signData = transaction.serializeMessage();

  // @ts-ignore
  const wireTransaction = transaction._serialize(signData);
  const encodedTransaction = wireTransaction.toString('base64');

  const request: RPCRequest = {
    method: 'simulateTransaction',
    jsonrpc: '2.0',
    params: [
      encodedTransaction,
      {
        encoding: 'base64',
        commitment: 'recent',
      },
    ],
    id: uuidv4(),
  };
  return request;
};

// decoders
export const decodeMultipleAccountsResponse = (
  resp: any,
  publicKeys: PublicKey[]
) => {
  return resp.result.value.map(
    ({ data, executable, lamports, owner }, i: number) => ({
      publicKey: publicKeys[i],
      context: resp.result.context,
      accountInfo: {
        data: Buffer.from(data[0], 'base64'),
        executable,
        owner: new PublicKey(owner),
        lamports,
      },
    })
  );
};

export const decodeProgramAccountsResponse = (
  resp: any
): {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
}[] => {
  return resp.result.map((t) => {
    return {
      pubkey: t.pubkey,
      account: { ...t.account, data: Buffer.from(t.account.data[0], 'base64') },
    };
  });
};

export const decodeAccountInfoResponse = (
  resp: any,
  publicKey?: PublicKey
): AccountInfo<Buffer> | null => {
  if (resp.result.value === null) {
    return null;
  }
  const { data, executable, lamports, owner } = resp.result.value;
  return {
    data: Buffer.from(data[0], 'base64'),
    executable,
    owner: new PublicKey(owner),
    lamports,
  };
};

export const decodeTokenSupplyResponse = (
  resp: any
): RpcResponseAndContext<TokenAmount> => {
  return {
    context: resp.result.context,
    value: resp.result.value,
  };
};

export const decodeTokenAccountBalanceResponse = (
  resp: any
): RpcResponseAndContext<TokenAmount> | undefined => {
  if (resp.error) {
    return undefined;
  }
  return {
    context: resp.result.context,
    value: resp.result.value,
  };
};

export function splitToChunks<T>(array: T[], parts: number) {
  const newArray = Array.from(array);
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(newArray.splice(0, Math.ceil(newArray.length / i)));
  }
  return result;
}
