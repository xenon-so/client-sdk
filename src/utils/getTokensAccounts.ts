import { publicKeyLayout, u64 } from '@blockworks-foundation/mango-client';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import BN from 'bignumber.js';
import { nu64, struct, u32, u8 } from 'buffer-layout';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TOKENS } from './tokens';

const TOKEN_ACCOUNT_LAYOUT = struct([
  publicKeyLayout('mint'),
  publicKeyLayout('owner'),
  nu64('amount'),
  u32('delegateOption'),
  publicKeyLayout('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKeyLayout('closeAuthority'),
]);

interface TOKEN_INFO {
  mint: PublicKey;
  owner: PublicKey;
  amount: BN;
  uiAmount: number;
}

interface TokenAccount {
  pubkey: PublicKey;
  account: AccountInfo<Buffer> | null;
  effectiveMint: PublicKey;
  parsedAccountInfo: TOKEN_INFO;
  tokenInfo?: any;
  coinGeckoInfo?: any;
}

export function parseTokenAccountData(data: Buffer): {
  mint: PublicKey;
  owner: PublicKey;
  amount: BN;
  uiAmount: number;
} {
  let {
    mint,
    owner,
    amount,
  }: { mint: PublicKey; owner: PublicKey; amount: BN } =
    TOKEN_ACCOUNT_LAYOUT.decode(data);
  const tokenInfo = Object.values(TOKENS).find(
    (f) => f.mintAddress === mint.toBase58()
  );
  const decimals = tokenInfo ? tokenInfo.decimals : 6;
  return {
    mint: new PublicKey(mint),
    owner: new PublicKey(owner),
    amount,
    uiAmount: new BN(amount).div(new BN(10 ** decimals)).toNumber(),
  };
}

export function getOwnedAccountsFilters(publicKey: PublicKey) {
  return [
    {
      memcmp: {
        offset: TOKEN_ACCOUNT_LAYOUT.offsetOf('owner'),
        bytes: publicKey.toBase58(),
      },
    },
    {
      dataSize: TOKEN_ACCOUNT_LAYOUT.span,
    },
  ];
}

export async function getOwnedTokenAccounts(
  connection: Connection,
  publicKey: PublicKey
): Promise<Array<{ publicKey: PublicKey; accountInfo: AccountInfo<Buffer> }>> {
  let filters = getOwnedAccountsFilters(publicKey);
  let resp = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
    filters,
  });
  return resp.map(
    ({ pubkey, account: { data, executable, owner, lamports } }) => ({
      publicKey: new PublicKey(pubkey),
      accountInfo: {
        data,
        executable,
        owner: new PublicKey(owner),
        lamports,
      },
    })
  );
}

export async function getTokenAccountInfo(
  connection: Connection,
  ownerAddress?: PublicKey
) {
  if (!ownerAddress) return [];
  let [splAccounts] = await Promise.all([
    getOwnedTokenAccounts(connection, ownerAddress),
  ]);

  const parsedSplAccounts: TokenAccount[] = splAccounts.map(
    ({ publicKey, accountInfo }) => {
      const tokenInfo = Object.values(TOKENS).find(
        (i) =>
          i.mintAddress ===
          parseTokenAccountData(accountInfo.data).mint.toBase58()
      );
      return {
        pubkey: publicKey,
        account: accountInfo,
        parsedAccountInfo: parseTokenAccountData(accountInfo.data),
        effectiveMint: parseTokenAccountData(accountInfo.data).mint,
        tokenInfo: tokenInfo,
      };
    }
  );

  return parsedSplAccounts.filter((f) =>
    Object.values(TOKENS)
      .map((k) => k.mintAddress)
      .includes(f.parsedAccountInfo.mint.toBase58())
  );
}
