import { ethers, Interface } from "ethers";
import { TOKEN_CONFIGS } from "../constants/tokens";
import { batchRpcCall } from "./batchRpcCall";
import { RPC_URLS } from "../constants/rpc";

const iface = new Interface([
    "function balanceOf(address owner) view returns (uint256)",
]);

export const fetchBalances = async (
    address: string,
    network: 'mainnet' | 'testnet',
): Promise<{ ctc: string, space: string, usdc: string,eth: string }> => {
    const spaceConfig = TOKEN_CONFIGS[network].space;
    const usdcConfig = TOKEN_CONFIGS[network].usdc;
    const calldata = iface.encodeFunctionData("balanceOf", [address]);

    const [ctcResults, ethResults] = await Promise.all([
        batchRpcCall(RPC_URLS.creditcoin[network], [
            { method: "eth_getBalance", params: [address, "latest"] },
            { method: "eth_call", params: [{ to: spaceConfig.contractAddress, data: calldata}] },
        ]),
        batchRpcCall(RPC_URLS.ethereum[network], [
            { method: "eth_getBalance", params: [address, "latest"] },
            { method: "eth_call", params: [{ to: usdcConfig.contractAddress, data: calldata}] },
        ]),
    ]);

    return {
        ctc: ethers.formatEther(ctcResults[0]),
        space: ethers.formatUnits(ctcResults[1], spaceConfig.decimals),
        usdc: ethers.formatUnits(ethResults[0], usdcConfig.decimals),
        eth: ethers.formatEther(ethResults[1]),
    };
}