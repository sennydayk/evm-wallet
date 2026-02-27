import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { walletStore } from '../stores/walletStore';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PageLayout } from '../components/layout/PageLayout';
import '../styles/page/Import.css';

type LocationState = { fromCreate?: boolean } | null;

export const Import = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromCreate = (location.state as LocationState)?.fromCreate ?? false;

  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');

  const handleImport = () => {
    const wordCount = mnemonic.trim().split(' ').length;
    if (![12, 15, 18, 21, 24].includes(wordCount)) {
      setError('Mnemonic must be 12, 15, 18, 21, or 24 words.');
      return;
    }
    setError('');
    walletStore.importWallet(mnemonic);
    navigate('/wallets');
  };

  return (
    <PageLayout title="Import Wallet" centerContent>
      {fromCreate && (
        <p className="text-muted import__description">
          Please re-enter your mnemonic phrase to confirm.
        </p>
      )}
      <Input
        multiline
        value={mnemonic}
        onChange={(e) => {
          setMnemonic(e.target.value);
          setError('');
        }}
        placeholder="Enter 12 or 24 word mnemonic phrase"
        rows={3}
      />
      {error && <p className="text-error import__error">{error}</p>}
      <div className="import__actions">
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back
        </Button>
        <Button onClick={handleImport}>Import Wallet</Button>
      </div>
    </PageLayout>
  );
});
