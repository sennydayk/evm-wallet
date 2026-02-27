import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Main } from './pages/Main';
import { Create } from './pages/Create';
import { Import } from './pages/Import';
import { Wallets } from './pages/Wallets';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/create" element={<Create />} />
        <Route path="/import" element={<Import />} />
        <Route path="/wallets" element={<Wallets />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;