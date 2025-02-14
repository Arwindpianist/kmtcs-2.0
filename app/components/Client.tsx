import React from 'react';
import ClientCarousel from './ClientCarousel';

const Client: React.FC = () => {
    return (
        <section className=" bg-white">
            <div className="client-section">
                <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">Our Clients</h2>
                <ClientCarousel />
            </div>
        </section>
    );
};

export default Client;
