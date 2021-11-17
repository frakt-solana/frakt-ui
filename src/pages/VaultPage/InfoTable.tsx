import BN from 'bn.js';
import { shortenAddress } from '../../external/utils/utils';
import fraktionConfig from '../../contexts/fraktion/config';
import styles from './styles.module.scss';
import { copyToClipboard, decimalBNToString } from '../../utils';
import { VaultData } from '../../contexts/fraktion/fraktion.model';
import CopyClipboardIcon from '../../icons/CopyClipboardIcon';
import classNames from 'classnames';
import Tooltip from '../../components/Tooltip';

export const InfoTable = ({
  vaultInfo,
}: {
  vaultInfo: VaultData;
}): JSX.Element => {
  const currency =
    vaultInfo?.priceTokenMint === fraktionConfig.SOL_TOKEN_PUBKEY
      ? 'SOL'
      : 'FRKT';

  return (
    <div className={styles.infoTable}>
      <div className={styles.infoTable__cell}>
        <p className={styles.infoTable__cellName}>Total supply</p>
        <p className={styles.infoTable__cellValue}>
          {vaultInfo.supply.toString().slice(0, -3)}
        </p>
      </div>
      <div className={styles.infoTable__cell}>
        <p className={styles.infoTable__cellName}>
          Fraktion price ({currency})
        </p>
        <p className={styles.infoTable__cellValue}>
          {decimalBNToString(
            vaultInfo.lockedPricePerFraction.mul(new BN(1e3)),
            6,
            9,
          )}
        </p>
      </div>
      <div className={styles.infoTable__cell}>
        <p className={styles.infoTable__cellName}>Buyout price ({currency})</p>
        <p className={styles.infoTable__cellValue}>
          {decimalBNToString(
            vaultInfo.lockedPricePerFraction.mul(vaultInfo.supply),
            2,
            9,
          )}
        </p>
      </div>
      <div className={styles.infoTable__cell}>
        <p className={styles.infoTable__cellName}>Market cap</p>
        <p className={styles.infoTable__cellValue}>
          {decimalBNToString(
            vaultInfo.lockedPricePerFraction.mul(vaultInfo.supply),
            2,
            9,
          )}
        </p>
      </div>
      <div className={styles.infoTable__cell}>
        <p className={styles.infoTable__cellName}>NFT mint</p>
        <p
          className={classNames(
            styles.infoTable__cellValue,
            styles.infoTable__cellValueCopy,
          )}
          onClick={() => copyToClipboard(vaultInfo.nftMint)}
        >
          {shortenAddress(vaultInfo.nftMint)}
          <Tooltip
            placement="bottom"
            trigger="hover"
            overlay="Click to copy to clipboard"
          >
            <CopyClipboardIcon className={styles.copyIcon} width={24} />
          </Tooltip>
        </p>
      </div>
      <div className={styles.infoTable__cell}>
        <p className={styles.infoTable__cellName}>Fractions mint</p>
        <p
          className={classNames(
            styles.infoTable__cellValue,
            styles.infoTable__cellValueCopy,
          )}
          onClick={() => copyToClipboard(vaultInfo.fractionMint)}
        >
          {shortenAddress(vaultInfo.fractionMint)}
          <Tooltip
            placement="bottom"
            trigger="hover"
            overlay="Click to copy to clipboard"
          >
            <CopyClipboardIcon className={styles.copyIcon} width={24} />
          </Tooltip>
        </p>
      </div>
    </div>
  );
};
