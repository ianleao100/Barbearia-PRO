import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, TooltipProps, Legend } from 'recharts';
import { MOCK_CLIENTS, MOCK_PROFESSIONALS, AUTH_KEYS, MOCK_SERVICES } from '../constants';
import { Button } from './Button';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Settings, 
  Search,
  Globe,
  Briefcase,
  Key,
  Eye,
  EyeOff,
  X,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Scissors,
  Sun,
  Moon,
  Palette,
  DollarSign,
  Languages,
  ChevronLeft,
  ChevronRight,
  Repeat,
  UserCheck,
  LogOut,
  CheckSquare,
  Square,
  Gift,
  MessageCircle,
  Award,
  Trophy,
  Lock,
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Wind,
  Box,
  Droplet,
  Sparkles,
  FlaskConical,
  AlignJustify,
  Smile,
  Clock,
  Camera,
  Upload,
  AlertCircle,
  Image as ImageIcon,
  Monitor,
  Zap,
  Star,
  Crown,
  Coffee,
  Beer,
  Tag,
  Package,
  SprayCan,
  Heart,
  Medal,
  ThumbsUp,
  Ruler,
  Anchor,
  ShoppingCart,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
  Save,
  Check,
  ChevronDown,
  Cake
} from 'lucide-react';
import { Appointment, ChartDataPoint, Product } from '../types';
import { getChartData, getUpcomingBirthdays, calculateProCommissions } from '../services/BusinessServices';

const COLORS = ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6'];

type TabType = 'dashboard' | 'clients' | 'team' | 'settings' | 'agenda' | 'services' | 'products';
type ChartPeriod = '7' | '15' | '30';

// --- Custom Icons ---

const HaircutIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 6L18 18" />
    <path d="M6 18L18 6" />
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H18" />
    <path d="M18 10V14" />
  </svg>
);

const BeardIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 21a9 9 0 0 0 9-9v-4.4c0-1.3-1.3-2.2-2.5-1.8l-2.2.8c-.6.2-1.3-.1-1.6-.7l-.7-1.4c-.6-1.1-2.2-1.1-2.8 0l-.7 1.4c-.3.6-1 .9-1.6.7l-2.2-.8C4.3 5.4 3 6.3 3 7.6V12a9 9 0 0 0 9 9z" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <path d="M9 10h.01" />
    <path d="M15 10h.01" />
  </svg>
);

const EyebrowIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 11c2-3 6.5-4 10-3s6 2 6 4" strokeWidth="2.5" />
    <path d="M12 19c-2.5 0-4.5-1.5-4.5-3.5S9.5 12 12 12s4.5 1.5 4.5 3.5-2 3.5-4.5 3.5z" />
    <circle cx="12" cy="15.5" r="1.5" fill="currentColor" />
  </svg>
);

const RelaxationIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 21a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" />
    <path d="M12 7v-4" />
    <path d="M15.5 8l2-3.5" />
    <path d="M8.5 8l-2-3.5" />
    <path d="M16 14c1.5 0 3-1 3-2.5" />
  </svg>
);

const PigmentationIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18.5 5.5l-9 9" />
    <path d="M7.5 16.5l-2.2 3.8c-.4.7.2 1.5 1 .9l3.7-2.7" />
    <path d="M16.5 3.5l4 4-3 3-4-4 3-3z" />
    <path d="M3 21h4" />
    <path d="M2 18l3 3" />
  </svg>
);

const ComboIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M7 8l10 8" />
    <path d="M7 16l10-8" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PomadeIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="6" rx="9" ry="3" />
    <path d="M3 6v9a9 3 0 0 0 18 0V6" />
    <path d="M3 11a9 3 0 0 0 18 0" />
  </svg>
);

const OilIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 10h6v8a3 3 0 0 1-6 0v-8z" />
    <path d="M12 10V4" />
    <path d="M12 4a2 2 0 0 1 2-2" />
    <path d="M9 14h6" />
    <path d="M12 22v-2" />
  </svg>
);

// --- Icon Mapping ---
const ICON_MAP: any = {
  // Services (Custom)
  scissors: HaircutIcon,
  beard: BeardIcon, 
  combo: ComboIcon,
  palette: PigmentationIcon,
  eye: EyebrowIcon,
  relax: RelaxationIcon,
  
  // Products (Custom & Lucide)
  pomade: PomadeIcon,
  oil: OilIcon,
  shampoo: Sparkles,
  minoxidil: FlaskConical,
  comb: AlignJustify,
  
  // General Library
  zap: Zap,
  star: Star,
  crown: Crown,
  coffee: Coffee,
  beer: Beer,
  tag: Tag,
  package: Package,
  spray: SprayCan,
  heart: Heart,
  medal: Medal,
  thumbsup: ThumbsUp,
  ruler: Ruler,
  anchor: Anchor,
  gift: Gift,
  bag: ShoppingBag,
  droplet: Droplet,
  wind: Wind,
  layers: Layers,
  box: Box,
  smile: Smile,
  
  // Default
  default: Scissors
};

// Comprehensive Library for Search
const ICON_LIBRARY = [
  { key: 'scissors', label: 'Tesoura', tags: ['corte', 'cabelo', 'serviço', 'tesoura'] },
  { key: 'beard', label: 'Barba', tags: ['barba', 'rosto', 'bigode', 'serviço'] },
  { key: 'combo', label: 'Combo', tags: ['combo', 'pacote', 'completo', 'serviço'] },
  { key: 'palette', label: 'Tintura', tags: ['cor', 'pintar', 'tinta', 'serviço'] },
  { key: 'eye', label: 'Olho', tags: ['sobrancelha', 'olho', 'rosto', 'serviço'] },
  { key: 'relax', label: 'Relaxamento', tags: ['relaxamento', 'massagem', 'cabelo', 'serviço'] },
  { key: 'pomade', label: 'Pomada', tags: ['produto', 'cabelo', 'fixador', 'pote'] },
  { key: 'oil', label: 'Óleo', tags: ['produto', 'barba', 'liquido', 'hidratação'] },
  { key: 'shampoo', label: 'Brilho/Limpeza', tags: ['shampoo', 'limpeza', 'banho', 'produto'] },
  { key: 'minoxidil', label: 'Químico', tags: ['quimica', 'tratamento', 'frasco', 'produto'] },
  { key: 'comb', label: 'Pente', tags: ['ferramenta', 'acessorio', 'cabelo', 'produto'] },
  { key: 'zap', label: 'Máquina', tags: ['maquina', 'rapido', 'eletrico', 'corte'] },
  { key: 'star', label: 'Estrela', tags: ['destaque', 'top', 'premium'] },
  { key: 'crown', label: 'Coroa', tags: ['vip', 'rei', 'premium', 'luxo'] },
  { key: 'coffee', label: 'Café', tags: ['bebida', 'cortesia', 'bar'] },
  { key: 'beer', label: 'Cerveja', tags: ['bebida', 'alcool', 'bar'] },
  { key: 'tag', label: 'Etiqueta', tags: ['preço', 'oferta', 'venda'] },
  { key: 'package', label: 'Pacote', tags: ['produto', 'caixa', 'entrega'] },
  { key: 'spray', label: 'Spray', tags: ['fixador', 'lata', 'aerossol'] },
  { key: 'heart', label: 'Coração', tags: ['cuidado', 'saude', 'vida'] },
  { key: 'medal', label: 'Medalha', tags: ['premio', 'vencedor', 'qualidade'] },
  { key: 'thumbsup', label: 'Joinha', tags: ['curtir', 'bom', 'aprovado'] },
  { key: 'ruler', label: 'Régua', tags: ['medida', 'precisao', 'design'] },
  { key: 'anchor', label: 'Âncora', tags: ['oldschool', 'mar', 'estilo'] },
  { key: 'gift', label: 'Presente', tags: ['gift', 'caixa', 'surpresa'] },
  { key: 'bag', label: 'Sacola', tags: ['compra', 'loja', 'shopping'] },
  { key: 'droplet', label: 'Gota', tags: ['agua', 'liquido', 'oleo'] },
  { key: 'wind', label: 'Secador', tags: ['ar', 'secador', 'vento'] },
  { key: 'layers', label: 'Camadas', tags: ['degrade', 'fade', 'nivel'] },
  { key: 'box', label: 'Caixa', tags: ['produto', 'estoque'] },
  { key: 'smile', label: 'Sorriso', tags: ['rosto', 'feliz', 'kids'] },
];

// --- Preset Images ---
const PRESET_BANNERS = [
  "https://images.unsplash.com/photo-1503951914875-452162b7f30a?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1925&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634480553558-6a516246c4cc?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512690459411-b9245aed6191?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1633681926022-69566d4e3154?q=80&w=2070&auto=format&fit=crop",
];

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1780&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1887&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
];

// --- Translation Dictionary (i18n Simulation) ---
const TRANSLATIONS = {
  'PT-BR': {
    dashboard: 'Dashboard',
    clients: 'Clientes',
    agenda: 'Agenda',
    team: 'Equipe',
    services: 'Serviços',
    products: 'Produtos',
    settings: 'Configurações',
    totalRevenue: 'Faturamento Total',
    newClients: 'Novos Clientes',
    occupancy: 'Serviços Feitos',
    revenue: 'Receita Semanal',
    clientFlow: 'Fluxo de Clientes',
    birthdays: 'Aniversariantes da Semana',
    topPros: 'TOP PROFISSIONAIS',
    topServices: 'TOP SERVIÇOS',
    topProducts: 'TOP PRODUTOS',
    retention: 'Retenção de Clientes',
    appearance: 'Aparência',
    regionalization: 'Região',
    security: 'Segurança e Acesso',
    theme: 'Tema',
    accentColor: 'Cor de Destaque',
    language: 'Idioma',
    currency: 'Moeda Padrão',
    edit: 'Editar',
    delete: 'Excluir',
    add: 'Adicionar',
    save: 'Salvar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    name: 'Nome',
    price: 'Preço',
    stock: 'Estoque',
    actions: 'Ações',
    whatsapp: 'WhatsApp',
    birthday: 'Aniversário',
    role: 'Cargo',
    email: 'E-mail',
    icon: 'Ícone'
  },
  'EN-US': {
    dashboard: 'Dashboard',
    clients: 'Clients',
    agenda: 'Schedule',
    team: 'Team',
    services: 'Services',
    products: 'Products',
    settings: 'Settings',
    totalRevenue: 'Total Revenue',
    newClients: 'New Clients',
    occupancy: 'Services Done',
    revenue: 'Weekly Revenue',
    clientFlow: 'Client Flow',
    birthdays: 'Birthdays of the Week',
    topPros: 'TOP PROFESSIONALS',
    topServices: 'TOP SERVICES',
    topProducts: 'TOP PRODUCTS',
    retention: 'Client Retention',
    appearance: 'Appearance',
    regionalization: 'Region',
    security: 'Security & Access',
    theme: 'Theme',
    accentColor: 'Accent Color',
    language: 'Language',
    currency: 'Default Currency',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    name: 'Name',
    price: 'Price',
    stock: 'Stock',
    actions: 'Actions',
    whatsapp: 'WhatsApp',
    birthday: 'Birthday',
    role: 'Role',
    email: 'Email',
    icon: 'Icon'
  }
};

interface OwnerViewProps {
  onLogout: () => void;
  appointments: Appointment[];
  products: Product[];
  onProductUpdate: (products: Product[]) => void;
}

