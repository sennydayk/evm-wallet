import { makeObservable, observable, action, runInAction } from "mobx";
import { createMnemonic } from "../utils/createMnemonic";
import { deriveWallet } from "../utils/deriveWallet";
import { fetchBalances } from "../utils/fetchBalances";
import { TOKEN_CONFIGS } from "../constants/tokens";
import { sendTransaction } from "../utils/sendTransaction";

export interface Wallet {
  index: number;
  address: string;
  privateKey: string;
  balance: Record<string, string | null>;
  balanceError: string | null;
}

export class WalletStore {
  mnemonic: string = "";
  mnemonicError: string | null = null;
  wallets: Wallet[] = [];
  network: "mainnet" | "testnet" = "testnet";
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
      transfer: action,
    });
  }

  createMnemonic = () => {
    try {
      this.mnemonic = createMnemonic();
      this.mnemonicError = null;
    } catch (err) {
      this.mnemonicError =
        err instanceof Error ? err.message : "Failed to create mnemonic phrase";
    }
  };

  importWallet = (mnemonic: string) => {
    this.wallets = [];
    this.mnemonic = mnemonic;
    this.deriveWallet();
  };

  deriveWallet = () => {
    const wallet = deriveWallet(this.mnemonic, this.wallets.length);
    this.wallets = [
      ...this.wallets,
      {
        ...wallet,
        balance: { ctc: null, space: null, usdc: null, eth: null },
        balanceError: null,
      },
    ];
  };

  fetchBalance = async (address: string) => {
    runInAction(() => {
      this.loadingAddresses = [...this.loadingAddresses, address];
    });
    try {
      const { ctc, space, usdc, eth } = await fetchBalances(
        address,
        this.network,
      );
      runInAction(() => {
        this.loadingAddresses = this.loadingAddresses.filter(
          (a) => a !== address,
        );
        const idx = this.wallets.findIndex((w) => w.address === address);
        if (idx >= 0) {
          this.wallets = this.wallets.map((w, i) =>
            i === idx
              ? { ...w, balance: { ctc, space, usdc, eth }, balanceError: null }
              : w,
          );
        }
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch balance";
      runInAction(() => {
        this.loadingAddresses = this.loadingAddresses.filter(
          (a) => a !== address,
        );
        const idx = this.wallets.findIndex((w) => w.address === address);
        if (idx >= 0) {
          this.wallets = this.wallets.map((w, i) =>
            i === idx ? { ...w, balanceError: errorMessage } : w,
          );
        }
      });
    }
  };

  setNetwork = (network: "mainnet" | "testnet") => {
    this.network = network;
    this.wallets = this.wallets.map((wallet) => ({
      ...wallet,
      balance: { ctc: null, space: null, usdc: null, eth: null },
      balanceError: null,
    }));
  };

  transfer = async (
    fromAddress: string,
    toAddress: string,
    amount: string,
    token: string,
  ) => {
    const tokenConfig = TOKEN_CONFIGS[this.network][token];
    const wallet = this.wallets.find((w) => w.address === fromAddress);
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const txHash = await sendTransaction(tokenConfig, {
      toAddress,
      amount,
      privateKey: wallet.privateKey,
    });
    return txHash;
  };
}

export const walletStore = new WalletStore();
