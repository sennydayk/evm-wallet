type RpcRequest = {
    method: string;
    params: unknown[];
}

type RpcResponse = {
    id: number;
    result: string;
    error?: {
        code: number;
        message: string;
    };
}

export async function batchRpcCall(rpcUrl: string, requests: RpcRequest[]): Promise<string[]> {
    const body = requests.map((req, i) => ({
      jsonrpc: "2.0",
      id: i + 1,
      method: req.method,
      params: req.params,
    }));
  
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  
    const results: RpcResponse[] = await res.json();
  
    return results
      .sort((a, b) => a.id - b.id)
      .map(r => {
        if (r.error) throw new Error(r.error.message);
        return r.result;
      });
  }