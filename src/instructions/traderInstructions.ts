import {
  AccountInfo,
  ComputeBudgetProgram,
  AccountMeta,
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
  TransactionInstruction,
  Keypair,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import {
  mangoProgramID,
  mangoAdapterProgramId,
  MANGO_GROUP_ACCOUNT_V3,
  solendAdapterProgramId,
  SYSTEM_PROGRAM_ID,
  programId,
  solendProgramID,
  saberAdapterProgramId,
  saberProgramID,
  quarryAdapterProgramId,
  quarryProgramId,
  QUARRY_REWARDER,
  QUARRY_MINTER,
  QUARRY_MINT_WRAPPER,
  QUARRY_MINT_WRAPPER_PROGRAM,
  QUARRY_REWARDER_ATA,
  mangoGAdapterPk,
  xenonPDA,
  solendGAdapterPk,
  saberGAdapterPk,
  quarryGAdapterPk,
  mangoCache,
  SERUM_PROGRAM_ID_V3,
  QUARRY_REWARD_MINT,
  orcaGAdapterPk,
  orcaAdapterProgramId,
  orcaProgramId,
  METAPLEX_TOKEN_METADATA,
} from '../constants';
import { getDecimalsFromMint, TOKENS } from '../utils/tokens';
import { struct, u8, nu64, u32, u32be } from 'buffer-layout';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  createAccountInstruction,
  createAssociatedTokenAccountIfNotExist,
  createDefaultKeys,
  findAssociatedTokenAddress,
} from '../utils/web3Utils';
import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import {
  ADAPTER_ACCOUNT_LAYOUT,
  i32,
  MANGO_ADAPTER_ACCOUNT_LAYOUT,
  MARGIN_DATA_LAYOUT,
  QUARRY_CHECK_DATA,
  SABER_ADAPTER_ACCOUNT,
  u128,
  XENON_DATA_LAYOUT,
} from '../layout/xenonLayout';
import { PERP_MARKETS } from '../utils/perpMarkets';
import {
  MangoClient,
  IDS,
  NodeBankLayout,
  PerpOrderType,
  Payer,
} from '@blockworks-foundation/mango-client';
import { mapOrderType } from '../utils/mangoUtils';
import {
  SOLEND_DERIEVED_MARKET,
  SOLEND_MARKET,
  SOLEND_RESERVE,
} from '../utils/solendMarkets';
import { Saber_LP } from '../utils/saberList';
import {
  getLocalAdapterTokenIndexHelper,
  getMarginPDATokenIndexHelper,
  getXenonPDATokenIndexHelper,
} from '../utils/getTokenIndexes';
import { isMainnet } from '../isMainnet';
import { OrcaWhirlpool } from '../utils/OrcaPools';
import {buildWhirlpoolClient, MAX_TICK_INDEX, MIN_TICK_INDEX, PDAUtil, PoolUtil, PriceMath, TickUtil, toTokenAmount, WhirlpoolClient, WhirlpoolContext} from '@orca-so/whirlpools-sdk';
import { Wallet } from '@project-serum/anchor';

const idsIndex = 0; //0 for maninnet, 2 for devnet
const ids = IDS['groups'][idsIndex];

export const initialiseMarginAccount = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  transaction: Transaction,
  payer: PublicKey,
  currentAccountCount: number
) => {
  //  check if already create if so throw error
  const marginAccounts = await connection.getProgramAccounts(programId, {
    filters: [
      {
        memcmp: {
          offset: MARGIN_DATA_LAYOUT.offsetOf('owner'),
          bytes: payer!.toString(),
        },
      },
    ],
    commitment: 'processed',
  });

  if (marginAccounts.length !== 0) {
    throw new Error('Margin Account already exist!!');
  }

  const bnNumber = new BN(currentAccountCount);

  const [marginPDA, nonce] = await PublicKey.findProgramAddress(
    [bnNumber.toArrayLike(Buffer, 'le', 4)],
    programId
  );

  const dataLayout = struct([u8('instruction'), u8('nonce_margin')]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 3,
      nonce_margin: nonce,
    },
    data
  );
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true }, //xenon State Account
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data,
  });
  transaction.add(instruction);

  await handleAddTokenToMargin2(
    connection,
    xenonPDA,
    xenonPdaData,
    marginPDA,
    payer,
    new PublicKey(TOKENS.USDC.mintAddress),
    transaction
  );
};

export const deposit = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  amount: number,
  transaction: Transaction,
  mint: string
) => {
  if (!mint) throw new Error(`incorrect mint::${mint}`);
  const decimals = getDecimalsFromMint(mint);
  if (!decimals) throw new Error(`mint not found::${mint}`);

  await handleAddTokenToMargin2(
    connection,
    xenonPDA,
    xenonPdaData,
    marginPDA,
    payer,
    new PublicKey(mint),
    transaction
  );

  const baseTokenAccount = await findAssociatedTokenAddress(
    payer,
    new PublicKey(mint)
  );
  const marginVaultAccount = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(mint)
  );
  const dataLayout = struct([u8('instruction'), nu64('quantity')]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 4,
      quantity: amount * 10 ** decimals,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true }, //xenon State Account
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: true },

      { pubkey: baseTokenAccount, isSigner: false, isWritable: true },
      { pubkey: marginVaultAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data,
  });
  transaction.add(instruction);
};

export const borrow = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  amount: number,
  payer: PublicKey,
  mango_account_ai: PublicKey,
  transaction: Transaction
) => {
  await updateAccountValuation(
    connection,
    xenonPDA,
    xenonPdaData,
    marginPDA,
    transaction,
    mango_account_ai
  );

  const xenonVaultAccount = await findAssociatedTokenAddress(
    xenonPDA,
    new PublicKey(TOKENS.USDC.mintAddress)
  ); //todo: handle SOL borrow
  const marginVaultAccount = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(TOKENS.USDC.mintAddress)
  );

  const dataLayout = struct([u8('instruction'), u8('index'), nu64('quantity')]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 6,
      index: 0, //todo: handle SOL reserve
      quantity: amount * 10 ** TOKENS.USDC.decimals,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true }, //xenon State Account
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: xenonVaultAccount, isSigner: false, isWritable: true },
      { pubkey: marginVaultAccount, isSigner: false, isWritable: true },
      { pubkey: SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data,
  });
  transaction.add(instruction);
};

export const repay = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  amount: number,
  payer: PublicKey,
  mango_account_ai: PublicKey,
  transaction: Transaction
) => {
  await updateAccountValuation(
    connection,
    xenonPDA,
    xenonPdaData,
    marginPDA,
    transaction,
    mango_account_ai
  );

  const xenonVaultAccount = await findAssociatedTokenAddress(
    xenonPDA,
    new PublicKey(TOKENS.USDC.mintAddress)
  );
  const marginVaultAccount = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(TOKENS.USDC.mintAddress)
  );

  const dataLayout = struct([u8('instruction'), u8('index'), nu64('quantity')]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 7,
      index: 0, //todo: handle SOL reserve
      quantity: amount * 10 ** TOKENS.USDC.decimals,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true }, //xenon State Account
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: true },

      { pubkey: xenonVaultAccount, isSigner: false, isWritable: true },
      { pubkey: marginVaultAccount, isSigner: false, isWritable: true },
      {
        pubkey: SYSVAR_INSTRUCTIONS_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
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
  xenonPdaData: any,
  marginPDA: PublicKey,
  amount: number,
  payer: PublicKey,
  mint: string,
  transaction: Transaction,
  mango_account_ai?: PublicKey
): Promise<void> => {
  if (!mint) throw new Error(`incorrect mint::${mint}`);
  const decimals = getDecimalsFromMint(mint);
  if (!decimals) throw new Error(`mint not found::${mint}`);

  await updateAccountValuation(
    connection,
    xenonPDA,
    xenonPdaData,
    marginPDA,
    transaction,
    mango_account_ai
  );

  const baseTokenAccount = await createAssociatedTokenAccountIfNotExist(
    connection,
    payer,
    new PublicKey(mint),
    payer,
    transaction
  );
  const marginVaultAccount = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(mint)
  );

  const dataLayout = struct([u8('instruction'), nu64('quantity')]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 5,
      quantity: amount * 10 ** decimals,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true }, //xenon State Account
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: true },

      { pubkey: marginVaultAccount, isSigner: false, isWritable: true },
      { pubkey: baseTokenAccount, isSigner: false, isWritable: true },
      {
        pubkey: SYSVAR_INSTRUCTIONS_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data,
  });
  transaction.add(instruction);
};

export const updateAccountValuation = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  transaction: Transaction,
  mango_account_ai?: PublicKey,
  loadedAccountInfos?: AccountInfo<Buffer>[]
) => {
  const localQuarryAdapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    quarryAdapterProgramId
  );
  const quarryCheckPDA = await PublicKey.findProgramAddress(
    [localQuarryAdapterPDA[0].toBuffer()],
    quarryAdapterProgramId
  );

  const accountInfos =
    loadedAccountInfos ??
    (await connection.getMultipleAccountsInfo(
      [marginPDA, localQuarryAdapterPDA[0], quarryCheckPDA[0]],
      'processed'
    ));

  let marginDataInfo = accountInfos[0];
  if (!marginDataInfo) throw new Error('No margin account found!');
  let marginData = MARGIN_DATA_LAYOUT.decode(marginDataInfo.data);

  let Obj = {};
  let accountsToBePassed: Array<AccountMeta> = [];

  // let activeAdapterCount = 0
  for (let i = 0; i < xenonPdaData.adapters.length; i++) {
    let currentAccCount = 0;
    if (marginData.active_adapters[i]) {
      // activeAdapterCount++;
      switch (i) {
        case 0: // solend
        case 1: //saber
          currentAccCount = 0;
          break;
        case 2: // quarry
          // based on the number of miner accounts
          const adapterPDADataInfo = accountInfos[1];
          if (!adapterPDADataInfo)
            throw new Error('No adapterPDADataInfo account found!');

          let quarryNeedAccounts: Array<AccountMeta> = [
            {
              pubkey: quarryAdapterProgramId,
              isSigner: false,
              isWritable: false,
            },
            {
              pubkey: localQuarryAdapterPDA[0],
              isSigner: false,
              isWritable: true,
            },
            { pubkey: quarryCheckPDA[0], isSigner: false, isWritable: true },
          ];

          let checkPDADataInfo = accountInfos[2];
          if (!checkPDADataInfo)
            throw new Error('No checkPDADataInfo account found!');
          let checkPDAData = QUARRY_CHECK_DATA.decode(checkPDADataInfo.data);
          let checkMintsToBePassed = 0;
          for (let j = 0; j < checkPDAData.miners.length; j++) {
            if (
              checkPDAData.miners[j].toBase58() !== PublicKey.default.toBase58()
            ) {
              checkMintsToBePassed++;
              quarryNeedAccounts.push({
                pubkey: checkPDAData.miners[j],
                isSigner: false,
                isWritable: true,
              });
            }
          }
          currentAccCount = checkMintsToBePassed;
          accountsToBePassed = [...accountsToBePassed, ...quarryNeedAccounts];
          break;

        case 3: // Mango
          if (!mango_account_ai)
            throw new Error('mango account needed but not found');

          const ids = IDS['groups'][isMainnet ? 0 : 2];
          const localMangoAdapterPDA = await PublicKey.findProgramAddress(
            [marginPDA.toBuffer()],
            mangoAdapterProgramId
          );
          const mangoCheckPDA = await PublicKey.findProgramAddress(
            [localMangoAdapterPDA[0].toBuffer()],
            mangoAdapterProgramId
          );

          const mangoNeedAccounts = [
            //  mangoAdapterProgramId  localAdapterPDA  checkAccount
            {
              pubkey: mangoAdapterProgramId,
              isSigner: false,
              isWritable: false,
            },
            {
              pubkey: localMangoAdapterPDA[0],
              isSigner: false,
              isWritable: true,
            },
            { pubkey: mangoCheckPDA[0], isSigner: false, isWritable: true },

            {
              pubkey: new PublicKey(ids.publicKey),
              isSigner: false,
              isWritable: false,
            }, // mango_group_ai
            { pubkey: mango_account_ai, isSigner: false, isWritable: true }, //mango_account_ai
            { pubkey: mangoCache, isSigner: false, isWritable: false }, //mango_cache_ai
          ];
          currentAccCount = 3;
          accountsToBePassed = [...accountsToBePassed, ...mangoNeedAccounts];
          break;
        default:
          break;
      }
      Obj[`protocol_acc_count_${i}`] = currentAccCount;
    } else {
      Obj[`protocol_acc_count_${i}`] = 0;
    }
  }

  //  find the ATA of margin accounts avaialble on marginState
  let marginATAs: Array<AccountMeta> = [];
  for (let i = 0; i < marginData.token_count; i++) {
    marginATAs.push({
      pubkey: marginData.tokens[i].vault,
      isSigner: false,
      isWritable: false,
    });
  }

  let layoutsArr = [u8('instruction')];
  for (let j = 0; j < Object.keys(Obj).length; j++) {
    layoutsArr.push(u8(`protocol_acc_count_${j}`));
  }

  const dataLayout = struct(layoutsArr);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 9,
      ...Obj,
    },
    data
  );
  const keys = [
    { pubkey: xenonPDA, isSigner: false, isWritable: true }, //xenon State Account
    { pubkey: marginPDA, isSigner: false, isWritable: true },
    ...marginATAs,
    ...accountsToBePassed,
  ];

  const instruction = new TransactionInstruction({
    keys,
    programId: programId,
    data,
  });
  transaction.add(instruction);
  const additionalComputeBudgetInstruction = ComputeBudgetProgram.requestUnits({
    units: 800000,
    additionalFee: 0,
  });
  transaction.add(additionalComputeBudgetInstruction);
};

