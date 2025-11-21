import React, { useState } from 'react';
import { MOCK_SERVICES, MOCK_PROFESSIONALS } from '../constants';
import { Button } from './Button';
import { Calendar, Clock, User, CheckSquare, Square, Info, CheckCircle } from 'lucide-react';
import { Appointment } from '../types';

interface ClientViewProps {
  onNewAppointment: (apt: Appointment) => void;
}

export const ClientView: React.FC<ClientViewProps> = ({ onNewAppointment }) => {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPro, setSelectedPro] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Derived totals
  const selectedServicesData = MOCK_SERVICES.filter(s => selectedServices.includes(s.id));
  const totalPrice = selectedServicesData.reduce((acc, curr) => acc + curr.price, 0);
  const totalDuration = selectedServicesData.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const reset = () => {
    setStep(1);
    setSelectedServices([]);
    setSelectedPro(null);
    setSelectedTime(null);
  };

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(prev => prev.filter(sId => sId !== id));
    } else {
      setSelectedServices(prev => [...prev, id]);
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedPro || !selectedTime) return;

    const pro = MOCK_PROFESSIONALS.find(p => p.id === selectedPro);
    const serviceNames = selectedServicesData.map(s => s.name).join(' + ');
    
    // Create proper date object for today + time
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      clientId: 'current-user', // In real app, this would be actual user ID
      clientName: 'Você (Cliente)', 
      professionalId: selectedPro,
      professionalName: pro?.name || 'Profissional',
      serviceId: selectedServices[0],
      serviceName: serviceNames,
      date: date.toISOString(),
      status: 'SCHEDULED',
      price: totalPrice,
      durationMinutes: totalDuration
    };

    onNewAppointment(newAppointment);
    setStep(4);
  };

  const openWhatsAppConfirmation = () => {
    const pro = MOCK_PROFESSIONALS.find(p => p.id === selectedPro);
    const message = `Olá! Gostaria de confirmar meu agendamento:\n\n` +
      `💈 Profissional: ${pro?.name}\n` +
      `✂️ Serviços: ${selectedServicesData.map(s => s.name).join(', ')}\n` +
      `📅 Data: Hoje, ${selectedTime}\n` +
      `💰 Valor: R$ ${totalPrice},00`;

    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  const renderServiceSelection = () => (
    <div className="animate-fade-in space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_SERVICES.map(service => {
          const isSelected = selectedServices.includes(service.id);
          return (
            <div 
              key={service.id}
              onClick={() => toggleService(service.id)}
              className={`relative p-6 bg-dark-900 border rounded-xl cursor-pointer transition-all group ${
                isSelected 
                  ? 'border-gold-500 shadow-lg shadow-gold-500/10 bg-dark-800' 
                  : 'border-dark-800 hover:border-gold-500/50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`text-xl font-bold ${isSelected ? 'text-gold-500' : 'text-white group-hover:text-gold-500'}`}>
                  {service.name}
                </h3>
                <div className={isSelected ? 'text-gold-500' : 'text-gray-600'}>
                  {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
                </div>
              </div>
              <div className="flex justify-between items-end mt-4">
                 <div className="flex items-center text-gray-400 text-sm gap-2">
                    <Clock size={14} />
                    <span>{service.durationMinutes} min</span>
                 </div>
                 <span className={`px-3 py-1 rounded-full font-mono font-bold ${isSelected ? 'bg-gold-500 text-black' : 'bg-dark-950 text-gold-500'}`}>
                    R$ {service.price}
                 </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-dark-900 border-t border-dark-800 p-4 md:relative md:bg-transparent md:border-0 md:p-0 z-40">
         <div className="max-w-4xl mx-auto flex items-center justify-between bg-dark-950 md:bg-dark-900 p-4 rounded-xl border border-gold-500/30 shadow-2xl">
            <div>
               <p className="text-xs text-gray-500 uppercase font-bold">Resumo do Pedido</p>
               <div className="flex items-center gap-3">
                  <span className="text-white font-bold">{selectedServices.length} Serviços</span>
                  <span className="text-gold-500 font-mono font-bold">R$ {totalPrice}</span>
                  <span className="text-gray-400 text-sm">~ {totalDuration} min</span>
               </div>
            </div>
            <Button 
              onClick={() => setStep(2)} 
              disabled={selectedServices.length === 0}
              className="px-8"
            >
              Continuar
            </Button>
         </div>
      </div>
    </div>
  );

  const renderProSelection = () => (
    <div className="space-y-4 animate-fade-in pb-20 md:pb-0">
      <h3 className="text-lg text-gray-300 mb-4">Escolha o Profissional</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_PROFESSIONALS.map(pro => (
          <div 
            key={pro.id}
            onClick={() => { setSelectedPro(pro.id); setStep(3); }}
            className="p-4 bg-dark-900 border border-dark-800 rounded-xl cursor-pointer hover:border-gold-500 flex flex-col items-center gap-3 text-center transition-all group"
          >
            {/* Updated to use real Avatar */}
            <div className="w-24 h-24 rounded-full bg-dark-800 flex items-center justify-center text-gold-500 overflow-hidden border-2 border-dark-800 group-hover:border-gold-500 transition-colors">
               {pro.avatar ? (
                  <img src={pro.avatar} alt={pro.name} className="w-full h-full object-cover" />
               ) : (
                  <User size={32} />
               )}
            </div>
            <p className="font-semibold text-white">{pro.name}</p>
            <p className="text-xs text-green-400">Disponível Hoje</p>
          </div>
        ))}
      </div>
      <Button variant="ghost" onClick={() => setStep(1)} className="w-full mt-4">Voltar</Button>
    </div>
  );

  const renderTimeSelection = () => {
    const baseTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    const slotsNeeded = Math.max(1, Math.ceil(totalDuration / 60));

    return (
      <div className="animate-fade-in pb-20 md:pb-0">
        <h3 className="text-lg text-gray-300 mb-2">Horários Disponíveis para Hoje</h3>
        
        <div className="bg-dark-900/50 p-4 rounded-xl border border-blue-500/20 flex items-start gap-3 mb-6">
           <Info className="text-blue-400 shrink-0" size={20} />
           <div className="text-sm text-gray-400">
              <p>Duração total: <span className="text-white font-bold">{totalDuration} min</span>.</p>
              <p>Ao selecionar um horário, reservaremos automaticamente os <span className="text-gold-500 font-bold">{slotsNeeded} horários sequenciais</span> necessários para realizar todos os serviços.</p>
           </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
          {baseTimes.map((time, index) => {
             let isStartSlotAvailable = true;
             if (time === '12:00') isStartSlotAvailable = false;

             let isSequenceAvailable = isStartSlotAvailable;
             if (isStartSlotAvailable) {
                for (let i = 1; i < slotsNeeded; i++) {
                   const nextIndex = index + i;
                   if (nextIndex >= baseTimes.length) {
                      isSequenceAvailable = false;
                      break;
                   }
                   if (baseTimes[nextIndex] === '12:00') {
                      isSequenceAvailable = false;
                      break;
                   }
                }
             }

             const isSelected = selectedTime === time;
             const selectedIndex = baseTimes.indexOf(selectedTime || '');
             const isPartOfSequence = selectedTime && index > selectedIndex && index < selectedIndex + slotsNeeded;

             return (
              <button
                key={time}
                disabled={!isSequenceAvailable && !isPartOfSequence}
                onClick={() => setSelectedTime(time)}
                className={`py-3 rounded-lg border text-sm font-semibold transition-all relative ${
                  isSelected 
                  ? 'bg-gold-500 border-gold-500 text-black shadow-lg shadow-gold-500/20 z-10 scale-105' 
                  : isPartOfSequence 
                    ? 'bg-gold-500/20 border-gold-500/50 text-gold-500'
                    : isSequenceAvailable 
                      ? 'bg-dark-950 border-dark-800 text-gray-300 hover:border-gold-500/50'
                      : 'bg-dark-900/50 border-transparent text-gray-600 cursor-not-allowed opacity-50'
                }`}
              >
                {time}
                {isSelected && slotsNeeded > 1 && (
                   <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-1.5 rounded-full border border-dark-950 shadow-sm">
                     Início
                   </span>
                )}
                {isPartOfSequence && (
                   <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full"></span>
                )}
              </button>
             );
          })}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">Voltar</Button>
          <Button 
            disabled={!selectedTime} 
            onClick={handleConfirmBooking} 
            className="flex-1"
          >
            Confirmar Agendamento
          </Button>
        </div>
      </div>
    );
  };

  const renderConfirmation = () => (
    <div className="text-center animate-fade-in py-8 pb-20 md:pb-8">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
        <CheckCircle size={48} />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Agendamento Confirmado!</h2>
      <p className="text-gray-400 mb-8">Enviamos os detalhes para o seu WhatsApp.</p>
      
      <div className="bg-dark-900 p-6 rounded-xl max-w-sm mx-auto mb-8 text-left border border-dark-800 shadow-2xl">
        <div className="flex justify-between mb-4 pb-4 border-b border-dark-800">
          <span className="text-gray-500">Profissional</span>
          <span className="text-white font-semibold">{MOCK_PROFESSIONALS.find(p => p.id === selectedPro)?.name}</span>
        </div>
        <div className="mb-4 pb-4 border-b border-dark-800">
          <span className="text-gray-500 block mb-2">Serviços</span>
          {selectedServicesData.map(s => (
             <div key={s.id} className="flex justify-between text-sm mb-1">
                <span className="text-white">{s.name}</span>
                <span className="text-gold-500">R$ {s.price}</span>
             </div>
          ))}
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Data</span>
          <span className="text-white font-semibold">Hoje, {selectedTime}</span>
        </div>
        <div className="flex justify-between mb-2">
           <span className="text-gray-500">Duração Total</span>
           <span className="text-white font-semibold">{totalDuration} min</span>
        </div>
        <div className="flex justify-between pt-4 mt-2 border-t border-dashed border-gray-700">
          <span className="text-white font-bold text-lg">Total</span>
          <span className="text-gold-500 font-bold text-lg">R$ {totalPrice}</span>
        </div>
      </div>

      {/* Replaced 'Realizar Novo Agendamento' with WhatsApp Confirmation */}
      <Button onClick={openWhatsAppConfirmation} className="bg-green-600 hover:bg-green-700 text-white border-none w-full max-w-sm mx-auto flex items-center justify-center gap-2">
         <i className="fab fa-whatsapp text-xl" /> Confirmar no WhatsApp
      </Button>

      <Button onClick={reset} variant="ghost" className="mt-4 mx-auto w-fit">Realizar Novo Agendamento</Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gold-500/10 rounded-lg text-gold-500">
          <Calendar size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Agendamento Online</h1>
          <p className="text-gray-400">Gerencie seus horários com facilidade.</p>
        </div>
      </div>

      <div className="bg-dark-900/50 p-6 md:p-8 rounded-2xl border border-dark-800 backdrop-blur-sm">
        {step === 1 && renderServiceSelection()}
        {step === 2 && renderProSelection()}
        {step === 3 && renderTimeSelection()}
        {step === 4 && renderConfirmation()}
      </div>
    </div>
  );
};