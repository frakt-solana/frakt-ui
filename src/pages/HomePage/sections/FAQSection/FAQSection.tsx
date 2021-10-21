import classNames from 'classnames/bind';

import styles from './styles.module.scss';

interface FAQSectionProps {
  className?: string;
}

const FAQSection = ({ className }: FAQSectionProps): JSX.Element => {
  return (
    <div className={classNames([styles.faq, className])}>
      <h2 className={styles.title}>Frequently asked questions</h2>
      <div className={styles.tab}>
        <input type="checkbox" id="tab1" />
        <label className={styles.tabLabel} htmlFor="tab1">
          Who is the custodian of a vault?
        </label>
        <div className={styles.tabContent}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum,
          reiciendis!
        </div>
      </div>

      <div className={styles.tab}>
        <input type="checkbox" id="tab2" />
        <label className={styles.tabLabel} htmlFor="tab2">
          What are the curator fees?
        </label>
        <div className={styles.tabContent}>
          Curator fees are similar to an asset under management fee. Annually, a
          curator will earn a percentage of the total ownership token supply.
          These fees are set by the vault’s curator, but restricted by
          governance to prevent inordinately high fees.
        </div>
      </div>

      <div className={styles.tab}>
        <input type="checkbox" id="tab3" />
        <label className={styles.tabLabel} htmlFor="tab3">
          What is the reserve price?
        </label>
        <div className={styles.tabContent}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum,
          reiciendis!
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