export const handleInitializeMangoAdapter = async (
  connection: Connection,
  xenonPDA: PublicKey,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction
) => {
  const gAdapterPDA = mangoGAdapterPk;
  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    mangoAdapterProgramId
  );
  const checkPDA = await PublicKey.findProgramAddress(
    [adapterPDA[0].toBuffer()],
    mangoAdapterProgramId
  );

  const client = new MangoClient(connection, mangoProgramID);
  const mangoGroup = await client.getMangoGroup(MANGO_GROUP_ACCOUNT_V3);
  const mango_group_ai = mangoGroup.publicKey;

  const accountNumBN = new BN(0);

  const mango_account_ai = await PublicKey.findProgramAddress(
    [
      mango_group_ai.toBytes(),
      marginPDA.toBytes(),
      accountNumBN.toArrayLike(Buffer, 'le', 8),
    ],
    mangoProgramID
  );

  let XenonInfo = await connection.getAccountInfo(xenonPDA, 'processed');
  if (!XenonInfo) {
    throw new Error('Xenon not initialzied');
  }

  let xenonData = XENON_DATA_LAYOUT.decode(XenonInfo.data);

  let marginInfo = await connection.getAccountInfo(marginPDA, 'processed');
  if (!marginInfo) {
    throw new Error('No margin PDA initialised');
  }

  let marginData = MARGIN_DATA_LAYOUT.decode(marginInfo.data);

  let gAdapterPDAData = await connection.getAccountInfo(
    gAdapterPDA,
    'processed'
  );
  if (!gAdapterPDAData) {
    throw new Error('No gAdapter PDA initialised');
  }

  const dataLayout = struct([
    u8('instruction'),
    u8('adapter_index'),
    u8('count'),
    u8('token_1'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 12,
      adapter_index: 3,
      count: 1,
      token_1: getMarginPDATokenIndexHelper(
        new PublicKey(TOKENS.USDC.mintAddress),
        xenonData,
        marginData
      ),
      // ...indexesObj
    },
    data
  );
  const keys = [
    { pubkey: xenonPDA, isSigner: false, isWritable: false },
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: marginPDA, isSigner: false, isWritable: true },
    { pubkey: mangoAdapterProgramId, isSigner: false, isWritable: false },

    { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
    { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
    { pubkey: checkPDA[0], isSigner: false, isWritable: true },

    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },

    { pubkey: mangoProgramID, isSigner: false, isWritable: false },
    { pubkey: mango_group_ai, isSigner: false, isWritable: true }, // mango_group_ai
    { pubkey: mango_account_ai[0], isSigner: false, isWritable: true }, //mango_account_ai
  ];

  const instruction = new TransactionInstruction({
    keys,
    programId: programId,
    data,
  });

  transaction.add(instruction);
  // return signers;
};

export const handleMangoDeposit = async (
  connection: Connection,
  xenonPDA: PublicKey,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  tokenIndex: number,
  mango_account_ai: PublicKey,
  quantity: number
) => {
  const ids = IDS['groups'][isMainnet ? 0 : 2];

  const gAdapterPDA = mangoGAdapterPk;
  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    mangoAdapterProgramId
  );
  const checkPDA = await PublicKey.findProgramAddress(
    [adapterPDA[0].toBuffer()],
    mangoAdapterProgramId
  );

  let client = new MangoClient(connection, new PublicKey(ids.mangoProgramId));
  let mangoGroup = await client.getMangoGroup(new PublicKey(ids.publicKey));

  const marginUSDCATA = await createAssociatedTokenAccountIfNotExist(
    connection,
    payer,
    new PublicKey(TOKENS.USDC.mintAddress),
    marginPDA,
    transaction
  );
  let nodeBankInfo = await connection.getAccountInfo(
    new PublicKey(ids.tokens[tokenIndex].nodeKeys[0])
  );
  if (!nodeBankInfo) {
    throw new Error(
      `No NodeBankInfo found for ${ids.tokens[tokenIndex].nodeKeys[0]}`
    );
  }
  let nodeBank = NodeBankLayout.decode(nodeBankInfo.data);

  const dataLayout = struct([
    u8('instruction'),
    u8('adapter_index'),
    u32('instruction3'),
    nu64('quantity'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 10,
      // account_id: xenonData.account_id,
      adapter_index: 3,
      // instruction2: 1,
      instruction3: 2,
      quantity: quantity * 10 ** (ids.tokens[tokenIndex].decimals ?? 6),
    },
    data
  );

  const keys = [
    { pubkey: xenonPDA, isSigner: false, isWritable: false },
    { pubkey: payer, isSigner: true, isWritable: false },
    { pubkey: marginPDA, isSigner: false, isWritable: true }, //owner_ai
    { pubkey: mangoAdapterProgramId, isSigner: false, isWritable: false },

    { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
    { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
    { pubkey: checkPDA[0], isSigner: false, isWritable: false },
    { pubkey: mangoProgramID, isSigner: false, isWritable: false },

    {
      pubkey: new PublicKey(ids.publicKey),
      isSigner: false,
      isWritable: false,
    }, // mango_group_ai
    { pubkey: mango_account_ai, isSigner: false, isWritable: true }, //mango_account_ai
    { pubkey: marginPDA, isSigner: false, isWritable: true }, //owner_ai
    { pubkey: mangoGroup.mangoCache, isSigner: false, isWritable: false }, //mango_cache_ai  new PublicKey('8mFQbdXsFXt3R3cu3oSNS3bDZRwJRP18vyzd9J278J9z')
    {
      pubkey: new PublicKey(ids.tokens[tokenIndex].rootKey),
      isSigner: false,
      isWritable: false,
    }, //root_bank_ai
    {
      pubkey: new PublicKey(ids.tokens[tokenIndex].nodeKeys[0]),
      isSigner: false,
      isWritable: true,
    }, //node_bank_ai
    { pubkey: nodeBank.vault, isSigner: false, isWritable: true }, //vault_ai
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, //token_prog_ai
    { pubkey: marginUSDCATA, isSigner: false, isWritable: true }, //owner_token_account_ai
  ];

  const instruction = new TransactionInstruction({
    keys,
    programId: programId,
    data,
  });

  transaction.add(instruction);
};

export const handleMangoWithdraw = async (
  connection: Connection,
  xenonPDA: PublicKey,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  tokenIndex: number,
  checkAccount: PublicKey,
  mango_account_ai: PublicKey,
  quantity: number
) => {
  const ids = IDS['groups'][isMainnet ? 0 : 2];

  const gAdapterPDA = mangoGAdapterPk;
  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    mangoAdapterProgramId
  );
  const checkPDA = await PublicKey.findProgramAddress(
    [adapterPDA[0].toBuffer()],
    mangoAdapterProgramId
  );

  let client = new MangoClient(connection, new PublicKey(ids.mangoProgramId));
  let mangoGroup = await client.getMangoGroup(new PublicKey(ids.publicKey));

  const marginUSDCATA = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(TOKENS.USDC.mintAddress)
  );

  let nodeBankInfo = await connection.getAccountInfo(
    new PublicKey(ids.tokens[tokenIndex].nodeKeys[0])
  );
  if (!nodeBankInfo) {
    throw new Error(
      `No NodeBankInfo found for ${ids.tokens[tokenIndex].nodeKeys[0]}`
    );
  }
  let nodeBank = NodeBankLayout.decode(nodeBankInfo.data);

  const dataLayout = struct([
    u8('instruction'),
    u8('adapter_index'),
    u32('instruction3'),
    nu64('quantity'),
    u8('allow_borrow'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 10,
      // account_id: xenonData.account_id,
      adapter_index: 3,
      // instruction2: 1,
      instruction3: 3,
      quantity: quantity * 10 ** (ids.tokens[tokenIndex].decimals ?? 6),
      allow_borrow: 0,
    },
    data
  );

  const keys = [
    { pubkey: xenonPDA, isSigner: false, isWritable: false },
    { pubkey: payer, isSigner: true, isWritable: false },
    { pubkey: marginPDA, isSigner: false, isWritable: true }, //owner_ai
    { pubkey: mangoAdapterProgramId, isSigner: false, isWritable: false },

    { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
    { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
    { pubkey: checkPDA[0], isSigner: false, isWritable: false },
    { pubkey: mangoProgramID, isSigner: false, isWritable: false },

    {
      pubkey: new PublicKey(ids.publicKey),
      isSigner: false,
      isWritable: false,
    }, // mango_group_ai
    { pubkey: mango_account_ai, isSigner: false, isWritable: true }, //mango_account_ai
    { pubkey: marginPDA, isSigner: false, isWritable: true }, //owner_ai
    { pubkey: mangoGroup.mangoCache, isSigner: false, isWritable: false }, //mango_cache_ai
    {
      pubkey: new PublicKey(ids.tokens[tokenIndex].rootKey),
      isSigner: false,
      isWritable: false,
    }, //root_bank_ai
    {
      pubkey: new PublicKey(ids.tokens[tokenIndex].nodeKeys[0]),
      isSigner: false,
      isWritable: true,
    }, //node_bank_ai
    { pubkey: nodeBank.vault, isSigner: false, isWritable: true }, //vault_ai
    { pubkey: marginUSDCATA, isSigner: false, isWritable: true }, //owner_token_account_ai
    { pubkey: mangoGroup.signerKey, isSigner: false, isWritable: true }, //mango group signer_ai
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, //token_prog_ai
    //open_orders
    ...createDefaultKeys(16),
  ];

  const instruction = new TransactionInstruction({
    keys,
    programId: programId,
    data,
  });

  transaction.add(instruction);
};

export const handleMangoPlacePrepOrder = async (
  connection: Connection,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  checkAccount: PublicKey,
  mango_account_ai: PublicKey,
  price: number,
  side: 'buy' | 'sell',
  orderPerpIndex: number,
  orderType: PerpOrderType,
  quantity: number,
  reduceOnly: number
) => {
  const ids = IDS['groups'][isMainnet ? 0 : 2];

  const gAdapterPDA = mangoGAdapterPk;
  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    mangoAdapterProgramId
  );
  const checkPDA = await PublicKey.findProgramAddress(
    [adapterPDA[0].toBuffer()],
    mangoAdapterProgramId
  );

  let client = new MangoClient(connection, new PublicKey(ids.mangoProgramId));
  let mangoGroup = await client.getMangoGroup(new PublicKey(ids.publicKey));

  const perpMarket = ids.perpMarkets.find(
    (f) => f.marketIndex === orderPerpIndex
  )!;

  let marginData = await connection.getAccountInfo(marginPDA, 'processed');
  if (!marginData) throw new Error('No margin account found!');

  const dataLayout = struct([
    u8('instruction'),
    u8('adapter_index'),
    u32('instruction3'),
    nu64('price'),
    nu64('quantity'),
    nu64('client_order_id'),
    u8('side'),
    u8('order_type'),
    u8('reduce_only'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 10,
      adapter_index: 3,
      instruction3: 12,
      price: price,
      quantity,
      client_order_id: Date.now(),
      side: side === 'buy' ? 0 : 1, //0-Buy, 1-Sell
      order_type: mapOrderType(orderType),
      reduce_only: reduceOnly,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: true }, //owner_ai
      { pubkey: mangoAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: checkPDA[0], isSigner: false, isWritable: false },
      { pubkey: mangoProgramID, isSigner: false, isWritable: false },

      {
        pubkey: new PublicKey(ids.publicKey),
        isSigner: false,
        isWritable: false,
      }, // mango_group_ai
      { pubkey: mango_account_ai, isSigner: false, isWritable: true }, //mango_account_ai
      { pubkey: marginPDA, isSigner: false, isWritable: true }, //owner_ai
      { pubkey: mangoGroup.mangoCache, isSigner: false, isWritable: false }, //mango_cache_ai

      {
        pubkey: new PublicKey(perpMarket.publicKey),
        isSigner: false,
        isWritable: true,
      }, //perp_market_ai
      {
        pubkey: new PublicKey(perpMarket.bidsKey),
        isSigner: false,
        isWritable: true,
      }, //bids_ai
      {
        pubkey: new PublicKey(perpMarket.asksKey),
        isSigner: false,
        isWritable: true,
      }, //asks_ai
      {
        pubkey: new PublicKey(perpMarket.eventsKey),
        isSigner: false,
        isWritable: true,
      }, //event_queue_ai
      //open_orders
      ...createDefaultKeys(16),
    ],
    programId: programId,
    data,
  });

  transaction.add(instruction);
};

export const handleMangoPrepCancelOrder = async (
  connection: Connection,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  checkAccount: PublicKey,
  mango_account_ai: PublicKey,
  orderPerpIndex: number,
  clientId: number
) => {
  const ids = IDS['groups'][isMainnet ? 0 : 2];

  const gAdapterPDA = mangoGAdapterPk;
  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    mangoAdapterProgramId
  );
  const checkPDA = await PublicKey.findProgramAddress(
    [adapterPDA[0].toBuffer()],
    mangoAdapterProgramId
  );

  const perpMarket = ids.perpMarkets.find(
    (f) => f.marketIndex === orderPerpIndex
  )!;

  let marginData = await connection.getAccountInfo(marginPDA, 'processed');
  if (!marginData) throw new Error('No margin account found!');

  const dataLayout = struct([
    u8('instruction'),
    u8('adapter_index'),
    u32('instruction3'),
    nu64('clientOrderId'),
    u8('invalidIdOk'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 10,
      adapter_index: 3,
      instruction3: 13,
      //TODO
      clientOrderId: clientId,
      invalidIdOk: 0,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: true }, //owner_ai
      { pubkey: mangoAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: checkPDA[0], isSigner: false, isWritable: false },
      { pubkey: mangoProgramID, isSigner: false, isWritable: false },

      {
        pubkey: new PublicKey(ids.publicKey),
        isSigner: false,
        isWritable: false,
      }, // mango_group_ai
      { pubkey: mango_account_ai, isSigner: false, isWritable: true }, //mango_account_ai
      { pubkey: marginPDA, isSigner: false, isWritable: true }, //owner_ai

      {
        pubkey: new PublicKey(perpMarket.publicKey),
        isSigner: false,
        isWritable: true,
      }, //perp_market_ai
      {
        pubkey: new PublicKey(perpMarket.bidsKey),
        isSigner: false,
        isWritable: true,
      }, //bids_ai
      {
        pubkey: new PublicKey(perpMarket.asksKey),
        isSigner: false,
        isWritable: true,
      }, //asks_ai

      ...createDefaultKeys(6),
    ],
    programId: programId,
    data,
  });

  transaction.add(instruction);
};

