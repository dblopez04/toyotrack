import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { SlidersHorizontal } from 'lucide-react';

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  fuelTypes: string[];
  financeOptions: string[];
  trdOnly: boolean;
}

interface FilterDialogProps {
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

export function FilterDialog({ filters, onApplyFilters }: FilterDialogProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onApplyFilters(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      priceRange: [0, 100000],
      categories: [],
      fuelTypes: [],
      financeOptions: [],
      trdOnly: false,
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    setOpen(false);
  };

  const toggleCategory = (category: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const toggleFuelType = (fuelType: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      fuelTypes: prev.fuelTypes.includes(fuelType)
        ? prev.fuelTypes.filter((f) => f !== fuelType)
        : [...prev.fuelTypes, fuelType],
    }));
  };

  const toggleFinanceOption = (option: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      financeOptions: prev.financeOptions.includes(option)
        ? prev.financeOptions.filter((o) => o !== option)
        : [...prev.financeOptions, option],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Set Preferences
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Preferences</DialogTitle>
          <DialogDescription>
            Set your preferences to find the perfect Toyota vehicle
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Price Range */}
          <div>
            <Label>
              Price Range: ${localFilters.priceRange[0].toLocaleString()} - $
              {localFilters.priceRange[1].toLocaleString()}
            </Label>
            <Slider
              min={0}
              max={100000}
              step={1000}
              value={localFilters.priceRange}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  priceRange: value as [number, number],
                }))
              }
              className="mt-2"
            />
          </div>

          {/* Car Type */}
          <div>
            <Label className="mb-3 block">Car Type</Label>
            <div className="space-y-2">
              {['car', 'suv', 'minivan', 'truck'].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={localFilters.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label htmlFor={category} className="text-sm cursor-pointer">
                    {category === 'car'
                      ? 'Cars / Sedans / Coupes'
                      : category === 'suv'
                      ? 'SUVs & Crossovers'
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <Label className="mb-3 block">Fuel Type</Label>
            <div className="space-y-2">
              {['gas', 'hybrid', 'electric', 'hydrogen'].map((fuelType) => (
                <div key={fuelType} className="flex items-center space-x-2">
                  <Checkbox
                    id={fuelType}
                    checked={localFilters.fuelTypes.includes(fuelType)}
                    onCheckedChange={() => toggleFuelType(fuelType)}
                  />
                  <label htmlFor={fuelType} className="text-sm cursor-pointer">
                    {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Finance Options */}
          <div>
            <Label className="mb-3 block">Finance Options</Label>
            <div className="space-y-2">
              {['lease', 'finance'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={localFilters.financeOptions.includes(option)}
                    onCheckedChange={() => toggleFinanceOption(option)}
                  />
                  <label htmlFor={option} className="text-sm cursor-pointer">
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* TRD Series */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="trd"
              checked={localFilters.trdOnly}
              onCheckedChange={(checked) =>
                setLocalFilters((prev) => ({ ...prev, trdOnly: !!checked }))
              }
            />
            <label htmlFor="trd" className="text-sm cursor-pointer">
              TRD Series Only
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-[#eb0a1e] hover:bg-[#c4091a]"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
