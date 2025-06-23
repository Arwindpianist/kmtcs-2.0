import Image from 'next/image';

interface ClientProps {
  name: string;
  logo: string;
}

const Client = ({ name, logo }: ClientProps) => {
  return (
    <div className="flex justify-center items-center h-24">
      <div className="relative h-16 w-32 grayscale hover:grayscale-0 transition-all duration-300">
        <Image
          src={logo}
          alt={name}
          layout="fill"
          objectFit="contain"
        />
      </div>
    </div>
  );
};

export default Client;
