import { RPC_URLS } from "./rpc";

type BaseTokenConfig = {
  chainId: number;
  contractAddress: string;
  rpcUrl: string;
  decimals: number;
};

export type NativeTokenConfig = BaseTokenConfig & { type: "native" };
export type Erc20TokenConfig = BaseTokenConfig & { type: "erc20" };
export type TokenConfig = NativeTokenConfig | Erc20TokenConfig;

export type NetworkTokens = Record<string, TokenConfig>;

export const TOKEN_CONFIGS: Record<"mainnet" | "testnet", NetworkTokens> = {
  mainnet: {
    ctc: {
      type: "native",
      chainId: 102030,
      contractAddress: "",
      rpcUrl: RPC_URLS.creditcoin.mainnet,
      decimals: 18,
    },
    eth: {
      type: "native",
      chainId: 1,
      contractAddress: "",
      rpcUrl: RPC_URLS.ethereum.mainnet,
      decimals: 18,
    },
    space: {
      type: "erc20",
      chainId: 102030,
      contractAddress: "0x7ab7C6A935Ab2D1437398790C9C0660af62A80b9",
      rpcUrl: RPC_URLS.creditcoin.mainnet,
      decimals: 18,
    },
    usdc: {
      type: "erc20",
      chainId: 1,
      contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      rpcUrl: RPC_URLS.ethereum.mainnet,
      decimals: 6,
    },
  },
  testnet: {
    ctc: {
      type: "native",
      chainId: 102031,
      contractAddress: "",
      rpcUrl: RPC_URLS.creditcoin.testnet,
      decimals: 18,
    },
    eth: {
      type: "native",
      chainId: 11155111,
      contractAddress: "",
      rpcUrl: RPC_URLS.ethereum.testnet,
      decimals: 18,
    },
    space: {
      type: "erc20",
      chainId: 102031,
      contractAddress: "0xfaFAd008f017C326B62FbfddA7fb2335A5c82247",
      rpcUrl: RPC_URLS.creditcoin.testnet,
      decimals: 18,
    },
    usdc: {
      type: "erc20",
      chainId: 11155111,
      contractAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      rpcUrl: RPC_URLS.ethereum.testnet,
      decimals: 6,
    },
  },
};
