import { RPC_URLS } from "./rpc";

export type TokenConfig = {
    contractAddress: string;
    rpcUrl: string;
    decimals: number;
  };
  
  export type NetworkTokens = Record<string, TokenConfig>;
  
  export const TOKEN_CONFIGS: Record<'mainnet' | 'testnet', NetworkTokens> = {
    mainnet: {
      space: {
        contractAddress: "0x7ab7C6A935Ab2D1437398790C9C0660af62A80b9",
        rpcUrl: RPC_URLS.creditcoin.mainnet,
        decimals: 18,
      },
      usdc: {
        contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        rpcUrl: RPC_URLS.ethereum.mainnet,
        decimals: 6,
      },
    },
    testnet: {
      space: {
        contractAddress: "0xfaFAd008f017C326B62FbfddA7fb2335A5c82247",
        rpcUrl: RPC_URLS.creditcoin.testnet,
        decimals: 18,
      },
      usdc: {
        contractAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        rpcUrl: RPC_URLS.ethereum.testnet,
        decimals: 6,
      },
    },
  };