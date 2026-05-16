import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Banner.module.css';

interface BannerProps {
  title?: string;
}

const Banner: React.FC<BannerProps> = ({ title = 'Title' }) => {
  return (
    <Link to=".">
      <div className={styles.banner} id="banner">
        <h1>{title}</h1>
      </div>
    </Link>
  );
};

export default Banner;
