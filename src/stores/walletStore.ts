import { makeObservable, observable, action, runInAction } from 'mobx';
import { createMnemonic } from '../utils/createMnemonic';
import { deriveWallet } from '../utils/deriveWallet';
import { fetchBalance as fetchCtcBalance } from '../utils/fetchBalance';
import { fetchErc20Balance, CONTRACT_ADDRESSES } from '../utils/fetchErc20Balance';

export interface Wallet {
  index: number;
  address: string;
  privateKey: string;
  balance: Record<string, string | null>;
  balanceError: string | null;
}

export class WalletStore {
  mnemonic: string = '';
  mnemonicError: string | null = null;
  wallets: Wallet[] = [];
  network: 'mainnet' | 'testnet' = 'testnet';
  loadingAddresses: string[] = [];

  constructor() {
    makeObservable(this, {
      mnemonic: observable,
      mnemonicError: observable,
      wallets: observable,
      network: observable,
      loadingAddresses: observable,
      createMnemonic: action,
      importWallet: action,
      deriveWallet: action,
      fetchBalance: action,
      setNetwork: action,
    });
  }

  createMnemonic = () => {
    try {
      this.mnemonic = createMnemonic();
      this.mnemonicError = null;
    } catch (err) {
      this.mnemonicError =
        err instanceof Error ? err.message : 'Failed to create mnemonic phrase';
    }
  };

  importWallet = (mnemonic: string) => {
    this.mnemonic = mnemonic;
    this.deriveWallet();
  };

  deriveWallet = () => {
    const wallet = deriveWallet(this.mnemonic, this.wallets.length);
    this.wallets = [...this.wallets, { ...wallet, balance: {ctc: null, space: null, usdc: null}, balanceError: null }];
  };

  fetchBalance = async (address: string) => {
    runInAction(() => {
      this.loadingAddresses = [...this.loadingAddresses, address];
    });
    try {
      const [ctc, space] = await Promise.all([
        fetchCtcBalance(address, this.network),
        fetchErc20Balance(address, CONTRACT_ADDRESSES[this.network].space, this.network),
        // fetchErc20Balance(address, CONTRACT_ADDRESSES[this.network].usdc, this.network),
      ]);
      runInAction(() => {
        this.loadingAddresses = this.loadingAddresses.filter((a) => a !== address);
        const idx = this.wallets.findIndex((w) => w.address === address);
        if (idx >= 0) {
          this.wallets = this.wallets.map((w, i) =>
            i === idx ? { ...w, balance: {...w.balance, ctc, space }, balanceError: null } : w
          );
        }
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch balance';
      runInAction(() => {
        this.loadingAddresses = this.loadingAddresses.filter((a) => a !== address);
        const idx = this.wallets.findIndex((w) => w.address === address);
        if (idx >= 0) {
          this.wallets = this.wallets.map((w, i) =>
            i === idx ? { ...w, balanceError: errorMessage } : w
          );
        }
      });
    }
  };

  setNetwork = (network: 'mainnet' | 'testnet') => {
    this.network = network;
    this.wallets = this.wallets.map((wallet) => ({
      ...wallet,
      balance: { ctc: null, space: null, usdc: null },
      balanceError: null,
    }));
  };
}

export const walletStore = new WalletStore();