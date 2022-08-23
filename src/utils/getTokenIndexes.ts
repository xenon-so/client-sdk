import { PublicKey } from '@solana/web3.js';

export const getXenonPDATokenIndexHelper = (
  xenonPdaData: any,
  mint: PublicKey
) => {
  if (!xenonPdaData) {
    throw 'Error : xenonPdaData undefined';
  }
  for (let i = 0; i < xenonPdaData.token_list.length; i++) {
    if (xenonPdaData.token_list[i].mint.toBase58() === mint.toBase58()) {
      return i;
    }
  }
  return -1;
};
//if you want to use stored marginPdaData then do not pass marginPdaData
export const getMarginPDATokenIndexHelper = (
  mint: PublicKey,
  xenonPdaData: any,
  marginPdaData?: any
) => {
  if (!xenonPdaData) {
    throw 'Error : xenonPdaData undefined';
  }

  if (xenonPdaData.token_list)
    for (let i = 0; i < marginPdaData.tokens.length; i++) {
      if (
        marginPdaData.tokens[i].is_active &&
        xenonPdaData.token_list[
          marginPdaData.tokens[i].index
        ].mint.toBase58() === mint.toBase58()
      ) {
        return i;
      }
    }
  return -1;
};

export const getLocalAdapterTokenIndexHelper = (
  mint: PublicKey,
  localAdapterPDAData: any
) => {
  if (!localAdapterPDAData) {
    throw 'Error : localAdapterPDAData undefined';
  }
  for (let i = 0; i < localAdapterPDAData.mints.length; i++) {
    if (localAdapterPDAData.mints[i].toBase58() === mint.toBase58()) {
      return i;
    }
  }
  return -1;
};
