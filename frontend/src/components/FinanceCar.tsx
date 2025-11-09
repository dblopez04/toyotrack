import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, ArrowRightLeft } from 'lucide-react';
import { cars } from '../data/cars';
import { CarCard } from './CarCard';
import { FilterDialog, FilterState } from './FilterDialog';

interface FinanceCarProps {
  savedCars: string[];
  onToggleSave: (carId: string) => void;
  onViewDetails?: (carId: string) => void;
  onCompare?: (carIds: [string, string]) => void;
}

export function FinanceCar({ savedCars, onToggleSave, onViewDetails, onCompare }: FinanceCarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
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

  const handleToggleCompareSelection = (carId: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(carId)) {
        return prev.filter((id) => id !== carId);
      } else if (prev.length < 2) {
        return [...prev, carId];
      } else {
        // Replace the first selected item if already 2 selected
        return [prev[1], carId];
      }
    });
  };

  const handleStartCompare = () => {
    if (selectedForCompare.length === 2 && onCompare) {
      onCompare(selectedForCompare as [string, string]);
    }
  };

  const handleCancelCompare = () => {
    setCompareMode(false);
    setSelectedForCompare([]);
  };

  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1>Finance a Car</h1>
          {!compareMode ? (
            <Button
              variant="outline"
              onClick={() => setCompareMode(true)}
              className="gap-2"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Compare Vehicles
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancelCompare}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartCompare}
                disabled={selectedForCompare.length !== 2}
                className="bg-[#eb0a1e] hover:bg-[#c4091a] disabled:bg-gray-300"
              >
                Compare ({selectedForCompare.length}/2)
              </Button>
            </div>
          )}
        </div>

        {compareMode && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900">
              Select 2 vehicles to compare. {selectedForCompare.length === 0 && 'Click on any vehicle to select it.'}
              {selectedForCompare.length === 1 && 'Select one more vehicle.'}
              {selectedForCompare.length === 2 && 'Click "Compare" to view side-by-side comparison.'}
            </p>
          </div>
        )}

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              isSaved={savedCars.includes(car.id)}
              onToggleSave={onToggleSave}
              onViewDetails={compareMode ? undefined : onViewDetails}
              compareMode={compareMode}
              isSelectedForCompare={selectedForCompare.includes(car.id)}
              onToggleCompareSelection={compareMode ? handleToggleCompareSelection : undefined}
            />
          ))}
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