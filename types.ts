
export enum UserRole {
  CLIENT = 'CLIENT',
  PROFESSIONAL = 'PROFESSIONAL',
  OWNER = 'OWNER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  birthDate?: string; // Changed from age
  cpf?: string;
  phone?: string;
  whatsapp?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  icon?: string; // Added for dynamic icon selection
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  cost?: number; // Added for profit calculation
  sales?: number; // Added for dashboard analytics
  icon?: string; // Added for dynamic icon selection
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  date: string; // ISO string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  price: number;
  durationMinutes: number; // Added for multi-slot logic
}

export interface BarberStats {
  todayAppointments: number;
  monthlyCommission: number;
  rating: number;
}

export interface BusinessMetrics {
  dailyRevenue: number;
  monthlyRevenue: number;
  topService: string;
  noShowRate: number;
}

export interface AIAnalysisResult {
  text: string;
  sources?: Array<{ title: string; uri: string }>;
}

export interface ChartDataPoint {
  name: string; // Abbreviation (SEG, TER)
  fullName: string; // Full Name (Segunda-feira)
  revenue: number;
  clients: number;
}

export interface BirthdayClient extends User {
  displayDate: string;
  age: string;
  status: 'TODAY' | 'TOMORROW' | 'FUTURE';
  daysUntil: number;
}
