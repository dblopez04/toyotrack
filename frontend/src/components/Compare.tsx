import { useState, useEffect } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Car } from '../data/cars';
import { ImageWithFallback } from './figma/ImageWithFallback';
import vehicleService, { ExtraFeature } from '../services/vehicle';

interface CompareProps {
  cars: [Car, Car];
  savedCars: string[];
  onToggleSave: (carId: string) => void;
  onBack: () => void;
  onViewDetails: (carId: string) => void;
}

export function Compare({ cars, savedCars, onToggleSave, onBack, onViewDetails }: CompareProps) {
  const [car1, car2] = cars;
  const [car1Features, setCar1Features] = useState<ExtraFeature[]>([]);
  const [car2Features, setCar2Features] = useState<ExtraFeature[]>([]);
  const [loadingFeatures, setLoadingFeatures] = useState(false);

  // Fetch features when vehicles have the same category
  useEffect(() => {
    const fetchFeatures = async () => {
      if (car1.category === car2.category) {
        setLoadingFeatures(true);
        try {
          const [features1, features2] = await Promise.all([
            vehicleService.getVehicleFeatures(parseInt(car1.id)),
            vehicleService.getVehicleFeatures(parseInt(car2.id))
          ]);
          setCar1Features(features1);
          setCar2Features(features2);
        } catch (err) {
          console.error('Failed to load vehicle features:', err);
        } finally {
          setLoadingFeatures(false);
        }
      }
    };

    fetchFeatures();
  }, [car1.id, car2.id, car1.category, car2.category]);

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
              label="Trim"
              value1={car1.type}
              value2={car2.type}
            />
            <ComparisonRow
              label="Category"
              value1={car1.category.charAt(0).toUpperCase() + car1.category.slice(1)}
              value2={car2.category.charAt(0).toUpperCase() + car2.category.slice(1)}
            />
            <ComparisonRow
              label="Fuel Type"
              value1={car1.fuelType.charAt(0).toUpperCase() + car1.fuelType.slice(1)}
              value2={car2.fuelType.charAt(0).toUpperCase() + car2.fuelType.slice(1)}
            />
          </div>

          {/* Features Comparison (when same category) - Grouped by Category */}
          {car1.category === car2.category && (car1Features.length > 0 || car2Features.length > 0) && !loadingFeatures && (() => {
            // Group features by category
            const categoriesMap = new Map<string, Set<string>>();

            car1Features.forEach((f: ExtraFeature) => {
              if (!categoriesMap.has(f.category)) {
                categoriesMap.set(f.category, new Set());
              }
              categoriesMap.get(f.category)!.add(f.featureName);
            });

            car2Features.forEach((f: ExtraFeature) => {
              if (!categoriesMap.has(f.category)) {
                categoriesMap.set(f.category, new Set());
              }
              categoriesMap.get(f.category)!.add(f.featureName);
            });

            return Array.from(categoriesMap.entries()).sort(([catA], [catB]) => catA.localeCompare(catB)).map(([category, featureNames]) => (
              <div key={category} className="mt-6">
                <h3 className="text-gray-900 mb-3">{category}</h3>
                {Array.from(featureNames).sort().map((featureName: string) => {
                  const car1HasFeature = car1Features.some((f: ExtraFeature) => f.featureName === featureName);
                  const car2HasFeature = car2Features.some((f: ExtraFeature) => f.featureName === featureName);

                  return (
                    <div key={`${category}-${featureName}`}>
                      <ComparisonRow
                        label={featureName}
                        value1={car1HasFeature ? '✓ Yes' : 'No'}
                        value2={car2HasFeature ? '✓ Yes' : 'No'}
                      />
                    </div>
                  );
                })}
              </div>
            ));
          })()}

          {/* Loading Features */}
          {car1.category === car2.category && loadingFeatures && (
            <div className="mt-6">
              <h3 className="text-gray-900 mb-3">
                Features Comparison
                <span className="text-sm text-gray-500 ml-2">(Loading...)</span>
              </h3>
            </div>
          )}

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
