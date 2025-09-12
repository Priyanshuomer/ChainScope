/**
 * Check if an RPC endpoint is responsive.
 * @param rpcUrl - The RPC endpoint URL.
 * @param timeoutMs - Optional timeout in ms (default 3000).
 * @returns true if the RPC responded successfully, false otherwise.
 */
export const checkRpcHealth = async (rpcUrl: string, timeoutMs = 3000): Promise<boolean> => {
  // Abort fetch after timeout
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) return false;

    const json = await res.json();
    if (json && json.result) return true; // RPC returned a chainId

    return false;
  } catch {
    clearTimeout(timeout);
    return false;
  }
};
