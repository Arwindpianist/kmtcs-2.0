// app/services/page.tsx
import { fetchServices } from '@/app/services/googleSheetService';
import ServiceCard from '@/app/components/ServiceCard';
import FilterButtons from '@/app/components/FilterButtons';
import BackgroundLines from '../components/BackgroundLines';

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const services = await fetchServices();
  const selectedType = searchParams?.type || 'All';
  const searchTerm = searchParams?.search || '';

  const filteredServices = services.filter(service => {
    const matchesType = selectedType === 'All' || service.type === selectedType;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || service.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      
      {/* Combined Search and Filters Container */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6 relative z-50">
        <FilterButtons 
          types={['All', 'Technical', 'Non-Technical', 'Consulting']}
          selectedType={selectedType}
        />
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <form className="flex gap-2">
            <input
              type="text"
              name="search"
              placeholder="Search services..."
              className="w-full bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={searchTerm}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-800/20 backdrop-filter backdrop-blur-lg text-blue-700 rounded-lg hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>

      </div>

      <BackgroundLines />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-50">
        {filteredServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No services found matching your criteria
        </div>
      )}
    </div>
  );
}