export const OwnerView: React.FC<OwnerViewProps> = ({ onLogout, appointments, products, onProductUpdate }) => {
  // --- Global App State & Settings (Simulated) ---
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accentColor, setAccentColor] = useState('#f59e0b'); // Default Gold-500
  
  // Regionalization State
  const [currency, setCurrency] = useState('BRL');
  const [language, setLanguage] = useState<'PT-BR' | 'EN-US'>('PT-BR');
  
  // Modal Visibility States
  const [showLangSelector, setShowLangSelector] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);

  const [dashboardConfig, setDashboardConfig] = useState({
    showRevenue: true,
    showClients: true,
    showOccupancy: true,
    showRevenueChart: true,
    showBirthdays: true,
    showClientFlow: true,
    showTopPros: true,
    showRetention: true,
    showTopServices: true,
    showTopProducts: true
  });

  // Access Keys State
  const [shopKey, setShopKey] = useState(AUTH_KEYS.SHOP_KEY);
  const [masterKey, setMasterKey] = useState(AUTH_KEYS.MASTER_KEY);
  const [editingShopKey, setEditingShopKey] = useState(false);
  const [editingMasterKey, setEditingMasterKey] = useState(false);
  const [showShopKey, setShowShopKey] = useState(false);
  const [showMasterKey, setShowMasterKey] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Chart State
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('7');

  // Team Metrics State
  const [detailPeriod, setDetailPeriod] = useState<'7' | '15' | '30'>('30');
  const [selectedProForDetails, setSelectedProForDetails] = useState<any | null>(null);

  // Image Upload State
  const [imageUploadConfig, setImageUploadConfig] = useState<{ proId: string, field: 'avatar' | 'banner' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Icon Picker State
  const [showIconModal, setShowIconModal] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  const [iconSelectorTarget, setIconSelectorTarget] = useState<'service' | 'product' | null>(null);

  // Data State (Simulating DB)
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [professionals, setProfessionals] = useState(MOCK_PROFESSIONALS);
  const [services, setServices] = useState(MOCK_SERVICES);
  
  // Appointments state - synced with props
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>(appointments);

  // Sync state when props change
  useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);
  
  // Agenda State
  const [agendaDate, setAgendaDate] = useState(new Date());
  
  // Mini Calendar State
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  // Client Date Picker State
  const [showClientDatePicker, setShowClientDatePicker] = useState(false);
  const [clientPickerViewDate, setClientPickerViewDate] = useState(new Date());

  const [selectedSlot, setSelectedSlot] = useState<{time: string, proId: string} | null>(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState<{ clientId: string, serviceIds: string[] }>({ clientId: '', serviceIds: [] });
  const [bookingClientSearch, setBookingClientSearch] = useState(''); // New state for search
  
  // State for Conflict Warning
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);
  
  // Viewing Appointment Details Modal
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);

  // Client CRUD State
  const [clientSearch, setClientSearch] = useState('');
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [addingClient, setAddingClient] = useState(false);
  const [deletingClient, setDeletingClient] = useState<any | null>(null);

  // Team CRUD State
  const [addingPro, setAddingPro] = useState(false);
  const [viewingPro, setViewingPro] = useState<any | null>(null); // READ ONLY VIEW
  const [editingPro, setEditingPro] = useState<any | null>(null); // EDIT FORM
  const [deletingPro, setDeletingPro] = useState<any | null>(null);

  // Service CRUD State
  const [editingService, setEditingService] = useState<any | null>(null);
  const [addingService, setAddingService] = useState(false);
  const [deletingService, setDeletingService] = useState<any | null>(null);

  // Product CRUD State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);
  
  // Sell Product State
  const [isSellingProduct, setIsSellingProduct] = useState(false);
  const [sellingProductData, setSellingProductData] = useState<{ productId: string, price: string, quantity: number }>({ productId: '', price: '', quantity: 1 });

  // Apply Dynamic Colors via CSS Variables
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor]);

  // --- Helpers ---
  const t = (key: keyof typeof TRANSLATIONS['PT-BR']) => {
    return TRANSLATIONS[language][key] || key;
  };

  const formatCurrency = (value: number) => {
    const locale = language === 'EN-US' ? 'en-US' : 'pt-BR';
    const curr = currency;
    
    let finalValue = value;
    if (currency === 'USD') finalValue = value * 0.2;
    if (currency === 'EUR') finalValue = value * 0.18;

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2
    }).format(finalValue);
  };

  // Helper to calculate age and format display: DD/MM - XX anos
  const formatBirthdayAge = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
      return `${formattedDate} - ${age} ${language === 'EN-US' ? 'y/o' : 'anos'}`;
    } catch (e) {
      return dateString;
    }
  };

  const handleOpenWhatsApp = (phone: string | undefined, name: string) => {
    if (!phone) return;
    const num = phone.replace(/\D/g, '');
    const message = language === 'EN-US' 
       ? `Hello ${name}!` 
       : `Olá ${name}!`;
    window.open(`https://wa.me/55${num}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Birthday Message Logic
  const handleBirthdayWhatsApp = (phone: string | undefined, name: string, ageStr: string) => {
     if (!phone) return;
     const num = phone.replace(/\D/g, '');
     // Extract just the age number if possible
     const age = ageStr.replace(/\D/g, '');
     
     const message = `Olá ${name}! 🎂 Parabéns pelos seus ${age} anos! Desejamos muita felicidade e sucesso hoje!`;
     window.open(`https://wa.me/55${num}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  // --- Helper: Mini Calendar Days ---
  const getCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for(let i=0; i<firstDay; i++) days.push(null);
    for(let i=1; i<=daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };
  
  // --- Helper: Render Mini Calendar ---
  const renderMiniCalendar = (onSelect: (date: Date) => void) => {
    const days = getCalendarDays(pickerDate.getFullYear(), pickerDate.getMonth());
    const monthName = pickerDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    return (
      <div className="absolute top-full left-0 mt-2 bg-dark-900 border border-dark-800 rounded-xl shadow-2xl z-50 p-4 w-72 animate-fade-in">
         <div className="flex justify-between items-center mb-4">
             <button onClick={(e) => { e.stopPropagation(); setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() - 1, 1)); }} className="p-1 hover:text-white text-gray-400"><ChevronLeft size={20}/></button>
             <span className="font-bold text-white capitalize">{monthName}</span>
             <button onClick={(e) => { e.stopPropagation(); setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() + 1, 1)); }} className="p-1 hover:text-white text-gray-400"><ChevronRight size={20}/></button>
         </div>
         <div className="grid grid-cols-7 gap-1 mb-2 text-center">
             {['D','S','T','Q','Q','S','S'].map((d, i) => <span key={i} className="text-xs font-bold text-gray-500">{d}</span>)}
         </div>
         <div className="grid grid-cols-7 gap-1">
             {days.map((day, idx) => {
                if (!day) return <div key={idx}></div>;
                const isSelected = day.toDateString() === agendaDate.toDateString();
                const isToday = day.toDateString() === new Date().toDateString();
                return (
                   <button 
                     key={idx}
                     onClick={(e) => { e.stopPropagation(); onSelect(day); }}
                     className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        isSelected 
                        ? 'bg-gold-500 text-black font-bold shadow-lg shadow-gold-500/20' 
                        : isToday 
                            ? 'border border-gold-500 text-gold-500'
                            : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                     }`}
                   >
                      {day.getDate()}
                   </button>
                )
             })}
         </div>
      </div>
    );
  };

  // --- Helper: Render Client Date Picker (Year Navigation) ---
  const renderClientDatePicker = (currentValue: string, onSelect: (isoDate: string) => void) => {
     const days = getCalendarDays(clientPickerViewDate.getFullYear(), clientPickerViewDate.getMonth());
     const monthName = clientPickerViewDate.toLocaleDateString('pt-BR', { month: 'long' });
     const year = clientPickerViewDate.getFullYear();

     return (
        <div className="absolute top-full left-0 mt-2 bg-dark-900 border border-dark-800 rounded-xl shadow-2xl z-[100] p-4 w-72 animate-fade-in">
           {/* Header */}
           <div className="flex justify-between items-center mb-4">
               <button onClick={(e) => { e.stopPropagation(); setClientPickerViewDate(new Date(year, clientPickerViewDate.getMonth() - 1, 1)); }} className="p-1 hover:text-white text-gray-400"><ChevronLeft size={20}/></button>
               <div className="flex flex-col items-center">
                  <span className="font-bold text-white capitalize text-sm">{monthName}</span>
                  <div className="flex items-center gap-2">
                     <button onClick={(e) => { e.stopPropagation(); setClientPickerViewDate(new Date(year - 1, clientPickerViewDate.getMonth(), 1)); }} className="text-xs text-gray-500 hover:text-gold-500"><ChevronLeft size={12}/></button>
                     <span className="text-xs text-gold-500 font-bold">{year}</span>
                     <button onClick={(e) => { e.stopPropagation(); setClientPickerViewDate(new Date(year + 1, clientPickerViewDate.getMonth(), 1)); }} className="text-xs text-gray-500 hover:text-gold-500"><ChevronRight size={12}/></button>
                  </div>
               </div>
               <button onClick={(e) => { e.stopPropagation(); setClientPickerViewDate(new Date(year, clientPickerViewDate.getMonth() + 1, 1)); }} className="p-1 hover:text-white text-gray-400"><ChevronRight size={20}/></button>
           </div>
           
           {/* Days Grid */}
           <div className="grid grid-cols-7 gap-1 mb-2 text-center">
               {['D','S','T','Q','Q','S','S'].map((d, i) => <span key={i} className="text-[10px] font-bold text-gray-500">{d}</span>)}
           </div>
           <div className="grid grid-cols-7 gap-1">
               {days.map((day, idx) => {
                  if (!day) return <div key={idx}></div>;
                  // Check if this day is selected
                  const isSelected = currentValue === day.toISOString().split('T')[0];
                  const isToday = day.toDateString() === new Date().toDateString();
                  
                  return (
                     <button 
                       key={idx}
                       type="button"
                       onClick={(e) => { 
                          e.stopPropagation(); 
                          // Adjust for timezone offset to ensure correct string YYYY-MM-DD
                          const offset = day.getTimezoneOffset();
                          const adjustedDate = new Date(day.getTime() - (offset*60*1000));
                          onSelect(adjustedDate.toISOString().split('T')[0]); 
                          setShowClientDatePicker(false);
                       }}
                       className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                          isSelected 
                          ? 'bg-gold-500 text-black font-bold shadow-lg shadow-gold-500/20' 
                          : isToday 
                              ? 'border border-gold-500 text-gold-500'
                              : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                       }`}
                     >
                        {day.getDate()}
                     </button>
                  )
               })}
           </div>
        </div>
     );
  };

  // --- Dynamic Dashboard Metrics ---
  const getDashboardMetrics = (period: ChartPeriod) => {
     const multiplier = period === '7' ? 1 : period === '15' ? 2.1 : 4.2;
     
     const totalRevenue = 9850 * multiplier;
     const newClients = Math.floor(12 * multiplier);
     const servicesRevenue = 6500 * multiplier;
     const servicesCount = Math.floor(85 * multiplier);
     const productsRevenue = 1200 * multiplier;
     const productsCount = Math.floor(32 * multiplier);

     return {
        totalRevenue,
        newClients,
        services: { revenue: servicesRevenue, count: servicesCount },
        products: { revenue: productsRevenue, count: productsCount }
     };
  };

  const metrics = getDashboardMetrics(chartPeriod);
  const chartData = getChartData(chartPeriod, language);
  const upcomingBirthdays = getUpcomingBirthdays(clients);
  
  // Data for Pie Chart (Top 5 Services with realistic calculated revenue)
  const servicesPieData = [
    { name: 'Corte Premium', value: 19165, percent: 45 },
    { name: 'Barba Real', value: 12775, percent: 30 },
    { name: 'Combo Exp.', value: 6390, percent: 15 },
    { name: 'Pigmentação', value: 2555, percent: 6 },
    { name: 'Sobrancelha', value: 1705, percent: 4 },
  ];

  const TOTAL_MOCK_REVENUE = 42590;
  const MOCK_TOTAL_MONTHLY_CLIENTS = 150; // Base for product conversion metrics

  // Prepare data for Top Products Pie Chart
  const topProductsPieData = products
    .filter(p => (p.sales || 0) > 0)
    .map(p => ({ name: p.name, value: p.price * (p.sales || 0), sales: p.sales || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
    
  // Calculated Metrics for New Cards
  const totalProductRevenue = products.reduce((acc, p) => acc + (p.price * (p.sales || 0)), 0);
  const totalProductSalesCount = products.reduce((acc, p) => acc + (p.sales || 0), 0);
  const totalServicesDone = localAppointments.filter(a => a.status === 'COMPLETED').length + 245; // Mock base + real

  // --- Custom Tooltip Component (Charts) ---
  const CustomChartTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as any;
      const isRevenue = payload[0].dataKey === 'revenue';
      const value = payload[0].value as number;
      
      return (
        <div className={`p-3 rounded-lg border shadow-xl ${theme === 'dark' ? 'bg-dark-900 border-dark-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
          <p className="text-sm font-bold mb-1 opacity-80">{data.fullName || data.name}</p>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
             {isRevenue ? (
                <span className="font-mono font-bold text-lg">{formatCurrency(value)}</span>
             ) : (
                <span className="font-bold text-lg">{value} <span className="text-sm font-normal opacity-70">{language === 'EN-US' ? 'clients' : 'clientes'}</span></span>
             )}
          </div>
          {/* Sales Count for Product Chart */}
          {data.sales !== undefined && (
             <p className="text-xs text-gray-500 mt-1">Vendas: {data.sales}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // --- Custom Pie Tooltip ---
  const CustomPieTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
          const data = payload[0];
          // Fix: show name and revenue
          return (
              <div className={`p-3 rounded-lg border shadow-xl ${theme === 'dark' ? 'bg-dark-900 border-dark-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                  <p className="font-bold text-base mb-1" style={{ color: data.payload.fill }}>{data.name}</p>
                  <p className="text-lg font-mono font-bold text-gold-500">{formatCurrency(data.value)}</p>
              </div>
          );
      }
      return null;
  };

  // --- Handlers Implementation ---
  const toggleBookingService = (id: string) => {
    setBookingData(prev => {
      const ids = prev.serviceIds.includes(id)
        ? prev.serviceIds.filter(sId => sId !== id)
        : [...prev.serviceIds, id];
      return { ...prev, serviceIds: ids };
    });
  };
  
  // --- Check Conflicts ---
  useEffect(() => {
     if (bookingData.serviceIds.length > 0 && selectedSlot) {
        const selectedServicesData = services.filter(s => bookingData.serviceIds.includes(s.id));
        const totalDuration = selectedServicesData.reduce((sum, s) => sum + s.durationMinutes, 0);
        
        const appointmentStart = new Date(agendaDate);
        const [hours, minutes] = selectedSlot.time.split(':').map(Number);
        appointmentStart.setHours(hours, minutes, 0, 0);
        
        const appointmentEnd = new Date(appointmentStart.getTime() + totalDuration * 60000);
        
        // Find conflicting appointments
        const conflict = localAppointments.find(apt => {
           if (apt.professionalId !== selectedSlot.proId) return false;
           if (apt.status === 'CANCELLED') return false;
           
           const aptStart = new Date(apt.date);
           const aptEnd = new Date(aptStart.getTime() + apt.durationMinutes * 60000);
           
           // Overlap check
           return (appointmentStart < aptEnd && appointmentEnd > aptStart);
        });
        
        if (conflict) {
           setConflictWarning(`Conflito com: ${conflict.clientName} (${new Date(conflict.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`);
        } else {
           setConflictWarning(null);
        }
     } else {
        setConflictWarning(null);
     }
  }, [bookingData.serviceIds, selectedSlot, localAppointments, agendaDate]);


  const handleCreateAppointment = () => {
      // Validate inputs
      const hasClient = bookingData.clientId || bookingClientSearch.trim().length > 0;
      if (!hasClient || bookingData.serviceIds.length === 0 || !selectedSlot) {
         alert('Selecione cliente e serviços.');
         return;
      }
      
      if (conflictWarning) {
         return; // Prevent booking on conflict
      }

      // Determine Client Name
      let clientName = bookingClientSearch;
      let clientId = bookingData.clientId;

      if (clientId) {
        const existingClient = clients.find(c => c.id === clientId);
        if (existingClient) clientName = existingClient.name;
      } else {
        // New Client logic (Guest)
        clientId = `guest-${Date.now()}`;
      }

      const selectedServicesData = services.filter(s => bookingData.serviceIds.includes(s.id));
      
      const appointmentDate = new Date(agendaDate);
      const [hours, minutes] = selectedSlot.time.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);

      const newApt: Appointment = {
        id: `apt-${Date.now()}`,
        clientId: clientId,
        clientName: clientName || 'Cliente',
        professionalId: selectedSlot.proId,
        professionalName: professionals.find(p => p.id === selectedSlot.proId)?.name || 'Profissional',
        serviceId: bookingData.serviceIds[0],
        serviceName: selectedServicesData.map(s => s.name).join(' + '),
        date: appointmentDate.toISOString(),
        status: 'SCHEDULED',
        price: selectedServicesData.reduce((sum, s) => sum + s.price, 0),
        durationMinutes: selectedServicesData.reduce((sum, s) => sum + s.durationMinutes, 0)
      };

      setLocalAppointments([...localAppointments, newApt]);
      setBookingModal(false);
      setBookingData({ clientId: '', serviceIds: [] });
      setBookingClientSearch('');
      setSelectedSlot(null);
  };

  // --- Image Upload Handlers ---
  const handleImageUpdate = (url: string) => {
    if (!imageUploadConfig) return;
    setProfessionals(prev => prev.map(p => {
      if (p.id === imageUploadConfig.proId) {
        return { ...p, [imageUploadConfig.field]: url };
      }
      return p;
    }));
    setImageUploadConfig(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageUpdate(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // --- Icon Selection Handlers ---
  const handleIconSelect = (iconKey: string) => {
     if (iconSelectorTarget === 'service' && editingService) {
         setEditingService({ ...editingService, icon: iconKey });
     } else if (iconSelectorTarget === 'product' && editingProduct) {
         setEditingProduct({ ...editingProduct, icon: iconKey });
     }
     setShowIconModal(false);
  };

  const handleSavePro = (e: React.FormEvent) => {
      e.preventDefault();
      if (addingPro) {
        const randomBanner = PRESET_BANNERS[Math.floor(Math.random() * PRESET_BANNERS.length)];
        const newPro = {
          ...editingPro,
          id: `p${Date.now()}`,
          availability: '10.0',
          performance: 100,
          appointmentsCount: 0,
          banner: editingPro.banner || randomBanner,
          avatar: editingPro.avatar || ''
        };
        setProfessionals([...professionals, newPro]);
      } else {
        setProfessionals(prev => prev.map(p => p.id === editingPro.id ? editingPro : p));
      }
      setEditingPro(null);
      setAddingPro(false);
  };

  const handleDeletePro = () => {
      if (deletingPro) {
        setProfessionals(prev => prev.filter(p => p.id !== deletingPro.id));
        setDeletingPro(null);
      }
  };

  const handleDeleteAppointment = () => {
      if (deletingAppointment) {
        setLocalAppointments(prev => prev.filter(a => a.id !== deletingAppointment.id));
        setDeletingAppointment(null);
      }
  };

  const handleDeleteProduct = () => {
      if (deletingProduct) {
        onProductUpdate(products.filter(p => p.id !== deletingProduct.id));
        setDeletingProduct(null);
      }
  };

  const handleDeleteService = () => {
      if (deletingService) {
        setServices(prev => prev.filter(s => s.id !== deletingService.id));
        setDeletingService(null);
      }
  };

  const handleSaveClient = (e: React.FormEvent) => {
      e.preventDefault();
      if (addingClient) {
         const newClient = {
            ...editingClient,
            id: `c${Date.now()}`,
            role: 'CLIENT',
            email: 'client@email.com' 
         };
         setClients([...clients, newClient]);
      } else {
         setClients(prev => prev.map(c => c.id === editingClient.id ? editingClient : c));
      }
      setEditingClient(null);
      setAddingClient(false);
  };

  const handleDeleteClient = () => {
      if (deletingClient) {
        setClients(prev => prev.filter(c => c.id !== deletingClient.id));
        setDeletingClient(null);
      }
  };

  const handleSaveService = (e: React.FormEvent) => {
      e.preventDefault();
      const serviceData = {
         ...editingService,
         price: Number(editingService.price),
         durationMinutes: Number(editingService.durationMinutes)
      };

      if (addingService) {
        setServices([...services, { ...serviceData, id: `s${Date.now()}` }]);
      } else {
        setServices(prev => prev.map(s => s.id === editingService.id ? serviceData : s));
      }
      setEditingService(null);
      setAddingService(false);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
      e.preventDefault();
      const productData = {
        ...editingProduct,
        price: Number(editingProduct.price),
        cost: Number(editingProduct.cost),
        stock: Number(editingProduct.stock)
      };

      if (addingProduct) {
        onProductUpdate([...products, { ...productData, id: `prod${Date.now()}` }]);
      } else {
        onProductUpdate(products.map(p => p.id === editingProduct.id ? productData : p));
      }
      setEditingProduct(null);
      setAddingProduct(false);
  };

  const handleSellProduct = () => {
    const { productId, price, quantity } = sellingProductData;
    const product = products.find(p => p.id === productId);
    
    if (product && product.stock >= quantity) {
      onProductUpdate(products.map(p => {
        if (p.id === productId) {
          return { 
             ...p, 
             stock: p.stock - quantity,
             sales: (p.sales || 0) + quantity 
          };
        }
        return p;
      }));
      setIsSellingProduct(false);
      setSellingProductData({ productId: '', price: '', quantity: 1 });
    } else {
      alert('Estoque insuficiente ou produto não selecionado.');
    }
  };
  
  const renderModalOverlay = (children: React.ReactNode, onClose: () => void, zIndex: string = 'z-50', allowOverflow: boolean = false) => (
    <div className={`fixed inset-0 ${zIndex} flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4`}>
      <div className={`w-full max-w-md rounded-xl border shadow-2xl relative ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200'} ${allowOverflow ? 'overflow-visible' : 'max-h-[90vh] overflow-y-auto custom-scrollbar'}`}>
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><X size={20} /></button>
         {children}
      </div>
    </div>
  );

  const renderIconPickerModal = () => (
     renderModalOverlay(
        <div className="p-6 h-[70vh] flex flex-col">
           <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Selecionar Ícone</h3>
           
           {/* Search Bar */}
           <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                 type="text" 
                 placeholder="Buscar ícone (ex: tesoura, barba, produto...)"
                 className={`w-full border rounded-lg pl-10 pr-4 py-2 outline-none ${theme === 'dark' ? 'bg-dark-950 border-dark-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                 value={iconSearch}
                 onChange={(e) => setIconSearch(e.target.value)}
                 autoFocus
              />
           </div>

           {/* Grid */}
           <div className="flex-1 overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                  {ICON_LIBRARY
                    .filter(i => 
                       i.label.toLowerCase().includes(iconSearch.toLowerCase()) || 
                       i.tags.some(t => t.includes(iconSearch.toLowerCase()))
                    )
                    .map((iconItem) => {
                       const IconComp = ICON_MAP[iconItem.key] || Scissors;
                       return (
                          <button
                             key={iconItem.key}
                             onClick={() => handleIconSelect(iconItem.key)}
                             className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-gold-500/10 hover:text-gold-500 border border-transparent hover:border-gold-500/30 transition-all group"
                             title={iconItem.label}
                          >
                             <IconComp size={24} />
                             <span className="text-[10px] text-gray-500 group-hover:text-white truncate w-full text-center">{iconItem.label}</span>
                          </button>
                       )
                    })
                  }
               </div>
               {ICON_LIBRARY.filter(i => i.label.toLowerCase().includes(iconSearch.toLowerCase()) || i.tags.some(t => t.includes(iconSearch.toLowerCase()))).length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                     <p>Nenhum ícone encontrado.</p>
                  </div>
               )}
           </div>
        </div>,
        () => setShowIconModal(false),
        'z-[60]'
     )
  );
  
  // --- Helper to get dynamic stats for professional details ---
  const getProStats = (period: '7' | '15' | '30') => {
     // Mock logic based on period to ensure dynamic data
     if (period === '7') return {
        commission: 1450, availability: '98%', services: 24, revenue: 2900, topService: 'Corte Premium', topProduct: 'Pomada Matte'
     };
     if (period === '15') return {
        commission: 3100, availability: '95%', services: 52, revenue: 6200, topService: 'Barba Real', topProduct: 'Minoxidil 5%'
     };
     // 30 days
     return {
        commission: 6500, availability: '92%', services: 118, revenue: 13000, topService: 'Combo Experience', topProduct: 'Shampoo Mentolado'
     };
  };

  const renderDashboard = () => {
    const showLeftChart = dashboardConfig.showRevenueChart;
    const showRightPanel = dashboardConfig.showBirthdays || dashboardConfig.showClientFlow;
    const showTopServices = dashboardConfig.showTopServices;
    const showTopPros = dashboardConfig.showTopPros;
    const showTopProducts = dashboardConfig.showTopProducts;
    const showRetention = dashboardConfig.showRetention;

    // Dynamic Top Products Calc
    const totalProdRev = topProductsPieData.reduce((acc, curr) => acc + curr.value, 0);
    const productsWithMetrics = topProductsPieData.map(p => ({
        ...p,
        percent: totalProdRev > 0 ? Math.round((p.value / totalProdRev) * 100) : 0
    }));

    return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('dashboard')}</h2>
            <p className="text-gray-500">Visão geral do seu negócio.</p>
         </div>
         <div className="flex gap-2 bg-dark-900 p-1 rounded-lg border border-dark-800">
             {(['7', '15', '30'] as ChartPeriod[]).map(p => (
                <button 
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${chartPeriod === p ? 'bg-gold-500 text-black shadow' : 'text-gray-500 hover:text-white'}`}
                >
                   {p} Dias
                </button>
             ))}
         </div>
      </div>

      {/* KPI Cards - Optimized Grid: Flexible flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-flow-col xl:auto-cols-fr gap-4 sm:gap-6">
         {/* 1. FATURAMENTO TOTAL */}
         {dashboardConfig.showRevenue && (
            <div className={`p-5 sm:p-6 rounded-xl border ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200 shadow-sm'} flex flex-col justify-between h-full relative overflow-hidden group`}>
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                  <DollarSign size={100} />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-900/20 rounded-lg text-green-500 border border-green-500/20 shadow-sm">
                        <DollarSign size={20} />
                     </div>
                     <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{t('totalRevenue')}</p>
                  </div>
                  <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                     {formatCurrency(metrics.totalRevenue)}
                  </h3>
                  <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs font-bold border border-green-500/20">
                        <TrendingUp size={12} />
                        <span>12,5%</span>
                     </div>
                     <span className="text-xs text-gray-500 font-medium">que Mês Passado</span>
                  </div>
               </div>
            </div>
         )}

         {/* 2. NOVOS CLIENTES */}
         {dashboardConfig.showClients && (
            <div className={`p-5 sm:p-6 rounded-xl border ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200 shadow-sm'} flex flex-col justify-between h-full relative overflow-hidden group`}>
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                  <Users size={100} />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-900/20 rounded-lg text-blue-500 border border-blue-500/20 shadow-sm">
                        <Users size={20} />
                     </div>
                     <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">NOVOS CLIENTES</p>
                  </div>
                  <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                     {formatCurrency(metrics.newClients)}
                  </h3>
                  <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs font-bold border border-green-500/20">
                        <TrendingUp size={12} />
                        <span>5%</span>
                     </div>
                     <span className="text-xs text-gray-500 font-medium">que Mês Passado</span>
                  </div>
               </div>
            </div>
         )}

         {/* 3. SERVIÇOS FEITOS */}
         {dashboardConfig.showOccupancy && (
             <div className={`p-5 sm:p-6 rounded-xl border ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200 shadow-sm'} flex flex-col justify-between h-full relative overflow-hidden group`}>
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                  <CheckCircle2 size={100} />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-900/20 rounded-lg text-purple-500 border border-purple-500/20 shadow-sm">
                        <Scissors size={20} />
                     </div>
                     <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">SERVIÇOS FEITOS</p>
                  </div>
                  <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                     {formatCurrency(metrics.services.revenue)}
                  </h3>
                  <p className="text-sm font-bold text-gray-400 mb-3">{metrics.services.count} Serviços Feitos</p>
                  <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs font-bold border border-green-500/20">
                        <TrendingUp size={12} />
                        <span>8%</span>
                     </div>
                     <span className="text-xs text-gray-500 font-medium">que Mês Passado</span>
                  </div>
               </div>
            </div>
         )}

         {/* 4. PRODUTOS VENDIDOS */}
         {dashboardConfig.showRetention && (
             <div className={`p-5 sm:p-6 rounded-xl border ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200 shadow-sm'} flex flex-col justify-between h-full relative overflow-hidden group`}>
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                  <ShoppingBag size={100} />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="p-2 bg-gradient-to-br from-orange-500/20 to-orange-900/20 rounded-lg text-orange-500 border border-orange-500/20 shadow-sm">
                        <ShoppingBag size={20} />
                     </div>
                     <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">PRODUTOS VENDIDOS</p>
                  </div>
                  <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                     {formatCurrency(metrics.products.revenue)}
                  </h3>
                  <p className="text-sm font-bold text-gray-400 mb-3">{metrics.products.count} Produtos Vendidos</p>
                  <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs font-bold border border-green-500/20">
                        <TrendingUp size={12} />
                        <span>15%</span>
                     </div>
                     <span className="text-xs text-gray-500 font-medium">que Mês Passado</span>
                  </div>
               </div>
            </div>
         )}
      </div>

      {/* Main Chart Section - Stacked on Tablet, Row on Desktop */}
      <div className={`grid grid-cols-1 ${showLeftChart && showRightPanel ? 'xl:grid-cols-2' : 'xl:grid-cols-1'} gap-6`}>
         {showLeftChart && (
            <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200 shadow-sm'} h-full`}>
               <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <TrendingUp className="text-gold-500"/> {t('revenue')}
               </h3>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#eee'} vertical={false} />
                        <XAxis dataKey="name" stroke="#666" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                        <YAxis stroke="#666" tick={{fill: '#666'}} axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                        <Tooltip content={<CustomChartTooltip />} cursor={{fill: theme === 'dark' ? '#ffffff05' : '#00000005'}} />
                        <Bar dataKey="revenue" fill={accentColor} radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         )}

         {/* Birthdays & Client Flow Column */}
         {showRightPanel && (
           <div className="space-y-6 h-full flex flex-col">
              {dashboardConfig.showBirthdays && (
                 <div className={`p-6 rounded-xl border flex-1 ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="flex justify-between items-center mb-4">
                       <h3 className={`text-xl font-bold flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          <Cake className="text-blue-500" size={24} /> {t('birthdays')}
                       </h3>
                       <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20">{upcomingBirthdays.length} clientes</span>
                    </div>
                    
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                       {upcomingBirthdays.length > 0 ? upcomingBirthdays.map(client => {
                          const isToday = client.daysUntil === 0;
                          const isTomorrow = client.daysUntil === 1;
                          
                          return (
                          <div key={client.id} className="flex items-center justify-between p-4 rounded-xl bg-dark-950/80 border border-dark-800 hover:border-gold-500/30 transition-all group">
                             <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center w-14 h-14 bg-dark-900 rounded-lg border border-dark-700 text-center">
                                   <span className="text-2xl font-bold text-white leading-none">{client.displayDate.split('/')[0]}</span>
                                </div>
                                <div>
                                   <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{client.name}</p>
                                   <p className="text-sm text-gray-400 font-medium">{client.age}</p>
                                </div>
                             </div>
                             
                             <div className="flex flex-col items-end gap-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${isToday ? 'bg-gold-500 text-black' : isTomorrow ? 'bg-blue-500/20 text-blue-400' : 'bg-dark-800 text-gray-500'}`}>
                                   {isToday ? 'HOJE!' : isTomorrow ? 'Amanhã' : `Faltam ${client.daysUntil} dias`}
                                </span>
                                <button 
                                   onClick={() => handleBirthdayWhatsApp(client.whatsapp, client.name, client.age)} 
                                   className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-green-900/20"
                                >
                                   <i className="fab fa-whatsapp text-lg"></i> Parabenizar
                                </button>
                             </div>
                          </div>
                       )}) : (
                          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                             <Gift size={48} className="mb-3 opacity-20" />
                             <p className="italic">Nenhum aniversariante próximo.</p>
                          </div>
                       )}
                    </div>
                 </div>
              )}
              
               {dashboardConfig.showClientFlow && (
                 <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                     <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                       <Users className="text-blue-500" /> {t('clientFlow')}
                    </h3>
                     <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#eee'} vertical={false} />
                              <XAxis dataKey="name" stroke="#666" tick={{fill: '#666', fontSize: 10}} axisLine={false} tickLine={false} />
                              <Tooltip content={<CustomChartTooltip />} />
                              <Line type="monotone" dataKey="clients" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} />
                           </LineChart>
                        </ResponsiveContainer>
                     </div>
                 </div>
              )}
           </div>
         )}
      </div>

      {/* ROW 1: Top Services & Top Pros (50/50 on Desktop) */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6`}>
          {/* Top Services */}
          {showTopServices && (
               <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200 shadow-sm'} h-full overflow-hidden`}>
                  <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                     <Scissors className="text-gold-500" /> {t('topServices')}
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="h-[180px] w-[180px] relative shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                <Pie 
                                  data={servicesPieData} 
                                  cx="50%" 
                                  cy="50%" 
                                  innerRadius={50} 
                                  outerRadius={80} 
                                  paddingAngle={5} 
                                  dataKey="value"
                                  stroke="none"
                                >
                                   {servicesPieData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                   ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                             </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <Scissors size={32} className="text-gray-600 opacity-50" />
                          </div>
                      </div>
                      
                      <div className="flex-1 space-y-3 w-full min-w-0">
                          {servicesPieData.map((service, index) => (
                             <div key={index} className="flex flex-col gap-1 border-b border-gray-800 pb-3 last:border-0">
                                {/* Line 1: Name = Countx */}
                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                   <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                   <span className="text-white font-bold text-base truncate">{service.name}</span>
                                   <span className="text-white">=</span>
                                   <span className="text-white text-sm font-bold">{Math.round(service.value / 80)}x</span>
                                </div>
                                {/* Line 2: Revenue = Percent% */}
                                <div className="flex items-center justify-center sm:justify-start sm:pl-4 gap-2">
                                    <span className="text-gold-500 font-sans font-black text-2xl tracking-tight">{formatCurrency(service.value)}</span>
                                   <span className="text-white text-lg">=</span>
                                   <span className="text-white font-bold">{service.percent}%</span>
                                </div>
                             </div>
                          ))}
                      </div>
                  </div>
               </div>
          )}
          
          {/* Top Professionals */}
          {showTopPros && (
               <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200 shadow-sm'} h-full`}>
                   <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <Trophy className="text-gold-500" /> {t('topPros')}
                   </h3>
                   <div className="space-y-4">
                       {/* 1st Place */}
                       <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gold-500/10 to-transparent border border-gold-500/30 rounded-xl">
                           <div className="flex items-center gap-6">
                               <span className="text-4xl font-black text-gold-500 drop-shadow-sm">1</span>
                               <div>
                                   <p className="text-xl font-bold text-white">João da Silva</p>
                                   <p className="text-xs text-gray-400 uppercase tracking-wider">Master Barber</p>
                               </div>
                           </div>
                           <div className="text-right">
                               <p className="text-2xl font-mono font-bold text-gold-500">R$ 9.940,00</p>
                           </div>
                       </div>

                       {/* 2nd Place */}
                       <div className="flex items-center justify-between p-4 bg-dark-950/50 border border-gray-700 rounded-xl">
                           <div className="flex items-center gap-6">
                               <span className="text-3xl font-black text-gray-300">2</span>
                               <div>
                                   <p className="text-lg font-bold text-white">André Costa</p>
                                   <p className="text-xs text-gray-500 uppercase tracking-wider">Barbeiro</p>
                               </div>
                           </div>
                           <div className="text-right">
                               <p className="text-xl font-mono font-bold text-gray-300">R$ 8.050,00</p>
                           </div>
                       </div>

                       {/* 3rd Place */}
                       <div className="flex items-center justify-between p-4 bg-dark-950/30 border border-gray-800 rounded-xl">
                           <div className="flex items-center gap-6">
                               <span className="text-3xl font-black text-orange-700">3</span>
                               <div>
                                   <p className="text-base font-bold text-white">Pedro Santos</p>
                                   <p className="text-xs text-gray-500 uppercase tracking-wider">Especialista</p>
                               </div>
                           </div>
                           <div className="text-right">
                               <p className="text-lg font-mono font-bold text-gray-400">R$ 6.860,00</p>
                           </div>
                       </div>
                   </div>
               </div>
          )}
      </div>

      {/* ROW 2: Top Products & Retention (50/50 on Desktop) */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6`}>
         {/* Top Products */}
         {showTopProducts && (
             <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200 shadow-sm'} h-full overflow-hidden`}>
                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                   <ShoppingBag className="text-green-500" /> {t('topProducts')}
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                   <div className="h-[180px] w-[180px] relative shrink-0">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                             <Pie 
                               data={topProductsPieData} 
                               cx="50%" 
                               cy="50%" 
                               innerRadius={50} 
                               outerRadius={80} 
                               paddingAngle={5} 
                               dataKey="value"
                               stroke="none"
                             >
                                {topProductsPieData.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                             </Pie>
                             <Tooltip content={<CustomPieTooltip />} />
                          </PieChart>
                       </ResponsiveContainer>
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <ShoppingBag size={32} className="text-gray-600 opacity-50" />
                       </div>
                   </div>

                   <div className="flex-1 w-full space-y-3 min-w-0">
                       {productsWithMetrics.length > 0 ? productsWithMetrics.map((prod, index) => (
                          <div key={index} className="flex flex-col gap-1 border-b border-gray-800 pb-3 last:border-0">
                               {/* Line 1: Name = Countx */}
                               <div className="flex items-center justify-center sm:justify-start gap-2">
                                   <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                   <span className="text-white font-bold text-base truncate" title={prod.name}>{prod.name}</span>
                                   <span className="text-white">=</span>
                                   <span className="text-white text-sm font-bold">{prod.sales}x</span>
                               </div>
                               {/* Line 2: Revenue = Percent% */}
                               <div className="flex items-center justify-center sm:justify-start sm:pl-4 gap-2">
                                   <span className="text-gold-500 font-sans font-black text-2xl tracking-tight">{formatCurrency(prod.value)}</span>
                                   <span className="text-white text-lg">=</span>
                                   <span className="text-white font-bold">{prod.percent}%</span>
                               </div>
                          </div>
                       )) : (
                          <p className="text-gray-500 text-sm italic text-center w-full">Nenhuma venda registrada.</p>
                       )}
                   </div>
                </div>
             </div>
         )}

         {/* Retention */}
         {showRetention && (
             <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200 shadow-sm'} h-full`}>
                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                   <Repeat className="text-orange-500" /> {t('retention')}
                </h3>
                <div className="flex flex-col gap-4 h-full justify-center">
                   <div className="bg-dark-950 p-6 rounded-xl border border-dark-800 text-center flex-1 flex flex-col justify-center">
                      <p className="text-4xl font-bold text-white mb-2">2.4</p>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Frequência Média</p>
                      <div className="flex justify-center mt-3">
                         <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-sm font-bold">Média de 2 visitas/cliente/mês</span>
                      </div>
                   </div>
                   <div className="bg-dark-950 p-6 rounded-xl border border-dark-800 text-center flex-1 flex flex-col justify-center">
                      <p className="text-4xl font-bold text-white mb-2">1.8</p>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Serviços por Cliente</p>
                      <div className="flex justify-center mt-3">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm font-bold">Cerca de 2 serviços por visita</span>
                      </div>
                   </div>
                </div>
             </div>
         )}
      </div>
    </div>
  )};

  const renderClients = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                  <h2 className="text-2xl font-bold text-white">{t('clients')}</h2>
                  <p className="text-gray-500">{clients.length} Clientes Cadastrados</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                     <Search className="absolute left-3 top-3 text-gray-500" size={18}/>
                     <input 
                       type="text" 
                       placeholder="Buscar cliente..." 
                       className="w-full bg-dark-900 border border-dark-800 rounded-lg pl-10 pr-4 py-2.5 text-white outline-none focus:border-gold-500 transition-colors"
                       value={clientSearch}
                       onChange={(e) => setClientSearch(e.target.value)}
                     />
                 </div>
                 <Button onClick={() => { setEditingClient({}); setAddingClient(true); }}>
                    <Plus size={18} /> Adicionar Cliente
                 </Button>
              </div>
          </div>

          <div className="bg-dark-900 border border-dark-800 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="bg-dark-950 border-b border-dark-800">
                              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp</th>
                              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">CPF</th>
                              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Aniversário</th>
                              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-800">
                          {clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase())).map(client => (
                              <tr key={client.id} className="hover:bg-dark-800/50 transition-colors">
                                  <td className="p-4 font-semibold text-white">{client.name}</td>
                                  <td className="p-4 text-gray-400">
                                      <div className="flex items-center gap-3">
                                         {client.whatsapp ? (
                                             <button 
                                                onClick={() => handleOpenWhatsApp(client.whatsapp, client.name)}
                                                className="text-green-500 hover:text-green-400 transition-colors"
                                                title="Abrir WhatsApp"
                                             >
                                                <i className="fab fa-whatsapp text-xl" />
                                             </button>
                                         ) : (
                                             <div className="w-5"></div>
                                         )}
                                         <span>{client.whatsapp || '-'}</span>
                                      </div>
                                  </td>
                                  <td className="p-4 text-gray-400">{client.cpf || '-'}</td>
                                  <td className="p-4 text-gray-400">{formatBirthdayAge(client.birthDate)}</td>
                                  <td className="p-4 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                          <button onClick={() => { setEditingClient(client); setAddingClient(false); }} className="p-2 text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors">
                                              <Pencil size={16} />
                                          </button>
                                          <button onClick={() => setDeletingClient(client)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                              <Trash2 size={16} />
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
  );

  const renderTeam = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{t('team')}</h2>
              <Button onClick={() => { setEditingPro({}); setAddingPro(true); }}>
                  <Plus size={18} /> Adicionar Profissional
              </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {professionals.map(pro => (
                  <div key={pro.id} className="bg-dark-900 border border-dark-800 rounded-xl overflow-hidden group hover:border-gold-500/30 transition-all duration-300 relative">
                      {/* Banner Area */}
                      <div className="h-32 bg-dark-950 relative group/banner">
                         <img src={pro.banner || PRESET_BANNERS[0]} alt="Banner" className="w-full h-full object-cover opacity-60" />
                         <button 
                             onClick={() => { setImageUploadConfig({proId: pro.id, field: 'banner'}); fileInputRef.current?.click(); }}
                             className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-gold-500 hover:text-black transition-all opacity-0 group-hover/banner:opacity-100"
                         >
                             <Upload size={14}/>
                         </button>
                      </div>
                      
                      {/* Content */}
                      <div className="px-6 pb-4 pt-0 relative">
                          {/* Avatar - Elevated */}
                          <div className="absolute -top-12 left-6">
                             <div className="w-24 h-24 rounded-full border-4 border-dark-900 bg-dark-800 overflow-hidden relative group/avatar shadow-xl">
                                <img src={pro.avatar || PRESET_AVATARS[0]} alt={pro.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer"
                                     onClick={() => { setImageUploadConfig({proId: pro.id, field: 'avatar'}); fileInputRef.current?.click(); }}
                                >
                                   <Camera size={20} className="text-white"/>
                                </div>
                             </div>
                          </div>

                          <div className="flex justify-end pt-8 pb-0">
                              <Button 
                                 className="text-sm py-3 px-10 bg-gold-500 text-black font-bold rounded-full hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20 w-auto" 
                                 onClick={() => { setSelectedProForDetails(pro); }}
                              >
                                 Ver Mais
                              </Button>
                          </div>
                          
                          <div className="mt-1">
                              <h3 className="text-xl font-bold text-white">{pro.name}</h3>
                              <p className="text-sm text-gold-500 font-bold uppercase tracking-wider">{pro.role}</p>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          {/* Hidden File Input for Uploads */}
          <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*"
             onChange={handleFileUpload}
          />
      </div>
  );

  const renderServices = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{t('services')}</h2>
              <Button onClick={() => { setEditingService({}); setAddingService(true); }}>
                  <Plus size={18} /> Adicionar Serviço
              </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => {
                  const Icon = ICON_MAP[service.icon || 'scissors'] || Scissors;
                  return (
                      <div key={service.id} className="bg-dark-900 border border-dark-800 p-6 rounded-xl flex flex-col justify-between group hover:border-gold-500/30 transition-all min-h-[180px]">
                          <div className="flex items-start gap-4 mb-4">
                              <div className="p-4 bg-dark-950 rounded-lg text-gold-500 border border-dark-800 group-hover:border-gold-500/50 transition-colors">
                                  <Icon size={28} />
                              </div>
                              <div className="flex-1">
                                  <h3 className="text-lg font-bold text-white leading-tight">{service.name}</h3>
                                  <p className="text-base font-bold text-gray-300 mt-2 flex items-center gap-2">
                                      <Clock size={16} className="text-gray-400" /> {service.durationMinutes} min
                                  </p>
                              </div>
                          </div>
                          <div className="flex items-end justify-between mt-auto border-t border-dark-800 pt-4">
                              <div>
                                  <p className="text-xl font-bold text-white">{formatCurrency(service.price)}</p>
                              </div>
                              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => { setEditingService(service); setAddingService(false); }} className="text-gray-400 hover:text-gold-500"><Pencil size={18}/></button>
                                  <button onClick={() => setDeletingService(service)} className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
  );

  const renderProducts = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{t('products')}</h2>
              <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setIsSellingProduct(true)} className="border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white">
                     <ShoppingCart size={18} /> Venda Rápida
                  </Button>
                  <Button onClick={() => { setEditingProduct({}); setAddingProduct(true); }}>
                      <Plus size={18} /> Novo Produto
                  </Button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => {
                 const Icon = ICON_MAP[product.icon || 'box'] || Box;
                 return (
                  <div key={product.id} className="bg-dark-900 border border-dark-800 p-6 rounded-xl flex flex-col justify-between group hover:border-gold-500/30 transition-all h-full min-h-[180px]">
                      <div className="flex items-start gap-4 mb-4">
                          <div className="p-4 bg-dark-950 rounded-lg text-gold-500 border border-dark-800 group-hover:border-gold-500/50 transition-colors">
                             <Icon size={28} />
                          </div>
                          <div className="flex-1">
                              <h3 className="text-lg font-bold text-white leading-tight">{product.name}</h3>
                              <p className="text-base font-bold text-gray-300 mt-2">Estoque: <span className="text-white font-black">{product.stock} un</span></p>
                          </div>
                      </div>
                      
                      <div className="flex items-end justify-between mt-auto border-t border-dark-800 pt-4">
                          <div>
                             <p className="text-xl font-bold text-white">{formatCurrency(product.price)}</p>
                          </div>
                          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingProduct(product); setAddingProduct(false); }} className="text-gray-400 hover:text-gold-500"><Pencil size={18}/></button>
                              <button onClick={() => setDeletingProduct(product)} className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                          </div>
                      </div>
                  </div>
                 );
              })}
          </div>
      </div>
  );

  // --- Agenda Grid Logic ---
  const HOURS = Array.from({ length: 11 }, (_, i) => 9 + i); // 09:00 to 19:00
  
  const renderAgenda = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-dark-900 border border-dark-800 p-4 rounded-xl">
         <div className="flex items-center gap-4">
            <Button 
               variant="outline" 
               className="border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black px-6 font-bold uppercase tracking-wider text-xs"
               onClick={() => setAgendaDate(new Date())}
            >
               HOJE
            </Button>
            <div className="flex items-center gap-2 bg-dark-950 rounded-lg p-1 border border-dark-800">
                <button onClick={() => { const d = new Date(agendaDate); d.setDate(d.getDate()-1); setAgendaDate(d); }} className="p-2 hover:bg-dark-800 rounded-lg text-gray-400 hover:text-white"><ChevronLeft size={20}/></button>
                <div className="relative group px-4 cursor-pointer" onClick={() => { setShowMiniCalendar(!showMiniCalendar); setPickerDate(agendaDate); }}>
                    <div className="flex items-center gap-2">
                       <Calendar size={18} className="text-gold-500" />
                       <span className="text-sm font-bold text-white capitalize whitespace-nowrap">
                          {agendaDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                       </span>
                    </div>
                    {showMiniCalendar && renderMiniCalendar((date) => {
                       setAgendaDate(date);
                       setShowMiniCalendar(false);
                    })}
                </div>
                <button onClick={() => { const d = new Date(agendaDate); d.setDate(d.getDate()+1); setAgendaDate(d); }} className="p-2 hover:bg-dark-800 rounded-lg text-gray-400 hover:text-white"><ChevronRight size={20}/></button>
            </div>
         </div>
         
         <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                <div className="w-4 h-4 rounded bg-gold-500 shadow-sm shadow-gold-500/50"></div> Agendado
             </div>
             <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                <div className="w-4 h-4 rounded bg-green-600 shadow-sm shadow-green-600/50"></div> Concluído
             </div>
         </div>
      </div>

      {/* Grid */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl overflow-hidden shadow-2xl">
         <div className="overflow-x-auto custom-scrollbar">
             <div className="min-w-full inline-block align-middle">
                {/* Grid Header: Professionals */}
                <div 
                   className="grid border-b border-dark-800 bg-dark-950"
                   style={{ gridTemplateColumns: `80px repeat(${professionals.length}, minmax(220px, 1fr))` }}
                >
                   <div className="sticky left-0 z-20 bg-dark-950 p-4 border-r border-dark-800 text-center text-gray-500 font-bold text-xs uppercase tracking-wider shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)]">Hora</div>
                   {professionals.map(pro => (
                      <div key={pro.id} className="p-4 border-r border-dark-800 last:border-0 text-center">
                         <div className="flex items-center justify-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-dark-800 border border-dark-700 overflow-hidden shrink-0">
                                 <img src={pro.avatar || PRESET_AVATARS[0]} alt={pro.name} className="w-full h-full object-cover" />
                             </div>
                             <span className="font-bold text-white text-sm whitespace-nowrap">{pro.name.split('"')[0]}</span>
                         </div>
                      </div>
                   ))}
                </div>

                {/* Grid Body: Time Slots */}
                <div className="divide-y divide-dark-800">
                   {HOURS.map(hour => (
                      <div 
                         key={hour} 
                         className="grid min-h-[100px]"
                         style={{ gridTemplateColumns: `80px repeat(${professionals.length}, minmax(220px, 1fr))` }}
                      >
                         {/* Time Label */}
                         <div className="sticky left-0 z-20 bg-dark-900 p-4 border-r border-dark-800 text-center text-gray-500 text-xs font-mono flex items-start justify-center pt-6 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)]">
                            {`${hour}:00`}
                         </div>
                         
                         {/* Slots per Professional */}
                         {professionals.map(pro => {
                            // Find appointments starting in this hour
                            const aptsInSlot = localAppointments.filter(a => {
                               const d = new Date(a.date);
                               return d.getDate() === agendaDate.getDate() && 
                                      d.getMonth() === agendaDate.getMonth() && 
                                      d.getFullYear() === agendaDate.getFullYear() &&
                                      a.professionalId === pro.id &&
                                      d.getHours() === hour;
                            });

                            return (
                               <div key={pro.id} className="border-r border-dark-800 last:border-0 relative p-2 group/slot hover:bg-dark-800/30 transition-colors">
                                  {/* Add Button (Only show if empty) */}
                                  {aptsInSlot.length === 0 && (
                                     <button 
                                       onClick={() => { setSelectedSlot({time: `${hour}:00`, proId: pro.id}); setBookingModal(true); }}
                                       className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-dark-800 text-gold-500 opacity-100 hover:scale-110 flex items-center justify-center transition-all border border-dark-700 hover:border-gold-500 shadow-sm"
                                     >
                                        <Plus size={16} />
                                     </button>
                                  )}

                                  {/* Render Appointments */}
                                  {aptsInSlot.map(apt => {
                                     // Calculate height based on duration (approx 100px per hour)
                                     const height = Math.max(80, (apt.durationMinutes / 60) * 100 - 10);
                                     return (
                                        <div 
                                           key={apt.id}
                                           onClick={() => { setViewingAppointment(apt); }}
                                           className={`absolute top-2 left-2 right-2 rounded-lg p-3 border-l-4 cursor-pointer hover:brightness-110 transition-all shadow-lg z-10 flex flex-col justify-between ${
                                              apt.status === 'COMPLETED' 
                                                ? 'bg-green-900/20 border-green-500' 
                                                : 'bg-gold-500/10 border-gold-500'
                                           }`}
                                           style={{ height: `${height}px` }}
                                        >
                                           <div>
                                              <p className={`text-sm font-bold leading-tight ${apt.status === 'COMPLETED' ? 'text-green-400' : 'text-gold-500'}`}>
                                                 {apt.clientName}
                                              </p>
                                              <p className="text-xs text-gray-400 mt-1 line-clamp-1">{apt.serviceName}</p>
                                           </div>
                                           <div className="flex items-center justify-between mt-auto">
                                              <span className="text-[10px] font-mono text-gray-500 bg-black/20 px-1.5 rounded">
                                                 {new Date(apt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                              </span>
                                              {apt.status === 'COMPLETED' && <CheckCircle2 size={14} className="text-green-500"/>}
                                           </div>
                                        </div>
                                     )
                                  })}
                               </div>
                            );
                         })}
                      </div>
                   ))}
                </div>
             </div>
         </div>
      </div>

      {/* Add Appointment Modal (Triggered from Grid) */}
      {bookingModal && renderModalOverlay(
         <div className="p-6">
             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
               <Plus className="text-gold-500" /> Novo Agendamento
            </h3>
            
            <div className="space-y-5">
               {/* Info Badge */}
               <div className="bg-dark-950 p-3 rounded-lg border border-dark-800 flex items-center gap-3 text-sm text-gray-400">
                  <Clock className="text-gold-500" size={16} />
                  <span>
                     {professionals.find(p => p.id === selectedSlot?.proId)?.name} • {selectedSlot?.time}
                  </span>
               </div>

               {/* Client Selection */}
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Cliente</label>
                  {/* Searchable Input for New/Existing Client */}
                  <input 
                     type="text"
                     placeholder="Pesquisar Cliente"
                     className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500 mb-2"
                     value={bookingClientSearch}
                     onChange={e => {
                        setBookingClientSearch(e.target.value);
                        // Reset selected client ID if user types new name
                        if (bookingData.clientId) setBookingData({...bookingData, clientId: ''});
                     }}
                  />
                  {/* Dropdown results if searching and matching */}
                  {bookingClientSearch && !bookingData.clientId && (
                      <div className="max-h-40 overflow-y-auto bg-dark-950 border border-dark-800 rounded-lg mb-2">
                         {clients.filter(c => c.name.toLowerCase().includes(bookingClientSearch.toLowerCase())).map(c => (
                            <div 
                               key={c.id} 
                               className="p-2 hover:bg-dark-800 cursor-pointer text-sm text-gray-300"
                               onClick={() => {
                                  setBookingData({...bookingData, clientId: c.id});
                                  setBookingClientSearch(c.name);
                               }}
                            >
                               {c.name}
                            </div>
                         ))}
                         <div className="p-2 text-xs text-gray-500 italic border-t border-dark-800">
                            "{bookingClientSearch}" será cadastrado como novo cliente avulso se não selecionado.
                         </div>
                      </div>
                  )}
               </div>

               {/* Service Selection */}
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Serviços</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar bg-dark-950 border border-dark-800 rounded-lg p-2">
                    {services.map(s => {
                      const isSelected = bookingData.serviceIds.includes(s.id);
                      return (
                        <div 
                          key={s.id}
                          onClick={() => toggleBookingService(s.id)}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all ${
                            isSelected ? 'bg-dark-800 border border-gold-500/50' : 'hover:bg-dark-900 border border-transparent'
                          }`}
                        >
                           <div className="flex items-center gap-2">
                              <div className={isSelected ? 'text-gold-500' : 'text-gray-600'}>
                                {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                              </div>
                              <span className="text-sm text-gray-300">{s.name}</span>
                           </div>
                           <div className="text-right">
                              <span className="block text-xs font-mono text-gold-500">{formatCurrency(s.price)}</span>
                              <span className="block text-[10px] text-gray-500">{s.durationMinutes} min</span>
                           </div>
                        </div>
                      );
                    })}
                  </div>
               </div>
               
               {/* Dynamic Conflict Warning */}
               {conflictWarning && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-xs">
                     <AlertCircle size={14} className="shrink-0 mt-0.5" />
                     <span>Impossível agendar: Já existe cliente agendado neste horário para realizar esses serviços. ({conflictWarning})</span>
                  </div>
               )}

               {/* Totals */}
               {bookingData.serviceIds.length > 0 && (
                  <div className="flex justify-between items-center pt-4 border-t border-dark-800">
                     <span className="text-gray-400 text-sm">Total Estimado</span>
                     <div className="text-right">
                        <span className="block text-white font-bold text-lg">
                           {formatCurrency(services.filter(s => bookingData.serviceIds.includes(s.id)).reduce((a,b)=>a+b.price,0))}
                        </span>
                        <span className="block text-xs text-gray-500">
                           {services.filter(s => bookingData.serviceIds.includes(s.id)).reduce((a,b)=>a+b.durationMinutes,0)} min
                        </span>
                     </div>
                  </div>
               )}
            </div>

            <div className="flex gap-3 mt-8">
               <Button variant="secondary" onClick={() => setBookingModal(false)} className="flex-1">Cancelar</Button>
               <Button onClick={handleCreateAppointment} className="flex-1" disabled={!!conflictWarning || bookingData.serviceIds.length === 0}>Agendar</Button>
            </div>
         </div>,
         () => setBookingModal(false)
      )}

      {/* View Appointment Details (Triggered by clicking an appointment) */}
      {viewingAppointment && renderModalOverlay(
         <div className="p-6">
             <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">Detalhes do Agendamento</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${viewingAppointment.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' : 'bg-gold-500/20 text-gold-500'}`}>
                   {viewingAppointment.status === 'SCHEDULED' ? 'Agendado' : 'Concluído'}
                </span>
             </div>
             
             <div className="space-y-4 mb-8">
                 <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg">
                        {viewingAppointment.clientName.charAt(0)}
                     </div>
                     <div>
                        <p className="text-white font-bold">{viewingAppointment.clientName}</p>
                        <p className="text-xs text-gray-500">Cliente</p>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-dark-950 rounded-lg border border-dark-800">
                       <p className="text-xs text-gray-500 uppercase mb-1">Serviço</p>
                       <p className="text-white font-medium text-sm">{viewingAppointment.serviceName}</p>
                    </div>
                    <div className="p-3 bg-dark-950 rounded-lg border border-dark-800">
                       <p className="text-xs text-gray-500 uppercase mb-1">Profissional</p>
                       <p className="text-white font-medium text-sm">{viewingAppointment.professionalName}</p>
                    </div>
                    <div className="p-3 bg-dark-950 rounded-lg border border-dark-800">
                       <p className="text-xs text-gray-500 uppercase mb-1">Horário</p>
                       <p className="text-white font-medium text-sm">
                          {new Date(viewingAppointment.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                       </p>
                    </div>
                    <div className="p-3 bg-dark-950 rounded-lg border border-dark-800">
                       <p className="text-xs text-gray-500 uppercase mb-1">Valor</p>
                       <p className="text-gold-500 font-mono font-bold text-sm">{formatCurrency(viewingAppointment.price)}</p>
                    </div>
                 </div>
             </div>

             <div className="flex gap-3">
                 <Button 
                    variant="secondary" 
                    className="flex-1 bg-dark-950 border-dark-800 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    onClick={() => { setDeletingAppointment(viewingAppointment); setViewingAppointment(null); }}
                 >
                    <Trash2 size={18} /> Excluir
                 </Button>
                 {viewingAppointment.status === 'SCHEDULED' && (
                    <Button 
                       className="flex-1 bg-green-600 hover:bg-green-700 text-white border-none"
                       onClick={() => {
                          setLocalAppointments(prev => prev.map(a => a.id === viewingAppointment.id ? {...a, status: 'COMPLETED'} : a));
                          setViewingAppointment(null);
                       }}
                    >
                       <CheckCircle2 size={18} /> Concluir
                    </Button>
                 )}
             </div>
         </div>,
         () => setViewingAppointment(null)
      )}

      {/* Delete Appointment Confirm */}
      {deletingAppointment && renderModalOverlay(
         <div className="p-6 text-center">
             <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Cancelar Agendamento?</h3>
             <p className="text-gray-500 mb-6 text-sm">Tem certeza que deseja remover o agendamento de <span className="text-white font-bold">{deletingAppointment.clientName}</span>?</p>
             <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setDeletingAppointment(null)}>Não</Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none" onClick={handleDeleteAppointment}>Sim, Cancelar</Button>
             </div>
         </div>,
         () => setDeletingAppointment(null)
      )}

    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
         <Settings className="text-gold-500" /> {t('settings')}
      </h2>

      {/* 1. Appearance */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Palette size={20} className="text-gold-500" /> {t('appearance')}
        </h3>
        <div className="flex flex-col gap-6">
           <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{t('theme')}</label>
              <div className="flex bg-dark-950 p-1 rounded-lg border border-dark-800 w-fit">
                 <button onClick={() => setTheme('light')} className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${theme === 'light' ? 'bg-white text-black shadow' : 'text-gray-500'}`}>
                    <Sun size={16} /> Claro
                 </button>
                 <button onClick={() => setTheme('dark')} className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${theme === 'dark' ? 'bg-dark-800 text-white shadow' : 'text-gray-500'}`}>
                    <Moon size={16} /> Escuro
                 </button>
              </div>
           </div>
        </div>
      </div>
      
      {/* 2. Security & Access */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <Lock size={20} className="text-red-500" /> {t('security')}
          </h3>
          <div className="space-y-4">
             {/* Professional Key */}
             <div className="flex items-center justify-between p-4 bg-dark-950 border border-dark-800 rounded-lg">
                 <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-1">Chave de Acesso Profissional</p>
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-gray-400 text-lg tracking-widest min-w-[80px]">
                           {showShopKey ? shopKey : '••••••••'}
                        </span>
                        <button onClick={() => setShowShopKey(!showShopKey)} className="text-gray-500 hover:text-white p-1 rounded hover:bg-dark-800 transition-colors" title={showShopKey ? "Ocultar" : "Mostrar"}>
                           {showShopKey ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    {editingShopKey ? (
                       <>
                          <input 
                             type="text" 
                             value={shopKey} 
                             onChange={(e) => setShopKey(e.target.value)}
                             className="bg-dark-900 border border-dark-700 rounded px-3 py-2 text-sm text-white outline-none w-32"
                          />
                          <button onClick={() => setEditingShopKey(false)} className="p-2 bg-green-500/20 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors">
                             <Check size={18} />
                          </button>
                       </>
                    ) : (
                       <button onClick={() => setEditingShopKey(true)} className="p-2 bg-dark-800 text-gray-400 rounded hover:bg-gold-500/10 hover:text-gold-500 transition-colors">
                          <Pencil size={18} />
                       </button>
                    )}
                 </div>
             </div>
             
             {/* Master Key */}
             <div className="flex items-center justify-between p-4 bg-dark-950 border border-dark-800 rounded-lg">
                 <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-1">Chave Mestra (Dono)</p>
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-gray-400 text-lg tracking-widest min-w-[80px]">
                           {showMasterKey ? masterKey : '••••••••'}
                        </span>
                        <button onClick={() => setShowMasterKey(!showMasterKey)} className="text-gray-500 hover:text-white p-1 rounded hover:bg-dark-800 transition-colors" title={showMasterKey ? "Ocultar" : "Mostrar"}>
                           {showMasterKey ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    {editingMasterKey ? (
                       <>
                          <input 
                             type="text" 
                             value={masterKey} 
                             onChange={(e) => setMasterKey(e.target.value)}
                             className="bg-dark-900 border border-dark-700 rounded px-3 py-2 text-sm text-white outline-none w-32"
                          />
                          <button onClick={() => setEditingMasterKey(false)} className="p-2 bg-green-500/20 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors">
                             <Check size={18} />
                          </button>
                       </>
                    ) : (
                       <button onClick={() => setEditingMasterKey(true)} className="p-2 bg-dark-800 text-gray-400 rounded hover:bg-dark-700 hover:text-white transition-colors">
                          <Pencil size={18} />
                       </button>
                    )}
                 </div>
             </div>
          </div>
      </div>

      {/* 3. Dashboard Config */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
             <LayoutDashboard size={20} className="text-blue-500" /> Personalizar Dashboard
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {[
                { key: 'showRevenue', label: 'Receita Total' },
                { key: 'showClients', label: 'Novos Clientes' },
                { key: 'showOccupancy', label: 'Serviços Feitos' },
                { key: 'showRetention', label: 'Produtos Vendidos' },
                { key: 'showRevenueChart', label: 'Gráfico de Receita' },
                { key: 'showBirthdays', label: 'Aniversariantes' },
                { key: 'showClientFlow', label: 'Fluxo de Clientes' },
                { key: 'showTopPros', label: 'Top Profissionais' },
                { key: 'showTopServices', label: 'Top Serviços' },
                { key: 'showTopProducts', label: 'Top Produtos' },
             ].map(item => {
                const isActive = dashboardConfig[item.key as keyof typeof dashboardConfig];
                return (
                <div key={item.key} className="flex items-center justify-between p-4 bg-dark-950 rounded-lg border border-dark-800 hover:border-dark-700 transition-colors">
                   <span className="text-base font-bold text-gray-200">{item.label}</span>
                   <button 
                      onClick={() => setDashboardConfig({...dashboardConfig, [item.key]: !isActive})}
                      className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${isActive ? 'bg-gold-500' : 'bg-dark-800 border border-dark-700'}`}
                   >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                   </button>
                </div>
             )})}
          </div>
      </div>
    </div>
  );

  const SidebarItem = ({ id, icon: Icon, label }: { id: TabType, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        activeTab === id 
          ? `bg-gradient-to-r from-${accentColor === '#f59e0b' ? 'gold' : 'blue'}-500/10 to-transparent border-l-2 border-${accentColor === '#f59e0b' ? 'gold' : 'blue'}-500 text-white font-medium` 
          : 'text-gray-400 hover:text-white hover:bg-dark-800/50'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'text-gold-500' : 'text-gray-500 group-hover:text-white'} />
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-dark-950 text-gray-100' : 'bg-gray-50 text-gray-900'} font-sans`}>
      {/* Sidebar */}
      <aside className={`w-64 ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200'} border-r flex flex-col hidden md:flex`}>
        <div className="p-6 border-b border-dark-800/50 flex items-center gap-2 text-gold-500">
          <Scissors size={28} className="rotate-[-45deg]" />
          <span className="text-xl font-bold tracking-wider text-white">BARBERIA<span className="text-gold-500">.PRO</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label={t('dashboard')} />
          <SidebarItem id="clients" icon={Users} label={t('clients')} />
          <SidebarItem id="agenda" icon={Calendar} label={t('agenda')} />
          <SidebarItem id="team" icon={Briefcase} label={t('team')} />
          <SidebarItem id="services" icon={Scissors} label={t('services')} />
          <SidebarItem id="products" icon={ShoppingBag} label={t('products')} />
          <div className="pt-4 mt-4 border-t border-dark-800">
            <SidebarItem id="settings" icon={Settings} label={t('settings')} />
          </div>
        </nav>

        <div className="p-4 border-t border-dark-800">
           <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-black font-bold text-xs">DA</div>
              <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-bold text-white truncate">Dono Admin</p>
                 <p className="text-xs text-gray-500">admin@barberia.pro</p>
              </div>
              <button onClick={onLogout} className="text-gray-500 hover:text-white"><LogOut size={16}/></button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
         {/* Mobile Header */}
         <header className={`md:hidden h-16 border-b ${theme === 'dark' ? 'bg-dark-900 border-dark-800' : 'bg-white border-gray-200'} flex items-center justify-between px-4`}>
            <div className="flex items-center gap-2 text-gold-500">
               <Scissors size={24} className="rotate-[-45deg]" />
               <span className="font-bold text-white">BARBERIA.PRO</span>
            </div>
            <button className="text-gray-400"><AlignJustify size={24}/></button>
         </header>

         {/* Scrollable Content Area */}
         <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-24 md:pb-8">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'clients' && renderClients()}
            {activeTab === 'agenda' && renderAgenda()}
            {activeTab === 'team' && renderTeam()}
            {activeTab === 'services' && renderServices()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'settings' && renderSettings()}
         </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-dark-900 border-t border-dark-800 flex justify-around py-3 px-2 z-40">
         <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-lg ${activeTab === 'dashboard' ? 'text-gold-500' : 'text-gray-500'}`}><LayoutDashboard size={24}/></button>
         <button onClick={() => setActiveTab('agenda')} className={`p-2 rounded-lg ${activeTab === 'agenda' ? 'text-gold-500' : 'text-gray-500'}`}><Calendar size={24}/></button>
         <button onClick={() => setActiveTab('clients')} className={`p-2 rounded-lg ${activeTab === 'clients' ? 'text-gold-500' : 'text-gray-500'}`}><Users size={24}/></button>
         <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-lg ${activeTab === 'settings' ? 'text-gold-500' : 'text-gray-500'}`}><Settings size={24}/></button>
      </div>

      {/* --- MODALS --- */}
      
      {/* Client Modal */}
      {(addingClient || editingClient) && renderModalOverlay(
          <form onSubmit={handleSaveClient} className="p-6">
             <h3 className="text-xl font-bold text-white mb-6">{addingClient ? 'Adicionar Cliente' : 'Editar Cliente'}</h3>
             <div className="space-y-4">
                <input 
                   className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500 placeholder:text-gray-500" 
                   placeholder="Nome Completo"
                   value={editingClient?.name || ''}
                   onChange={e => setEditingClient({...editingClient, name: e.target.value})}
                   required
                />
                <input 
                   className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500 placeholder:text-gray-500" 
                   placeholder="WhatsApp"
                   value={editingClient?.whatsapp || ''}
                   onChange={e => setEditingClient({...editingClient, whatsapp: e.target.value})}
                />
                <input 
                   className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500 placeholder:text-gray-500" 
                   placeholder="CPF (Opcional)"
                   value={editingClient?.cpf || ''}
                   onChange={e => setEditingClient({...editingClient, cpf: e.target.value})}
                />
                 {/* Custom Date Picker for Birth Date */}
                <div className={`relative group ${showClientDatePicker ? 'z-20' : ''}`}>
                    <input
                        type="text"
                        maxLength={10}
                        placeholder="Data de Nascimento"
                        className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500 placeholder:text-gray-500"
                        value={editingClient?.displayDate !== undefined ? editingClient.displayDate : (editingClient?.birthDate ? new Date(editingClient.birthDate).toLocaleDateString('pt-BR') : '')}
                        onChange={(e) => {
                           let v = e.target.value.replace(/\D/g, '');
                           if (v.length > 8) v = v.slice(0, 8);
                           
                           if (v.length > 4) {
                              v = v.replace(/^(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
                           } else if (v.length > 2) {
                              v = v.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
                           }

                           // Update temporary display value
                           const updates: any = { displayDate: v };

                           // Validate and update ISO date if full date is entered
                           if (v.length === 10) {
                              const [day, month, year] = v.split('/').map(Number);
                              if (day && month && year) {
                                 const date = new Date(year, month - 1, day);
                                 if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
                                    updates.birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                 }
                              }
                           }
                           setEditingClient({...editingClient, ...updates});
                        }}
                    />
                    <button 
                        type="button"
                        onClick={() => { setShowClientDatePicker(!showClientDatePicker); setClientPickerViewDate(editingClient?.birthDate ? new Date(editingClient.birthDate) : new Date()); }}
                        className="absolute right-3 top-3 text-gold-500 hover:text-gold-400 transition-colors"
                    >
                       <Calendar size={18} />
                    </button>
                    {showClientDatePicker && renderClientDatePicker(editingClient?.birthDate, (isoDate) => {
                       const [year, month, day] = isoDate.split('-').map(Number);
                       const displayDate = `${String(day).padStart(2,'0')}/${String(month).padStart(2,'0')}/${year}`;
                       setEditingClient({...editingClient, birthDate: isoDate, displayDate: displayDate});
                    })}
                </div>
             </div>
             <div className="flex gap-3 mt-6">
                <Button type="button" variant="secondary" onClick={() => { setAddingClient(false); setEditingClient(null); }} className="flex-1">Cancelar</Button>
                <Button type="submit" className="flex-1">Salvar</Button>
             </div>
          </form>,
          () => { setAddingClient(false); setEditingClient(null); },
          'z-50',
          true
      )}

      {/* Team Modal */}
      {(addingPro || editingPro) && renderModalOverlay(
          <form onSubmit={handleSavePro} className="p-6">
             <h3 className="text-xl font-bold text-white mb-6">{addingPro ? 'Adicionar Profissional' : 'Editar Profissional'}</h3>
             <div className="space-y-4">
                <input 
                   className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500" 
                   placeholder="Nome Completo"
                   value={editingPro?.name || ''}
                   onChange={e => setEditingPro({...editingPro, name: e.target.value})}
                   required
                />
                <input 
                   className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500" 
                   placeholder="Cargo / Especialidade"
                   value={editingPro?.role || ''}
                   onChange={e => setEditingPro({...editingPro, role: e.target.value})}
                   required
                />
             </div>
             <div className="flex gap-3 mt-6">
                <Button type="button" variant="secondary" onClick={() => { setAddingPro(false); setEditingPro(null); }} className="flex-1">Cancelar</Button>
                <Button type="submit" className="flex-1">Salvar</Button>
             </div>
          </form>,
          () => { setAddingPro(false); setEditingPro(null); }
      )}
      
      {/* Professional Details Modal */}
      {selectedProForDetails && renderModalOverlay(
         <div className="p-6">
             <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full border-4 border-dark-800 mx-auto mb-3 overflow-hidden">
                   <img src={selectedProForDetails.avatar || PRESET_AVATARS[0]} alt={selectedProForDetails.name} className="w-full h-full object-cover"/>
                </div>
                <h3 className="text-xl font-bold text-white">{selectedProForDetails.name}</h3>
                <p className="text-gold-500 font-bold text-sm uppercase">{selectedProForDetails.role}</p>
             </div>
             
             {/* Time Filter */}
             <div className="flex justify-center mb-6">
                <div className="flex bg-dark-950 rounded-lg p-1 border border-dark-800">
                   {(['7', '15', '30'] as const).map(d => (
                      <button 
                        key={d}
                        onClick={() => setDetailPeriod(d)}
                        className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${detailPeriod === d ? 'bg-dark-800 text-white' : 'text-gray-500 hover:text-white'}`}
                      >
                        {d} Dias
                      </button>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-dark-950 p-4 rounded-xl border border-dark-800">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Comissão</p>
                    <p className="text-green-500 font-mono font-bold text-lg">
                       {formatCurrency(getProStats(detailPeriod as any).commission)}
                    </p>
                 </div>
                 <div className="bg-dark-950 p-4 rounded-xl border border-dark-800">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Disponibilidade</p>
                    <p className="text-blue-500 font-mono font-bold text-lg">{getProStats(detailPeriod as any).availability}</p>
                 </div>
                 <div className="bg-dark-950 p-4 rounded-xl border border-dark-800">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Serviços</p>
                    <p className="text-white font-mono font-bold text-lg">
                       {getProStats(detailPeriod as any).services}
                    </p>
                 </div>
                 <div className="bg-dark-950 p-4 rounded-xl border border-dark-800">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Faturamento</p>
                    <p className="text-gold-500 font-mono font-bold text-lg">
                       {formatCurrency(getProStats(detailPeriod as any).revenue)}
                    </p>
                 </div>
                 {/* New Cards */}
                 <div className="bg-dark-950 p-4 rounded-xl border border-dark-800">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Mais Realizado</p>
                    <p className="text-white font-bold text-sm truncate" title={getProStats(detailPeriod as any).topService}>
                       {getProStats(detailPeriod as any).topService}
                    </p>
                 </div>
                 <div className="bg-dark-950 p-4 rounded-xl border border-dark-800">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Mais Vendido</p>
                    <p className="text-white font-bold text-sm truncate" title={getProStats(detailPeriod as any).topProduct}>
                       {getProStats(detailPeriod as any).topProduct}
                    </p>
                 </div>
             </div>

             <div className="flex gap-3">
                <Button 
                   variant="secondary" 
                   className="flex-1 bg-dark-950 border-dark-800" 
                   onClick={() => { setEditingPro(selectedProForDetails); setAddingPro(false); setSelectedProForDetails(null); }}
                >
                   Editar
                </Button>
                <Button 
                   className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none shadow-none" 
                   onClick={() => { setDeletingPro(selectedProForDetails); setSelectedProForDetails(null); }}
                >
                   Excluir
                </Button>
             </div>
         </div>,
         () => setSelectedProForDetails(null)
      )}

      {/* Service Modal */}
      {(addingService || editingService) && renderModalOverlay(
          <form onSubmit={handleSaveService} className="p-6">
             <h3 className="text-xl font-bold text-white mb-6">{addingService ? 'Novo Serviço' : 'Editar Serviço'}</h3>
             <div className="space-y-4">
                <div>
                   <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Nome</label>
                   <input 
                      className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500" 
                      value={editingService?.name || ''}
                      onChange={e => setEditingService({...editingService, name: e.target.value})}
                      required
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Preço</label>
                      <input 
                         type="number"
                         className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500" 
                         value={editingService?.price || ''}
                         onChange={e => setEditingService({...editingService, price: e.target.value})}
                         required
                      />
                   </div>
                   <div>
                      <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Duração (min)</label>
                      <input 
                         type="number"
                         className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500" 
                         value={editingService?.durationMinutes || ''}
                         onChange={e => setEditingService({...editingService, durationMinutes: e.target.value})}
                         required
                      />
                   </div>
                </div>
                
                <div>
                   <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Ícone</label>
                   <button 
                      type="button"
                      onClick={() => { setIconSelectorTarget('service'); setShowIconModal(true); }}
                      className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 flex items-center justify-between hover:border-gold-500 transition-colors group"
                   >
                      <div className="flex items-center gap-3">
                         {editingService?.icon && ICON_MAP[editingService.icon] ? (
                            <div className="p-1 bg-gold-500/10 rounded text-gold-500">
                               {React.createElement(ICON_MAP[editingService.icon], { size: 20 })}
                            </div>
                         ) : (
                            <div className="p-1 bg-dark-800 rounded text-gray-500"><Box size={20}/></div>
                         )}
                         <span className="text-gray-300 text-sm">{editingService?.icon || 'Selecionar'}</span>
                      </div>
                      <span className="text-xs bg-dark-800 px-2 py-1 rounded text-gray-400 group-hover:text-white flex items-center gap-1">
                         <Search size={12}/> Selecionar
                      </span>
                   </button>
                </div>
             </div>
             <div className="flex gap-3 mt-8">
                <Button type="button" variant="secondary" onClick={() => { setAddingService(false); setEditingService(null); }} className="flex-1">Cancelar</Button>
                <Button type="submit" className="flex-1">Salvar</Button>
             </div>
          </form>,
          () => { setAddingService(false); setEditingService(null); }
      )}

      {/* Product Modal */}
      {(addingProduct || editingProduct) && renderModalOverlay(
          <form onSubmit={handleSaveProduct} className="p-6">
             <h3 className="text-xl font-bold text-white mb-6">{addingProduct ? 'Novo Produto' : 'Editar Produto'}</h3>
             <div className="space-y-4">
                <div>
                   <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Nome</label>
                   <input 
                      className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500" 
                      value={editingProduct?.name || ''}
                      onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                      required
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Preço</label>
                      <input 
                         type="number"
                         className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500" 
                         value={editingProduct?.price || ''}
                         onChange={e => setEditingProduct({...editingProduct, price: e.target.value})}
                         required
                      />
                   </div>
                   <div>
                      <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Estoque</label>
                      <input 
                         type="number"
                         className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500" 
                         value={editingProduct?.stock || ''}
                         onChange={e => setEditingProduct({...editingProduct, stock: e.target.value})}
                         required
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Custo (R$)</label>
                      <input 
                         type="number"
                         className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500" 
                         value={editingProduct?.cost || ''}
                         onChange={e => setEditingProduct({...editingProduct, cost: e.target.value})}
                      />
                   </div>
                   <div>
                      <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Lucro Estimado</label>
                      <div className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-green-500 font-mono font-bold flex items-center justify-between">
                         {formatCurrency((Number(editingProduct?.price) || 0) - (Number(editingProduct?.cost) || 0))}
                         <span className="text-xs bg-green-500/10 px-1 rounded ml-2">/un</span>
                      </div>
                   </div>
                </div>
                
                <div>
                   <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Ícone</label>
                   <button 
                      type="button"
                      onClick={() => { setIconSelectorTarget('product'); setShowIconModal(true); }}
                      className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 flex items-center justify-between hover:border-gold-500 transition-colors group"
                   >
                      <div className="flex items-center gap-3">
                         {editingProduct?.icon && ICON_MAP[editingProduct.icon] ? (
                            <div className="p-1 bg-gold-500/10 rounded text-gold-500">
                               {React.createElement(ICON_MAP[editingProduct.icon], { size: 20 })}
                            </div>
                         ) : (
                            <div className="p-1 bg-dark-800 rounded text-gray-500"><Box size={20}/></div>
                         )}
                         <span className="text-gray-300 text-sm">{editingProduct?.icon || 'Selecionar'}</span>
                      </div>
                      <span className="text-xs bg-dark-800 px-2 py-1 rounded text-gray-400 group-hover:text-white flex items-center gap-1">
                         <Search size={12}/> Selecionar
                      </span>
                   </button>
                </div>
             </div>
             <div className="flex gap-3 mt-8">
                <Button type="button" variant="secondary" onClick={() => { setAddingProduct(false); setEditingProduct(null); }} className="flex-1">Cancelar</Button>
                <Button type="submit" className="flex-1">Salvar</Button>
             </div>
          </form>,
          () => { setAddingProduct(false); setEditingProduct(null); }
      )}

      {/* Sell Product Modal */}
      {isSellingProduct && renderModalOverlay(
         <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
               <ShoppingCart className="text-gold-500" /> Vender Produto
            </h3>
            <p className="text-sm text-gray-500 mb-6">Selecione o produto para dar baixa no estoque.</p>
            
            <div className="space-y-4">
               <div>
                  <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Selecionar Produto</label>
                  <select 
                     className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500"
                     value={sellingProductData.productId}
                     onChange={(e) => {
                        const prod = products.find(p => p.id === e.target.value);
                        setSellingProductData({
                           productId: e.target.value,
                           price: prod ? prod.price.toString() : '',
                           quantity: 1
                        });
                     }}
                  >
                     <option value="">Selecione...</option>
                     {products.map(p => (
                        <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                           {p.name} (Estoque: {p.stock})
                        </option>
                     ))}
                  </select>
               </div>
               
               {sellingProductData.productId && (
                  <>
                     <div>
                        <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Preço de Venda (R$)</label>
                        <input 
                           type="number"
                           className="w-full bg-dark-950 border border-dark-800 rounded-lg p-3 text-white outline-none focus:border-gold-500" 
                           value={sellingProductData.price}
                           onChange={e => setSellingProductData({...sellingProductData, price: e.target.value})}
                        />
                        <p className="text-xs text-gray-600 mt-1">Você pode alterar o valor para aplicar descontos.</p>
                     </div>

                     <div>
                        <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Quantidade</label>
                        <div className="flex items-center">
                           <button 
                              onClick={() => setSellingProductData(prev => ({...prev, quantity: Math.max(1, prev.quantity - 1)}))}
                              className="px-4 py-3 bg-dark-800 rounded-l-lg border border-dark-700 text-white hover:bg-dark-700"
                           >-</button>
                           <input 
                              type="number" 
                              className="w-full p-3 border-y border-dark-700 text-center outline-none bg-dark-950 text-white" 
                              value={sellingProductData.quantity}
                              readOnly
                           />
                           <button 
                              onClick={() => {
                                 const prod = products.find(p => p.id === sellingProductData.productId);
                                 if (prod && sellingProductData.quantity < prod.stock) {
                                    setSellingProductData(prev => ({...prev, quantity: prev.quantity + 1}));
                                 }
                              }}
                              className="px-4 py-3 bg-dark-800 rounded-r-lg border border-dark-700 text-white hover:bg-dark-700"
                           >+</button>
                        </div>
                     </div>
                  </>
               )}
            </div>

            <div className="flex gap-3 mt-8">
               <Button variant="secondary" onClick={() => setIsSellingProduct(false)} className="flex-1">Cancelar</Button>
               <Button onClick={handleSellProduct} className="flex-1" disabled={!sellingProductData.productId}>Confirmar Venda</Button>
            </div>
         </div>,
         () => setIsSellingProduct(false)
      )}

      {/* Icon Picker Modal */}
      {showIconModal && renderIconPickerModal()}
      
    </div>
  );
};