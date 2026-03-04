import { ethers, Interface } from "ethers";

type TransferParams = {
  toAddress: string;
  amount: string;
  contractAddress: string;
  decimals: number;
};

const iface = new Interface(["function transfer(address to, uint256 amount)"]);

export const buildErc20Transfer = (params: TransferParams) => {
  const data = iface.encodeFunctionData("transfer", [
    params.toAddress,
    ethers.parseUnits(params.amount, params.decimals),
  ]);

  return {
    to: params.contractAddress,
    data: data,
  };
};
