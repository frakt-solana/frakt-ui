import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { Modal, ModalProps } from '../Modal/Modal';
import classNames from 'classnames';
import { Token } from '../../utils';
import { SearchInput } from '../SearchInput';

interface SelectTokenModalProps extends ModalProps {
  onChange?: (token: Token) => void;
  tokensList: Token[];
}

export const SelectTokenModal = ({
  title,
  tokensList,
  className,
  onChange,
  visible,
  onCancel,
  ...props
}: SelectTokenModalProps): JSX.Element => {
  const [search, setSearch] = useState<string>('');
  const searchUp = search.toUpperCase();
  const filterTokens = () => {
    return tokensList.filter(({ symbol }) =>
      symbol.toUpperCase().includes(searchUp),
    );
  };

  useEffect(() => {
    setSearch('');
  }, [visible]);

  return (
    <Modal
      width={730}
      title={title || 'Receive'}
      {...props}
      onCancel={onCancel}
      visible={visible}
      className={classNames(className, styles.modal)}
    >
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.input}
        placeholder="SOL"
        {...props}
      />
      <div className={styles.tokenList}>
        {filterTokens().map((token) => (
          <div
            key={token.mint}
            className={styles.row}
            onClick={() => {
              onChange(token);
              onCancel(null);
            }}
          >
            <div className={styles.title}>
              <div
                className={styles.icon}
                style={{
                  backgroundImage: `url("${token.img}")`,
                }}
              />{' '}
              <span className={styles.title}>{token.symbol}</span>
            </div>
            {/* 0.993020549647554908 //TODO: When wallet connected display balance */}
          </div>
        ))}
      </div>
    </Modal>
  );
};
