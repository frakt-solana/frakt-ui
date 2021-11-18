import styles from './styles.module.scss';

const Error = (): JSX.Element => {
  return (
    <div className={styles.error}>
      <span>An error has occurred, please try again</span>
    </div>
  );
};

export default Error;
