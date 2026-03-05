import { ethers, JsonRpcProvider, Wallet } from "ethers";
import type { TokenConfig } from "../constants/tokens";
import { buildNativeTransfer } from "./buildNativeTransfer";
import { buildErc20Transfer } from "./buildErc20Transfer";

type TransferParams = {
  toAddress: string;
  amount: string;
  privateKey: string;
};

export const sendTransaction = async (
  tokenConfig: TokenConfig,
  params: TransferParams,
) => {
  const provider = new JsonRpcProvider(tokenConfig.rpcUrl);
  const wallet = new Wallet(params.privateKey, provider);
  const tx =
    tokenConfig.type === "native"
      ? buildNativeTransfer({
          toAddress: params.toAddress,
          amount: params.amount,
        })
      : buildErc20Transfer({
          toAddress: params.toAddress,
          amount: params.amount,
          contractAddress: tokenConfig.contractAddress,
          decimals: tokenConfig.decimals,
        });
  const response = await wallet.sendTransaction(tx);
  return response.hash;
};

export const estimateGas = async (
  tokenConfig: TokenConfig,
  params: TransferParams,
) => {
  const provider = new JsonRpcProvider(tokenConfig.rpcUrl);
  const wallet = new Wallet(params.privateKey);

  const tx =
    tokenConfig.type === "native"
      ? buildNativeTransfer({
          toAddress: params.toAddress,
          amount: params.amount,
        })
      : buildErc20Transfer({
          toAddress: params.toAddress,
          amount: params.amount,
          contractAddress: tokenConfig.contractAddress,
          decimals: tokenConfig.decimals,
        });

  const [gasEstimate, feeData] = await Promise.all([
    provider.estimateGas({
      ...tx,
      from: wallet.address,
    }),
    provider.getFeeData(),
  ]);

  const gasPrice = feeData.gasPrice ?? feeData.maxFeePerGas ?? 0n;
  const gasCost = gasEstimate * gasPrice;
  return ethers.formatEther(gasCost);
};
