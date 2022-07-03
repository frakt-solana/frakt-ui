import { FC, ReactNode } from 'react';
import classNames from 'classnames';

import styles from './Block.module.scss';

interface BlockProps {
  className?: string;
  children: ReactNode;
  title?: string;
}

const Block: FC<BlockProps> = ({ children, className }) => {
  return <div className={classNames(styles.block, className)}>{children}</div>;
};

export default Block;
