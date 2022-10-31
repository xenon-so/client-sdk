import {
  MangoClient,
  Payer,
  PerpOrderType,
} from '@blockworks-foundation/mango-client';
import { buildWhirlpoolClient, ORCA_WHIRLPOOL_PROGRAM_ID, WhirlpoolClient, WhirlpoolContext } from '@orca-so/whirlpools-sdk';
import { Wallet } from '@project-serum/anchor';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { BN } from 'bn.js';
import { mangoAdapterProgramId, mangoProgramID, orcaProgramId, xenonPDA } from './constants';
import * as commonInstructions from './instructions/commonInstructions';
import * as traderInstructions from './instructions/traderInstructions';
import {
  ADAPTER_ACCOUNT_LAYOUT,
  MANGO_ADAPTOR_CHECK_ACCOUNT,
} from './layout/xenonLayout';
import { getTraderMarginPDA } from './utils/accounts/getMarginPDA';
import { getXenonAccountData } from './utils/accounts/getXenonAccountData';
import { getXenonPDATokenIndexHelper } from './utils/getTokenIndexes';
import { OrcaWhirlpool } from './utils/OrcaPools';
import { Saber_LP } from './utils/saberList';
import { SOLEND_RESERVE } from './utils/solendMarkets';
import { wrapSol } from './utils/web3Utils';

export class XenonTraderClient {
  connection: Connection;
  trader: PublicKey;
  xenonPDA?: PublicKey;
  xenonPdaData?: any;
  // marginPdaData? : any;
  marginPDA?: PublicKey;
  mangoClient: MangoClient;
  WhirlpoolClient : WhirlpoolClient;

  mangoAdaptor?: PublicKey;
  mangoAdaptorData?: any;
  mangoCheckAccountData?: any;
  mangoAccount?: PublicKey;

  constructor(connection: Connection, trader: PublicKey) {
    this.xenonPDA = xenonPDA;
    this.connection = connection;
    this.trader = trader;
    this.mangoClient = new MangoClient(connection, mangoProgramID);
  }

  async load(): Promise<void> {
    this.xenonPdaData = await getXenonAccountData(this.connection, this.xenonPDA);
    const marginAccount = await getTraderMarginPDA(
      this.connection,
      this.trader
    );
    this.marginPDA = marginAccount;
  }

  async loadMangoAdaptor() {
    const adapterPDA = await PublicKey.findProgramAddress(
      [this.marginPDA!.toBuffer()],
      mangoAdapterProgramId
    );
    const accountInfo = await this.connection.getAccountInfo(adapterPDA[0]);
    if (accountInfo === null) return;
    const data = ADAPTER_ACCOUNT_LAYOUT.decode(accountInfo?.data);
    const checkAccountInfo = await this.connection.getAccountInfo(
      data.check_account
    );
    const checkAccountData = MANGO_ADAPTOR_CHECK_ACCOUNT.decode(
      checkAccountInfo?.data
    );
    this.mangoAdaptor = adapterPDA[0];
    this.mangoAdaptorData = data;
    this.mangoCheckAccountData = checkAccountData;
    this.mangoAccount = new PublicKey(checkAccountData.mango_account);
  }

  async loadWhirlpoolClient(connection: Connection){
    // const Wallet = new Wallet(Keypair.generate())
     const Wallet :any = {
      // signTransaction : new Promise(new Transaction()),
      // signAllTransactions : [],
      publicKey: this.trader
    } 
    const ctx = WhirlpoolContext.from(connection, Wallet, ORCA_WHIRLPOOL_PROGRAM_ID);
    const client = buildWhirlpoolClient(ctx);
    this.WhirlpoolClient = client;
  }

  async getXenonPDATokenIndex(mint: PublicKey) {
    if (!this.xenonPdaData) {
      throw 'Error : Load client first';
    }
    return getXenonPDATokenIndexHelper(this.xenonPdaData, mint);
  }

  async initializeTraderMarginAccount(transaction: Transaction) {
    const xenonData = await getXenonAccountData(
      this.connection,
      this.xenonPDA!
    );
    // add some invariant checking stuff to throw error to load rather than using !
    return traderInstructions.initialiseMarginAccount(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      transaction,
      this.trader,
      xenonData.account_id_count
    );
  }

  async traderAddTokenToMargin(transaction: Transaction, mint: PublicKey) {
    await traderInstructions.handleAddTokenToMargin2(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      this.marginPDA!,
      this.trader,
      mint,
      transaction
    );
  }

  async traderDeposit(
    transaction: Transaction,
    amount: number,
    mint: string,
    Wrapped: boolean = false
  ) {
    if (Wrapped) {
      await wrapSol(this.connection, this.trader, amount, transaction);
    }
    return traderInstructions.deposit(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      this.marginPDA!,
      this.trader,
      amount,
      transaction,
      mint
    );
  }

