import { HDNodeWallet } from 'ethers';

export const deriveWallet = (mnemonic: string, index: number) => {
  const rootWallet = HDNodeWallet.fromPhrase(mnemonic, "m/44'/60'/0'/0");
  const wallet = rootWallet.deriveChild(index);
  return {
    index,
    address: wallet.address,
    privateKey: wallet.privateKey,
    balance: null,
    balanceError: null,
  };
}