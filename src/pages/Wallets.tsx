import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { walletStore } from '../stores/walletStore';
import { WalletTable } from '../components/WalletTable';
import { Button } from '../components/ui/Button';
import { PageLayout } from '../components/layout/PageLayout';
import { useNavigate } from 'react-router-dom';
import '../styles/page/Wallets.css';

export const Wallets = observer(() => {
    const navigate = useNavigate();
    const [viewPrivateKey, setViewPrivateKey] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (!walletStore.mnemonic) {
            alert('Wallet information has been initialized. Please start from the beginning.');
            navigate('/');
        }
    }, [navigate]);
    
    const handleViewPrivateKey = (index: number) => {
        setViewPrivateKey((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const handleNetworkToggle = () => {
        const nextNetwork = walletStore.network === 'mainnet' ? 'subnet' : 'mainnet';
        const message =
            nextNetwork === 'mainnet'
                ? 'Switch to mainnet?'
                : 'Switch to subnet?';
        if (confirm(message)) {
            walletStore.setNetwork(nextNetwork);
        }
    };

    return (
        <PageLayout title="Wallet List">
            <div className="wallets-page__toolbar">
                <div className="wallets-page__network">
                    <span className="wallets-page__network-label">
                        {walletStore.network === 'subnet' && (
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
                        {walletStore.network === 'mainnet' ? 'Mainnet' : 'Subnet'}
                    </span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={walletStore.network === 'mainnet'}
                        className={`wallets-page__toggle ${walletStore.network === 'mainnet' ? 'wallets-page__toggle--active' : ''}`}
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
            />
        </PageLayout>
    );
});