  async traderRepay(transaction: Transaction, amount: number) {
    return traderInstructions.repay(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      this.marginPDA!,
      amount,
      this.trader,
      this.mangoCheckAccountData?.mango_account,
      transaction
    );
  }

  async traderBorrow(transaction: Transaction, amount: number) {
    return traderInstructions.borrow(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      this.marginPDA!,
      amount,
      this.trader,
      this.mangoCheckAccountData?.mango_account,
      transaction
    );
  }

  async traderWithdraw(transaction: Transaction, amount: number, mint: string) {
    return traderInstructions.withdraw(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      this.marginPDA!,
      amount,
      this.trader,
      mint,
      transaction,
      this.mangoCheckAccountData?.mango_account
    );
  }

  async traderUpdateAccountValuation(transaction: Transaction) {
    return traderInstructions.updateAccountValuation(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData!,
      this.marginPDA!,
      transaction,
      this.mangoCheckAccountData?.mango_account
    );
  }

  // Mango specific methods ===================
  async initializeMangoAdaptor(transaction: Transaction) {
    return traderInstructions.handleInitializeMangoAdapter(
      this.connection,
      this.xenonPDA!,
      this.marginPDA!,
      this.trader,
      transaction
    );
  }

  async mangoDeposit(
    transaction: Transaction,
    tokenIndex: number,
    quantity: number
  ) {
    return traderInstructions.handleMangoDeposit(
      this.connection,
      this.xenonPDA!,
      this.marginPDA!,
      this.trader,
      transaction,
      tokenIndex,
      this.mangoCheckAccountData.mango_account,
      quantity
    );
  }

  async mangoWithdraw(
    transaction: Transaction,
    tokenIndex: number,
    quantity: number
  ) {
    return traderInstructions.handleMangoWithdraw(
      this.connection,
      this.xenonPDA!,
      this.marginPDA!,
      this.trader,
      transaction,
      tokenIndex,
      this.mangoAdaptorData.check_account,
      this.mangoCheckAccountData.mango_account,
      quantity
    );
  }

  async mangoPlaceOrder(
    transaction: Transaction,
    price: number,
    side: 'buy' | 'sell',
    orderPerpIndex: number,
    orderType: PerpOrderType,
    quantity: number,
    reduceOnly: number
  ) {
    return traderInstructions.handleMangoPlacePrepOrder(
      this.connection,
      this.marginPDA!,
      this.trader,
      transaction,
      this.mangoAdaptorData.check_account,
      this.mangoCheckAccountData.mango_account,
      price,
      side,
      orderPerpIndex,
      orderType,
      quantity,
      reduceOnly
    );
  }

  async mangoCancelOrder(
    transaction: Transaction,
    orderPerpIndex: number,
    clientId: number
  ) {
    return traderInstructions.handleMangoPrepCancelOrder(
      this.connection,
      this.marginPDA!,
      this.trader,
      transaction,
      this.mangoAdaptorData.check_account,
      this.mangoCheckAccountData.mango_account,
      orderPerpIndex,
      clientId
    );
  }

  async mangoSettleAll(wallet: Payer) {
    return traderInstructions.handleMangoSettleAll(
      this.connection,
      this.mangoCheckAccountData.mango_account,
      wallet
    );
  }

  // Solend specific methods ===================
  async solendDeposit(
    transaction: Transaction,
    amount: number,
    solendReserve: SOLEND_RESERVE
  ) {
    return traderInstructions.solendDeposit(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      this.marginPDA!,
      this.trader,
      transaction,
      amount,
      solendReserve
    );
  }

  async solendWithdraw(
    transaction: Transaction,
    amount: number,
    solendReserve: SOLEND_RESERVE
  ) {
    return traderInstructions.solendWithdraw(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData!,
      this.marginPDA!,
      this.trader,
      transaction,
      amount,
      solendReserve
    );
  }

  // Saber specific methods ===================
  async saberInitialize(transaction: Transaction, saberLp: Saber_LP) {
    return traderInstructions.handleInitializeSaberAdapter(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      this.marginPDA!,
      this.trader,
      transaction,
      saberLp
    );
  }

  async saberDeposit(
    transaction: Transaction,
    saberLp: Saber_LP,
    amountA: number,
    amountB: number
  ) {
    return traderInstructions.handleSaberDeposit(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      this.marginPDA!,
      this.trader,
      transaction,
      saberLp,
      amountA,
      amountB
    );
  }

