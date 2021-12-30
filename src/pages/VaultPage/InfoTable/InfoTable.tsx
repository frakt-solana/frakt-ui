import BN from 'bn.js';
import { shortenAddress } from '../../../utils/solanaUtils';
import fraktionConfig from '../../../contexts/fraktion/config';
import styles from './styles.module.scss';
import { copyToClipboard, decimalBNToString } from '../../../utils';
import { VaultData } from '../../../contexts/fraktion';
import CopyClipboardIcon from '../../../icons/CopyClipboardIcon';
import classNames from 'classnames';
import Tooltip from '../../../components/Tooltip';

export const InfoTable = ({
  vaultInfo,
  marketId = null,
}: {
  vaultInfo: VaultData;
  marketId?: string;
}): JSX.Element => {
  const currency =
    vaultInfo?.priceMint === fraktionConfig.SOL_TOKEN_PUBKEY ? 'SOL' : 'FRKT';

  const nftMint =
    vaultInfo.safetyBoxes.length >= 1 ? vaultInfo.safetyBoxes[0].nftMint : '';

  return (
    <div className={styles.infoTable}>
      <div className={styles.infoTable__cell}>
        <p className={styles.infoTable__cellName}>Total supply</p>
        <p className={styles.infoTable__cellValue}>
          {vaultInfo.fractionsSupply.toString().slice(0, -3)}
        </p>
      </div>
      <div className={styles.infoTable__cell}>
        <p className={styles.infoTable__cellName}>
          Locked fraktion price ({currency})
        </p>
        <p className={styles.infoTable__cellValue}>
          {decimalBNToString(
            vaultInfo.lockedPricePerShare.mul(new BN(1e3)),
            6,
            9,
          )}
        </p>
      </div>
      <div className={styles.infoTable__cell}>
        <p className={styles.infoTable__cellName}>
          Locked start bid ({currency})
        </p>
        <p className={styles.infoTable__cellValue}>
          {decimalBNToString(
            vaultInfo.lockedPricePerShare.mul(vaultInfo.fractionsSupply),
            2,
            9,
          )}
        </p>
      </div>
      <div className={styles.infoTable__cell}>
        <p className={styles.infoTable__cellName}>Market cap</p>
        <p className={styles.infoTable__cellValue}>
          {decimalBNToString(
            vaultInfo.lockedPricePerShare.mul(vaultInfo.fractionsSupply),
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
          onClick={() => copyToClipboard(nftMint)}
        >
          {shortenAddress(nftMint)}
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
      {marketId && (
        <div className={styles.infoTable__cell}>
          <p className={styles.infoTable__cellName}>Serum Market ID</p>
          <p
            className={classNames(
              styles.infoTable__cellValue,
              styles.infoTable__cellValueCopy,
            )}
            onClick={() => copyToClipboard(marketId)}
          >
            {shortenAddress(marketId)}
            <Tooltip
              placement="bottom"
              trigger="hover"
              overlay="Click to copy to clipboard"
            >
              <CopyClipboardIcon className={styles.copyIcon} width={24} />
            </Tooltip>
          </p>
        </div>
      )}
    </div>
  );
};