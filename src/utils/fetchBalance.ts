import { ethers, JsonRpcProvider } from 'ethers';

const MAINNET_RPC_URL = 'https://mainnet-proxy-rpc.creditcoin.network';
const SUBNET_RPC_URL = 'https://sepolia-proxy-rpc.creditcoin.network';

export const fetchBalance = async (address: string, network: 'mainnet' | 'subnet'): Promise<string> => {
    const provider = new JsonRpcProvider(network === 'mainnet' ? MAINNET_RPC_URL : SUBNET_RPC_URL);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
}