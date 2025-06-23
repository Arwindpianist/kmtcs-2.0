'use client';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import './ClientCarousel.module.css';
import Client from './Client';

const clients = [
  { name: 'PETRONAS', logo: '/client-logos/petronas.png' },
  { name: 'PETRONAS CHEMICALS GROUP', logo: '/client-logos/petronas-chemicals.png' },
  { name: 'KJO', logo: '/client-logos/kjo.png' },
  { name: 'ICON OFFSHORE BERHAD', logo: '/client-logos/icon-offshore-berhad.jpg' },
  { name: 'INGRESS', logo: '/client-logos/ingress.jpg' },
  { name: 'KIPIC', logo: '/client-logos/kipis.jpg' },
  { name: 'KUWAIT OIL COMPANY', logo: '/client-logos/kuwait-oil-company.png' },
  { name: 'PCA GROUP', logo: '/client-logos/pca-group.png' },
  { name: 'PREFCHEM', logo: '/client-logos/prefchem.jpg' },
  { name: 'PROTON', logo: '/client-logos/proton.jpg' },
  { name: 'SABIC', logo: '/client-logos/sabic.png' },
  { name: 'SARAWAK ENERGY', logo: '/client-logos/sarawak-energy.png' },
  { name: 'SONY', logo: '/client-logos/sony.png' },
  { name: 'SURUHANJAYA TENAGA', logo: '/client-logos/suruhanjaya-tenaga.png' },
  { name: 'TELBRU', logo: '/client-logos/telbru.png' }
];

const ClientCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Our Clients</h2>
        <Slider {...settings}>
          {clients.map((client) => (
            <div key={client.name} className="px-4">
              <Client name={client.name} logo={client.logo} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ClientCarousel;
