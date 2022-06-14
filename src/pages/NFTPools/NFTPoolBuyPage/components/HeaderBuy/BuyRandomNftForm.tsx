import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Select } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from '@solana/spl-token-registry';
import { web3 } from '@frakt-protocol/frakt-sdk';

import styles from './HeaderBuy.module.scss';
import { ArrowDownBtn, SolanaIcon } from '../../../../../icons';
import { useNativeAccount } from '../../../../../utils/accounts';
import Button from '../../../../../components/Button';
import { SlippageDropdown } from '../../../components/ModalParts';
import { commonActions } from '../../../../../state/common/actions';

const { Option } = Select;

interface BuyRandomNftFormProps {
  onBuy: (needSwap?: boolean) => void;
  poolTokenAvailable: boolean;
  poolTokenInfo: TokenInfo;
  poolTokenPrice: string;
  slippage: number;
  setSlippage: (nextValue: number) => void;
}

enum Token {
  SOL = 'sol',
  POOL_TOKEN = 'poolToken',
}

export const BuyRandomNftForm: FC<BuyRandomNftFormProps> = ({
  onBuy,
  poolTokenAvailable,
  poolTokenInfo,
  poolTokenPrice,
  slippage,
  setSlippage,
}) => {
  const dispatch = useDispatch();
  const poolTokenPriceSOL = parseFloat(poolTokenPrice);

  const { connected } = useWallet();
  const { account } = useNativeAccount();

  const solBalance = (account?.lamports || 0) / web3.LAMPORTS_PER_SOL;

  const [isSlippageVisible, setIsSlippageVisible] = useState<boolean>(false);

  const settingsRef = useRef();

  const [token, setToken] = useState<Token>(Token.SOL);

  useEffect(() => {
    poolTokenAvailable && setToken(Token.POOL_TOKEN);
  }, [poolTokenAvailable]);

  const price = token === Token.SOL ? poolTokenPriceSOL.toFixed(3) : '1.000';

  const slippageText =
    token === Token.SOL
      ? `* Max total (with slippage) = ${(
          poolTokenPriceSOL *
          (1 + slippage / 100)
        ).toFixed(3)} SOL`
      : '';

  const isBtnDisabled =
    (token === Token.POOL_TOKEN && !poolTokenAvailable) ||
    (token === Token.SOL && solBalance < poolTokenPriceSOL);

  const poolImage = poolTokenInfo?.logoURI;

  return (
    <div className={styles.buyWrapper}>
      <img src={poolImage} alt="Pool image" className={styles.poolBgImage} />
      <div className={styles.buySettings}>
        <div className={styles.settingsWrapper}>
          {token === Token.SOL && (
            <>
              <SlippageDropdown
                slippage={slippage.toString()}
                setSlippage={(slippage) => setSlippage(parseFloat(slippage))}
                isSlippageDropdpwnVisible={isSlippageVisible}
                setIsSlippageDropdpwnVisible={setIsSlippageVisible}
                posRight
              />
              <div className={styles.separator} />
            </>
          )}
          <p className={styles.randomNFTsPrice}>{price}</p>
          <div className={styles.separator} />
          <div className={styles.selectWrapper} ref={settingsRef}>
            {poolTokenAvailable ? (
              <Select
                value={token}
                className={styles.select}
                suffixIcon={<ArrowDownBtn />}
                dropdownClassName={styles.dropdown}
                getPopupContainer={() => settingsRef.current}
                onChange={(nextValue) => setToken(nextValue)}
              >
                <Option value={Token.POOL_TOKEN} className={styles.option}>
                  <div
                    className={styles.tokenIcon}
                    style={{
                      backgroundImage: `url(${poolTokenInfo?.logoURI})`,
                    }}
                  />
                  <span className={styles.tokenText}>
                    {poolTokenInfo?.symbol}
                  </span>
                </Option>
                <Option value={Token.SOL} className={styles.option}>
                  <SolanaIcon />
                  <span className={styles.tokenText}>SOL</span>
                </Option>
              </Select>
            ) : (
              <div className={styles.option}>
                <SolanaIcon />
                <span className={styles.tokenText}>SOL</span>
              </div>
            )}
          </div>
        </div>
        <p className={styles.slippageInfo}>{slippageText}</p>
      </div>
      <Button
        type="alternative"
        className={styles.buyButton}
        onClick={
          connected
            ? () => onBuy(token === Token.SOL)
            : (arg) =>
                dispatch(commonActions.setWalletModal({ isVisible: arg }))
        }
        disabled={connected && isBtnDisabled}
      >
        {connected ? 'Buy' : 'Connect wallet'}
      </Button>
    </div>
  );
};
