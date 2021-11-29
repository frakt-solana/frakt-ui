import BN from 'bn.js';
import { shortenAddress } from '../../utils/solanaUtils';
import fraktionConfig from '../../contexts/fraktion/config';
import styles from './styles.module.scss';
import { copyToClipboard, decimalBNToString } from '../../utils';
import { VaultData } from '../../contexts/fraktion';
import CopyClipboardIcon from '../../icons/CopyClipboardIcon';
import classNames from 'classnames';
import Tooltip from '../../components/Tooltip';

export const MetadataTable = ({
  vaultInfo,
}: {
  vaultInfo: VaultData;
}): JSX.Element => {
  if (!vaultInfo?.nftAttributes) {
    return null;
  }

  return (
    <div>
      <div className={styles.infoTable}>
        <div className={styles.infoTable__cell}>
          <p className={styles.infoTable__cellName}>Description</p>
          <p className={styles.infoTable__cellValue}>{vaultInfo.description}</p>
        </div>
        {vaultInfo.nftAttributes.map((attribute) => (
          <div key={attribute.trait_type} className={styles.infoTable__cell}>
            <p className={styles.infoTable__cellName}>{attribute.trait_type}</p>
            <p className={styles.infoTable__cellValue}>{attribute.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
