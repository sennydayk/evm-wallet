import { ethers, JsonRpcProvider } from 'ethers';

const MAINNET_RPC_URL = 'https://mainnet3.creditcoin.network';
const TESTNET_RPC_URL = 'https://rpc.cc3-testnet.creditcoin.network';

export const fetchBalance = async (address: string, network: 'mainnet' | 'testnet'): Promise<string> => {
    const provider = new JsonRpcProvider(network === 'mainnet' ? MAINNET_RPC_URL : TESTNET_RPC_URL);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
}