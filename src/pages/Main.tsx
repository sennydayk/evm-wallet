import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PageLayout } from '../components/layout/PageLayout';
import '../styles/page/Main.css';

export const Main = () => {
  const navigate = useNavigate();
  return (
    <PageLayout title="Seyeon Wallet" centerContent>
      <div className="main__content">
        <img src="/logo.png" alt="EVM Wallet Logo" className="main__logo" />
        <div className="main__buttons">
          <Button onClick={() => navigate('/create')}>Create Wallet</Button>
          <Button onClick={() => navigate('/import')}>Import Wallet</Button>
        </div>
      </div>
    </PageLayout>
  );
};