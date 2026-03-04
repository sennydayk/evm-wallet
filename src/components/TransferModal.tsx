import { useState } from "react";
import { observer } from "mobx-react-lite";
import { walletStore } from "../stores/walletStore";
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

export const TransferModal = observer(
  ({ fromAddress, onClose }: TransferModalProps) => {
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedToken, setSelectedToken] = useState("ctc");
    const [sending, setSending] = useState(false);
    const [txHash, setTxHash] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>();

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

    const isFormValid = toAddress.trim() !== "" && Number(amount) > 0;

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
