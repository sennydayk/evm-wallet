import { JsonRpcProvider, Contract, ethers } from "ethers";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
];

const RPC_URLS = {
  mainnet: "https://mainnet3.creditcoin.network",
  testnet: "https://rpc.cc3-testnet.creditcoin.network",
  };

  export const CONTRACT_ADDRESSES = {
    mainnet: {
      space: "0x7ab7C6A935Ab2D1437398790C9C0660af62A80b9",
      usdc: "0x0000000000000000000000000000000000000000",
    },
    testnet: {
      space: "0xfaFAd008f017C326B62FbfddA7fb2335A5c82247",
      usdc: "0x0000000000000000000000000000000000000000",
    },
  }

  export const fetchErc20Balance = async (
    address: string,
    contractAddress: string,
    network: 'mainnet' | 'testnet',
  ): Promise<string> => {
    const provider = new JsonRpcProvider(RPC_URLS[network]);
    const contract = new Contract(contractAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(address);
    return ethers.formatEther(balance);
  }