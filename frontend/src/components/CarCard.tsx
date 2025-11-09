import { Heart, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Car } from '../data/cars';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CarCardProps {
  car: Car;
  isSaved: boolean;
  onToggleSave: (carId: string) => void;
  onViewDetails?: (carId: string) => void;
  compareMode?: boolean;
  isSelectedForCompare?: boolean;
  onToggleCompareSelection?: (carId: string) => void;
}

export function CarCard({ 
  car, 
  isSaved, 
  onToggleSave, 
  onViewDetails,
  compareMode = false,
  isSelectedForCompare = false,
  onToggleCompareSelection
}: CarCardProps) {
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

  const handleCardClick = () => {
    if (compareMode && onToggleCompareSelection) {
      onToggleCompareSelection(car.id);
    } else {
      onViewDetails?.(car.id);
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all w-full ${
      compareMode ? 'cursor-pointer' : ''
    } ${isSelectedForCompare ? 'ring-2 ring-[#eb0a1e]' : ''}`}>
      <div 
        className="relative cursor-pointer"
        onClick={handleCardClick}
      >
        <ImageWithFallback
          src={car.image}
          alt={car.name}
          className="w-full h-48 object-cover"
        />
        {compareMode && isSelectedForCompare && (
          <div className="absolute top-2 left-2 bg-[#eb0a1e] text-white rounded-full p-2">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        )}
        {!compareMode && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(car.id);
            }}
          >
            <Heart
              className={`h-5 w-5 ${
                isSaved ? 'fill-[#eb0a1e] text-[#eb0a1e]' : 'text-gray-600'
              }`}
            />
          </Button>
        )}
      </div>

      <div 
        className="p-4 cursor-pointer"
        onClick={handleCardClick}
      >
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