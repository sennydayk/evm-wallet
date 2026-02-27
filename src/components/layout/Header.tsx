import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface HeaderProps {
  title: string;
  rightContent?: ReactNode;
}

export const Header = ({ title, rightContent }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <Link to="/" className="header__logo" aria-label="Go to main">
            <img src="/logo.png" alt="Logo" />
          </Link>
        </div>
        <h1 className="header__title">{title}</h1>
        <div className="header__right">{rightContent}</div>
      </div>
    </header>
  );
};
