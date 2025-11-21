
import { Service, Appointment, Product, User, UserRole } from './types';

export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Corte Premium', price: 80, durationMinutes: 45, icon: 'scissors' },
  { id: '2', name: 'Barba Real', price: 50, durationMinutes: 30, icon: 'beard' },
  { id: '3', name: 'Combo Experience', price: 120, durationMinutes: 70, icon: 'combo' },
  { id: '4', name: 'Pigmentação', price: 60, durationMinutes: 40, icon: 'palette' },
  { id: '5', name: 'Sobrancelha', price: 25, durationMinutes: 15, icon: 'eye' },
  { id: '6', name: 'Relaxamento Capilar', price: 90, durationMinutes: 60, icon: 'relax' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Pomada Modeladora Matte', price: 45.00, cost: 20.00, stock: 24, sales: 74, icon: 'pomade' },
  { id: 'p2', name: 'Óleo para Barba Premium', price: 35.90, cost: 15.00, stock: 15, sales: 45, icon: 'oil' },
  { id: 'p3', name: 'Shampoo Mentolado', price: 29.90, cost: 12.50, stock: 32, sales: 52, icon: 'shampoo' },
  { id: 'p4', name: 'Minoxidil 5%', price: 60.00, cost: 35.00, stock: 8, sales: 28, icon: 'minoxidil' },
  { id: 'p5', name: 'Pente de Madeira', price: 15.00, cost: 5.00, stock: 50, sales: 12, icon: 'comb' },
];

export const MOCK_PROFESSIONALS = [
  { 
    id: 'p1', 
    name: 'João da Silva', 
    role: 'Master Barber', 
    availability: '8.5', 
    performance: 98, 
    appointmentsCount: 142,
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop'
  },
  { 
    id: 'p2', 
    name: 'Pedro Santos', 
    role: 'Especialista', 
    availability: '6.2', 
    performance: 92, 
    appointmentsCount: 98,
    avatar: 'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1887&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    id: 'p3', 
    name: 'André Costa', 
    role: 'Barbeiro', 
    availability: '7.8', 
    performance: 88, 
    appointmentsCount: 115,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1925&auto=format&fit=crop'
  },
];

export const MOCK_CLIENTS: User[] = [
  { id: 'c1', name: 'Carlos Almeida', whatsapp: '(11) 99999-1001', cpf: '123.456.789-00', birthDate: '1996-05-12', email: 'carlos@email.com', role: UserRole.CLIENT },
  { id: 'c2', name: 'Marcos Souza', whatsapp: '(11) 99999-1002', cpf: '234.567.890-11', birthDate: '1989-11-23', email: 'marcos@email.com', role: UserRole.CLIENT },
  { id: 'c3', name: 'Felipe Neto', whatsapp: '(11) 99999-1003', cpf: '345.678.901-22', birthDate: '2002-02-15', email: 'felipe@email.com', role: UserRole.CLIENT },
  { id: 'c4', name: 'João Silva', whatsapp: '(11) 99999-1004', cpf: '456.789.012-33', birthDate: '1984-08-30', email: 'joao@email.com', role: UserRole.CLIENT },
  { id: 'c5', name: 'André Santos', whatsapp: '(11) 99999-1005', cpf: '567.890.123-44', birthDate: '1993-01-10', email: 'andre@email.com', role: UserRole.CLIENT },
  { id: 'c6', name: 'Roberto Justus', whatsapp: '(11) 99999-1006', cpf: '678.901.234-55', birthDate: '1969-04-12', email: 'roberto@email.com', role: UserRole.CLIENT },
  { id: 'c7', name: 'Luciano Huck', whatsapp: '(11) 99999-1007', cpf: '789.012.345-66', birthDate: '1976-09-03', email: 'luciano@email.com', role: UserRole.CLIENT },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    clientId: 'c1',
    clientName: 'Carlos Almeida',
    professionalId: 'p1',
    professionalName: 'João "The Blade" Silva',
    serviceId: '1',
    serviceName: 'Corte Premium',
    date: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    status: 'SCHEDULED',
    price: 80,
    durationMinutes: 45
  },
  {
    id: 'a2',
    clientId: 'c2',
    clientName: 'Marcos Souza',
    professionalId: 'p1',
    professionalName: 'João "The Blade" Silva',
    serviceId: '2',
    serviceName: 'Barba Real',
    date: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    status: 'COMPLETED',
    price: 50,
    durationMinutes: 30
  },
  {
    id: 'a3',
    clientId: 'c3',
    clientName: 'Felipe Neto',
    professionalId: 'p2',
    professionalName: 'Pedro "Fade" Santos',
    serviceId: '3',
    serviceName: 'Combo Experience',
    date: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(), 
    status: 'SCHEDULED',
    price: 120,
    durationMinutes: 70
  },
  {
    id: 'a4',
    clientId: 'c4',
    clientName: 'João Silva',
    professionalId: 'p3',
    professionalName: 'André "Razor" Costa',
    serviceId: '1',
    serviceName: 'Corte Premium',
    date: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    status: 'SCHEDULED',
    price: 80,
    durationMinutes: 45
  },
];

export const AUTH_KEYS = {
  SHOP_KEY: 'BARBER2024',
  MASTER_KEY: 'ADMINMASTER',
};
