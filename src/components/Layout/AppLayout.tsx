import Header from '../Header';

interface AppLayoutProps {
  children: JSX.Element[] | JSX.Element;
  className?: string;
}

export const AppLayout = ({
  children,
  className = '',
}: AppLayoutProps): JSX.Element => {
  return (
    <div className={className}>
      <Header />
      {children}
    </div>
  );
};
