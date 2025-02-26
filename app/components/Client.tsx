import React from 'react';
import ClientCarousel from './ClientCarousel';

const Client: React.FC = () => {
    return (
        <div className="w-full bg-white h-full flex flex-col justify-center items-center">
            <div className="client-section w-full">
                <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">Our Clients</h2>
                <ClientCarousel />
            </div>
        </div>
    );
};

export default Client;
