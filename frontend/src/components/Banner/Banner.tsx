import React from 'react';
import styles from './Banner.module.css';

interface BannerProps {
  title?: string;
}

const Banner: React.FC<BannerProps> = ({ title = "Title" }) => {
  return (
    <a href='/'>
      <div className={styles.banner} id='banner'>
          <h1>
             {title}
          </h1>
      </div>
    </a>
  );
};

export default Banner;
