import { ethers, Interface } from "ethers";
import { TOKEN_CONFIGS } from "../constants/tokens";
import { batchRpcCall } from "./batchRpcCall";
import { RPC_URLS } from "../constants/rpc";

const iface = new Interface([
  "function balanceOf(address owner) view returns (uint256)",
]);

export type ChainErrors = {
  creditcoin: string | null;
  ethereum: string | null;
};

export type BalanceResult = {
  balances: {
    ctc: string | null;
    space: string | null;
    eth: string | null;
    usdc: string | null;
  };
  errors: ChainErrors;
};

export const fetchBalances = async (
  address: string,
  network: "mainnet" | "testnet",
): Promise<BalanceResult> => {
  const spaceConfig = TOKEN_CONFIGS[network].space;
  const usdcConfig = TOKEN_CONFIGS[network].usdc;
  const calldata = iface.encodeFunctionData("balanceOf", [address]);

  const [ctcResult, ethResult] = await Promise.allSettled([
    batchRpcCall(RPC_URLS.creditcoin[network], [
      { method: "eth_getBalance", params: [address, "latest"] },
      {
        method: "eth_call",
        params: [{ to: spaceConfig.contractAddress, data: calldata }],
      },
    ]),
    batchRpcCall(RPC_URLS.ethereum[network], [
      { method: "eth_getBalance", params: [address, "latest"] },
      {
        method: "eth_call",
        params: [{ to: usdcConfig.contractAddress, data: calldata }],
      },
    ]),
  ]);

  return {
    balances: {
      ctc:
        ctcResult.status === "fulfilled"
          ? ethers.formatEther(ctcResult.value[0])
          : null,
      space:
        ctcResult.status === "fulfilled"
          ? ethers.formatUnits(ctcResult.value[1], spaceConfig.decimals)
          : null,
      eth:
        ethResult.status === "fulfilled"
          ? ethers.formatEther(ethResult.value[0])
          : null,
      usdc:
        ethResult.status === "fulfilled"
          ? ethers.formatUnits(ethResult.value[1], usdcConfig.decimals)
          : null,
    },
    errors: {
      creditcoin:
        ctcResult.status === "rejected"
          ? (ctcResult.reason?.message ?? "Failed to fetch Creditcoin balances")
          : null,
      ethereum:
        ethResult.status === "rejected"
          ? (ethResult.reason?.message ?? "Failed to fetch Ethereum balances")
          : null,
    },
  };
};
