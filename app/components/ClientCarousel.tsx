'use client';

import Client from './Client';
import { Marquee } from '@/app/components/ui/marquee';

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
  { name: 'SARAWAK PETCHEM', logo: '/client-logos/sarawakpetchem-logo.png' },
  { name: 'SHELL MDS (M) SDN BHD', logo: '/client-logos/logo-shell-mds(m)-sdn-bhd.png' },
  { name: 'SONY', logo: '/client-logos/sony.png' },
  { name: 'SURUHANJAYA TENAGA', logo: '/client-logos/suruhanjaya-tenaga.png' },
  { name: 'TELBRU', logo: '/client-logos/telbru.png' },
  { name: 'UNION SANGYO', logo: '/client-logos/USM-Logo.png' }
];

const ClientCarousel = () => {
  const midpoint = Math.ceil(clients.length / 2);
  const topRow = clients.slice(0, midpoint);
  const bottomRow = clients.slice(midpoint);

  return (
    <section className="py-12 bg-background border-y border-border/60">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Clients</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-6">
          Trusted by global and local organizations across energy, manufacturing, and technology.
        </p>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

          <Marquee pauseOnHover className="[--duration:42s] py-1">
            {topRow.map((client) => (
              <div key={client.name} className="w-40 md:w-48">
                <Client name={client.name} logo={client.logo} />
              </div>
            ))}
          </Marquee>

          <Marquee pauseOnHover reverse className="[--duration:46s] py-1">
            {bottomRow.map((client) => (
              <div key={client.name} className="w-40 md:w-48">
                <Client name={client.name} logo={client.logo} />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default ClientCarousel;
