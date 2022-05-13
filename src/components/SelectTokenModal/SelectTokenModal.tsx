import { FC, useEffect, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import classNames from 'classnames';

import { Modal, ModalProps } from '../Modal/Modal';
import { SearchInput } from '../SearchInput';
import styles from './styles.module.scss';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../FakeInfinityScroll';
import { useDebounce } from '../../hooks';
import { CloseModalIcon } from '../../icons';

interface SelectTokenModalProps extends ModalProps {
  onChange?: (token: TokenInfo) => void;
  tokensList: TokenInfo[];
  balances?: {
    [key: string]: string;
  };
}

export const SelectTokenModal: FC<SelectTokenModalProps> = ({
  title,
  tokensList,
  className,
  onChange,
  visible,
  onCancel,
  balances = {},
  ...props
}) => {
  const [searchString, setSearchString] = useState<string>('');
  const { itemsToShow, next } = useFakeInfinityScroll(20);

  const filterTokens = () => {
    return tokensList.filter(({ symbol }) =>
      symbol.toUpperCase().includes(searchString),
    );
  };

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 1000);

  useEffect(() => {
    setSearchString('');
  }, [visible]);

  return (
    <Modal
      width={500}
      title={title || 'Receive'}
      onCancel={onCancel}
      footer={false}
      closable={false}
      visible={visible}
      className={classNames(className, styles.modal)}
      {...props}
    >
      <div className={styles.closeModalSection}>
        <div className={styles.closeModalIcon} onClick={onCancel}>
          <CloseModalIcon className={styles.closeIcon} />
        </div>
      </div>
      <SearchInput
        onChange={(event) => searchItems(event.target.value || '')}
        className={styles.input}
        placeholder="Search token by name"
      />
      <FakeInfinityScroll
        itemsToShow={itemsToShow}
        next={next}
        emptyMessage="No token found"
        wrapperClassName={styles.tokenList}
      >
        {filterTokens().map((token) => (
          <div
            key={token.address}
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
                  backgroundImage: `url("${token.logoURI}")`,
                }}
              />{' '}
              <span className={styles.title}>{token.symbol}</span>
            </div>
            {balances[token?.address] || ''}
          </div>
        ))}
      </FakeInfinityScroll>
    </Modal>
  );
};
