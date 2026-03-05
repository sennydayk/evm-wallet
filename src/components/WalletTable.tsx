import type { Wallet } from "../stores/walletStore";
import { Button } from "./ui/Button";
import { CopyButton } from "./ui/CopyButton";
import eyeIcon from "../assets/eye.svg";
import eyeOffIcon from "../assets/eye-off.svg";

export interface WalletTableProps {
  wallets: Wallet[];
  loadingAddresses: string[];
  viewPrivateKey: Record<number, boolean>;
  onViewPrivateKey: (index: number) => void;
  onFetchBalance: (address: string) => void;
  onSend: (address: string) => void;
}

export const WalletTable = ({
  wallets,
  loadingAddresses,
  viewPrivateKey,
  onViewPrivateKey,
  onFetchBalance,
  onSend,
}: WalletTableProps) => {
  return (
    <div className="wallet-table">
      <div className="wallet-table__wrapper">
        <table className="wallet-table__table">
          <thead>
            <tr>
              <th className="wallet-table__col-index">Index</th>
              <th>Address</th>
              <th className="wallet-table__col-private-key">Private Key</th>
              <th className="wallet-table__col-balance">Balance</th>
            </tr>
          </thead>
          <tbody>
            {wallets.length === 0 ? (
              <tr>
                <td colSpan={4} className="wallet-table__empty">
                  No wallets registered.
                </td>
              </tr>
            ) : (
              wallets.map((wallet) => (
                <tr key={wallet.index}>
                  <td className="wallet-table__col-index">
                    {wallet.index + 1}
                  </td>
                  <td className="wallet-table__address">{wallet.address}</td>
                  <td className="wallet-table__col-private-key">
                    <div className="wallet-table__cell-action">
                      <span className="wallet-table__private-key">
                        {viewPrivateKey[wallet.index]
                          ? wallet.privateKey
                          : "**********************"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="wallet-table__icon-btn"
                        onClick={() => onViewPrivateKey(wallet.index)}
                        aria-label={
                          viewPrivateKey[wallet.index] ? "Hide" : "Show"
                        }
                      >
                        <img
                          src={
                            viewPrivateKey[wallet.index] ? eyeOffIcon : eyeIcon
                          }
                          alt=""
                          className="wallet-table__icon"
                        />
                      </Button>
                      {viewPrivateKey[wallet.index] && (
                        <CopyButton
                          text={wallet.privateKey}
                          className="wallet-table__icon-btn"
                        />
                      )}
                    </div>
                  </td>
                  <td className="wallet-table__col-balance">
                    <div className="wallet-table__cell-action">
                      {Object.values(wallet.balance).every((v) => v === null) &&
                      !wallet.chainErrors.creditcoin &&
                      !wallet.chainErrors.ethereum ? (
                        <Button
                          size="sm"
                          onClick={() => onFetchBalance(wallet.address)}
                          disabled={loadingAddresses.includes(wallet.address)}
                          aria-busy={loadingAddresses.includes(wallet.address)}
                          aria-label={
                            loadingAddresses.includes(wallet.address)
                              ? "Fetching balance"
                              : "Fetch balance"
                          }
                        >
                          {loadingAddresses.includes(wallet.address) ? (
                            <span
                              className="wallet-table__spinner"
                              aria-hidden
                            />
                          ) : (
                            "Fetch balance"
                          )}
                        </Button>
                      ) : (
                        <div className="wallet-table__balance-list">
                          <div className="wallet-table__balance-row">
                            <span className="wallet-table__token-badge wallet-table__token-badge--eth">
                              ETH
                            </span>
                            <span className="wallet-table__balance-value">
                              {wallet.balance.eth ?? "-"}
                            </span>
                          </div>
                          <div className="wallet-table__balance-row">
                            <span className="wallet-table__token-badge wallet-table__token-badge--ctc">
                              CTC
                            </span>
                            <span className="wallet-table__balance-value">
                              {wallet.balance.ctc ?? "-"}
                            </span>
                          </div>
                          <div className="wallet-table__balance-row">
                            <span className="wallet-table__token-badge wallet-table__token-badge--space">
                              SPACE
                            </span>
                            <span className="wallet-table__balance-value">
                              {wallet.balance.space ?? "-"}
                            </span>
                          </div>
                          <div className="wallet-table__balance-row">
                            <span className="wallet-table__token-badge wallet-table__token-badge--usdc">
                              USDC
                            </span>
                            <span className="wallet-table__balance-value">
                              {wallet.balance.usdc ?? "-"}
                            </span>
                          </div>
                          {(wallet.chainErrors.creditcoin ||
                            wallet.chainErrors.ethereum) && (
                            <div className="wallet-table__chain-errors">
                              {wallet.chainErrors.creditcoin && (
                                <span className="wallet-table__chain-error-text">
                                  Creditcoin: {wallet.chainErrors.creditcoin}
                                </span>
                              )}
                              {wallet.chainErrors.ethereum && (
                                <span className="wallet-table__chain-error-text">
                                  Ethereum: {wallet.chainErrors.ethereum}
                                </span>
                              )}
                              <Button
                                size="sm"
                                onClick={() => onFetchBalance(wallet.address)}
                                disabled={loadingAddresses.includes(
                                  wallet.address,
                                )}
                                aria-label="Retry fetch balance"
                              >
                                Retry
                              </Button>
                            </div>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            className="wallet-table__send-btn"
                            onClick={() => onSend(wallet.address)}
                          >
                            Send
                          </Button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