export const handleMangoSettleAll = async (
  connection: Connection,
  mango_account_ai: PublicKey,
  wallet: Payer
) => {
  const mangoClient = new MangoClient(connection, mangoProgramID);
  const mangoGroup = await mangoClient.getMangoGroup(MANGO_GROUP_ACCOUNT_V3);
  const mangoCache = await mangoGroup.loadCache(connection);
  const mangoAccount = await mangoClient.getMangoAccount(
    mango_account_ai,
    SERUM_PROGRAM_ID_V3
  );
  const markets = PERP_MARKETS.slice(0, 3);
  const loadedMarkets = await Promise.all(
    markets.map((f) =>
      mangoClient.getPerpMarket(
        new PublicKey(f.publicKey),
        f.baseDecimals,
        f.quoteDecimals
      )
    )
  );
  await mangoGroup.loadRootBanks(connection);
  const sig = await mangoClient.settleAllPerpPnl(
    mangoGroup,
    mangoCache,
    mangoAccount,
    loadedMarkets,
    mangoGroup.rootBankAccounts[15],
    wallet
  );
  return sig;
};

interface AddTokenToMargin {
  addingTokenToMargin: boolean;
  index: number;
  mint: PublicKey;
}

interface AddTokenToMargin {
  addingTokenToMargin: boolean;
  index: number;
  mint: PublicKey;
}

export const handleAddTokensToMargin = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  mints: PublicKey[],
  transaction: Transaction
): Promise<AddTokenToMargin[]> => {

  const addTokensToMargin: AddTokenToMargin[] = [];

  let marginInfo = await connection.getAccountInfo(marginPDA, 'processed');
  if (!marginInfo) throw new Error('No margin account found!');

  let marginData = MARGIN_DATA_LAYOUT.decode(marginInfo.data);
  const dataLayout = struct([u8('instruction'), u8('index')]);
  let currentIndex = marginData.token_count;
  for (const mint of mints) {
    const index = xenonPdaData.token_list
      .map((f) => f.mint.toBase58())
      .findIndex((o) => o === mint.toBase58());

    if (index === -1) {
      throw new Error('Adding incorrect mint');
    }

    const marginAccountToken = marginData.tokens.find((f) => f.index === index);

    if (marginAccountToken && marginAccountToken.is_active) {
      addTokensToMargin.push({
        addingTokenToMargin: false,
        index: marginData.tokens.findIndex((f) => f.index === index),
        mint,
      });
      continue;
    }

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
      {
        instruction: 16,
        index: index,
      },
      data
    );
    const marginVaultAccount = await createAssociatedTokenAccountIfNotExist(
      connection,
      payer,
      mint,
      marginPDA,
      transaction
    );

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: xenonPDA, isSigner: false, isWritable: true },
        { pubkey: marginPDA, isSigner: false, isWritable: true },
        { pubkey: payer, isSigner: false, isWritable: true },
        { pubkey: marginVaultAccount, isSigner: false, isWritable: false },
      ],
      programId,
      data,
    });

    transaction.add(instruction);
    addTokensToMargin.push({ addingTokenToMargin: true, index: currentIndex, mint });
    currentIndex++
  }

  addTokensToMargin
  return addTokensToMargin;
};

export const handleAddTokenToMargin2 = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  mint: PublicKey,
  transaction: Transaction
): Promise<AddTokenToMargin> => {
  let marginInfo = await connection.getAccountInfo(marginPDA, 'processed');
  if (!marginInfo) throw new Error('No margin account found!');

  let marginData = MARGIN_DATA_LAYOUT.decode(marginInfo.data);
  const dataLayout = struct([u8('instruction'), u8('index')]);
  const index = xenonPdaData.token_list
    .map((f) => f.mint.toBase58())
    .findIndex((o) => o === mint.toBase58());

  if (index === -1) {
    throw new Error('Adding incorrect mint');
  }

  const marginAccountToken = marginData.tokens.find((f) => f.index === index);

  if (marginAccountToken && marginAccountToken.is_active) {
    return {
      addingTokenToMargin: false,
      index: marginData.tokens.findIndex((f) => f.index === index),
      mint,
    };
  }

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 16,
      index: index,
    },
    data
  );
  const marginVaultAccount = await createAssociatedTokenAccountIfNotExist(
    connection,
    payer,
    mint,
    marginPDA,
    transaction
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true },
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: false, isWritable: true },
      { pubkey: marginVaultAccount, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  });

  transaction.add(instruction);
  return { addingTokenToMargin: true, index: marginData.token_count, mint };
};

// rewrite this 
export const handleInitializeSolendAdapter2 = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  solendReserve: SOLEND_RESERVE
) => {
  let handleAddTokensToMarginResults: AddTokenToMargin[] = [];

  for (const mint of [
    solendReserve.mint,
    solendReserve.collateralMintAddress,
  ]) {
    const handleAddTokenToMarginResult = await handleAddTokenToMargin2(
      connection,
      xenonPDA,
      xenonPdaData,
      marginPDA,
      payer,
      new PublicKey(mint),
      transaction
    );
    handleAddTokensToMarginResults.push(handleAddTokenToMarginResult);
  }

  handleAddTokensToMarginResults = handleAddTokensToMarginResults.sort(
    (x, y) => {
      return x.addingTokenToMargin === y.addingTokenToMargin
        ? 0
        : x.addingTokenToMargin
        ? -1
        : 1;
    }
  );
  const alreadyAddedTokens: AddTokenToMargin[] = [];
  for (const iterator of handleAddTokensToMarginResults) {
    if (iterator.addingTokenToMargin === false) {
      alreadyAddedTokens.push(iterator);
    }
  }

  const filteredAdding = handleAddTokensToMarginResults.filter(
    (f) => f.addingTokenToMargin === true
  );
  const newlyAddingTokens: AddTokenToMargin[] = [];
  for (let i = 0; i < filteredAdding.length; i++) {
    const element = filteredAdding[i];
    newlyAddingTokens.push({ ...element, index: element.index + i });
  }

  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    solendAdapterProgramId
  );

  const gAdapterPDA = solendGAdapterPk;

  const adaData = await connection.getAccountInfo(adapterPDA[0]);

  const indexes: number[] = [];

  if (adaData) {
    const alreadyInitialisedMints: string[] = ADAPTER_ACCOUNT_LAYOUT.decode(
      adaData?.data
    ).mints.map((k) => k.toBase58());
    for (const x of [...alreadyAddedTokens, ...newlyAddingTokens]) {
      if (!alreadyInitialisedMints.includes(x.mint.toBase58())) {
        indexes.push(x.index);
      }
    }
  } else {
    for (const x of [...alreadyAddedTokens, ...newlyAddingTokens]) {
      indexes.push(x.index);
    }
  }

  if (indexes.length === 0) {
    return;
  }

  const xx: any = [];
  xx.push(u8('instruction'));
  xx.push(u8('adapter_index'));
  xx.push(u8('count'));

  for (const iterator of indexes) {
    xx.push(u8(`token_${iterator}`));
  }

  const someLayout = {
    instruction: 12,
    adapter_index: 0,
    count: indexes.length,
  };

  for (const i of indexes) {
    someLayout['token_' + i] = i;
  }

  const dataLayout = struct(xx);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(someLayout, data);

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: solendAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: PublicKey.default, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data,
  });
  transaction.add(instruction);
};

