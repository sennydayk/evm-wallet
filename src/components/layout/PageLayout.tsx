import type { ReactNode } from 'react';
import { Header } from './Header';

export interface PageLayoutProps {
  title: string;
  rightContent?: ReactNode;
  centerContent?: boolean;
  children: ReactNode;
}

export const PageLayout = ({
  title,
  rightContent,
  centerContent = false,
  children,
}: PageLayoutProps) => {
  const contentClassName = centerContent
    ? 'page-layout__content page-layout__content--center'
    : 'page-layout__content';

  const mainClassName = centerContent
    ? 'page-layout__main page-layout__main--center'
    : 'page-layout__main';

  return (
    <div className="page-layout">
      <Header title={title} rightContent={rightContent} />
      <main className={mainClassName}>
        <div className={contentClassName}>{children}</div>
      </main>
    </div>
  );
};
