import { useState, useEffect } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Car } from '../data/cars';
import { ImageWithFallback } from './figma/ImageWithFallback';
import financeService from '../services/finance';
import { getErrorMessage } from '../services/api';

interface CreditTierData {
  tier: string;
  apr: number;
  aprPercent: string;
}

interface CarDetailsProps {
  car: Car;
  isSaved: boolean;
  onToggleSave: (carId: string) => void;
  onBack: () => void;
}

// Fallback APR rates (in case API fails)
const FALLBACK_APR_BY_TIER = {
  excellent: 0.049,
  good: 0.069,
  fair: 0.099,
  poor: 0.149,
};

// Residual value percentages by lease term
const RESIDUAL_BY_TERM: { [key: number]: number } = {
  24: 0.65,
  36: 0.60,
  48: 0.55,
};

type CreditTier = 'excellent' | 'good' | 'fair' | 'poor';

export function CarDetails({ car, isSaved, onToggleSave, onBack }: CarDetailsProps) {
  const [financeType, setFinanceType] = useState<'finance' | 'lease'>('finance');
  const [downPayment, setDownPayment] = useState(5000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [creditTier, setCreditTier] = useState<CreditTier>('good');
  const [creditTiers, setCreditTiers] = useState<CreditTierData[]>([]);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);
  interface CreditTier {
    toLowerCase(): unknown;
    apr: number;
    aprPercent: string;
  }
  // Fetch credit tiers on mount
  useEffect(() => {
    const fetchCreditTiers = async () => {
      setIsLoadingRates(true);
      setRatesError(null);
      try {
        const data = await financeService.getCreditTiers();
        setCreditTiers(data);
      } catch (err) {
        setRatesError(getErrorMessage(err));
        console.error('Failed to load credit tiers, using fallback values:', err);
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchCreditTiers();
  }, []);

  // Get APR for current credit tier from API or fallback
  const getAPR = (): number => {
    if (creditTiers.length > 0) {
      const tierData = creditTiers.find(
        t => t.tier.toLowerCase() === creditTier.toLowerCase()
      );
      if (tierData) return tierData.apr; // Already in decimal format
    }
    return FALLBACK_APR_BY_TIER[creditTier];
  };
  
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

  // Calculate monthly payment for financing
  const calculateFinancePayment = () => {
    const principle = car.price - downPayment;
    const apr = getAPR();
    const monthlyRate = apr / 12;
    const months = loanTerm;

    if (principle <= 0) return 0;

    const monthlyPayment = (principle * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    return monthlyPayment;
  };

  // Calculate monthly payment for leasing
  const calculateLeasePayment = () => {
    const capCost = car.price - downPayment;
    const apr = getAPR();
    const monthlyRate = apr / 12;
    const residualPercent = RESIDUAL_BY_TERM[loanTerm] ?? 0.55;
    const residualValue = car.price * residualPercent;

    if (capCost <= 0) return { monthlyPayment: 0, residualValue: 0 };

    const depreciationMonthly = (capCost - residualValue) / loanTerm;
    const financeMonthly = (capCost + residualValue) * monthlyRate;
    const monthlyPayment = depreciationMonthly + financeMonthly;

    return { monthlyPayment, residualValue };
  };

  const isFinance = financeType === 'finance';
  const monthlyPayment = isFinance
    ? calculateFinancePayment()
    : calculateLeasePayment().monthlyPayment;

  const leaseDetails = !isFinance ? calculateLeasePayment() : null;
  const totalAmount = isFinance ? monthlyPayment * loanTerm : 0;
  const totalInterest = isFinance ? totalAmount - (car.price - downPayment) : 0;
  const dueAtSigning = isFinance ? downPayment : downPayment + monthlyPayment + 500; // Adding $500 lease fees
  const apr = getAPR();

  // Finance supports all terms, lease typically shorter
  const loanTermOptions = isFinance ? [24, 36, 48, 60, 72] : [24, 36, 48];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to All Cars
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Car details */}
        <div>
          <Card className="overflow-hidden">
            <div className="relative">
              <ImageWithFallback
                src={car.image}
                alt={car.name}
                className="w-full h-96 object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                onClick={() => onToggleSave(car.id)}
              >
                <Heart
                  className={`h-6 w-6 ${
                    isSaved ? 'fill-[#eb0a1e] text-[#eb0a1e]' : 'text-gray-600'
                  }`}
                />
              </Button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h1 className="mb-2">{car.name}</h1>
                <p className="text-[#eb0a1e] text-2xl">{formatPrice(car.price)}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
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

              <div className="space-y-4">
                <h3 className="text-gray-900">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {car.specs.mpg && (
                    <div>
                      <p className="text-sm text-gray-600">Fuel Economy</p>
                      <p className="text-gray-900">{car.specs.mpg}</p>
                    </div>
                  )}
                  {car.specs.engine && (
                    <div>
                      <p className="text-sm text-gray-600">Engine</p>
                      <p className="text-gray-900">{car.specs.engine}</p>
                    </div>
                  )}
                  {car.specs.horsepower && (
                    <div>
                      <p className="text-sm text-gray-600">Horsepower</p>
                      <p className="text-gray-900">{car.specs.horsepower}</p>
                    </div>
                  )}
                  {car.specs.seating && (
                    <div>
                      <p className="text-sm text-gray-600">Seating</p>
                      <p className="text-gray-900">{car.specs.seating}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-gray-900 mb-2">Finance Options</h3>
                <div className="flex gap-4 text-sm text-gray-600">
                  {car.financeOptions.includes('lease') && (
                    <span>✓ Lease Available</span>
                  )}
                  {car.financeOptions.includes('finance') && (
                    <span>✓ Finance Available</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column - Finance calculator */}
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="mb-6 text-gray-900">Payment Calculator</h2>

            {/* Finance Type Selection */}
            <div className="mb-6">
              <Tabs value={financeType} onValueChange={(v: string) => setFinanceType(v as 'finance' | 'lease')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="finance">Finance</TabsTrigger>
                  <TabsTrigger value="lease">Lease</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Credit Score Tier */}
            <div className="mb-6">
              <Label htmlFor="creditTier" className="mb-2 block">
                Credit Score Tier
              </Label>
              <Select value={creditTier} onValueChange={(v: string) => setCreditTier(v as unknown as CreditTier)}>
                <SelectTrigger id="creditTier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent (720+) - {(FALLBACK_APR_BY_TIER.excellent * 100).toFixed(1)}% APR</SelectItem>
                  <SelectItem value="good">Good (680-719) - {(FALLBACK_APR_BY_TIER.good * 100).toFixed(1)}% APR</SelectItem>
                  <SelectItem value="fair">Fair (640-679) - {(FALLBACK_APR_BY_TIER.fair * 100).toFixed(1)}% APR</SelectItem>
                  <SelectItem value="poor">Poor (Below 640) - {(FALLBACK_APR_BY_TIER.poor * 100).toFixed(1)}% APR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Down Payment */}
            <div className="mb-6">
              <Label htmlFor="downPayment" className="mb-2 block">
                {isFinance ? 'Down Payment' : 'Cash Down'}
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Math.max(0, Math.min(car.price, Number(e.target.value))))}
                  min={0}
                  max={car.price}
                  step={500}
                  className="flex-1"
                />
                <span className="text-gray-600 min-w-[100px]">{formatPrice(downPayment)}</span>
              </div>
              <input
                type="range"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                min={0}
                max={car.price}
                step={500}
                className="w-full mt-2"
              />
            </div>

            {/* Loan Term */}
            <div className="mb-6">
              <Label className="mb-3 block">Term Length (Months)</Label>
              <div className={`grid gap-2 ${loanTermOptions.length === 5 ? 'grid-cols-5' : 'grid-cols-3'}`}>
                {loanTermOptions.map((term) => (
                  <Button
                    key={term}
                    variant={loanTerm === term ? 'default' : 'outline'}
                    onClick={() => setLoanTerm(term)}
                    className={loanTerm === term ? 'bg-[#eb0a1e] hover:bg-[#c00818]' : ''}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>

            {/* Calculation Results */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vehicle Price (MSRP)</span>
                <span className="text-gray-900">{formatPrice(car.price)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{isFinance ? 'Down Payment' : 'Cash Down'}</span>
                <span className="text-gray-900">-{formatPrice(downPayment)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Est. APR</span>
                <span className="text-gray-900">{(apr * 100).toFixed(1)}%</span>
              </div>
              
              {isFinance ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount Financed</span>
                    <span className="text-gray-900">{formatPrice(car.price - downPayment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Interest</span>
                    <span className="text-gray-900">{formatPrice(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-gray-900">{formatPrice(totalAmount + downPayment)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Residual Value (End of Lease)</span>
                    <span className="text-gray-900">{formatPrice(leaseDetails?.residualValue ?? 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Acquisition Fee</span>
                    <span className="text-gray-900">{formatPrice(500)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Monthly Payment - Featured */}
            <div className="mt-6 p-6 bg-gray-50 rounded-lg space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Estimated Monthly Payment</p>
                <p className="text-3xl text-[#eb0a1e]">{formatPrice(monthlyPayment)}<span className="text-lg text-gray-600">/mo</span></p>
                <p className="text-sm text-gray-600 mt-2">for {loanTerm} months</p>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Due at Signing</span>
                  <span className="text-gray-900">{formatPrice(dueAtSigning)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {isFinance ? 'Down payment' : 'Cash down + first payment + fees'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}