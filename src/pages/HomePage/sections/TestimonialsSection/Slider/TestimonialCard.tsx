import { FC } from 'react';
import styles from './Slider.module.scss';

interface TestimonialCardProps {
  imageSrc: string;
  name: string;
  organisation: string;
  text: string;
}

export const TestimonialCard: FC<TestimonialCardProps> = ({
  imageSrc,
  name,
  organisation,
  text,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.photoWrapper}>
          <img src={imageSrc} alt="" className={styles.photo} />
        </div>
        <div className={styles.info}>
          <p className={styles.name}>{name}</p>
          <p className={styles.organisation}>{organisation}</p>
        </div>
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  );
};
