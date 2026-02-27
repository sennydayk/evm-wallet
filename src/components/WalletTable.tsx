import type { Wallet } from '../stores/walletStore';
import { Button } from './ui/Button';
import { CopyButton } from './ui/CopyButton';
import eyeIcon from '../assets/eye.svg';
import eyeOffIcon from '../assets/eye-off.svg';

export interface WalletTableProps {
  wallets: Wallet[];
  loadingAddresses: string[];
  viewPrivateKey: Record<number, boolean>;
  onViewPrivateKey: (index: number) => void;
  onFetchBalance: (address: string) => void;
}

export const WalletTable = ({
  wallets,
  loadingAddresses,
  viewPrivateKey,
  onViewPrivateKey,
  onFetchBalance,
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
                  <td className="wallet-table__col-index">{wallet.index + 1}</td>
                  <td className="wallet-table__address">{wallet.address}</td>
                  <td className="wallet-table__col-private-key">
                    <div className="wallet-table__cell-action">
                      <span className="wallet-table__private-key">
                        {viewPrivateKey[wallet.index]
                          ? wallet.privateKey
                          : '**********************'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="wallet-table__icon-btn"
                        onClick={() => onViewPrivateKey(wallet.index)}
                        aria-label={viewPrivateKey[wallet.index] ? 'Hide' : 'Show'}
                      >
                        <img
                          src={viewPrivateKey[wallet.index] ? eyeOffIcon : eyeIcon}
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
                      {wallet.balanceError ? (
                        <div className="wallet-table__balance-error">
                          <span className="wallet-table__balance-error-text">
                            {wallet.balanceError}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => onFetchBalance(wallet.address)}
                            disabled={loadingAddresses.includes(wallet.address)}
                            aria-busy={loadingAddresses.includes(wallet.address)}
                            aria-label="Retry fetch balance"
                          >
                            Retry
                          </Button>
                        </div>
                      ) : wallet.balance === null ? (
                        <Button
                          size="sm"
                          onClick={() => onFetchBalance(wallet.address)}
                          disabled={loadingAddresses.includes(wallet.address)}
                          aria-busy={loadingAddresses.includes(wallet.address)}
                          aria-label={
                            loadingAddresses.includes(wallet.address)
                              ? 'Fetching balance'
                              : 'Fetch balance'
                          }
                        >
                          {loadingAddresses.includes(wallet.address) ? (
                            <span className="wallet-table__spinner" aria-hidden />
                          ) : (
                            'Fetch balance'
                          )}
                        </Button>
                      ) : (
                        <span>{wallet.balance}</span>
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
