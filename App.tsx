import React, { useState } from 'react';
import { User, UserRole, Appointment, Product } from './types';
import { AuthForms } from './components/AuthForms';
import { ClientView } from './components/ClientView';
import { ProfessionalView } from './components/ProfessionalView';
import { OwnerView } from './components/OwnerView';
import { Button } from './components/Button';
import { MOCK_APPOINTMENTS, MOCK_PRODUCTS } from './constants';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { 
  Scissors, 
  LogOut, 
  MapPin, 
  Phone, 
  Star
} from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'LANDING' | 'AUTH_CLIENT' | 'AUTH_PRO' | 'AUTH_OWNER'>('LANDING');
  
  // Global State for Linking Panels
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('LANDING');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
    setCurrentUser(null);
    setView('LANDING');
  };

  const handleNewAppointment = (newApt: Appointment) => {
    setAppointments(prev => [...prev, newApt]);
  };

  const handleProductUpdate = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Authenticated Views
  if (currentUser) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col font-sans">
        {currentUser.role !== UserRole.OWNER && (
          <header className="bg-dark-900/80 backdrop-blur-md border-b border-dark-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-gold-500">
                <Scissors size={24} className="rotate-[-45deg]" />
                <span className="text-xl font-bold text-white tracking-wider">BARBERIA<span className="text-gold-500">.PRO</span></span>
              </div>
              <Button variant="ghost" onClick={handleLogout} className="text-sm gap-2">
                <LogOut size={16} /> Sair
              </Button>
            </div>
          </header>
        )}
        
        {currentUser.role === UserRole.OWNER ? (
           <div className="relative flex-1 h-screen overflow-hidden">
             <div className="absolute top-4 right-4 z-50 md:hidden">
                <Button variant="ghost" onClick={handleLogout} className="bg-dark-900/50 backdrop-blur"><LogOut size={16}/></Button>
             </div>
             <OwnerView 
                onLogout={handleLogout} 
                appointments={appointments} 
                products={products}
                onProductUpdate={handleProductUpdate}
             />
           </div>
        ) : (
          <main className="flex-1 p-4 md:p-8">
            {currentUser.role === UserRole.CLIENT && (
              <ClientView onNewAppointment={handleNewAppointment} />
            )}
            {currentUser.role === UserRole.PROFESSIONAL && (
              <ProfessionalView 
                appointments={appointments} 
                products={products}
                onProductUpdate={handleProductUpdate}
              />
            )}
          </main>
        )}
      </div>
    );
  }

  // Landing Page View
  if (view === 'LANDING') {
    return (
      <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden font-sans scroll-smooth">
        
        {/* Navigation */}
        <nav className="absolute top-0 left-0 w-full z-50 p-6 md:px-12 flex justify-between items-center">
           <div className="flex items-center gap-2 text-white">
              <Scissors size={24} className="text-gold-500 rotate-[-45deg]" />
              <span className="text-xl font-bold tracking-wider">BARBERIA<span className="text-gold-500">.PRO</span></span>
           </div>
           <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300 tracking-wide">
              <button onClick={() => scrollToSection('sobre')} className="hover:text-gold-500 transition-colors uppercase">Sobre</button>
              <button onClick={() => scrollToSection('equipe')} className="hover:text-gold-500 transition-colors uppercase">Equipe</button>
              <button onClick={() => scrollToSection('contato')} className="hover:text-gold-500 transition-colors uppercase">Contato</button>
           </div>
        </nav>

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950/90 via-dark-950/60 to-dark-950 z-10" />
            {/* High quality placeholder image */}
            <img 
              src="https://images.unsplash.com/photo-1503951914875-452162b7f30a?q=80&w=2070&auto=format&fit=crop" 
              alt="Barbershop Atmosphere" 
              className="w-full h-full object-cover opacity-60 animate-pulse-slow"
            />
          </div>

          <div className="relative z-20 text-center px-6 max-w-5xl mx-auto animate-fade-in-up">
             <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-500 text-xs md:text-sm font-bold tracking-[0.2em] uppercase backdrop-blur-sm">
               Estilo • Tradição • Excelência
             </div>
             <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 text-white leading-[1.1] md:leading-[0.9]">
               A EXCELÊNCIA EM <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">CUIDADOS MASCULINOS</span>
             </h1>
             <p className="text-base sm:text-lg md:text-2xl text-gray-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
               Mais que um corte, uma experiência de alto padrão. Agende seu horário e descubra o verdadeiro significado de exclusividade.
             </p>
             <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
               <Button 
                 onClick={() => setView('AUTH_CLIENT')}
                 className="text-lg px-12 py-5 rounded-full shadow-2xl shadow-gold-500/20 hover:shadow-gold-500/40 transform hover:-translate-y-1 transition-all w-full md:w-auto"
               >
                 Agendar Meu Horário
               </Button>
             </div>
          </div>
        </section>

        {/* About Section */}
        <section id="sobre" className="py-16 md:py-24 px-6 md:px-12 bg-dark-900 relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                Resgatando a <span className="text-gold-500">Tradição</span> com Modernidade
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Fundada com o propósito de oferecer um refúgio para o homem moderno. Nossa barbearia combina técnicas clássicas de navalha com as tendências mais atuais de visagismo.
              </p>
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-dark-800 rounded-full text-gold-500"><Star size={20} fill="currentColor" /></div>
                    <div>
                      <h4 className="font-bold text-white">Atendimento Premium</h4>
                      <p className="text-sm text-gray-500">Cerveja artesanal e café expresso cortesia.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-dark-800 rounded-full text-gold-500"><Scissors size={20} /></div>
                    <div>
                      <h4 className="font-bold text-white">Profissionais de Elite</h4>
                      <p className="text-sm text-gray-500">Equipe treinada internacionalmente.</p>
                    </div>
                 </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative">
               <div className="absolute -inset-4 bg-gold-500/20 rounded-2xl blur-xl"></div>
               <img 
                 src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop" 
                 alt="Interior" 
                 className="relative rounded-2xl shadow-2xl border border-dark-800 grayscale hover:grayscale-0 transition-all duration-700"
               />
            </div>
          </div>
        </section>

        {/* Professionals Section */}
        <section id="equipe" className="py-16 md:py-24 px-6 md:px-12 bg-dark-950">
           <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 md:mb-20">
                <span className="text-gold-500 font-bold tracking-widest uppercase text-sm">Nossa Equipe</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mt-2">Mestres da Navalha</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { name: 'João "The Blade"', role: 'Master Barber', img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop' },
                   { name: 'Pedro "Fade"', role: 'Especialista em Degradê', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1925&auto=format&fit=crop' },
                   { name: 'André "Razor"', role: 'Design de Barba', img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop' }
                 ].map((pro, idx) => (
                   <div key={idx} className="group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer">
                     <img src={pro.img} alt={pro.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                     <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-2xl font-bold text-white mb-1">{pro.name}</h3>
                        <p className="text-gold-500 font-medium uppercase tracking-wider text-sm">{pro.role}</p>
                     </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Footer */}
        <footer id="contato" className="bg-black py-12 md:py-16 px-6 md:px-12 border-t border-dark-900">
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                 <h2 className="text-3xl font-bold text-white tracking-wider mb-6">BARBERIA<span className="text-gold-500">.PRO</span></h2>
                 <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                   Elevando a autoestima masculina através de serviços de excelência e um ambiente inigualável.
                 </p>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-dark-900 border border-dark-800 flex items-center justify-center text-gray-400 hover:text-gold-500 hover:border-gold-500 transition-all cursor-pointer">
                      <i className="fab fa-instagram text-xl"></i>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-dark-900 border border-dark-800 flex items-center justify-center text-gray-400 hover:text-gold-500 hover:border-gold-500 transition-all cursor-pointer">
                      <i className="fab fa-facebook text-xl"></i>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-dark-900 border border-dark-800 flex items-center justify-center text-gray-400 hover:text-gold-500 hover:border-gold-500 transition-all cursor-pointer">
                      <i className="fab fa-whatsapp text-xl"></i>
                    </div>
                 </div>
              </div>
              
              <div>
                 <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm text-gold-500">Contato</h4>
                 <ul className="space-y-4 text-gray-500 text-sm">
                    <li className="flex items-start gap-3">
                      <MapPin size={18} className="text-gold-500 shrink-0" />
                      <span>Av. Paulista, 1000<br/>Jardins, São Paulo - SP</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone size={18} className="text-gold-500 shrink-0" />
                      <span>(11) 3000-0000</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <i className="fab fa-whatsapp text-gold-500 text-lg shrink-0" />
                      <span>(11) 99999-9999</span>
                    </li>
                 </ul>
              </div>

              <div>
                 <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm text-gold-500">Horários</h4>
                 <ul className="space-y-2 text-gray-500 text-sm">
                    <li className="flex justify-between border-b border-dark-900 pb-2">
                      <span>Seg - Sex</span>
                      <span className="text-white">09:00 - 20:00</span>
                    </li>
                    <li className="flex justify-between border-b border-dark-900 pb-2">
                      <span>Sábado</span>
                      <span className="text-white">09:00 - 18:00</span>
                    </li>
                    <li className="flex justify-between border-b border-dark-900 pb-2">
                      <span>Domingo</span>
                      <span className="text-dark-700">Fechado</span>
                    </li>
                 </ul>
              </div>
           </div>
           
           <div className="pt-8 border-t border-dark-900 flex flex-col items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                 <button 
                   onClick={() => setView('AUTH_PRO')} 
                   className="w-full sm:w-auto border border-dark-800 bg-dark-900/50 px-6 py-3 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-gold-500 transition-all uppercase tracking-widest"
                 >
                   Área do Profissional
                 </button>
                 <button 
                   onClick={() => setView('AUTH_OWNER')} 
                   className="w-full sm:w-auto border border-dark-800 bg-dark-900/50 px-6 py-3 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-gold-500 transition-all uppercase tracking-widest"
                 >
                   Painel de Gestão
                 </button>
              </div>
              <p className="text-xs text-dark-700 text-center">&copy; 2024 Barberia Premium SaaS. Todos os direitos reservados.</p>
           </div>
        </footer>
      </div>
    );
  }

  // Auth Views Wrapper
  return (
    <div className="min-h-screen bg-dark-950 text-white relative overflow-hidden flex items-center justify-center p-4 font-sans">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />
       </div>

       <div className="relative z-10 w-full max-w-lg">
          {view === 'AUTH_CLIENT' && (
            <AuthForms role={UserRole.CLIENT} onLogin={handleLogin} onBack={() => setView('LANDING')} />
          )}
          {view === 'AUTH_PRO' && (
            <AuthForms role={UserRole.PROFESSIONAL} onLogin={handleLogin} onBack={() => setView('LANDING')} />
          )}
          {view === 'AUTH_OWNER' && (
            <AuthForms role={UserRole.OWNER} onLogin={handleLogin} onBack={() => setView('LANDING')} />
          )}
       </div>
    </div>
  );
};

export default App;
