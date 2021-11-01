import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { Modal, ModalProps } from '../Modal/Modal';
import { Input } from '../Input';
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { getTokensList, getTokenImageUrl, Token } from '../../utils';

interface SelectTokenModalProps extends ModalProps {
  onChange?: (value: Token) => void;
}

const tokens = getTokensList();

export const SelectTokenModal = ({
  title,
  className,
  onChange,
  visible,
  onCancel,
  ...props
}: SelectTokenModalProps): JSX.Element => {
  const [search, setSearch] = useState<string>('');
  const searchUp = search.toUpperCase();
  const filterTokens = () => {
    return Object.keys(tokens).filter((key) =>
      tokens[key].symbol.toUpperCase().includes(searchUp),
    );
  };

  useEffect(() => {
    setSearch('');
  }, [visible]);

  return (
    <Modal
      title={title || 'Receive'}
      {...props}
      onCancel={onCancel}
      visible={visible}
      className={classNames(className, styles.modal)}
    >
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.input}
        size="large"
        placeholder="ETH"
        prefix={<SearchOutlined className={styles.search} />}
        {...props}
      />
      <div className={styles.tokenList}>
        {filterTokens().map((key) => (
          <div
            key={key}
            className={styles.row}
            onClick={() => {
              onChange(tokens[key]);
              onCancel(null);
            }}
          >
            <div className={styles.title}>
              <div
                className={styles.icon}
                style={{
                  backgroundImage: `url("${getTokenImageUrl(
                    tokens[key].mint,
                  )}")`,
                }}
              />{' '}
              <span className={styles.title}>{tokens[key].symbol}</span>
            </div>
            0.993020549647554908
          </div>
        ))}
      </div>
    </Modal>
  );
};
