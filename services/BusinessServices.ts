
import { MOCK_APPOINTMENTS, MOCK_CLIENTS, MOCK_SERVICES } from '../constants';
import { ChartDataPoint, BirthdayClient, Appointment } from '../types';

// --- Helper: Date Logic ---
const DAYS_ABBREV = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const DAYS_FULL = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

// --- Chart Data Service ---
export const getChartData = (period: '7' | '15' | '30', lang: 'PT-BR' | 'EN-US'): ChartDataPoint[] => {
  const days = parseInt(period);
  const data: ChartDataPoint[] = [];
  const today = new Date();

  // Generate data for the last N days
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dayIndex = d.getDay();

    const abbrev = DAYS_ABBREV[dayIndex];
    const fullName = DAYS_FULL[dayIndex];

    // Simulate data variability based on day of week
    let baseRevenue = 1000;
    let baseClients = 10;

    if (dayIndex === 5 || dayIndex === 6) { // Fri/Sat busy
      baseRevenue *= 2.5;
      baseClients *= 2.0;
    } else if (dayIndex === 0) { // Sun closed/slow
      baseRevenue = 0;
      baseClients = 0;
    }

    // Random noise
    const revenue = Math.floor(baseRevenue + Math.random() * 500);
    const clients = Math.floor(baseClients + Math.random() * 5);

    data.push({
      name: abbrev,
      fullName: fullName,
      revenue,
      clients
    });
  }

  return data;
};

// --- CRM Service: Birthdays ---
export const getUpcomingBirthdays = (clients: typeof MOCK_CLIENTS): BirthdayClient[] => {
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const currentYear = today.getFullYear();

  return clients
    .map(client => {
      if (!client.birthDate) return null;
      
      const [year, month, day] = client.birthDate.split('-').map(Number);
      
      // Create birthday date object for current year
      const birthDateThisYear = new Date(currentYear, month - 1, day);
      birthDateThisYear.setHours(0,0,0,0);
      
      // If birthday passed this year, check next year
      if (birthDateThisYear < today) {
         birthDateThisYear.setFullYear(currentYear + 1);
      }

      const diffTime = birthDateThisYear.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // Calculate real age
      let ageVal = currentYear - year;
      if (new Date(currentYear, month - 1, day) > new Date()) {
         // Birthday hasn't happened yet effectively in absolute years calculation context
      }
      
      // Precise age calculation
      const birthObj = new Date(year, month - 1, day);
      const ageDifMs = Date.now() - birthObj.getTime();
      const ageDate = new Date(ageDifMs);
      const realAge = Math.abs(ageDate.getUTCFullYear() - 1970);

      let status: 'TODAY' | 'TOMORROW' | 'FUTURE' = 'FUTURE';
      if (diffDays === 0) status = 'TODAY';
      else if (diffDays === 1) status = 'TOMORROW';

      return {
        ...client,
        role: 'CLIENT', // Ensure User interface compatibility
        displayDate: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`,
        age: `${realAge} anos`,
        status,
        daysUntil: diffDays
      } as BirthdayClient;
    })
    .filter((c): c is BirthdayClient => c !== null && c.daysUntil >= 0 && c.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil);
};

// --- Finance Service: Commissions ---
export const calculateProCommissions = (proId: string, range: '7' | '30' | 'future'): number => {
    // Legacy support
    if (range === '7') return 1450.00;
    if (range === '30') return 5800.00;
    if (range === 'future') return 2100.00;
    return 0;
};

export const getCommissionMetrics = (proId: string) => {
    // Mock calculation logic for BI Widget
    // In a real app, this would aggregate actual appointment data
    return {
        realized: {
            last7: 1450.00,
            last30: 5800.00
        },
        projected: {
            next7: 2100.00,
            next15: 4200.00,
            next30: 8500.00
        }
    };
};

// --- Agenda Service ---
export const getAppointmentsByDate = (date: Date, proId: string): Appointment[] => {
  const dateStr = date.toDateString();
  return MOCK_APPOINTMENTS.filter(a =>
    a.professionalId === proId &&
    new Date(a.date).toDateString() === dateStr
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getNextClient = (proId: string): Appointment | null => {
  const now = new Date();
  const upcoming = MOCK_APPOINTMENTS.filter(a =>
    a.professionalId === proId &&
    a.status === 'SCHEDULED' &&
    new Date(a.date) > now
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return upcoming[0] || null;
};

export const getRecentHistory = (proId: string): Appointment[] => {
  return MOCK_APPOINTMENTS.filter(a =>
    a.professionalId === proId &&
    a.status === 'COMPLETED'
  )
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5);
};
