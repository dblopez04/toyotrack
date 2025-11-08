import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Car } from '../data/cars';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CarCardProps {
  car: Car;
  isSaved: boolean;
  onToggleSave: (carId: string) => void;
}

export function CarCard({ car, isSaved, onToggleSave }: CarCardProps) {
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex-shrink-0 w-[400px]">
      <div className="relative">
        <ImageWithFallback
          src={car.image}
          alt={car.name}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={() => onToggleSave(car.id)}
        >
          <Heart
            className={`h-5 w-5 ${
              isSaved ? 'fill-[#eb0a1e] text-[#eb0a1e]' : 'text-gray-600'
            }`}
          />
        </Button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="mb-1">{car.name}</h3>
            <p className="text-[#eb0a1e]">{formatPrice(car.price)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2 py-1 rounded text-sm ${getFuelTypeBadge(car.fuelType)}`}>
            {car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1)}
          </span>
          <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-800">
            {car.type}
          </span>
          {car.isTRD && (
            <span className="px-2 py-1 rounded text-sm bg-[#eb0a1e] text-white">
              TRD Series
            </span>
          )}
        </div>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          {car.specs.mpg && <p>• {car.specs.mpg}</p>}
          {car.specs.engine && <p>• {car.specs.engine}</p>}
          {car.specs.horsepower && <p>• {car.specs.horsepower}</p>}
          {car.specs.seating && <p>• {car.specs.seating}</p>}
        </div>

        <div className="flex gap-2">
          {car.financeOptions.includes('lease') && (
            <span className="text-sm text-gray-600">Lease Available</span>
          )}
          {car.financeOptions.includes('finance') && (
            <span className="text-sm text-gray-600">
              {car.financeOptions.includes('lease') ? '•' : ''} Finance Available
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
