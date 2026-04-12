// Mock data for the scooter rental management system

export type ScooterStatus = 'available' | 'unavailable' | 'maintenance';
export type RentalType = '1hour' | '4hours' | '1day' | '1week';

export interface Scooter {
  id: string;
  name: string;
  status: ScooterStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  batteryLevel: number;
  lastMaintenance: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalRentals: number;
}

export interface Rental {
  id: string;
  scooterId: string;
  customerId: string;
  rentalType: RentalType;
  startDate: string;
  endDate: string;
  price: number;
  status: 'active' | 'completed' | 'cancelled';
}

// Mock scooters data
export const mockScooters: Scooter[] = [
  {
    id: 'S001',
    name: 'Scooter Alpha',
    status: 'available',
    location: { lat: 40.7589, lng: -73.9851, address: 'Times Square, New York' },
    batteryLevel: 95,
    lastMaintenance: '2026-03-25',
  },
  {
    id: 'S002',
    name: 'Scooter Beta',
    status: 'unavailable',
    location: { lat: 40.7614, lng: -73.9776, address: 'Central Park South, New York' },
    batteryLevel: 45,
    lastMaintenance: '2026-03-20',
  },
  {
    id: 'S003',
    name: 'Scooter Gamma',
    status: 'available',
    location: { lat: 40.7580, lng: -73.9855, address: 'Broadway, New York' },
    batteryLevel: 88,
    lastMaintenance: '2026-03-28',
  },
  {
    id: 'S004',
    name: 'Scooter Delta',
    status: 'maintenance',
    location: { lat: 40.7505, lng: -73.9934, address: '8th Avenue, New York' },
    batteryLevel: 20,
    lastMaintenance: '2026-03-15',
  },
  {
    id: 'S005',
    name: 'Scooter Epsilon',
    status: 'available',
    location: { lat: 40.7549, lng: -73.9840, address: '7th Avenue, New York' },
    batteryLevel: 100,
    lastMaintenance: '2026-03-30',
  },
  {
    id: 'S006',
    name: 'Scooter Zeta',
    status: 'unavailable',
    location: { lat: 40.7648, lng: -73.9808, address: 'Columbus Circle, New York' },
    batteryLevel: 62,
    lastMaintenance: '2026-03-22',
  },
  {
    id: 'S007',
    name: 'Scooter Eta',
    status: 'available',
    location: { lat: 40.7527, lng: -73.9772, address: 'Madison Avenue, New York' },
    batteryLevel: 78,
    lastMaintenance: '2026-03-27',
  },
  {
    id: 'S008',
    name: 'Scooter Theta',
    status: 'available',
    location: { lat: 40.7590, lng: -73.9845, address: 'West 42nd Street, New York' },
    batteryLevel: 91,
    lastMaintenance: '2026-03-29',
  },
];

// Mock customers data
export const mockCustomers: Customer[] = [
  { id: 'C001', name: 'John Smith', email: 'john@example.com', phone: '555-0101', totalRentals: 15 },
  { id: 'C002', name: 'Emma Wilson', email: 'emma@example.com', phone: '555-0102', totalRentals: 8 },
  { id: 'C003', name: 'Michael Brown', email: 'michael@example.com', phone: '555-0103', totalRentals: 22 },
  { id: 'C004', name: 'Sophia Davis', email: 'sophia@example.com', phone: '555-0104', totalRentals: 12 },
  { id: 'C005', name: 'James Johnson', email: 'james@example.com', phone: '555-0105', totalRentals: 19 },
];

// Rental pricing
export const rentalPrices: Record<RentalType, number> = {
  '1hour': 5,
  '4hours': 18,
  '1day': 35,
  '1week': 200,
};

// Generate mock rentals for the past 4 weeks
export const mockRentals: Rental[] = [];
const today = new Date('2026-04-01');
const rentalTypes: RentalType[] = ['1hour', '4hours', '1day', '1week'];

for (let i = 0; i < 200; i++) {
  const daysAgo = Math.floor(Math.random() * 28); // Last 4 weeks
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - daysAgo);
  
  const rentalType = rentalTypes[Math.floor(Math.random() * rentalTypes.length)];
  const endDate = new Date(startDate);
  
  switch (rentalType) {
    case '1hour':
      endDate.setHours(endDate.getHours() + 1);
      break;
    case '4hours':
      endDate.setHours(endDate.getHours() + 4);
      break;
    case '1day':
      endDate.setDate(endDate.getDate() + 1);
      break;
    case '1week':
      endDate.setDate(endDate.getDate() + 7);
      break;
  }
  
  mockRentals.push({
    id: `R${String(i + 1).padStart(3, '0')}`,
    scooterId: mockScooters[Math.floor(Math.random() * mockScooters.length)].id,
    customerId: mockCustomers[Math.floor(Math.random() * mockCustomers.length)].id,
    rentalType,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    price: rentalPrices[rentalType],
    status: daysAgo > 0 ? 'completed' : 'active',
  });
}

// Helper functions for statistics
export const getRentalsByType = () => {
  const stats: Record<RentalType, { count: number; revenue: number }> = {
    '1hour': { count: 0, revenue: 0 },
    '4hours': { count: 0, revenue: 0 },
    '1day': { count: 0, revenue: 0 },
    '1week': { count: 0, revenue: 0 },
  };

  mockRentals.forEach((rental) => {
    stats[rental.rentalType].count++;
    stats[rental.rentalType].revenue += rental.price;
  });

  return stats;
};

export const getWeeklyRevenue = () => {
  const weeks: Record<string, Record<RentalType, number>> = {};

  mockRentals.forEach((rental) => {
    const date = new Date(rental.startDate);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0];

    if (!weeks[weekKey]) {
      weeks[weekKey] = { '1hour': 0, '4hours': 0, '1day': 0, '1week': 0 };
    }

    weeks[weekKey][rental.rentalType] += rental.price;
  });

  return Object.entries(weeks)
    .map(([week, data]) => ({
      week,
      ...data,
    }))
    .sort((a, b) => a.week.localeCompare(b.week));
};

export const getDailyRevenue = () => {
  const days: Record<string, number> = {};

  mockRentals.forEach((rental) => {
    const date = new Date(rental.startDate);
    const dayKey = date.toISOString().split('T')[0];

    if (!days[dayKey]) {
      days[dayKey] = 0;
    }

    days[dayKey] += rental.price;
  });

  return Object.entries(days)
    .map(([date, revenue]) => ({
      date,
      revenue,
      dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};
