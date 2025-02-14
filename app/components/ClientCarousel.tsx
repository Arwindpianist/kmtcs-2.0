import React from 'react';
import Image from 'next/image';
import styles from './ClientCarousel.module.css';

const imagePaths = [
  '/client-logos/icon-offshore-berhad.jpg',
  '/client-logos/ingress.jpg',
  '/client-logos/kipis.jpg',
  '/client-logos/kjo.png',
  '/client-logos/kuwait-oil-company.png',
  '/client-logos/pca-group.png',
  '/client-logos/petronas-chemicals.png',
  '/client-logos/petronas.png',
  '/client-logos/prefchem.jpg',
  '/client-logos/proton.jpg',
  '/client-logos/sabic.png',
  '/client-logos/sarawak-energy.png',
  '/client-logos/sony.png',
  '/client-logos/suruhanjaya-tenaga.png',
  '/client-logos/telbru.png',
];

const ClientCarousel: React.FC = () => {
  const extendedImagePaths = [...imagePaths, ...imagePaths, ...imagePaths, ...imagePaths]; // Double the list to create seamless scrolling

  return (
    <div className={styles.carouselWrapper}>
      {/* Top Row */}
      <div className={styles.carouselTrack}>
        {extendedImagePaths.map((imagePath, index) => (
          <div className={styles.carouselItem} key={`top-${index}`}>
            <Image
              src={imagePath}
              alt={`Client logo ${index + 1}`}
              width={200}
              height={100}
              style={{ objectFit: 'contain' }}
            />
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className={`${styles.carouselTrack} ${styles.reverse}`}>
        {extendedImagePaths.map((imagePath, index) => (
          <div className={styles.carouselItem} key={`bottom-${index}`}>
            <Image
              src={imagePath}
              alt={`Client logo ${index + 1}`}
              width={200}
              height={100}
              style={{ objectFit: 'contain' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientCarousel;
