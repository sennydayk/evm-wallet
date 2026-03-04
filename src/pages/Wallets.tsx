import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { walletStore } from "../stores/walletStore";
import { WalletTable } from "../components/WalletTable";
import { TransferModal } from "../components/TransferModal";
import { Button } from "../components/ui/Button";
import { PageLayout } from "../components/layout/PageLayout";
import { useNavigate } from "react-router-dom";
import "../styles/page/Wallets.css";

export const Wallets = observer(() => {
  const navigate = useNavigate();
  const [viewPrivateKey, setViewPrivateKey] = useState<Record<number, boolean>>(
    {},
  );
  const [transferAddress, setTransferAddress] = useState<string | undefined>();

  useEffect(() => {
    if (!walletStore.mnemonic) {
      alert(
        "Wallet information has been initialized. Please start from the beginning.",
      );
      navigate("/");
    }
  }, [navigate]);

  const handleViewPrivateKey = (index: number) => {
    setViewPrivateKey((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleNetworkToggle = () => {
    const nextNetwork =
      walletStore.network === "mainnet" ? "testnet" : "mainnet";
    const message =
      nextNetwork === "mainnet" ? "Switch to mainnet?" : "Switch to testnet?";
    if (confirm(message)) {
      walletStore.setNetwork(nextNetwork);
    }
  };

  return (
    <PageLayout title="Wallet List">
      <div className="wallets-page__toolbar">
        <div className="wallets-page__network">
          <span className="wallets-page__network-label">
            {walletStore.network === "testnet" && (
              <span
                className="wallets-page__help-badge"
                aria-label="This is a testnet. Click the toggle to switch to mainnet"
              >
                ?
                <span className="wallets-page__help-tooltip">
                  This is a testnet. Click the toggle to switch to mainnet.
                </span>
              </span>
            )}
            {walletStore.network === "mainnet" ? "Mainnet" : "Testnet"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={walletStore.network === "mainnet"}
            className={`wallets-page__toggle ${walletStore.network === "mainnet" ? "wallets-page__toggle--active" : ""}`}
            onClick={handleNetworkToggle}
          >
            <span className="wallets-page__toggle-thumb" />
          </button>
        </div>
        <Button onClick={() => walletStore.deriveWallet()}>Add Wallet</Button>
      </div>
      <WalletTable
        wallets={walletStore.wallets}
        loadingAddresses={walletStore.loadingAddresses}
        viewPrivateKey={viewPrivateKey}
        onViewPrivateKey={handleViewPrivateKey}
        onFetchBalance={(address) => walletStore.fetchBalance(address)}
        onSend={(address) => setTransferAddress(address)}
      />
      {transferAddress && (
        <TransferModal
          fromAddress={transferAddress}
          onClose={() => setTransferAddress(undefined)}
        />
      )}
    </PageLayout>
  );
});
