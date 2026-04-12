export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: 'active' | 'inactive';
  totalBookings: number;
  totalSpent: number;
}

export interface Booking {
  id: string;
  userId: string | null;
  userName: string;
  scooterModel: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: 'active' | 'completed' | 'cancelled';
  isRegistered: boolean;
}

export interface Scooter {
  id: string;
  model: string;
  pricePerHour: number;
  status: 'available' | 'rented' | 'maintenance';
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: '张伟',
    email: 'zhangwei@example.com',
    phone: '13800138001',
    registrationDate: '2025-12-15',
    status: 'active',
    totalBookings: 12,
    totalSpent: 3600,
  },
  {
    id: '2',
    name: '李娜',
    email: 'lina@example.com',
    phone: '13800138002',
    registrationDate: '2026-01-10',
    status: 'active',
    totalBookings: 8,
    totalSpent: 2400,
  },
  {
    id: '3',
    name: '王强',
    email: 'wangqiang@example.com',
    phone: '13800138003',
    registrationDate: '2025-11-20',
    status: 'active',
    totalBookings: 15,
    totalSpent: 4500,
  },
  {
    id: '4',
    name: '刘芳',
    email: 'liufang@example.com',
    phone: '13800138004',
    registrationDate: '2026-02-05',
    status: 'inactive',
    totalBookings: 3,
    totalSpent: 900,
  },
  {
    id: '5',
    name: '陈明',
    email: 'chenming@example.com',
    phone: '13800138005',
    registrationDate: '2026-03-01',
    status: 'active',
    totalBookings: 20,
    totalSpent: 6000,
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'B001',
    userId: '1',
    userName: '张伟',
    scooterModel: '小米电动滑板车 Pro 2',
    startDate: '2026-03-28 10:00',
    endDate: '2026-03-28 12:00',
    totalCost: 60,
    status: 'completed',
    isRegistered: true,
  },
  {
    id: 'B002',
    userId: '2',
    userName: '李娜',
    scooterModel: 'Ninebot Max G30',
    startDate: '2026-03-30 14:00',
    endDate: '2026-03-30 16:00',
    totalCost: 70,
    status: 'completed',
    isRegistered: true,
  },
  {
    id: 'B003',
    userId: '1',
    userName: '张伟',
    scooterModel: 'Segway ES2',
    startDate: '2026-04-01 09:00',
    endDate: '2026-04-01 17:00',
    totalCost: 200,
    status: 'active',
    isRegistered: true,
  },
  {
    id: 'B004',
    userId: null,
    userName: '王小明',
    scooterModel: '小米电动滑板车 Pro 2',
    startDate: '2026-03-29 15:00',
    endDate: '2026-03-29 18:00',
    totalCost: 90,
    status: 'completed',
    isRegistered: false,
  },
  {
    id: 'B005',
    userId: '3',
    userName: '王强',
    scooterModel: 'Ninebot Max G30',
    startDate: '2026-03-31 11:00',
    endDate: '2026-03-31 13:00',
    totalCost: 70,
    status: 'completed',
    isRegistered: true,
  },
];

export const mockScooters: Scooter[] = [
  {
    id: 'S001',
    model: '小米电动滑板车 Pro 2',
    pricePerHour: 30,
    status: 'available',
  },
  {
    id: 'S002',
    model: 'Ninebot Max G30',
    pricePerHour: 35,
    status: 'available',
  },
  {
    id: 'S003',
    model: 'Segway ES2',
    pricePerHour: 25,
    status: 'rented',
  },
  {
    id: 'S004',
    model: '小米电动滑板车 Pro 2',
    pricePerHour: 30,
    status: 'available',
  },
  {
    id: 'S005',
    model: 'Ninebot Max G30',
    pricePerHour: 35,
    status: 'maintenance',
  },
];
