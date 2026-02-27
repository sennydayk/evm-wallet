import { HDNodeWallet } from 'ethers';

export const createMnemonic = () => {
  const wallet = HDNodeWallet.createRandom();
  if (!wallet.mnemonic) {
    throw new Error('Failed to create mnemonic');
  }
  return wallet.mnemonic.phrase;
};