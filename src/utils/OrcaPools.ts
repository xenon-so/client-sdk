import { isMainnet } from "../isMainnet";

export interface OrcaWhirlpool {
    address: string,
    whitelisted: boolean,
    tokenMintA: string,
    tokenMintB: string,
    tokenASymbol: string,
    tokenBSymbol: string,
    tickSpacing: number,
    lpsFeeRate?: number,
    protocolFeeRate?: number,
  }  

  const devnetPoolList: OrcaWhirlpool[] = [
    {
        address: "5Z66YYYaTmmx1R4mATAGLSc8aV4Vfy5tNdJQzk1GP9RF",
        whitelisted: true,
        tokenMintA: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
        tokenMintB: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        tokenASymbol: 'WSOL',
        tokenBSymbol: 'USDC',
        tickSpacing: 64,
        lpsFeeRate: 0.003,
        protocolFeeRate: 0.03,
    }
  ];
  
  export const mainnetPoolList: OrcaWhirlpool[] = [
   {
    address: "5Z66YYYaTmmx1R4mATAGLSc8aV4Vfy5tNdJQzk1GP9RF",
    whitelisted: true,
    tokenMintA: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
    tokenMintB: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    tokenASymbol: 'WSOL',
    tokenBSymbol: 'USDC',
    tickSpacing: 64,
    lpsFeeRate: 0.003,
    protocolFeeRate: 0.03,
   }
  ];
  
  export const ORCA_POOLS_LIST: OrcaWhirlpool[] = isMainnet
    ? mainnetPoolList
    : devnetPoolList;