export const solendDeposit = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  amount: number,
  solendReserve: SOLEND_RESERVE
) => {
  await handleInitializeSolendAdapter2(
    connection,
    xenonPDA,
    xenonPdaData,
    marginPDA,
    payer,
    transaction,
    solendReserve
  );

  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    solendAdapterProgramId
  );
  const gAdapterPDA = solendGAdapterPk;

  let marginData = await connection.getAccountInfo(marginPDA, 'processed');
  if (!marginData) throw new Error('No margin account found!');

  const dataLayout = struct([
    u8('instruction'),
    u8('adapter_index'),
    u8('instruction3'),
    nu64('liquidity_amount'),
  ]);
  const decimals = getDecimalsFromMint(solendReserve.mint);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 10,
      adapter_index: 0,
      instruction3: 4,
      liquidity_amount: amount * 10 ** decimals!,
    },
    data
  );

  const sourceLiquidityAcc = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(solendReserve.mint)
  );
  const DestCollateralAcc = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(solendReserve.collateralMintAddress)
  );

  const reserveLiqSupplyAcc = new PublicKey(solendReserve.liquidityAddress);

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: false },
      { pubkey: solendAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: PublicKey.default, isSigner: false, isWritable: true },

      { pubkey: solendProgramID, isSigner: false, isWritable: false },

      { pubkey: sourceLiquidityAcc, isSigner: false, isWritable: true }, //source liquidity info
      { pubkey: DestCollateralAcc, isSigner: false, isWritable: true }, //destination colleteral info

      {
        pubkey: new PublicKey(solendReserve.address),
        isSigner: false,
        isWritable: true,
      }, // reserve info
      { pubkey: reserveLiqSupplyAcc, isSigner: false, isWritable: true }, //reserve liquidity supply
      {
        pubkey: new PublicKey(solendReserve.collateralMintAddress),
        isSigner: false,
        isWritable: true,
      }, //reserve colleteral mint

      { pubkey: SOLEND_MARKET, isSigner: false, isWritable: false }, //Lending market info
      { pubkey: SOLEND_DERIEVED_MARKET, isSigner: false, isWritable: false }, //derived lending market
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  });

  transaction.add(instruction);
};

export const solendWithdraw = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  amount: number,
  solendReserve: SOLEND_RESERVE
) => {
  await handleInitializeSolendAdapter2(
    connection,
    xenonPDA,
    xenonPdaData,
    marginPDA,
    payer,
    transaction,
    solendReserve
  );

  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    solendAdapterProgramId
  );
  const gAdapterPDA = solendGAdapterPk;

  let marginData = await connection.getAccountInfo(marginPDA, 'processed');
  if (!marginData) throw new Error('No margin account found!');

  const dataLayout = struct([
    u8('instruction'),
    u8('adapter_index'),
    u8('instruction3'),
    nu64('collateral_amount'),
  ]);
  const decimals = getDecimalsFromMint(solendReserve.mint);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 10,
      adapter_index: 0,
      instruction3: 5,
      collateral_amount: amount * 10 ** decimals!,
    },
    data
  );

  const sourceCollateralAcc = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(solendReserve.collateralMintAddress),
  );

  const DestLiquidityAcc = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(solendReserve.mint)
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: false },
      { pubkey: solendAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: true },

      { pubkey: solendProgramID, isSigner: false, isWritable: false },

      { pubkey: sourceCollateralAcc, isSigner: false, isWritable: true }, //source Collateral
      { pubkey: DestLiquidityAcc, isSigner: false, isWritable: true }, //destination liquidity info
      {
        pubkey: new PublicKey(solendReserve.address),
        isSigner: false,
        isWritable: true,
      }, // reserve info
      {
        pubkey: new PublicKey(solendReserve.collateralMintAddress),
        isSigner: false,
        isWritable: true,
      }, //reserve colleteral mint

      {
        pubkey: new PublicKey(solendReserve.liquidityAddress),
        isSigner: false,
        isWritable: true,
      }, //reserve liquidity token account
      { pubkey: SOLEND_MARKET, isSigner: false, isWritable: false }, //Lending market info
      { pubkey: SOLEND_DERIEVED_MARKET, isSigner: false, isWritable: false }, //derived lending market
      { pubkey: marginPDA, isSigner: false, isWritable: true },

      { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  });

  transaction.add(instruction);
};

export const handleInitializeSaberAdapter = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  saber_lp: Saber_LP
) => {
  //save check_account

  const saberLpNeededTokens = [
    ...saber_lp.lpToken.extensions.underlyingTokens,
    saber_lp.lpToken.address,
  ];

  let marginInfo = await connection.getAccountInfo(marginPDA, 'processed');
  if (!marginInfo) throw new Error('No margin account found!');
  let marginPdaData = MARGIN_DATA_LAYOUT.decode(marginInfo.data);

  for (const [i, mint] of saberLpNeededTokens.entries()) {
    //check if already token is initialised
    if (
      getMarginPDATokenIndexHelper(
        new PublicKey(mint),
        xenonPdaData,
        marginPdaData
      ) === -1
    ) {
      await handleAddTokenToMargin2(
        connection,
        xenonPDA,
        xenonPdaData,
        marginPDA,
        payer,
        new PublicKey(mint),
        transaction
      );
    }
  }
};

export const handleInitializeSaberAdapter2 = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  saber_lp: Saber_LP
) => {
  //  steps0 ::  find all tokens needed
  const saberLpNeededTokens = [
    ...saber_lp.lpToken.extensions.underlyingTokens,
    saber_lp.lpToken.address,
  ];

  const tokenData = await handleAddTokensToMargin(
    connection, xenonPDA, xenonPdaData, marginPDA, payer, saberLpNeededTokens.map(f => new PublicKey(f)), transaction);

  let marginInfo = await connection.getAccountInfo(marginPDA, 'processed');
  if (!marginInfo) throw new Error('No margin account found!');
  let marginPdaData = MARGIN_DATA_LAYOUT.decode(marginInfo.data);

  const localAdapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    saberAdapterProgramId
  );
  const gAdapterPDA = saberGAdapterPk;

  const marginAccTokenIndexToBeAdded: any = [];
  let tokensToBeInitCount = 0;
  const localAdapterPDADataInfo = await connection.getAccountInfo(
    localAdapterPDA[0],
    'processed'
  );
  if (localAdapterPDADataInfo) {

    //  step 2-a :: localAdapterAcc already exist so check and add
    const localAdapterPDAData = ADAPTER_ACCOUNT_LAYOUT.decode(
      localAdapterPDADataInfo?.data
    );
    //  current_last_margin_pda_index = 4
    for (const [i, mint] of saberLpNeededTokens.entries()) {
      //check if already token is initialised inside LocalAdpater
      if (
        getLocalAdapterTokenIndexHelper(
          new PublicKey(mint),
          localAdapterPDAData
        ) === -1
      ) {
        const token = tokenData.find(k => k.mint.toBase58() === mint);
        // already added
        if (token) {
          tokensToBeInitCount++;
          marginAccTokenIndexToBeAdded.push({ mint: mint, index: token.index });
        }
      } else {
        //case 3 : exist on margin and adapter
        // no need to add
      }
    }

    if (tokensToBeInitCount === 0) {
      return;
    }
  } else {
    //  step 2-b :: localAdapterAcc doesn't exist so Add all mints
    for (const [i, mint] of saberLpNeededTokens.entries()) {
      const token = tokenData.find(f => f.mint.toBase58() === mint);
      if (token) {
        marginAccTokenIndexToBeAdded.push({ mint: mint, index: token.index });
      }
    }
  }

  if(marginAccTokenIndexToBeAdded.length === 0) {
    return;
  }

  let obj = {};
  const layoutArr: any = [u8('instruction'), u8('adapter_index'), u8('count')];

  for (let i = 0; i < marginAccTokenIndexToBeAdded.length; i++) {
    layoutArr.push(u8(`token_${i}`));
    obj[`token_${i}`] = marginAccTokenIndexToBeAdded[i].index;
  }
  const dataLayout = struct(layoutArr);

  const data = Buffer.alloc(dataLayout.span);
  const someLayout = {
    instruction: 12,
    adapter_index: 1,
    count: marginAccTokenIndexToBeAdded.length,
    ...obj,
  };

  dataLayout.encode(someLayout, data);

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: saberAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
      { pubkey: localAdapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: PublicKey.default, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  });

  transaction.add(instruction);
};

export const handleSaberDeposit = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  saber_lp: Saber_LP,
  amountA: number,
  amountB: number
) => {
  await handleInitializeSaberAdapter2(
    connection,
    xenonPDA,
    xenonPdaData,
    marginPDA,
    payer,
    transaction,
    saber_lp
  );

  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    saberAdapterProgramId
  );
  const gAdapterPDA = saberGAdapterPk;

  const token_a_user = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(saber_lp.tokens[0].address)
  );
  const token_b_user = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(saber_lp.tokens[1].address)
  );

  const user_pool = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(saber_lp.lpToken.address)
  );

  const xx: any = [];
  xx.push(u8('instruction'));
  xx.push(u8('adapter_index'));
  xx.push(u8('instruction3'));
  xx.push(nu64('token_a_amount'));
  xx.push(nu64('token_b_amount'));
  xx.push(nu64('min_mint_amount'));

  const dataLayout = struct(xx);

  const data = Buffer.alloc(dataLayout.span);
  const token_a_amount = amountA * 10 ** saber_lp.tokens[0].decimals;
  const token_b_amount = amountB * 10 ** saber_lp.tokens[1].decimals;
  const min_mint_amount = (token_a_amount + token_b_amount) * (95 / 100);
  dataLayout.encode(
    {
      instruction: 10,
      adapter_index: 1,
      instruction3: 2,
      token_a_amount,
      token_b_amount,
      min_mint_amount,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: saberAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: PublicKey.default, isSigner: false, isWritable: false },
      { pubkey: saberProgramID, isSigner: false, isWritable: false },

      {
        pubkey: new PublicKey(saber_lp.swap.config.swapAccount),
        isSigner: false,
        isWritable: false,
      }, //stableswap
      {
        pubkey: new PublicKey(saber_lp.swap.config.authority),
        isSigner: false,
        isWritable: false,
      }, //authority

      { pubkey: marginPDA, isSigner: false, isWritable: true }, //user
      { pubkey: token_a_user, isSigner: false, isWritable: true }, //token_a $authority can transfer amount
      { pubkey: token_b_user, isSigner: false, isWritable: true }, //token_b $authority can transfer amount
      {
        pubkey: new PublicKey(saber_lp.swap.state.tokenA.reserve),
        isSigner: false,
        isWritable: true,
      }, //token_a Base Account to deposit into
      {
        pubkey: new PublicKey(saber_lp.swap.state.tokenB.reserve),
        isSigner: false,
        isWritable: true,
      }, //token_a Base Account to deposit into

      {
        pubkey: new PublicKey(saber_lp.lpToken.address),
        isSigner: false,
        isWritable: true,
      }, //pool mint account
      { pubkey: user_pool, isSigner: false, isWritable: true }, //user pool account

      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  });

  transaction.add(instruction);
};

