import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Car } from '../data/cars';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CompareProps {
  cars: [Car, Car];
  savedCars: string[];
  onToggleSave: (carId: string) => void;
  onBack: () => void;
  onViewDetails: (carId: string) => void;
}

export function Compare({ cars, savedCars, onToggleSave, onBack, onViewDetails }: CompareProps) {
  const [car1, car2] = cars;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getFuelTypeBadge = (fuelType: string) => {
    const colors = {
      gas: 'bg-gray-100 text-gray-800',
      hybrid: 'bg-green-100 text-green-800',
      electric: 'bg-blue-100 text-blue-800',
      hydrogen: 'bg-purple-100 text-purple-800',
    };
    return colors[fuelType as keyof typeof colors] || colors.gas;
  };

  const ComparisonRow = ({ label, value1, value2, highlight = false }: { 
    label: string; 
    value1: string | number; 
    value2: string | number;
    highlight?: boolean;
  }) => {
    const v1Str = String(value1);
    const v2Str = String(value2);
    const isDifferent = v1Str !== v2Str;
    
    return (
      <div className={`grid grid-cols-3 gap-4 py-3 border-b ${highlight ? 'bg-gray-50' : ''}`}>
        <div className="text-gray-600">{label}</div>
        <div className={`text-center ${isDifferent ? 'text-gray-900' : 'text-gray-600'}`}>
          {value1}
        </div>
        <div className={`text-center ${isDifferent ? 'text-gray-900' : 'text-gray-600'}`}>
          {value2}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Cars
        </Button>

        <h1 className="mb-8">Compare Vehicles</h1>

        {/* Vehicle Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {[car1, car2].map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <div className="relative">
                <ImageWithFallback
                  src={car.image}
                  alt={car.name}
                  className="w-full h-64 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                  onClick={() => onToggleSave(car.id)}
                >
                  <Heart
                    className={`h-6 w-6 ${
                      savedCars.includes(car.id) ? 'fill-[#eb0a1e] text-[#eb0a1e]' : 'text-gray-600'
                    }`}
                  />
                </Button>
              </div>
              <div className="p-6">
                <h2 className="mb-2 text-gray-900">{car.name}</h2>
                <p className="text-[#eb0a1e] text-2xl mb-4">{formatPrice(car.price)}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded ${getFuelTypeBadge(car.fuelType)}`}>
                    {car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1)}
                  </span>
                  <span className="px-3 py-1 rounded bg-gray-100 text-gray-800">
                    {car.type}
                  </span>
                  {car.isTRD && (
                    <span className="px-3 py-1 rounded bg-[#eb0a1e] text-white">
                      TRD Series
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => onViewDetails(car.id)}
                  className="w-full"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <Card className="p-6">
          <h2 className="mb-6 text-gray-900">Specifications Comparison</h2>

          {/* Header Row */}
          <div className="grid grid-cols-3 gap-4 pb-4 border-b-2">
            <div></div>
            <div className="text-center">
              <p className="text-gray-900">{car1.name}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-900">{car2.name}</p>
            </div>
          </div>

          {/* Price & Basic Info */}
          <div className="mt-4">
            <h3 className="text-gray-900 mb-3">Pricing</h3>
            <ComparisonRow 
              label="MSRP" 
              value1={formatPrice(car1.price)} 
              value2={formatPrice(car2.price)} 
            />
            <ComparisonRow 
              label="Price Difference" 
              value1={car1.price < car2.price ? '✓ Lower' : car1.price > car2.price ? 'Higher' : 'Same'} 
              value2={car2.price < car1.price ? '✓ Lower' : car2.price > car1.price ? 'Higher' : 'Same'} 
            />
          </div>

          {/* Vehicle Type & Fuel */}
          <div className="mt-6">
            <h3 className="text-gray-900 mb-3">Vehicle Information</h3>
            <ComparisonRow 
              label="Type" 
              value1={car1.type} 
              value2={car2.type} 
            />
            <ComparisonRow 
              label="Fuel Type" 
              value1={car1.fuelType.charAt(0).toUpperCase() + car1.fuelType.slice(1)} 
              value2={car2.fuelType.charAt(0).toUpperCase() + car2.fuelType.slice(1)} 
            />
            <ComparisonRow 
              label="Category" 
              value1={car1.category} 
              value2={car2.category} 
            />
            <ComparisonRow 
              label="TRD Series" 
              value1={car1.isTRD ? 'Yes' : 'No'} 
              value2={car2.isTRD ? 'Yes' : 'No'} 
            />
          </div>

          {/* Specifications */}
          <div className="mt-6">
            <h3 className="text-gray-900 mb-3">Performance & Specifications</h3>
            <ComparisonRow 
              label="Engine" 
              value1={car1.specs.engine || 'N/A'} 
              value2={car2.specs.engine || 'N/A'} 
            />
            <ComparisonRow 
              label="Horsepower" 
              value1={car1.specs.horsepower || 'N/A'} 
              value2={car2.specs.horsepower || 'N/A'} 
            />
            <ComparisonRow 
              label="Fuel Economy" 
              value1={car1.specs.mpg || 'N/A'} 
              value2={car2.specs.mpg || 'N/A'} 
            />
            <ComparisonRow 
              label="Seating Capacity" 
              value1={car1.specs.seating || 'N/A'} 
              value2={car2.specs.seating || 'N/A'} 
            />
          </div>

          {/* Finance Options */}
          <div className="mt-6">
            <h3 className="text-gray-900 mb-3">Finance Options</h3>
            <ComparisonRow 
              label="Financing Available" 
              value1={car1.financeOptions.includes('finance') ? 'Yes' : 'No'} 
              value2={car2.financeOptions.includes('finance') ? 'Yes' : 'No'} 
            />
            <ComparisonRow 
              label="Leasing Available" 
              value1={car1.financeOptions.includes('lease') ? 'Yes' : 'No'} 
              value2={car2.financeOptions.includes('lease') ? 'Yes' : 'No'} 
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 grid md:grid-cols-2 gap-4 pt-6 border-t">
            <Button
              className="bg-[#eb0a1e] hover:bg-[#c4091a]"
              onClick={() => onViewDetails(car1.id)}
            >
              View {car1.name} Details
            </Button>
            <Button
              className="bg-[#eb0a1e] hover:bg-[#c4091a]"
              onClick={() => onViewDetails(car2.id)}
            >
              View {car2.name} Details
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
