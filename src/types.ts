export type FuelType = 'Petrol' | 'Diesel';
export type VehicleType = 'Car' | 'Bike';

export interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  fuelType: FuelType;
  licensePlate: string;
  tankCapacity?: number;  // liters
  avgDailyKm?: number;    // km/day
}

export interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
}

export type OrderStatus = 'Pending' | 'Accepted' | 'Out for Delivery' | 'Arriving' | 'Delivered' | 'Cancelled';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Order {
  id: string;
  userId: string;
  vehicleId: string;
  fuelType: FuelType;
  quantityLiters?: number;
  amountRupees?: number;
  location: Location;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
  totalAmount: number;
  rating?: number;
  tip?: number;
  isScheduled?: boolean;
  scheduledDate?: string;
  captainName?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  licensePlate?: string;
  deliveryInstructions?: string;
  isEmergency?: boolean;
}

export interface FavoriteOrder {
  id: string;
  name: string;
  vehicleId: string;
  fuelType: FuelType;
  orderType: 'amount' | 'quantity';
  value: number;
  location: Location;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
}

export interface CartItem {
  id: string;
  vehicleId: string;
  fuelType: FuelType;
  orderType: 'amount' | 'quantity';
  value: number;
  quantityLiters: number;
  amountRupees: number;
}

export interface SavedAddress {
  id: string;
  label: string;
  emoji: string;
  location: Location;
}