export const handleSaberWithdraw = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  saber_lp: Saber_LP,
  lpAmount: number
) => {
  await handleInitializeSaberAdapter2(
    connection,
    xenonPDA,
    xenonPdaData,
    marginPDA,
    payer,
    transaction,
    saber_lp
  );

  const gAdapterPDA = saberGAdapterPk;
  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    saberAdapterProgramId
  );

  const token_a_user = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(saber_lp.tokens[0].address)
  );
  const token_b_user = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(saber_lp.tokens[1].address)
  );

  const user_pool = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(saber_lp.lpToken.address)
  );

  const dataLayout = struct([
    u8('instruction'),
    u8('adapter_index'),
    u8('instruction3'),
    nu64('pool_token_amount'),
    nu64('minimum_token_a_amount'),
    nu64('minimum_token_b_amount'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 10,
      adapter_index: 1,
      instruction3: 3,
      pool_token_amount: lpAmount * 10 ** saber_lp.lpToken.decimals,
      minimum_token_a_amount: 1,
      minimum_token_b_amount: 1,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: saberAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: PublicKey.default, isSigner: false, isWritable: false },
      { pubkey: saberProgramID, isSigner: false, isWritable: false },

      {
        pubkey: new PublicKey(saber_lp.swap.config.swapAccount),
        isSigner: false,
        isWritable: false,
      }, //stableswap
      {
        pubkey: new PublicKey(saber_lp.swap.config.authority),
        isSigner: false,
        isWritable: false,
      }, //authority

      { pubkey: marginPDA, isSigner: false, isWritable: true }, //user

      {
        pubkey: new PublicKey(saber_lp.lpToken.address),
        isSigner: false,
        isWritable: true,
      }, //pool mint account
      { pubkey: user_pool, isSigner: false, isWritable: true }, //source pool account

      {
        pubkey: new PublicKey(saber_lp.swap.state.tokenA.reserve),
        isSigner: false,
        isWritable: true,
      }, //token_a Swap Account to withdraw FROM
      {
        pubkey: new PublicKey(saber_lp.swap.state.tokenB.reserve),
        isSigner: false,
        isWritable: true,
      }, //token_b Swap Account to withdraw FROM
      { pubkey: token_a_user, isSigner: false, isWritable: true }, //token_a user Account to credit
      { pubkey: token_b_user, isSigner: false, isWritable: true }, //token_b user Account to credit

      {
        pubkey: new PublicKey(saber_lp.swap.state.tokenA.adminFeeAccount),
        isSigner: false,
        isWritable: true,
      }, //admin_fee_a admin fee Account for token_a
      {
        pubkey: new PublicKey(saber_lp.swap.state.tokenB.adminFeeAccount),
        isSigner: false,
        isWritable: true,
      }, //admin_fee_b admin fee Account for token_b

      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  });

  transaction.add(instruction);
};

export const handleQuarryInitMintsInMargin = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  saber_lp: Saber_LP
) => {
  let marginInfo = await connection.getAccountInfo(marginPDA, 'processed');
  if (!marginInfo) throw new Error('No margin account found!');
  let marginPdaData = MARGIN_DATA_LAYOUT.decode(marginInfo.data);

  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    quarryAdapterProgramId
  );

  const index = getXenonPDATokenIndexHelper(
    xenonPdaData,
    new PublicKey(saber_lp.lpToken.address)
  );
  if (index === -1) {
    throw new Error('Adding incorrect mint Not Found on XenonPDA');
  }
  const marginAccountTokenIndex = getMarginPDATokenIndexHelper(
    new PublicKey(saber_lp.lpToken.address),
    xenonPdaData,
    marginPdaData
  );

  if (marginAccountTokenIndex !== -1) {
    throw new Error('token already init in margin');
  }
  await handleAddTokenToMargin2(
    connection,
    xenonPDA,
    xenonPdaData,
    marginPDA,
    payer,
    new PublicKey(saber_lp.lpToken.address),
    transaction
  );
};

export const handleInitializeQuarryAdapter = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  saber_lp: Saber_LP
) => {
  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    quarryAdapterProgramId
  );
  const gAdapterPDA = quarryGAdapterPk;
  const checkPDA = await PublicKey.findProgramAddress(
    [adapterPDA[0].toBuffer()],
    quarryAdapterProgramId
  );

  let marginInfo = await connection.getAccountInfo(marginPDA, 'processed');
  if (!marginInfo) throw new Error('No margin account found!');

  let marginData = MARGIN_DATA_LAYOUT.decode(marginInfo.data);

  const index = getXenonPDATokenIndexHelper(
    xenonPdaData,
    new PublicKey(saber_lp.lpToken.address)
  );
  if (index === -1) {
    throw new Error('Adding incorrect mint Not Found on XenonPDA');
  }

  // const marginAccountTokenIndex = marginData.tokens.findIndex(f => f.index === index);
  const marginAccountTokenIndex = getMarginPDATokenIndexHelper(
    new PublicKey(saber_lp.lpToken.address),
    xenonPdaData,
    marginData
  );

  if (marginAccountTokenIndex === -1) {
    throw new Error('token not found in margin');
  }

  const localAdapterPDADataInfo = await connection.getAccountInfo(
    adapterPDA[0],
    'processed'
  );
  if (localAdapterPDADataInfo) {
    //  account already exist so check if already contains mint
    const localAdapterPDAData = ADAPTER_ACCOUNT_LAYOUT.decode(
      localAdapterPDADataInfo?.data
    );

    if (
      getLocalAdapterTokenIndexHelper(
        new PublicKey(saber_lp.lpToken.address),
        localAdapterPDAData
      ) !== -1
    ) {
      // mint already init so skip the trx
      return;
    }
  } else {
    // no adapter acc created yet so don't skip init all the mints passed
  }

  const quarryAccount = new PublicKey(saber_lp.quarry);
  const minerAccount = await PublicKey.findProgramAddress(
    [Buffer.from('Miner'), quarryAccount.toBuffer(), marginPDA.toBuffer()],
    quarryProgramId
  );
  const minerVault = await findAssociatedTokenAddress(
    minerAccount[0],
    new PublicKey(saber_lp.lpToken.address)
  );

  const dataLayout = struct([
    u8('instruction'),
    u8('adapter_index'),
    u8('count'),
    u8('token_1'),
  ]);
  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 12,
      adapter_index: 2,
      count: 1,
      token_1: marginAccountTokenIndex,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: false },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: quarryAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: checkPDA[0], isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: true },
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },

      { pubkey: quarryProgramId, isSigner: false, isWritable: false },

      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: minerAccount[0], isSigner: false, isWritable: true }, //pool mint
      { pubkey: quarryAccount, isSigner: false, isWritable: true }, //pool mint
      { pubkey: QUARRY_REWARDER, isSigner: false, isWritable: true },
      {
        pubkey: new PublicKey(saber_lp.lpToken.address),
        isSigner: false,
        isWritable: true,
      },
      { pubkey: minerVault, isSigner: false, isWritable: true }, //pool mint
    ],
    programId,
    data,
  });

  transaction.add(instruction);
};

export const handleQuarryDeposit = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  saber_lp: Saber_LP,
  lpAmount: number
) => {
  await handleInitializeQuarryAdapter(
    connection,
    xenonPDA,
    xenonPdaData,
    marginPDA,
    payer,
    transaction,
    saber_lp
  );

  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    quarryAdapterProgramId
  );
  const gAdapterPDA = await PublicKey.findProgramAddress(
    [Buffer.from('quarry')],
    quarryAdapterProgramId
  );
  const checkPDA = await PublicKey.findProgramAddress(
    [adapterPDA[0].toBuffer()],
    quarryAdapterProgramId
  );

  const quarryAccount = new PublicKey(saber_lp.quarry);

  const minerAccount = await PublicKey.findProgramAddress(
    [Buffer.from('Miner'), quarryAccount.toBuffer(), marginPDA.toBuffer()],
    quarryProgramId
  );

  const minerVault = await findAssociatedTokenAddress(
    minerAccount[0],
    new PublicKey(saber_lp.lpToken.address)
  );

  const lpTokenAccount = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(saber_lp.lpToken.address)
  );

  const dataLayout = struct([
    u8('instruction'),
    u8('adapter_id'),
    u32be('instruction1'),
    u32be('instruction2'),
    nu64('deposit_amount'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 10,
      adapter_id: 2,
      instruction1: new BigNumber('0x887e5ba2'),
      instruction2: new BigNumber('0x28830d7f'),
      deposit_amount: lpAmount * 10 ** saber_lp.lpToken.decimals,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: quarryAdapterProgramId, isSigner: false, isWritable: false },
      { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: checkPDA[0], isSigner: false, isWritable: true },

      { pubkey: quarryProgramId, isSigner: false, isWritable: false },

      { pubkey: marginPDA, isSigner: false, isWritable: true },

      { pubkey: minerAccount[0], isSigner: false, isWritable: true },
      { pubkey: quarryAccount, isSigner: false, isWritable: true },
      { pubkey: minerVault, isSigner: false, isWritable: true },
      { pubkey: lpTokenAccount, isSigner: false, isWritable: true },

      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: QUARRY_REWARDER, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  });

  transaction.add(instruction);
};

export const handleQuarryWithdraw = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  saber_lp: Saber_LP,
  lpAmount: number
) => {
  await handleInitializeQuarryAdapter(
    connection,
    xenonPDA,
    xenonPdaData,
    marginPDA,
    payer,
    transaction,
    saber_lp
  );

  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    quarryAdapterProgramId
  );
  const gAdapterPDA = quarryGAdapterPk;
  const checkPDA = await PublicKey.findProgramAddress(
    [adapterPDA[0].toBuffer()],
    quarryAdapterProgramId
  );

  const quarryAccount = new PublicKey(saber_lp.quarry);

  const minerAccount = await PublicKey.findProgramAddress(
    [Buffer.from('Miner'), quarryAccount.toBuffer(), marginPDA.toBuffer()],
    quarryProgramId
  );

  const minerVault = await createAssociatedTokenAccountIfNotExist(
    connection,
    payer,
    new PublicKey(saber_lp.lpToken.address),
    minerAccount[0],
    transaction
  );

  const lpTokenAccount = await findAssociatedTokenAddress(
    marginPDA,
    new PublicKey(saber_lp.lpToken.address)
  );

  const dataLayout = struct([
    u8('instruction'),
    u8('adapter_id'),
    u32be('instruction1'),
    u32be('instruction2'),
    nu64('withdraw_amount'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 10,
      adapter_id: 2,
      instruction1: new BigNumber('0x0204e13d'),
      instruction2: new BigNumber('0x13b66aaa'),
      withdraw_amount: lpAmount * 10 ** saber_lp.lpToken.decimals,
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: quarryAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: checkPDA[0], isSigner: false, isWritable: true },

      { pubkey: quarryProgramId, isSigner: false, isWritable: false },

      { pubkey: marginPDA, isSigner: false, isWritable: true },

      { pubkey: minerAccount[0], isSigner: false, isWritable: true },
      { pubkey: quarryAccount, isSigner: false, isWritable: true },
      { pubkey: minerVault, isSigner: false, isWritable: true },
      { pubkey: lpTokenAccount, isSigner: false, isWritable: true },

      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: QUARRY_REWARDER, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  });
  transaction.add(instruction);
};