  async saberWithdraw(
    transaction: Transaction,
    saberLp: Saber_LP,
    lpAmount: number
  ) {
    return traderInstructions.handleSaberWithdraw(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      this.marginPDA!,
      this.trader,
      transaction,
      saberLp,
      lpAmount
    );
  }

  // Quarry specific methods ===================
  async quarryInitMintsInMargin(transaction: Transaction, saberLp: Saber_LP) {
    return traderInstructions.handleQuarryInitMintsInMargin(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      this.marginPDA!,
      this.trader,
      transaction,
      saberLp
    );
  }

  async quarryDeposit(
    transaction: Transaction,
    saberLp: Saber_LP,
    lpAmount: number
  ) {
    return traderInstructions.handleQuarryDeposit(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      this.marginPDA!,
      this.trader,
      transaction,
      saberLp,
      lpAmount
    );
  }

  async quarryWithdraw(
    transaction: Transaction,
    saberLp: Saber_LP,
    lpAmount: number
  ) {
    return traderInstructions.handleQuarryWithdraw(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      this.marginPDA!,
      this.trader,
      transaction,
      saberLp,
      lpAmount
    );
  }

  async quarryClaim(
    transaction: Transaction,
    saberLp: Saber_LP,
    lpAmount: number
  ) {
    return traderInstructions.handleQuarryClaimRewards(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData,
      this.marginPDA!,
      this.trader,
      transaction,
      saberLp,
      lpAmount
    );
  }

  // Orca specific methods ===================
  async initializeOrcaAdaptor(transaction: Transaction, OrcaWhirlpool : OrcaWhirlpool) {
    return traderInstructions.handleInitializeOrcaAdapter2(
      this.connection,
      this.xenonPDA!,
      this.xenonPdaData!,
      this.marginPDA,
      this.trader,
      transaction,
      OrcaWhirlpool,
    );
  }

  async orcaDeposit(
    transaction: Transaction,
    OrcaWhirlpool: OrcaWhirlpool,
    tickLowerIndex: number,
    tickUpperIndex: number,
    maxTokenAAmount: number,
    maxTokenBAmount: number
  ) {
    const positionMintKeypair : Keypair = await traderInstructions.handleOrcaOpenPosition(
      this.connection,
      this.xenonPDA!,
      this.marginPDA!,
      this.trader,
      transaction,
      OrcaWhirlpool,
      tickLowerIndex,
      tickUpperIndex
    );
    await traderInstructions.handleOrcaIncreaseLiquidity(
      this.connection,
      this.xenonPDA!,
      this.marginPDA!,
      this.trader,
      transaction,
      this.WhirlpoolClient,
      OrcaWhirlpool,
      positionMintKeypair.publicKey,
      tickLowerIndex,
      tickUpperIndex,
      maxTokenAAmount,
      maxTokenBAmount
    );
      return positionMintKeypair;
  }

  async orcaWithdraw(
    transaction: Transaction,
    OrcaWhirlpool: OrcaWhirlpool,
    positionMint: PublicKey,
    withdrawFull=true, // Withdraw Full amount by default
    liquidityAmountBN=(new BN(0)),
    tokenMinA=0,
    tokenMinB=0,
  ) {

    await traderInstructions.handleOrcaUpdateFeesAndReward(
      this.connection,
      this.xenonPDA!,
      this.marginPDA!,
      this.trader,
      transaction,
      this.WhirlpoolClient,
      OrcaWhirlpool,
      positionMint,
    );
    await traderInstructions.handleOrcaCollectFees(
      this.connection,
      this.xenonPDA!,
      this.marginPDA!,
      this.trader,
      transaction,
      this.WhirlpoolClient,
      OrcaWhirlpool,
      positionMint,
    )
   await traderInstructions.handleOrcaCollectRewards(
      this.connection,
      this.xenonPDA!,
      this.marginPDA!,
      this.trader,
      transaction,
      this.WhirlpoolClient,
      OrcaWhirlpool,
      positionMint,
    )
    await traderInstructions.handleOrcaDecreaseLiquidity(
      this.connection,
      this.xenonPDA!,
      this.marginPDA!,
      this.trader,
      transaction,
      this.WhirlpoolClient,
      OrcaWhirlpool,
      positionMint,
      withdrawFull,
      liquidityAmountBN,
      tokenMinA,
      tokenMinB,
    )
    await traderInstructions.handleOrcaClosePosition(
      this.connection,
      this.xenonPDA!,
      this.marginPDA!,
      this.trader,
      transaction,
      this.WhirlpoolClient,
      OrcaWhirlpool,
      positionMint,
    )
  }

  // Global methods
  async updateGlobalPrices(transaction: Transaction) {
    return commonInstructions.updateGlobalPriceCache(
      this.connection,
      transaction
    );
  }
}
