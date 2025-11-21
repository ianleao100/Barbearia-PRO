
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_SERVICES, MOCK_CLIENTS } from '../constants';
import { CalendarDays, DollarSign, Clock, Scissors, User, Plus, Pencil, Trash2, X, CheckCircle, AlertCircle, Ban, ChevronDown, CheckSquare, Square, Calendar, ChevronLeft, ChevronRight, History, TrendingUp, ShoppingCart } from 'lucide-react';
import { Button } from './Button';
import { Appointment, Product } from '../types';
import { getCommissionMetrics } from '../services/BusinessServices';

// Extended Status types
type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NOSHOW';

// --- Premium Status Badge Component ---
const StatusBadge = ({ 
  status, 
  onChange 
}: { 
  status: AppointmentStatus, 
  onChange: (s: AppointmentStatus) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const configs = {
    SCHEDULED: { label: 'AGENDADO', bg: 'bg-gold-500', text: 'text-black', icon: Clock },
    COMPLETED: { label: 'CONCLUÍDO', bg: 'bg-green-600', text: 'text-white', icon: CheckCircle },
    NOSHOW: { label: 'FALTOU', bg: 'bg-red-800', text: 'text-white', icon: AlertCircle },
    CANCELLED: { label: 'CANCELADO', bg: 'bg-gray-600', text: 'text-white', icon: Ban },
  };

  const current = configs[status] || configs.SCHEDULED;
  const Icon = current.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${current.bg} ${current.text} px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 hover:brightness-110 transition-all shadow-lg`}
      >
        <Icon size={12} />
        {current.label}
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-36 bg-dark-900 border border-dark-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
          {Object.entries(configs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => { onChange(key as AppointmentStatus); setIsOpen(false); }}
              className="w-full text-left px-4 py-3 text-xs font-bold text-gray-300 hover:bg-dark-800 hover:text-white flex items-center gap-2 transition-colors border-b border-dark-800 last:border-0"
            >
              <div className={`w-2 h-2 rounded-full ${config.bg}`} />
              {config.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface ProfessionalViewProps {
  appointments: Appointment[];
  products: Product[];
  onProductUpdate: (products: Product[]) => void;
}

export const ProfessionalView: React.FC<ProfessionalViewProps> = ({ appointments, products, onProductUpdate }) => {
  // --- State Management ---
  // Date Navigation
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mini Calendar State
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  // Data State (Synced with Global Props)
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(appointments);

  // Financial Performance State
  const [realizedPeriod, setRealizedPeriod] = useState<'7' | '15' | '30'>('7');
  const [projectedPeriod, setProjectedPeriod] = useState<'7' | '15' | '30'>('7');

  // Sync with props when global appointments change
  useEffect(() => {
    setAllAppointments(appointments);
  }, [appointments]);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [currentAppointment, setCurrentAppointment] = useState<Partial<Appointment>>({});
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  // Quick Sale State
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [quickSaleData, setQuickSaleData] = useState<{ productId: string, quantity: number, clientId: string }>({ productId: '', quantity: 1, clientId: '' });
  const [saleSuccess, setSaleSuccess] = useState<string | null>(null);
  const [quickSaleClientSearch, setQuickSaleClientSearch] = useState('');

  // --- Derived Data ---
  const PRO_ID = 'p1'; 
  
  const dateStr = currentDate.toDateString();
  const dailyAppointments = allAppointments.filter(a =>
    a.professionalId === PRO_ID &&
    new Date(a.date).toDateString() === dateStr
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Dynamic Next Client Logic
  const getDynamicNextClient = () => {
      const now = new Date();
      const upcoming = allAppointments.filter(a =>
        a.professionalId === PRO_ID &&
        a.status === 'SCHEDULED' &&
        new Date(a.date) > now
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return upcoming[0] || null;
  };
  const nextClient = getDynamicNextClient();

  // Recent History from All Appointments
  const recentHistory = allAppointments.filter(a =>
      a.professionalId === PRO_ID &&
      a.status === 'COMPLETED'
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate Daily Commission
  const todayCommission = dailyAppointments
    .filter(a => a.status === 'COMPLETED')
    .reduce((acc, curr) => acc + curr.price, 0) * 0.5;

  // Mock Data for Financial Performance Widget
  const performanceData = {
    realized: {
      '7': 1450.00,
      '15': 3100.00,
      '30': 5800.00
    },
    projected: {
      '7': 2100.00,
      '15': 4200.00,
      '30': 8500.00
    }
  };

  // --- Handlers ---
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    setAllAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: newStatus as any } : apt
    ));
  };

  const handleDeleteClick = (id: string) => setDeleteConfirmation(id);
  const confirmDelete = () => {
    if (deleteConfirmation) {
      setAllAppointments(prev => prev.filter(a => a.id !== deleteConfirmation));
      setDeleteConfirmation(null);
    }
  };

  const handleEditClick = (apt: Appointment) => {
    setCurrentAppointment(apt);
    setSelectedServiceIds([apt.serviceId]); // Simplified for edit
    setModalMode('EDIT');
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    const defaultDate = new Date(currentDate);
    defaultDate.setHours(9, 0, 0, 0); 

    setCurrentAppointment({
      date: defaultDate.toISOString(),
      status: 'SCHEDULED'
    });
    setSelectedServiceIds([]);
    setModalMode('ADD');
    setIsModalOpen(true);
  };

  const toggleServiceSelection = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      setSelectedServiceIds(prev => prev.filter(sid => sid !== id));
    } else {
      setSelectedServiceIds(prev => [...prev, id]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedServicesData = MOCK_SERVICES.filter(s => selectedServiceIds.includes(s.id));
    const combinedServiceName = selectedServicesData.map(s => s.name).join(' + ');
    const combinedPrice = selectedServicesData.reduce((acc, curr) => acc + curr.price, 0);
    const totalDuration = selectedServicesData.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const primaryServiceId = selectedServiceIds[0] || '1';

    if (modalMode === 'ADD') {
      const newApt: Appointment = {
        id: `new_${Date.now()}`,
        clientId: 'guest',
        clientName: currentAppointment.clientName || 'Cliente Avulso',
        professionalId: PRO_ID,
        professionalName: 'João Silva',
        serviceId: primaryServiceId,
        serviceName: combinedServiceName || 'Serviço Personalizado',
        date: currentAppointment.date || new Date().toISOString(),
        status: 'SCHEDULED',
        price: combinedPrice,
        durationMinutes: totalDuration
      };
      setAllAppointments([...allAppointments, newApt]);
    } else {
      setAllAppointments(prev => prev.map(apt => {
        if (apt.id === currentAppointment.id) {
          return {
            ...apt,
            clientName: currentAppointment.clientName || apt.clientName,
            serviceId: primaryServiceId,
            serviceName: combinedServiceName || apt.serviceName,
            price: combinedPrice,
            durationMinutes: totalDuration,
            date: currentAppointment.date || apt.date
          };
        }
        return apt;
      }));
    }
    setIsModalOpen(false);
  };

  const handleQuickSale = () => {
     const { productId, quantity, clientId } = quickSaleData;
     const product = products.find(p => p.id === productId);
     
     if (product && product.stock >= quantity) {
        // Determine Client Name
        let clientName = quickSaleClientSearch;
        if (clientId) {
          const existingClient = MOCK_CLIENTS.find(c => c.id === clientId);
          if (existingClient) clientName = existingClient.name;
        }
        if (!clientId && !clientName) clientName = 'Cliente Avulso';

        const updatedProducts = products.map(p => {
           if (p.id === productId) {
              return {
                 ...p,
                 stock: p.stock - quantity,
                 sales: (p.sales || 0) + quantity
              };
           }
           return p;
        });
        onProductUpdate(updatedProducts);
        
        const commission = (product.price * quantity) * 0.10; // 10% commission
        setSaleSuccess(`Venda realizada para ${clientName}! Você ganhou ${formatCurrency(commission)} de comissão.`);
        setTimeout(() => {
            setSaleSuccess(null);
            setIsQuickSaleOpen(false);
            setQuickSaleData({ productId: '', quantity: 1, clientId: '' });
            setQuickSaleClientSearch('');
        }, 3000);
     } else {
        alert('Estoque insuficiente ou produto inválido.');
     }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const isToday = new Date().toDateString() === currentDate.toDateString();

  // --- Time Format Helper ---
  const formatTimeRemaining = (ms: number) => {
      if (ms <= 0) return 'Agora';
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      if (hours > 0) {
          return `${hours}h ${minutes}m`;
      }
      return `${minutes} min`;
  };

  // --- Mini Calendar Logic ---
  const getCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for(let i=0; i<firstDay; i++) days.push(null);
    for(let i=1; i<=daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

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
                const isSelected = day.toDateString() === currentDate.toDateString();
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

  const getButtonStyle = (isActive: boolean) => isActive
    ? "text-[10px] px-2 py-1 bg-dark-800 text-white border border-dark-700 rounded hover:border-gold-500 shadow-sm font-bold"
    : "text-[10px] px-2 py-1 bg-dark-950 text-gray-500 border border-dark-800 rounded hover:text-white";

  return (
    <div className="max-w-7xl mx-auto w-full animate-fade-in">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Painel do Profissional</h1>
          <p className="text-gray-400 mt-1">Central de Produtividade e Agenda.</p>
        </div>
        
        <div className="bg-dark-900 border border-dark-800 px-6 py-3 rounded-xl flex items-center justify-between sm:justify-start gap-6 shadow-lg">
           <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Sua Comissão (Dia)</span>
              <span className="text-2xl font-bold text-gold-500 font-mono">{formatCurrency(todayCommission)}</span>
           </div>
           <div className="p-3 bg-gold-500/10 rounded-full text-gold-500 border border-gold-500/20">
             <DollarSign size={24} />
           </div>
        </div>
      </header>

      {/* Date Navigation Bar - Updated for Mobile */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-dark-900/50 border border-dark-800 p-2 rounded-xl backdrop-blur-sm z-50 relative">
         <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button 
                variant="secondary" 
                onClick={goToToday} 
                className={`w-full sm:w-auto text-xs font-bold uppercase tracking-wider h-10 px-6 ${isToday ? 'opacity-50 cursor-default' : 'hover:bg-dark-800 hover:text-white text-gold-500 border-gold-500/30'}`}
            >
                HOJE
            </Button>
            
            <div className="h-px w-full sm:h-8 sm:w-px bg-dark-800 mx-2"></div>
            
            {/* Navigation Arrows + Date Picker */}
            <div className="flex items-center gap-3 bg-dark-950 px-2 py-1 rounded-lg border border-dark-800 shadow-inner w-full sm:w-auto justify-between sm:justify-start">
                <button 
                    onClick={() => changeDate(-1)} 
                    className="p-2 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
                    title="Dia Anterior"
                >
                    <ChevronLeft size={24}/>
                </button>

                <div className="relative group flex-1 sm:flex-none">
                    <div 
                        className="flex items-center justify-center gap-3 px-6 py-2 cursor-pointer hover:text-gold-500 transition-colors rounded-lg hover:bg-dark-900"
                        onClick={() => { setShowMiniCalendar(!showMiniCalendar); setPickerDate(currentDate); }}
                    >
                        <Calendar size={18} className="text-gold-500 shrink-0" />
                        <span className="text-sm font-bold text-white capitalize whitespace-nowrap">{formatDate(currentDate)}</span>
                    </div>
                    
                    {/* Custom Mini Calendar */}
                    {showMiniCalendar && renderMiniCalendar((date) => {
                        setCurrentDate(date);
                        setShowMiniCalendar(false);
                    })}
                </div>

                <button 
                    onClick={() => changeDate(1)} 
                    className="p-2 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
                    title="Próximo Dia"
                >
                    <ChevronRight size={24}/>
                </button>
            </div>
         </div>
         
         <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="secondary" onClick={() => setIsQuickSaleOpen(true)} className="flex-1 sm:flex-none justify-center bg-dark-950 hover:bg-dark-900 border-dark-700 text-gray-300">
               <ShoppingCart size={18} className="text-gold-500"/> <span className="hidden sm:inline">Venda Rápida</span>
            </Button>
            <Button onClick={handleAddClick} className="flex-1 sm:flex-none justify-center bg-gold-500 hover:bg-gold-400 text-black border-none shadow-lg shadow-gold-500/20">
               <Plus size={18} /> Novo Agendamento
            </Button>
         </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Agenda (2/3) */}
        <div className="lg:col-span-2 space-y-6 z-0 relative">
          <div className="bg-dark-900 border border-dark-800 rounded-xl overflow-hidden min-h-[500px] flex flex-col">
             <div className="p-4 border-b border-dark-800 flex justify-between items-center bg-dark-950/50">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CalendarDays className="text-gold-500" size={20} /> Agenda de {currentDate.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                </h2>
                <span className="text-xs text-gray-500 font-bold bg-dark-800 px-2 py-1 rounded">{dailyAppointments.length} Agendamentos</span>
             </div>
             
             <div className="flex-1 p-4 space-y-3">
                {dailyAppointments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 py-20">
                     <Calendar size={48} className="mb-4 opacity-20" />
                     <p>Nenhum agendamento para este dia.</p>
                     <Button variant="ghost" onClick={handleAddClick} className="mt-4 text-gold-500">Adicionar Manualmente</Button>
                  </div>
                ) : (
                  dailyAppointments.map(apt => {
                    const aptTime = new Date(apt.date);
                    return (
                      <div key={apt.id} className={`bg-dark-950 p-4 rounded-xl border border-dark-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gold-500/30 transition-all group relative`}>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="bg-dark-900 p-3 rounded-lg text-gray-300 font-mono text-lg font-bold border border-dark-800 shadow-inner flex flex-col items-center justify-center min-w-[70px]">
                            <span>{aptTime.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <div>
                            <h3 className={`text-base font-bold ${apt.status === 'CANCELLED' ? 'text-gray-500 line-through' : 'text-white'}`}>
                              {apt.clientName}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                              <Scissors size={12} className="text-gold-500" />
                              <span className="line-clamp-1">{apt.serviceName}</span>
                              <span className="text-gray-600">•</span>
                              <span>{apt.durationMinutes} min</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions & Status */}
                        <div className="flex items-center justify-between w-full sm:w-auto gap-3 pl-0 sm:pl-4 border-t sm:border-t-0 border-dark-800 pt-3 sm:pt-0 mt-2 sm:mt-0">
                          <StatusBadge 
                            status={apt.status as AppointmentStatus} 
                            onChange={(s) => handleStatusChange(apt.id, s)} 
                          />

                          <div className="flex items-center gap-1">
                             <button 
                               onClick={() => handleEditClick(apt)}
                               className="p-2 text-gray-500 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors" 
                               title="Editar"
                             >
                               <Pencil size={16} />
                             </button>
                             <button 
                               onClick={() => handleDeleteClick(apt.id)}
                               className="p-2 text-gray-500 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors" 
                               title="Excluir"
                             >
                               <Trash2 size={16} />
                             </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
             </div>
          </div>
        </div>

        {/* Right Column: Productivity Sidebar (1/3) */}
        <div className="space-y-6">
           
           {/* Widget 1: Next Client */}
           <div className="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5"><User size={80}/></div>
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
               <Clock size={16} className="text-gold-500" /> Próximo Cliente
             </h3>
             
             {nextClient ? (
               <div>
                 <div className="flex items-center gap-4 mb-4 relative z-10">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-dark-800 to-dark-950 border border-dark-700 flex items-center justify-center shadow-inner">
                     <User size={24} className="text-gray-400"/>
                   </div>
                   <div>
                     <p className="text-white font-bold text-lg">{nextClient.clientName}</p>
                     <p className="text-xs text-gold-500 truncate max-w-[150px]">{nextClient.serviceName}</p>
                   </div>
                 </div>
                 
                 <div className="bg-dark-950 rounded-lg p-3 border border-dark-800 flex justify-between items-center">
                    <div>
                       <span className="text-xs text-gray-500 block">Horário</span>
                       <span className="text-white font-mono font-bold">{new Date(nextClient.date).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="text-right">
                       <span className="text-xs text-gray-500 block">Início em</span>
                       <span className="text-green-500 font-mono font-bold">
                         {formatTimeRemaining(new Date(nextClient.date).getTime() - new Date().getTime())}
                       </span>
                    </div>
                 </div>
               </div>
             ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                   <CheckCircle size={32} className="mx-auto mb-2 opacity-20" />
                   Não há próximos agendamentos.
                </div>
             )}
           </div>

           {/* Widget 2: Commission BI */}
           <div className="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-green-500" /> Performance Financeira
              </h3>
              
              <div className="space-y-6">
                 {/* Realized */}
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-500 font-bold">COMISSÃO REALIZADA</p>
                        <div className="flex gap-1">
                             <button onClick={() => setRealizedPeriod('7')} className={getButtonStyle(realizedPeriod === '7')}>7D</button>
                             <button onClick={() => setRealizedPeriod('15')} className={getButtonStyle(realizedPeriod === '15')}>15D</button>
                             <button onClick={() => setRealizedPeriod('30')} className={getButtonStyle(realizedPeriod === '30')}>30D</button>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono">{formatCurrency(performanceData.realized[realizedPeriod])}</p>
                 </div>

                 <div className="h-px bg-dark-800 w-full"></div>

                 {/* Projected */}
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-500 font-bold flex items-center gap-1">PROJEÇÃO <InfoIcon size={10}/></p>
                        <div className="flex gap-1">
                             <button onClick={() => setProjectedPeriod('7')} className={getButtonStyle(projectedPeriod === '7')}>7D</button>
                             <button onClick={() => setProjectedPeriod('15')} className={getButtonStyle(projectedPeriod === '15')}>15D</button>
                             <button onClick={() => setProjectedPeriod('30')} className={getButtonStyle(projectedPeriod === '30')}>30D</button>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-500 font-mono">{formatCurrency(performanceData.projected[projectedPeriod])}</p>
                 </div>
              </div>
           </div>

           {/* Widget 3: Recent History */}
           <div className="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <History size={16} className="text-blue-400" /> Histórico Recente
              </h3>
              <div className="space-y-4">
                 {recentHistory.length > 0 ? recentHistory.slice(0, 3).map(h => (
                    <div key={h.id} className="flex justify-between items-center pb-3 border-b border-dark-800 last:border-0 last:pb-0">
                       <div>
                          <p className="text-white font-bold text-lg">{h.clientName}</p>
                          <p className="text-xs text-gray-500">{new Date(h.date).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'})}</p>
                       </div>
                       <span className="text-green-500 font-mono text-lg font-bold bg-green-500/10 px-2 py-1 rounded">{formatCurrency(h.price * 0.5)}</span>
                    </div>
                 )) : (
                    <p className="text-xs text-gray-500 italic">Nenhum histórico recente.</p>
                 )}
              </div>
           </div>

        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-dark-900 border border-dark-800 rounded-xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
             
             <form onSubmit={handleSave} className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                   {modalMode === 'ADD' ? <Plus className="text-gold-500"/> : <Pencil className="text-gold-500"/>}
                   {modalMode === 'ADD' ? 'Novo Agendamento' : 'Editar Agendamento'}
                </h3>
                
                <div className="space-y-5">
                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Nome do Cliente</label>
                      <input 
                        type="text"
                        value={currentAppointment.clientName || ''}
                        onChange={e => setCurrentAppointment({...currentAppointment, clientName: e.target.value})}
                        className="w-full bg-dark-950 border border-dark-800 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none"
                        placeholder="Ex: Carlos Souza"
                        required
                      />
                   </div>

                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Serviços</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar bg-dark-950 border border-dark-800 rounded-lg p-2">
                        {MOCK_SERVICES.map(s => {
                          const isSelected = selectedServiceIds.includes(s.id);
                          return (
                            <div 
                              key={s.id}
                              onClick={() => toggleServiceSelection(s.id)}
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
                               <span className="text-xs font-mono text-gold-500">{formatCurrency(s.price)}</span>
                            </div>
                          );
                        })}
                      </div>
                   </div>

                   <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Horário</label>
                      <input 
                        type="datetime-local"
                        value={currentAppointment.date ? new Date(currentAppointment.date).toISOString().slice(0, 16) : ''}
                        onChange={e => setCurrentAppointment({...currentAppointment, date: new Date(e.target.value).toISOString()})}
                        className="w-full bg-dark-950 border border-dark-800 rounded-lg px-4 py-3 text-white focus:border-gold-500 outline-none [color-scheme:dark]"
                        required
                      />
                   </div>
                </div>

                <div className="flex gap-3 mt-8">
                   <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
                   <Button type="submit" className="flex-1" disabled={selectedServiceIds.length === 0}>Salvar</Button>
                </div>
             </form>
          </div>
        </div>
      )}
      
      {/* Quick Sale Modal */}
      {isQuickSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-dark-900 border border-dark-800 rounded-xl w-full max-w-md shadow-2xl p-6 relative">
              <button onClick={() => setIsQuickSaleOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
              
              {saleSuccess ? (
                 <div className="text-center py-10 animate-fade-in">
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                       <CheckCircle size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Venda Realizada!</h3>
                    <p className="text-gray-400">{saleSuccess}</p>
                 </div>
              ) : (
                 <>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                       <ShoppingCart className="text-gold-500" /> Venda Rápida (Comissão)
                    </h3>
                    <div className="space-y-4">
                       {/* Client Selection for Sale */}
                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Cliente</label>
                          <select 
                            className={`w-full p-3 rounded-lg border outline-none bg-dark-950 border-dark-800 text-white`}
                            value={quickSaleData.clientId}
                            onChange={e => setQuickSaleData({...quickSaleData, clientId: e.target.value})}
                          >
                             <option value="">Cliente Avulso</option>
                             {MOCK_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                          {!quickSaleData.clientId && (
                              <input 
                                type="text" 
                                placeholder="Nome do cliente (Opcional)"
                                className="w-full p-3 mt-2 rounded-lg border outline-none bg-dark-950 border-dark-800 text-white"
                                value={quickSaleClientSearch}
                                onChange={e => setQuickSaleClientSearch(e.target.value)}
                              />
                          )}
                       </div>

                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Produto</label>
                          <select 
                             className="w-full p-3 rounded-lg border outline-none bg-dark-950 border-dark-800 text-white"
                             value={quickSaleData.productId}
                             onChange={(e) => setQuickSaleData({...quickSaleData, productId: e.target.value})}
                          >
                             <option value="">Selecione um produto...</option>
                             {products.map(p => (
                                <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                                   {p.name} (Estoque: {p.stock}) - {formatCurrency(p.price)}
                                </option>
                             ))}
                          </select>
                       </div>

                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Quantidade</label>
                          <div className="flex items-center">
                             <button 
                               onClick={() => setQuickSaleData(prev => ({...prev, quantity: Math.max(1, prev.quantity - 1)}))}
                               className="px-3 py-3 bg-dark-800 rounded-l-lg border border-dark-700 text-white hover:bg-dark-700"
                             >-</button>
                             <input 
                               type="number" 
                               className="w-full p-3 border-y border-dark-700 text-center outline-none bg-dark-950 text-white" 
                               value={quickSaleData.quantity}
                               readOnly
                             />
                             <button 
                                onClick={() => {
                                   const prod = products.find(p => p.id === quickSaleData.productId);
                                   if (prod && quickSaleData.quantity < prod.stock) {
                                      setQuickSaleData(prev => ({...prev, quantity: prev.quantity + 1}));
                                   }
                                }}
                                className="px-3 py-3 bg-dark-800 rounded-r-lg border border-dark-700 text-white hover:bg-dark-700"
                             >+</button>
                          </div>
                       </div>

                       {quickSaleData.productId && (
                          <div className="bg-dark-950 p-4 rounded-lg border border-dark-800">
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-400 text-sm">Total</span>
                                <span className="text-white font-bold">
                                   {formatCurrency((products.find(p => p.id === quickSaleData.productId)?.price || 0) * quickSaleData.quantity)}
                                </span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Sua Comissão (10%)</span>
                                <span className="text-green-500 font-bold">
                                   {formatCurrency((products.find(p => p.id === quickSaleData.productId)?.price || 0) * quickSaleData.quantity * 0.10)}
                                </span>
                             </div>
                          </div>
                       )}
                    </div>

                    <div className="flex gap-3 mt-8">
                       <Button variant="secondary" onClick={() => setIsQuickSaleOpen(false)} className="flex-1">Cancelar</Button>
                       <Button onClick={handleQuickSale} className="flex-1" disabled={!quickSaleData.productId}>Confirmar Venda</Button>
                    </div>
                 </>
              )}
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-dark-900 border border-dark-800 rounded-xl w-full max-w-sm shadow-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center mx-auto mb-4">
                 <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Excluir Agendamento?</h3>
              <p className="text-gray-500 mb-6 text-sm">Esta ação não pode ser desfeita.</p>
              
              <div className="flex gap-3">
                 <Button variant="secondary" onClick={() => setDeleteConfirmation(null)} className="flex-1">Cancelar</Button>
                 <Button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none">Confirmar</Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const InfoIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);