export const handleQuarryClaimRewards = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData: any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  saber_lp: Saber_LP,
  lpAmount: number
) => {
  const adapterPDA = await PublicKey.findProgramAddress(
    [marginPDA.toBuffer()],
    quarryAdapterProgramId
  );
  const gAdapterPDA = quarryGAdapterPk;
  const checkPDA = await PublicKey.findProgramAddress(
    [adapterPDA[0].toBuffer()],
    quarryAdapterProgramId
  );

  const quarryAccount = new PublicKey(saber_lp.quarry);

  const minerAccount = await PublicKey.findProgramAddress(
    [Buffer.from('Miner'), quarryAccount.toBuffer(), marginPDA.toBuffer()],
    quarryProgramId
  );

  const rewardTokenAccount = await createAssociatedTokenAccountIfNotExist(
    connection,
    payer,
    QUARRY_REWARD_MINT,
    payer,
    transaction
  );

  const dataLayout = struct([
    u8('instruction'),
    u8('adapter_id'),
    u32be('instruction1'),
    u32be('instruction2'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 10,
      adapter_id: 2,
      instruction1: new BigNumber('0x45319ee5'),
      instruction2: new BigNumber('0xd48588e3'),
    },
    data
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: quarryAdapterProgramId, isSigner: false, isWritable: false },
      { pubkey: gAdapterPDA, isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: checkPDA[0], isSigner: false, isWritable: true },

      { pubkey: quarryProgramId, isSigner: false, isWritable: false },
      { pubkey: QUARRY_MINT_WRAPPER, isSigner: false, isWritable: true },
      {
        pubkey: QUARRY_MINT_WRAPPER_PROGRAM,
        isSigner: false,
        isWritable: false,
      },
      { pubkey: QUARRY_MINTER, isSigner: false, isWritable: true },
      { pubkey: QUARRY_REWARD_MINT, isSigner: false, isWritable: true },
      { pubkey: rewardTokenAccount, isSigner: false, isWritable: true },
      { pubkey: QUARRY_REWARDER_ATA, isSigner: false, isWritable: true },

      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: minerAccount[0], isSigner: false, isWritable: true },
      { pubkey: quarryAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: QUARRY_REWARDER, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  });
  transaction.add(instruction);
};

// All Orca Methods====

// Simple INSTRUCTION: Initialize DOESNOT HANDLE Tokens to be added to margin - BREAK THE TRXS IF USING THIS 
// NOTE : should handle adding to margin token to Margin Acc & Adapter if not exist 
export const handleInitializeOrcaAdapter = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData : any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  OrcaWhirlpool: OrcaWhirlpool
)=> {
  
  const adapterPDA = await PublicKey.findProgramAddress([marginPDA.toBuffer()], orcaAdapterProgramId);
  const gAdapterPDA = await PublicKey.findProgramAddress([Buffer.from("orca")], orcaAdapterProgramId);
  const checkPDA = await PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], orcaAdapterProgramId);

  // console.log("marginPDA :", marginPDA);
  // console.log("adapterPDA:", adapterPDA);

  //  check mints to be added in margin 3 mints 
  // margin accc token A and B ( 1,2)   
  let marginInfo = await connection.getAccountInfo(marginPDA, 'processed');
  if (!marginInfo) throw new Error('No margin account found!');
  let marginData = MARGIN_DATA_LAYOUT.decode(marginInfo.data);

  const tokensToCheck = [OrcaWhirlpool.tokenA.mint, OrcaWhirlpool.tokenB.mint];
  let marginTokenIndexsToBeAdded = []
  for(let i=0;i<2;i++){
      const index = getXenonPDATokenIndexHelper(
        xenonPdaData,
        new PublicKey(tokensToCheck[i])
      );
      if (index === -1) {
        throw new Error('Adding incorrect mint Not Found on XenonPDA');
      }
    
      // const marginAccountTokenIndex = marginData.tokens.findIndex(f => f.index === index);
      const marginAccountTokenIndex = getMarginPDATokenIndexHelper(
        new PublicKey(tokensToCheck[i]),
        xenonPdaData,
        marginData
      );
    
      if (marginAccountTokenIndex === -1) {
        throw new Error('token not found in margin');
      }
      marginTokenIndexsToBeAdded.push(marginAccountTokenIndex);
  }

    // const dataLayout = struct([u8('instruction'), u8('adapter_index'), u8('count'), u8('token_index_1'), u8('token_index_2')])
    let obj = {};
      const layoutArr: any = [u8('instruction'), u8('adapter_index'), u8('count')];

      for (let i = 0; i < marginTokenIndexsToBeAdded.length; i++) {
        layoutArr.push(u8(`token__index_${i}`));
        obj[`token__index_${i}`] = marginTokenIndexsToBeAdded[i].index;
      }
      const dataLayout = struct(layoutArr);

      const data = Buffer.alloc(dataLayout.span);
      const someLayout = {
            instruction: 12,
            adapter_index: 4,
            count: marginTokenIndexsToBeAdded.length,
        ...obj,
      };
      console.log("layout:",someLayout);
      dataLayout.encode(someLayout,data)

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: xenonPDA, isSigner: false, isWritable: false },
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: marginPDA, isSigner: false, isWritable: true },
        { pubkey: orcaAdapterProgramId, isSigner: false, isWritable: false },

        { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
        { pubkey: checkPDA[0], isSigner: false, isWritable: true },
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
       
      ],
      programId, //programId,
      data
    });

    transaction.add(instruction)
};

// COMPLEX INSTRUCTION: Initialize HANDLES Tokens to be added to margin - Does Everything in same Trx
//  add mints in Margin Account and also in localAdapter (2 places)
export const handleInitializeOrcaAdapter2 = async (
  connection: Connection,
  xenonPDA: PublicKey,
  xenonPdaData : any,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  OrcaWhirlpool: OrcaWhirlpool
)=> {
  
  const localAdapterPDA = await PublicKey.findProgramAddress([marginPDA.toBuffer()], orcaAdapterProgramId);
  const gAdapterPDA = await PublicKey.findProgramAddress([Buffer.from("orca")], orcaAdapterProgramId);
  const checkPDA = await PublicKey.findProgramAddress([localAdapterPDA[0].toBuffer()], orcaAdapterProgramId);

  // console.log("marginPDA :", marginPDA);
  // console.log("localAdapterPDA:", localAdapterPDA);

  //  steps0 ::  find all tokens needed
  const tokensToCheck = [OrcaWhirlpool.tokenA.mint, OrcaWhirlpool.tokenB.mint];

  const tokenData = await handleAddTokensToMargin(
    connection, xenonPDA, xenonPdaData, marginPDA, payer, tokensToCheck.map(f => new PublicKey(f)), transaction);

  // let marginInfo = await connection.getAccountInfo(marginPDA, 'processed');
  // if (!marginInfo) throw new Error('No margin account found!');
  // let marginPdaData = MARGIN_DATA_LAYOUT.decode(marginInfo.data);
  
  const marginAccTokenIndexToBeAdded: any = [];
  let tokensToBeInitCount = 0;

  const localAdapterPDADataInfo = await connection.getAccountInfo(
    localAdapterPDA[0],
    'processed'
  );
  if (localAdapterPDADataInfo) {

    //  step 2-a :: localAdapterAcc already exist so check and add
    const localAdapterPDAData = ADAPTER_ACCOUNT_LAYOUT.decode(
      localAdapterPDADataInfo?.data
    );
    //  current_last_margin_pda_index = 4
    for (const [i, mint] of tokensToCheck.entries()) {
      //check if already token is initialised inside LocalAdpater
      if (
        getLocalAdapterTokenIndexHelper(
          new PublicKey(mint),
          localAdapterPDAData
        ) === -1
      ) {
        const token = tokenData.find(k => k.mint.toBase58() === mint);
        // already added
        if (token) {
          tokensToBeInitCount++;
          marginAccTokenIndexToBeAdded.push({ mint: mint, index: token.index });
        }
      } else {
        //case 3 : exist on margin and adapter
        // no need to add
      }
    }

    if (tokensToBeInitCount === 0) {
      return;
    }
  } else {
    //  step 2-b :: localAdapterAcc doesn't exist so Add all mints
    for (const [i, mint] of tokensToCheck.entries()) {
      const token = tokenData.find(f => f.mint.toBase58() === mint);
      if (token) {
        marginAccTokenIndexToBeAdded.push({ mint: mint, index: token.index });
      }
    }
  }

  if(marginAccTokenIndexToBeAdded.length === 0) {
    console.log(" NO need to Initialize Orca Adapter")
    return; // NO need to Initialize Account
  }

  let obj = {};
  const layoutArr: any = [u8('instruction'), u8('adapter_index'), u8('count')];

  for (let i = 0; i < marginAccTokenIndexToBeAdded.length; i++) {
    layoutArr.push(u8(`token_index_${i}`));
    obj[`token_index_${i}`] = marginAccTokenIndexToBeAdded[i].index;
  }
  const dataLayout = struct(layoutArr);

  const data = Buffer.alloc(dataLayout.span);
  const someLayout = {
    instruction: 12,
    adapter_index: 4,
    count: marginAccTokenIndexToBeAdded.length,
    ...obj,
  };

  dataLayout.encode(someLayout, data);
 
    // const dataLayout = struct([u8('instruction'), u8('adapter_index'), u8('count'), u8('token_index_1'), u8('token_index_2')])
    // const data = Buffer.alloc(dataLayout.span)
    // dataLayout.encode(
    //   {
    //     instruction: 12,
    //     adapter_index: 4,
    //     count: 2,
    //     token_index_1: 2, // index of main marginPDA
    //     token_index_2: 3
    //   },
    // data
    // )
    

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: xenonPDA, isSigner: false, isWritable: false },
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: marginPDA, isSigner: false, isWritable: true },
        { pubkey: orcaAdapterProgramId, isSigner: false, isWritable: false },

        { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
        { pubkey: localAdapterPDA[0], isSigner: false, isWritable: true },
        { pubkey: checkPDA[0], isSigner: false, isWritable: true },
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
       
      ],
      programId, //programId,
      data
    });

    transaction.add(instruction)
};

