import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
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
import { selectTokenListState } from '../../state/tokenList/selectors';
import { useSwapForm } from '../SwapForm/hooks/useSwapForm';
import { useHeaderState } from '../Layout/headerState';
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
  const { next, itemsToShow } = useFakeInfinityScroll(15);
  const { tokensList } = useSelector(selectTokenListState);
  const { swapTokenList } = useSwapForm();
  const { onContentScroll } = useHeaderState();

  const filterTokens = () => {
    return tokensList.filter(({ symbol }) =>
      symbol.toUpperCase().includes(searchString),
    );
  };

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const filteredTokensList = searchString ? filterTokens() : swapTokenList;

  const onChangeToken = (token: TokenInfo): void => {
    onChange(token);
    onCancel(null);
  };

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
      <div className={styles.topTokensList}>
        {[SOL_TOKEN, USDT_TOKEN, USDC_TOKEN].map((token) => (
          <div
            key={token.address}
            className={styles.topCoinContent}
            onClick={() => onChangeToken(token)}
          >
            <img
              src={token.logoURI}
              className={classNames(styles.icon, styles.smallIcon)}
            />
            <span className={styles.token}>{token.symbol}</span>
          </div>
        ))}
      </div>
      <div
        className={styles.tokenList}
        onScroll={onContentScroll}
        id={`scrollBar${title}`}
      >
        <FakeInfinityScroll
          scrollableTargetId={`scrollBar${title}`}
          itemsToShow={itemsToShow}
          next={next}
          emptyMessage="No token found"
        >
          {filteredTokensList.map((token) => (
            <div
              key={token.address}
              className={styles.row}
              onClick={() => onChangeToken(token)}
            >
              <div className={styles.tokenInfo}>
                <img className={styles.icon} src={token.logoURI} />
                <span className={styles.token}>{token.symbol}</span>
              </div>
              <span className={styles.token}>
                {balances[token?.address] || ''}
              </span>
            </div>
          ))}
        </FakeInfinityScroll>
      </div>
    </Modal>
  );
};
