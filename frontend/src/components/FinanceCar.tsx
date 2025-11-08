import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { cars } from '../data/cars';
import { CarCard } from './CarCard';
import { FilterDialog, FilterState } from './FilterDialog';

interface FinanceCarProps {
  savedCars: string[];
  onToggleSave: (carId: string) => void;
}

export function FinanceCar({ savedCars, onToggleSave }: FinanceCarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000],
    categories: [],
    fuelTypes: [],
    financeOptions: [],
    trdOnly: false,
  });

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Search query
      if (
        searchQuery &&
        !car.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Price range
      if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) {
        return false;
      }

      // Categories
      if (filters.categories.length > 0 && !filters.categories.includes(car.category)) {
        return false;
      }

      // Fuel types
      if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuelType)) {
        return false;
      }

      // Finance options
      if (filters.financeOptions.length > 0) {
        const hasOption = filters.financeOptions.some((option) =>
          car.financeOptions.includes(option)
        );
        if (!hasOption) return false;
      }

      // TRD only
      if (filters.trdOnly && !car.isTRD) {
        return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8">Finance a Car</h1>

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for a Toyota model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <FilterDialog filters={filters} onApplyFilters={setFilters} />
        </div>

        <div className="mb-4 text-gray-600">
          Showing {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'}
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                isSaved={savedCars.includes(car.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No vehicles found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
