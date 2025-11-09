// API Response Types

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface CarImage {
  id: number;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  vehicleId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vehicle {
  id: number;
  year: number;
  make: string;
  model: string;
  trimName: string;
  baseMsrp: number;
  baseInvoice: number;
  truck: boolean;
  electric: boolean;
  pluginElectric: boolean;
  CarImages?: CarImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleSpecs {
  mpg?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  seating?: number;
  cargo?: string;
  features?: string[];
}

export interface FinanceRate {
  id: number;
  creditTier: string;
  aprRate: number;
  term: number; // in months
  residualValue?: number; // for leases
  description?: string;
}

export interface FinanceCalculation {
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  downPayment: number;
  loanAmount: number;
  apr: number;
  term: number;
}

export interface ChatMessage {
  id?: number;
  message: string;
  response?: string;
  userId?: number;
  timestamp?: string;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
