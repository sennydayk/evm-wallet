import { ethers } from "ethers";

type TransferParams = {
  toAddress: string;
  amount: string;
};

export const buildNativeTransfer = (params: TransferParams) => {
  return {
    to: params.toAddress,
    value: ethers.parseEther(params.amount),
  };
};