// NOTE : should be called before handleOrcaIncreaseLiquidity
// ASSUMING all the margin tokens are Initialized
export const handleOrcaOpenPosition = async (
  connection: Connection,
  xenonPDA: PublicKey,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  OrcaWhirlpool: OrcaWhirlpool,
  tickLowerIndex: number,
  tickUpperIndex: number
): Promise<PublicKey>  => {

  //save positionMint
  let signers = []
  const positionMintNew = Keypair.generate();
  // console.log("positionMintNew::", positionMintNew.publicKey.toBase58());
  signers.push(positionMintNew)

  const positionPda = PDAUtil.getPosition(orcaProgramId, positionMintNew.publicKey);
  // console.log("positionPDA:", positionPda.publicKey.toBase58());
  const positionMetadataPda = PDAUtil.getPositionMetadata(positionMintNew.publicKey);
  // console.log("positionMetadata: ", positionMetadataPda.publicKey.toBase58());
  const positionTokenAccountAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    positionMintNew.publicKey,
    marginPDA,
    true
  );

  const adapterPDA = await PublicKey.findProgramAddress([marginPDA.toBuffer()], orcaAdapterProgramId);
  const gAdapterPDA = await PublicKey.findProgramAddress([Buffer.from("orca")], orcaAdapterProgramId);
  const checkPDA = await PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], orcaAdapterProgramId);
  // console.log("checkPDA:", checkPDA);

  const dataLayout = struct([ u8('instruction'), u8('adapter_index'), u32be('instruction1'), u32be('instruction2'), u8('position_bump'), u8('metadata_bump'), i32('tick_lower_index'), i32('tick_upper_index')])

  console.log("positionPda.bump, ",positionPda.bump,positionMetadataPda.bump,tickLowerIndex,tickUpperIndex)
  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 10,
      adapter_index: 4,
      instruction1: new BigNumber('0xf21d8630'),
      instruction2: new BigNumber('0x3a6e0e3c'),
      position_bump:  positionPda.bump,
      metadata_bump:  positionMetadataPda.bump,
      tick_lower_index: tickLowerIndex,
      tick_upper_index: tickUpperIndex
    },
  data
  )

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: orcaAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: checkPDA[0], isSigner: false, isWritable: true }, //check_acc
      { pubkey: payer, isSigner: true, isWritable: true }, //funder
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false }, 

      { pubkey: orcaProgramId, isSigner: false, isWritable: false },

      { pubkey: payer, isSigner: true, isWritable: true }, //funder
      { pubkey: marginPDA, isSigner: false, isWritable: true }, //owner - marginPDA

      { pubkey: positionPda.publicKey, isSigner: false, isWritable: true }, //position
      { pubkey: positionMintNew.publicKey, isSigner: false, isWritable: true }, //position mint
      { pubkey: positionMetadataPda.publicKey, isSigner: false, isWritable: true }, //position metadata
      { pubkey: positionTokenAccountAddress, isSigner: false, isWritable: true }, //position token account
      { pubkey: new PublicKey(OrcaWhirlpool.address), isSigner: false, isWritable: true }, //whirlpool

      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: METAPLEX_TOKEN_METADATA, isSigner: false, isWritable: false },
      { pubkey: new PublicKey('3axbTs2z5GBy6usVbNVoqEgZMng3vZvMnAoX29BFfwhr'), isSigner: false, isWritable: true }, //metadata update auth : TODO ??
    ],
    programId,
    data
  });

  transaction.add(instruction);
  return positionMintNew.publicKey;
};

// NOTE : should be called after handleOrcaOpenPosition
//  ASSUMING all the margin tokens are Initialized
export const handleOrcaIncreaseLiquidity = async (
  connection: Connection,
  xenonPDA: PublicKey,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  WhirlpoolClient : WhirlpoolClient,
  OrcaWhirlpool: OrcaWhirlpool,
  positionMint: PublicKey,
  maxTokenAAmount : number,
  maxTokenBAmount : number,
) => { 
  console.log("handle Orca Increase Liquidity clicked")

  const pool = await WhirlpoolClient.getPool(OrcaWhirlpool.address);
  const poolData = pool.getData();
  const token_a_vault = poolData.tokenVaultA;
  const token_b_vault = poolData.tokenVaultB;
  
  const positionPda = PDAUtil.getPosition(orcaProgramId, positionMint);
  console.log("positionPDA:", positionPda);
  const positionTokenAccountAddress = await createAssociatedTokenAccountIfNotExist(connection, payer, positionMint, marginPDA, transaction);
  console.log("positionTokenAccountAddress:", positionTokenAccountAddress);

  const position = await WhirlpoolClient.getPosition(positionPda.publicKey);
  const positionData = position.getData()
    
  const adapterPDA = await PublicKey.findProgramAddress([marginPDA.toBuffer()], orcaAdapterProgramId);
  const gAdapterPDA = await PublicKey.findProgramAddress([Buffer.from("orca")], orcaAdapterProgramId);
  const checkPDA = await PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], orcaAdapterProgramId);

  const token_a_user = await createAssociatedTokenAccountIfNotExist(connection, payer, new PublicKey(OrcaWhirlpool.tokenA.mint), marginPDA, transaction);
  const token_b_user = await createAssociatedTokenAccountIfNotExist(connection, payer, new PublicKey(OrcaWhirlpool.tokenB.mint), marginPDA, transaction);
  console.log("token_a_user: ", token_a_user.toBase58())
  console.log("token_b_user: ", token_b_user.toBase58())
 
 
  const tickSpacing = poolData.tickSpacing; //todo: get it from pool_data.tickSpacing
  const tick_array_lower = PDAUtil.getTickArrayFromTickIndex(positionData.tickLowerIndex, tickSpacing, new PublicKey('HJPjoWUrhoZzkNfRpHuieeFk9WcZWjwy6PBjZ81ngndJ'), orcaProgramId);
  const tick_array_upper = PDAUtil.getTickArrayFromTickIndex(positionData.tickUpperIndex, tickSpacing, new PublicKey('HJPjoWUrhoZzkNfRpHuieeFk9WcZWjwy6PBjZ81ngndJ'), orcaProgramId);

  console.log("tick_array_lower:", tick_array_lower);
  console.log("tick_array_upper:", tick_array_upper);

  // estimateLiquidityFromTokenAmounts
  const currTick = poolData.tickCurrentIndex;
  const tickLowerIndex =  positionData.tickLowerIndex;
  const tickUpperIndex = positionData.tickUpperIndex;
  const tokenAmount = toTokenAmount(maxTokenAAmount, maxTokenBAmount);

  const liquidityAmount = PoolUtil.estimateLiquidityFromTokenAmounts(
    currTick,
    tickLowerIndex,
    tickUpperIndex,
    tokenAmount
  );
  console.log("liquidityAmount ::",liquidityAmount.toString())

  const dataLayout = struct([ u8('instruction'), u8('adapter_index'), u32be('instruction1'), u32be('instruction2'), u128('liquidity_amount'), nu64('token_max_a'), nu64('token_max_b')])

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 10,
      adapter_index: 4,
      instruction1: new BigNumber('0x2e9cf376'),
      instruction2: new BigNumber('0x0dcdfbb2'),
      liquidity_amount: liquidityAmount,
      token_max_a: maxTokenAAmount ,
      token_max_b: maxTokenBAmount
    },
  data
  )

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: orcaAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: checkPDA[0], isSigner: false, isWritable: true }, //check_acc
      { pubkey: payer, isSigner: true, isWritable: true }, //funder
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false }, 

      { pubkey: orcaProgramId, isSigner: false, isWritable: false },

      { pubkey: new PublicKey(OrcaWhirlpool.address), isSigner: false, isWritable: true }, //whirlpool
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: true }, //position_auth - marginPDA
      { pubkey: positionPda.publicKey, isSigner: false, isWritable: true }, //position
      { pubkey: positionTokenAccountAddress, isSigner: false, isWritable: true }, //position token account

      { pubkey: token_a_user, isSigner: false, isWritable: true }, //token_a_user
      { pubkey: token_b_user, isSigner: false, isWritable: true }, //token_b_user
      { pubkey: token_a_vault, isSigner: false, isWritable: true }, //token_a_vault
      { pubkey: token_b_vault, isSigner: false, isWritable: true }, //token_b_vault
      
      { pubkey: tick_array_lower.publicKey, isSigner: false, isWritable: true }, //tick_array_lower
      { pubkey: tick_array_upper.publicKey, isSigner: false, isWritable: true }, //tick_array_upper
      
    ],
    programId,
    data
  });

  transaction.add(instruction)

};

// Orca Withdarw Flow -------------

export const handleOrcaUpdateFeesAndReward =  async (
  connection: Connection,
  xenonPDA: PublicKey,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  WhirlpoolClient : WhirlpoolClient,
  OrcaWhirlpool: OrcaWhirlpool,
  positionMint: PublicKey,
) => { 
  console.log("handle Orca update clicked")

  const adapterPDA = await PublicKey.findProgramAddress([marginPDA.toBuffer()], orcaAdapterProgramId);
  const gAdapterPDA = await PublicKey.findProgramAddress([Buffer.from("orca")], orcaAdapterProgramId);
  const checkPDA = await PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], orcaAdapterProgramId)

  const positionPda = PDAUtil.getPosition(orcaProgramId, positionMint);
  console.log("positionPDA:", positionPda.publicKey.toBase58());
  const positionMetadataPda = PDAUtil.getPositionMetadata(positionMint);
  console.log("positionMetadata: ", positionMetadataPda.publicKey.toBase58());

  const pool = await WhirlpoolClient.getPool(OrcaWhirlpool.address);
  const poolData = pool.getData();

  const position = await WhirlpoolClient.getPosition(positionPda.publicKey);
  const positionData = position.getData()

  const tickSpacing = poolData.tickSpacing; //todo: get it from pool_data.tickSpacing

  const tick_array_lower = PDAUtil.getTickArrayFromTickIndex(positionData.tickLowerIndex, tickSpacing, new PublicKey(OrcaWhirlpool.address), orcaProgramId);
  const tick_array_upper = PDAUtil.getTickArrayFromTickIndex(positionData.tickUpperIndex, tickSpacing, new PublicKey(OrcaWhirlpool.address), orcaProgramId);

  console.log("tick_array_lower:", tick_array_lower);

  const dataLayout = struct([ u8('instruction'), u8('adapter_index'), u32be('instruction1'), u32be('instruction2')])

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 10,
      adapter_index: 4,
      instruction1: new BigNumber('0x9ae6fa0d'),
      instruction2: new BigNumber('0xecd14bdf'),
    },
  data
  )

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: orcaAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: checkPDA[0], isSigner: false, isWritable: true }, //check_acc
      { pubkey: payer, isSigner: true, isWritable: true }, //funder
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false }, 

      { pubkey: marginPDA, isSigner: false, isWritable: true }, //position_auth - marginPDA

      { pubkey: orcaProgramId, isSigner: false, isWritable: false },

      { pubkey: new PublicKey(OrcaWhirlpool.address), isSigner: false, isWritable: true }, //whirlpool
      { pubkey: positionPda.publicKey, isSigner: false, isWritable: true }, //position
      
      { pubkey: tick_array_lower.publicKey, isSigner: false, isWritable: true }, //tick_array_lower
      { pubkey: tick_array_upper.publicKey, isSigner: false, isWritable: true }, //tick_array_upper
    ],
    programId,
    data
  });

  transaction.add(instruction)

}

export const handleOrcaCollectFees = async (
  connection: Connection,
  xenonPDA: PublicKey,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  WhirlpoolClient : WhirlpoolClient,
  OrcaWhirlpool: OrcaWhirlpool,
  positionMint: PublicKey,
) => { 
  console.log("handle Orca collect fees clicked")

  const adapterPDA = await PublicKey.findProgramAddress([marginPDA.toBuffer()], orcaAdapterProgramId);
  const gAdapterPDA = await PublicKey.findProgramAddress([Buffer.from("orca")], orcaAdapterProgramId);
  const checkPDA = await PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], orcaAdapterProgramId)

  const positionPda = PDAUtil.getPosition(orcaProgramId, positionMint);
  const positionTokenAccountAddress = await createAssociatedTokenAccountIfNotExist(connection, payer, positionMint, marginPDA, transaction);

  const token_a_user = await createAssociatedTokenAccountIfNotExist(connection, payer, new PublicKey(OrcaWhirlpool.tokenA.mint), marginPDA, transaction);
  const token_b_user = await createAssociatedTokenAccountIfNotExist(connection, payer, new PublicKey(OrcaWhirlpool.tokenB.mint), marginPDA, transaction);

  const pool = await WhirlpoolClient.getPool(OrcaWhirlpool.address);
  const poolData = pool.getData();
  const token_a_vault = poolData.tokenVaultA;
  const token_b_vault = poolData.tokenVaultB;

  const dataLayout = struct([ u8('instruction'), u8('adapter_index'), u32be('instruction1'), u32be('instruction2')])

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 10,
      adapter_index: 4,
      instruction1: new BigNumber('0xa498cf63'),
      instruction2: new BigNumber('0x1eba13b6'),
    },
  data
  )

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: xenonPDA, isSigner: false, isWritable: true },
      { pubkey: payer, isSigner: true, isWritable: false },
      { pubkey: marginPDA, isSigner: false, isWritable: true },
      { pubkey: orcaAdapterProgramId, isSigner: false, isWritable: false },

      { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
      { pubkey: checkPDA[0], isSigner: false, isWritable: true }, //check_acc
      { pubkey: payer, isSigner: true, isWritable: true }, //funder
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false }, 

      { pubkey: orcaProgramId, isSigner: false, isWritable: false },

      { pubkey: new PublicKey('HJPjoWUrhoZzkNfRpHuieeFk9WcZWjwy6PBjZ81ngndJ'), isSigner: false, isWritable: true }, //whirlpool
      { pubkey: marginPDA, isSigner: false, isWritable: true }, //position_auth - marginPDA
      { pubkey: positionPda.publicKey, isSigner: false, isWritable: true }, //position
      { pubkey: positionTokenAccountAddress, isSigner: false, isWritable: true }, //position token account

      { pubkey: token_a_user, isSigner: false, isWritable: true }, //token_a_user
      { pubkey: token_a_vault, isSigner: false, isWritable: true }, //token_a_vault
      { pubkey: token_b_user, isSigner: false, isWritable: true }, //token_b_user
      { pubkey: token_b_vault, isSigner: false, isWritable: true }, //token_b_vault
      
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    programId,
    data
  });

  transaction.add(instruction)

 
}

