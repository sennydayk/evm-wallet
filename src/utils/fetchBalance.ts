import { ethers, JsonRpcProvider } from 'ethers';
import { RPC_URLS } from '../constants/rpc';

export const fetchBalance = async (address: string, network: 'mainnet' | 'testnet'): Promise<string> => {
    const provider = new JsonRpcProvider(RPC_URLS.creditcoin[network]);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
}
