import { FC, useState } from 'react';
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
import { useTokenListContext } from '../../contexts/TokenList';
import { SOL_TOKEN, USDC_TOKEN, USDT_TOKEN } from '../../utils';

interface SelectTokenModalProps extends ModalProps {
  onChange?: (token: TokenInfo) => void;
  balances?: {
    [key: string]: string;
  };
}

export const SelectTokenModal: FC<SelectTokenModalProps> = ({
  title,
  className,
  onChange,
  visible,
  onCancel,
  balances = {},
  ...props
}) => {
  const [searchString, setSearchString] = useState<string>('');
  const { itemsToShow, next } = useFakeInfinityScroll();
  const { tokensList, fraktionTokensList } = useTokenListContext();

  const poolsTokens = fraktionTokensList.filter(
    ({ extensions }) => (extensions as any)?.poolPubkey,
  );

  const poolsTokensWithTopCoin = [
    SOL_TOKEN,
    USDT_TOKEN,
    USDC_TOKEN,
    ...poolsTokens,
  ];

  const filterTokens = () => {
    return tokensList.filter(({ symbol }) =>
      symbol.toUpperCase().includes(searchString),
    );
  };

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const filteredTokensList = searchString
    ? filterTokens()
    : poolsTokensWithTopCoin;

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
        {filteredTokensList.map((token) => (
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