//  Should be called multiple times for multiple rewards 
export const handleOrcaCollectRewards = async (
  connection: Connection,
  xenonPDA: PublicKey,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  WhirlpoolClient : WhirlpoolClient,
  OrcaWhirlpool: OrcaWhirlpool,
  positionMint: PublicKey,
) => { 
  console.log("handle Orca collect rewards clicked")

  const adapterPDA = await PublicKey.findProgramAddress([marginPDA.toBuffer()], orcaAdapterProgramId);
  const gAdapterPDA = await PublicKey.findProgramAddress([Buffer.from("orca")], orcaAdapterProgramId);
  const checkPDA = await PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], orcaAdapterProgramId)

  const positionPda = PDAUtil.getPosition(orcaProgramId, positionMint);
  const positionTokenAccountAddress = await createAssociatedTokenAccountIfNotExist(connection, payer, positionMint, marginPDA, transaction);
  console.log("positionTokn:",  positionTokenAccountAddress)

  const pool = await WhirlpoolClient.getPool(OrcaWhirlpool.address);
  const poolData = pool.getData();
  const rewardInfos = poolData.rewardInfos;

  // rewards will be directly send to marginAccounts owner wallet - so no need to check if exist on margin 
  for(let i=0;i<rewardInfos.length;i++){
      const reward_owner = await createAssociatedTokenAccountIfNotExist(connection, payer, new PublicKey(rewardInfos[i].mint), payer, transaction);// users ATA
      const reward_vault = new PublicKey(rewardInfos[i].vault);
      console.log("reward_owner:", reward_owner.toBase58())
      console.log("rewrd_vault:", reward_vault.toBase58());

      const dataLayout = struct([ u8('instruction'), u8('adapter_index'), u32be('instruction1'), u32be('instruction2'), u8('reward_index')])

      const data = Buffer.alloc(dataLayout.span)
      dataLayout.encode(
        {
          instruction: 10,
          adapter_index: 4,
          instruction1: 0x46058457,
          instruction2: 0x56ebb122,
          reward_index: i
        },
      data
      )

      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: xenonPDA, isSigner: false, isWritable: true },
          { pubkey: payer, isSigner: true, isWritable: false },
          { pubkey: marginPDA, isSigner: false, isWritable: true },
          { pubkey: orcaAdapterProgramId, isSigner: false, isWritable: false },

          { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
          { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
          { pubkey: checkPDA[0], isSigner: false, isWritable: true }, //check_acc
          { pubkey: payer, isSigner: true, isWritable: true }, //funder
          { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false }, 

          { pubkey: orcaProgramId, isSigner: false, isWritable: false },

          { pubkey: new PublicKey(OrcaWhirlpool.address), isSigner: false, isWritable: true }, //whirlpool
          { pubkey: marginPDA, isSigner: false, isWritable: true }, //position_auth - marginPDA
          { pubkey: positionPda.publicKey, isSigner: false, isWritable: true }, //position
          { pubkey: positionTokenAccountAddress, isSigner: false, isWritable: true }, //position token account

          { pubkey: reward_owner, isSigner: false, isWritable: true }, //token_a_user
          { pubkey: reward_vault, isSigner: false, isWritable: true }, //token_a_vault
          
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        programId,
        data
      });

      transaction.add(instruction)
  }
}

export const handleOrcaDecreaseLiquidity = async (
  connection: Connection,
  xenonPDA: PublicKey,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  WhirlpoolClient : WhirlpoolClient,
  OrcaWhirlpool: OrcaWhirlpool,
  positionMint: PublicKey,
  withdrawFull=true,
  liquidityAmountBN=(new BN(0)),
  tokenMinA=0,
  tokenMinB=0,
) => { 
    console.log("handle Orca decrease Liquidity clicked")

    const positionPda = PDAUtil.getPosition(orcaProgramId, positionMint);
    const positionTokenAccountAddress = await createAssociatedTokenAccountIfNotExist(connection, payer, positionMint, marginPDA, transaction)

    const position = await WhirlpoolClient.getPosition(positionPda.publicKey);
    const positionData = position.getData()

    const liquidity_amount = positionData.liquidity;
    console.log("SOL USDC positionData:",liquidity_amount.toString())

    const adapterPDA = await PublicKey.findProgramAddress([marginPDA.toBuffer()], orcaAdapterProgramId);
    const gAdapterPDA = await PublicKey.findProgramAddress([Buffer.from("orca")], orcaAdapterProgramId);
    const checkPDA = await PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], orcaAdapterProgramId)

    const token_a_user = await createAssociatedTokenAccountIfNotExist(connection, payer, new PublicKey(OrcaWhirlpool.tokenA.mint), marginPDA, transaction);
    const token_b_user = await createAssociatedTokenAccountIfNotExist(connection, payer, new PublicKey(OrcaWhirlpool.tokenB.mint), marginPDA, transaction);
    console.log("token_a_user: ", token_a_user.toBase58())
    console.log("token_b_user: ", token_b_user.toBase58())

    const pool = await WhirlpoolClient.getPool(OrcaWhirlpool.address);
    const poolData = pool.getData();
    const token_a_vault = poolData.tokenVaultA;
    const token_b_vault = poolData.tokenVaultB;

    const tickSpacing = 64; //todo: get it from pool_data.tickSpacing

    const tick_array_lower = PDAUtil.getTickArrayFromTickIndex(positionData.tickLowerIndex, tickSpacing, new PublicKey(OrcaWhirlpool.address), orcaProgramId);
    const tick_array_upper = PDAUtil.getTickArrayFromTickIndex(positionData.tickUpperIndex, tickSpacing, new PublicKey(OrcaWhirlpool.address), orcaProgramId);

    const dataLayout = struct([ u8('instruction'), u8('adapter_index'), u32be('instruction1'), u32be('instruction2'), u128('liqiuidity_amount'), nu64('token_min_a'), nu64('token_min_b')])

    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
      {
        instruction: 10,
        adapter_index: 4,
        instruction1: new BigNumber('0xa026d06f'),
        instruction2: new BigNumber('0x685b2c01'),
        liqiuidity_amount: withdrawFull ? liquidity_amount : liquidityAmountBN, //withdrawing 100%
        token_min_a: tokenMinA,
        token_min_b: tokenMinB,
      },
    data
    )

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: xenonPDA, isSigner: false, isWritable: true },
        { pubkey: payer, isSigner: true, isWritable: false },
        { pubkey: marginPDA, isSigner: false, isWritable: true },
        { pubkey: orcaAdapterProgramId, isSigner: false, isWritable: false },

        { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
        { pubkey: checkPDA[0], isSigner: false, isWritable: true }, //check_acc
        { pubkey: payer, isSigner: true, isWritable: true }, //funder
        { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false }, 

        { pubkey: orcaProgramId, isSigner: false, isWritable: false },

        { pubkey: new PublicKey(OrcaWhirlpool.address), isSigner: false, isWritable: true }, //whirlpool
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: marginPDA, isSigner: false, isWritable: true }, //position_auth - marginPDA
        { pubkey: positionPda.publicKey, isSigner: false, isWritable: true }, //position
        { pubkey: positionTokenAccountAddress, isSigner: false, isWritable: true }, //position token account

        { pubkey: token_a_user, isSigner: false, isWritable: true }, //token_a_user
        { pubkey: token_b_user, isSigner: false, isWritable: true }, //token_b_user
        { pubkey: token_a_vault, isSigner: false, isWritable: true }, //token_a_vault
        { pubkey: token_b_vault, isSigner: false, isWritable: true }, //token_b_vault
        
        { pubkey: tick_array_lower.publicKey, isSigner: false, isWritable: true }, //tick_array_lower
        { pubkey: tick_array_upper.publicKey, isSigner: false, isWritable: true }, //tick_array_upper
        
      ],
      programId,
      data
    });

    transaction.add(instruction)

}

export const handleOrcaClosePosition = async (
  connection: Connection,
  xenonPDA: PublicKey,
  marginPDA: PublicKey,
  payer: PublicKey,
  transaction: Transaction,
  WhirlpoolClient : WhirlpoolClient,
  OrcaWhirlpool: OrcaWhirlpool,
  positionMint: PublicKey,
) => { 
    console.log("handle Orca close position clicked")

    const adapterPDA = await PublicKey.findProgramAddress([marginPDA.toBuffer()], orcaAdapterProgramId);
    const gAdapterPDA = await PublicKey.findProgramAddress([Buffer.from("orca")], orcaAdapterProgramId);
    const checkPDA = await PublicKey.findProgramAddress([adapterPDA[0].toBuffer()], orcaAdapterProgramId)

    const positionPda = PDAUtil.getPosition(orcaProgramId, positionMint);
    const positionTokenAccountAddress = await createAssociatedTokenAccountIfNotExist(connection, payer, positionMint, marginPDA, transaction);

    const dataLayout = struct([ u8('instruction'), u8('adapter_index'), u32be('instruction1'), u32be('instruction2')])

    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
      {
        instruction: 10,
        adapter_index: 4,
        instruction1: 0x7b865100,
        instruction2: 0x31446262,
      },
    data
    )

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: xenonPDA, isSigner: false, isWritable: true },
        { pubkey: payer, isSigner: true, isWritable: false },
        { pubkey: marginPDA, isSigner: false, isWritable: true },
        { pubkey: orcaAdapterProgramId, isSigner: false, isWritable: false },

        { pubkey: gAdapterPDA[0], isSigner: false, isWritable: true },
        { pubkey: adapterPDA[0], isSigner: false, isWritable: true },
        { pubkey: checkPDA[0], isSigner: false, isWritable: true }, //check_acc
        { pubkey: payer, isSigner: true, isWritable: true }, //funder
        { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false }, 

        { pubkey: orcaProgramId, isSigner: false, isWritable: false },

        { pubkey: marginPDA, isSigner: false, isWritable: true }, //position_auth - marginPDA
        { pubkey: marginPDA, isSigner: false, isWritable: true }, //receiver - marginPDA
        { pubkey: positionPda.publicKey, isSigner: false, isWritable: true }, //position
        { pubkey: positionMint, isSigner: false, isWritable: true }, //position mint
        { pubkey: positionTokenAccountAddress, isSigner: false, isWritable: true }, //position token account

        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      programId,
      data
    });

    transaction.add(instruction)

}
