import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { walletStore } from '../stores/walletStore';
import { observer } from 'mobx-react-lite';
import { Button } from '../components/ui/Button';
import { PageLayout } from '../components/layout/PageLayout';
import { CopyButton } from '../components/ui/CopyButton';
import '../styles/page/Create.css';

export const Create = observer(() => {
  const navigate = useNavigate();
  const mnemonic = walletStore.mnemonic;
  const mnemonicError = walletStore.mnemonicError;
  const mnemonicWords = mnemonic.split(' ');

  useEffect(() => {
    walletStore.createMnemonic();
  }, []);

  return (
    <PageLayout title="Mnemonic Phrase" centerContent>
      <p className="text-muted create__description">
        Without this phrase, you cannot recover your wallet. Copy and store it
        somewhere safe.
      </p>
      {mnemonicError && (
        <p className="text-error">{mnemonicError}</p>
      )}
      <div className="create__row">
        <p className="create__mnemonic">
          {mnemonicWords.map((word: string, index: number) => (
            <span key={index}>{word} </span>
          ))}
        </p>
        <CopyButton text={mnemonic} className="create__copy-btn" />
      </div>
      <Button onClick={() => navigate('/import', { state: { fromCreate: true } })}>
        Confirm
      </Button>
    </PageLayout>
  );
});
