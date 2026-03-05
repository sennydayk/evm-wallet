import { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { walletStore } from "../stores/walletStore";
import { TOKEN_CONFIGS } from "../constants/tokens";
import { estimateGas } from "../utils/sendTransaction";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Dropdown } from "./ui/Dropdown";
import { CopyButton } from "./ui/CopyButton";

interface TransferModalProps {
  fromAddress: string;
  onClose: () => void;
}

const TOKEN_OPTIONS = [
  { value: "ctc", label: "CTC" },
  { value: "eth", label: "ETH" },
  { value: "space", label: "SPACE" },
  { value: "usdc", label: "USDC" },
];

const GAS_TOKEN_LABEL: Record<string, string> = {
  ctc: "CTC",
  eth: "ETH",
  space: "CTC",
  usdc: "ETH",
};

const isValidAddress = (address: string) => /^0x[0-9a-fA-F]{40}$/.test(address);

const isValidAmount = (value: string) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

const DEBOUNCE_MS = 500;

export const TransferModal = observer(
  ({ fromAddress, onClose }: TransferModalProps) => {
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedToken, setSelectedToken] = useState("ctc");
    const [sending, setSending] = useState(false);
    const [txHash, setTxHash] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();
    const [gasFee, setGasFee] = useState<string | undefined>();
    const [estimating, setEstimating] = useState(false);
    const [gasError, setGasError] = useState<string | undefined>();

    const lastEstimatedRef = useRef("");
    const requestIdRef = useRef(0);

    const isFormValid = isValidAddress(toAddress) && isValidAmount(amount);

    useEffect(() => {
      if (!isFormValid) {
        setGasFee(undefined);
        setGasError(undefined);
        lastEstimatedRef.current = "";
        return;
      }

      const paramsKey = `${selectedToken}:${toAddress}:${amount}`;
      if (paramsKey === lastEstimatedRef.current) {
        return;
      }

      const currentRequestId = ++requestIdRef.current;

      const timer = setTimeout(async () => {
        const wallet = walletStore.wallets.find(
          (w) => w.address === fromAddress,
        );
        if (!wallet) return;

        const tokenConfig = TOKEN_CONFIGS[walletStore.network][selectedToken];

        setEstimating(true);
        setGasError(undefined);

        try {
          const fee = await estimateGas(tokenConfig, {
            toAddress,
            amount,
            privateKey: wallet.privateKey,
          });

          if (currentRequestId !== requestIdRef.current) return;

          setGasFee(fee);
          lastEstimatedRef.current = paramsKey;
        } catch (err) {
          if (currentRequestId !== requestIdRef.current) return;

          setGasError(
            err instanceof Error ? err.message : "Failed to estimate gas",
          );
          setGasFee(undefined);
        } finally {
          if (currentRequestId === requestIdRef.current) {
            setEstimating(false);
          }
        }
      }, DEBOUNCE_MS);

      return () => clearTimeout(timer);
    }, [selectedToken, toAddress, amount, fromAddress, isFormValid]);

    const handleTransfer = async () => {
      setError(undefined);
      setSending(true);
      try {
        const hash = await walletStore.transfer(
          fromAddress,
          toAddress,
          amount,
          selectedToken,
        );
        setTxHash(hash);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to send transaction",
        );
      } finally {
        setSending(false);
      }
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Send Token"
        >
          <h2 className="modal__title">Send Token</h2>

          <div className="modal__field">
            <label className="modal__label">From</label>
            <span className="modal__address">{fromAddress}</span>
          </div>

          <div className="modal__field">
            <label className="modal__label">Token</label>
            <Dropdown
              options={TOKEN_OPTIONS}
              value={selectedToken}
              onChange={setSelectedToken}
              disabled={sending || !!txHash}
            />
          </div>

          <div className="modal__field">
            <label className="modal__label">To Address</label>
            <Input
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
              disabled={sending || !!txHash}
              className="modal__input"
            />
          </div>

          <div className="modal__field">
            <label className="modal__label">Amount</label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              disabled={sending || !!txHash}
              className="modal__input"
            />
          </div>

          <div className="modal__gas-fee">
            {estimating && (
              <span className="modal__gas-fee-estimating">
                <span
                  className="modal__spinner modal__spinner--sm"
                  aria-hidden
                />
                Estimating gas fee...
              </span>
            )}
            {!estimating && gasFee && (
              <span className="modal__gas-fee-value">
                Estimated Gas Fee: {gasFee} {GAS_TOKEN_LABEL[selectedToken]}
              </span>
            )}
            {!estimating && gasError && (
              <span className="modal__gas-fee-error">
                Gas estimation failed
              </span>
            )}
          </div>

          {error && <p className="modal__error">{error}</p>}

          {txHash && (
            <div className="modal__success">
              <p className="modal__success-title">Transaction Sent</p>
              <div className="modal__tx-hash-row">
                <span className="modal__tx-hash">{txHash}</span>
                <CopyButton text={txHash} className="modal__copy-btn" />
              </div>
            </div>
          )}

          <div className="modal__actions">
            <Button variant="secondary" size="md" onClick={onClose}>
              {txHash ? "Close" : "Cancel"}
            </Button>
            {!txHash && (
              <Button
                variant="primary"
                size="md"
                onClick={handleTransfer}
                disabled={!isFormValid || sending}
              >
                {sending ? (
                  <span className="modal__spinner" aria-hidden />
                ) : (
                  "Send"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  },
);
