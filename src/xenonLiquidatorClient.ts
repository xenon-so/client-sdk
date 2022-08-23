import { Jupiter } from '@jup-ag/core';
import {
  AccountInfo,
  Connection,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { struct, u8 } from 'buffer-layout';
import {
  mangoAdapterProgramId,
  MANGO_GROUP_ACCOUNT_V3,
  MANGO_PROGRAM_ID_V3,
  programId,
  TOKEN_PROGRAM_ID,
  xenonPDA,
} from './constants';
import {
  handleQuarryClaimRewards,
  handleQuarryWithdraw,
  handleSaberWithdraw,
  solendWithdraw,
  updateAccountValuation,
} from './instructions/traderInstructions';
import { MANGO_ADAPTOR_CHECK_ACCOUNT } from './layout/xenonLayout';
import { getXenonAccountData } from './utils/accounts/getXenonAccountData';
import { fetchMangoPositions } from './utils/fetchMangoData';
import { getSaberData } from './utils/fetchSaberData';
import { getTokenAccountInfo } from './utils/getTokensAccounts';
import { mainnetLpList } from './utils/saberList';
import { TOKENS } from './utils/tokens';
import { findAssociatedTokenAddress } from './utils/web3Utils';
import { XenonTraderClient } from './xenonTraderClient';

import { MangoClient, MangoGroup } from '@blockworks-foundation/mango-client';
import BigNumber from 'bignumber.js';
import { buildJupSwapTransaction } from './utils/jupSwapApi';
import { mainnet_reserves } from './utils/solendMarkets';

export class XenonLiquidatorClient {
  connection: Connection;
  liquidator: PublicKey;
  xenonTraderClient: XenonTraderClient;
  liquidatorVaultAccount: PublicKey;
  feeAccount: PublicKey;
  lendingVaultAccount: PublicKey;
  xenonPdaData: any;
  jupiterInstance: Jupiter;
  mangoClient: MangoClient;
  mangoGroup: MangoGroup;

  constructor(connection: Connection, liquidator: PublicKey) {
    this.connection = connection;
    this.liquidator = liquidator;
  }

  async load(): Promise<void> {
    this.xenonPdaData = await getXenonAccountData(this.connection, xenonPDA);
    this.liquidatorVaultAccount = await findAssociatedTokenAddress(
      this.liquidator,
      new PublicKey(TOKENS['USDC'].mintAddress)
    );
    this.lendingVaultAccount = await findAssociatedTokenAddress(
      xenonPDA!,
      new PublicKey(TOKENS['USDC'].mintAddress)
    );
    this.feeAccount = await findAssociatedTokenAddress(
      new PublicKey('8hGPqdwvTvDi9yqWJWwoeoKjoDPaJyieiLvzvZryaGRG'),
      new PublicKey(TOKENS['USDC'].mintAddress)
    );

    const client = new MangoClient(this.connection, MANGO_PROGRAM_ID_V3);
    const mangoGroup = await client.getMangoGroup(MANGO_GROUP_ACCOUNT_V3);

    this.mangoClient = client;
    this.mangoGroup = mangoGroup;
  }

  async getAllMarginAccounts(): Promise<
    {
      pubkey: PublicKey;
      account: AccountInfo<Buffer>;
    }[]
  > {
    const accounts = await this.connection.getProgramAccounts(programId, {
      dataSlice: { offset: 0, length: 0 }, // Fetch without any data.
      filters: [],
    });
    return accounts;
  }

  async liquidateMarginAccount({
    marginAccount,
    transaction,
  }: {
    marginAccount: PublicKey;
    transaction: Transaction;
  }): Promise<void> {
    const adapterPDA = await PublicKey.findProgramAddress(
      [marginAccount.toBuffer()],
      mangoAdapterProgramId
    );
    const mangoCheckPDA = await PublicKey.findProgramAddress(
      [adapterPDA[0].toBuffer()],
      mangoAdapterProgramId
    );

    let checkAccountInfo, checkAccountData;
    try {
      checkAccountInfo = await this.connection.getAccountInfo(mangoCheckPDA[0]);
      checkAccountData = MANGO_ADAPTOR_CHECK_ACCOUNT.decode(
        checkAccountInfo?.data
      );
    } catch (error) {
      console.error(error);
    }

    let mangoPK = null;
    if (checkAccountData) {
      mangoPK = new PublicKey(checkAccountData.mango_account);
    }

    await updateAccountValuation(
      this.connection,
      xenonPDA,
      this.xenonPdaData,
      marginAccount,
      transaction,
      mangoPK ?? undefined
    );

    const dataLayout = struct([u8('instruction')]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
      {
        instruction: 8,
      },
      data
    );

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: xenonPDA!, isSigner: false, isWritable: true },
        { pubkey: marginAccount, isSigner: false, isWritable: true },
        { pubkey: this.liquidator, isSigner: true, isWritable: true },
        {
          pubkey: SYSVAR_INSTRUCTIONS_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },

        {
          pubkey: this.liquidatorVaultAccount,
          isSigner: false,
          isWritable: true,
        },
        { pubkey: this.lendingVaultAccount, isSigner: false, isWritable: true },
        { pubkey: this.feeAccount, isSigner: false, isWritable: true },
      ],
      programId,
      data,
    });
    transaction.add(instruction);
  }

  async closeAllQuarryPositions({
    marginAccount,
  }: {
    marginAccount: PublicKey;
  }): Promise<Transaction[]> {
    let saberData = await getSaberData(marginAccount);
    const transactions: Transaction[] = [];

    for (let i = 0; i < mainnetLpList.length; i++) {
      const saberLpPool = mainnetLpList[i];
      const poolData = saberData[i];

      let transaction = new Transaction();
      // get user Quarry data
      let quarryLPBalance = poolData.minerVaultBalance?.value.uiAmount ?? 0;

      if (quarryLPBalance >= 0.0001) {
        await handleQuarryWithdraw(
          this.connection,
          xenonPDA,
          this.xenonPdaData,
          marginAccount,
          this.liquidator,
          transaction,
          saberLpPool,
          quarryLPBalance
        );
        transactions.push(transaction);
      }
      let transaction2 = new Transaction();
      await handleQuarryClaimRewards(
        this.connection,
        xenonPDA,
        this.xenonPdaData,
        marginAccount,
        this.liquidator,
        transaction2,
        saberLpPool,
        0
      );
      transactions.push(transaction2);
    }

    return transactions;
  }

  async closeAllMangoPositions(
    client: XenonTraderClient
  ): Promise<Transaction[]> {
    const mangoAccPubkey = client.mangoAccount;
    const transactions: Transaction[] = [];
    let mangoData = await fetchMangoPositions(
      this.liquidator,
      mangoAccPubkey,
      this.mangoClient,
      this.mangoGroup,
      client
    );
    console.log(
      'mangoData.openPositions.length ::: ',
      mangoData.openPositions.length
    );
    console.log(
      'mangoData.pendingOpenOrders.length ::: ',
      mangoData.pendingOpenOrders.length
    );
    for (let i = 0; i < mangoData.openPositions.length; i++) {
      const position = mangoData.openPositions[i];
      transactions.push(await position.closePosition());
    }
    for (let i = 0; i < mangoData.pendingOpenOrders.length; i++) {
      const orders = mangoData.pendingOpenOrders[i];
      transactions.push(await orders.cancelOrder());
    }
    return transactions;
  }

  async closeAllSaberPositions({
    marginAccount,
  }: {
    marginAccount: PublicKey;
  }): Promise<Transaction[]> {
    let accounts = await getTokenAccountInfo(this.connection, marginAccount);
    let transactions: Transaction[] = [];
    for (const account of accounts) {
      let transaction = new Transaction();
      for (const [key, value] of Object.entries(mainnetLpList)) {
        if (
          value.lpToken.address === account.tokenInfo.mintAddress &&
          account.parsedAccountInfo.uiAmount != 0
        ) {
          await handleSaberWithdraw(
            this.connection,
            xenonPDA,
            this.xenonPdaData,
            marginAccount,
            this.liquidator,
            transaction,
            value,
            account.parsedAccountInfo.uiAmount
          );
          transactions.push(transaction);
        }
      }
    }
    return transactions;
  }

  async closeAllSolendPositions({
    marginAccount,
  }: {
    marginAccount: PublicKey;
  }): Promise<Transaction[]> {
    let accounts = await getTokenAccountInfo(this.connection, marginAccount);
    let transactions: Transaction[] = [];
    for (const account of accounts) {
      let transaction = new Transaction();
      for (const [key, value] of Object.entries(mainnet_reserves)) {
        if (
          value.collateralMintAddress === account.tokenInfo.mintAddress &&
          account.parsedAccountInfo.uiAmount != 0
        ) {
          await solendWithdraw(
            this.connection,
            xenonPDA,
            this.xenonPdaData,
            marginAccount,
            this.liquidator,
            transaction,
            account.parsedAccountInfo.uiAmount,
            value
          );
          transactions.push(transaction);
        }
      }
    }
    return transactions;
  }

  async withdrawAllAssets(convertAllAssetsToUSDC: boolean = false): Promise<{
    withdrawInstructions: Transaction[];
    convertToUSDCTransactions: Transaction[][];
  }> {
    const xenonClient = new XenonTraderClient(this.connection, this.liquidator);
    await xenonClient.load();
    await xenonClient.loadMangoAdaptor();

    let tokenAccounts = (
      await getTokenAccountInfo(this.connection, xenonClient.marginPDA)
    ).filter(
      (f) =>
        Object.values(TOKENS).find(
          (k) => k.mintAddress === f.parsedAccountInfo.mint.toBase58()
        ).tokenType === 'GENERAL'
    );

    const withdrawInstructions: Transaction[] = [];

    // withdraw instructions
    for (const tokenAccount of tokenAccounts) {
      const transaction = new Transaction();
      if (!new BigNumber(tokenAccount.parsedAccountInfo.amount).gt(0)) continue;
      await xenonClient.traderWithdraw(
        transaction,
        tokenAccount.parsedAccountInfo.uiAmount,
        tokenAccount.parsedAccountInfo.mint.toBase58()
      );
      withdrawInstructions.push(transaction);
    }

    tokenAccounts = tokenAccounts.filter(
      (x) => x.parsedAccountInfo.mint.toBase58() != TOKENS.USDC.mintAddress
    );

    const convertTransactions: Transaction[][] = [];
    if (convertAllAssetsToUSDC) {
      for (const tokenAccount of tokenAccounts) {
        if (!new BigNumber(tokenAccount.parsedAccountInfo.amount).gt(0))
          continue;
        const transactions = await buildJupSwapTransaction(
          this.liquidator,
          tokenAccount.parsedAccountInfo.mint,
          new PublicKey(TOKENS.USDC.mintAddress),
          new BigNumber(tokenAccount.parsedAccountInfo.amount).toNumber()
        );
        convertTransactions.push(transactions);
      }
    }

    return {
      withdrawInstructions,
      convertToUSDCTransactions: convertTransactions,
    };
  }
}
