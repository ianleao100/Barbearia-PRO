import React, { useState, useRef } from 'react';
import { UserRole } from '../types';
import { Button } from './Button';
import { AUTH_KEYS } from '../constants';
import { KeyRound, User, Mail, Lock, ArrowLeft, Calendar, Phone, FileText, Loader2 } from 'lucide-react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface AuthProps {
  role: UserRole;
  onLogin: (user: any) => void;
  onBack: () => void;
}

export const AuthForms: React.FC<AuthProps> = ({ role, onLogin, onBack }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [key, setKey] = useState('');
  
  // Register fields
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 1. Validate Business Logic (Keys) first
    if (role === UserRole.PROFESSIONAL && key !== AUTH_KEYS.SHOP_KEY) {
      alert('Chave de Acesso da Barbearia inválida!');
      setIsLoading(false);
      return;
    }
    if (role === UserRole.OWNER && key !== AUTH_KEYS.MASTER_KEY) {
      alert('Chave Mestra de Gestão inválida!');
      setIsLoading(false);
      return;
    }

    try {
      let userCredential;
      
      // 2. Perform Firebase Authentication
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with name if registering
        if (auth.currentUser && name) {
            await updateProfile(auth.currentUser, {
                displayName: name
            });
        }
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      // 3. Construct App User Object
      // In a real app with Firestore, we would fetch additional user data (Role, CPF, etc) here.
      // Since we are stateless/mocking data, we construct the user based on input + auth result.
      const firebaseUser = userCredential.user;
      
      const appUser = {
        id: firebaseUser.uid,
        name: isRegistering ? name : (firebaseUser.displayName || 'Usuário'),
        email: firebaseUser.email || email,
        role: role,
        birthDate: isRegistering ? birthDate : undefined,
        cpf: isRegistering ? cpf : undefined,
        phone: isRegistering ? phone : undefined,
        whatsapp: isRegistering ? phone : undefined
      };

      onLogin(appUser);

    } catch (error: any) {
      console.error("Firebase Auth Error:", error);
      let errorMessage = "Ocorreu um erro na autenticação.";
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        errorMessage = "E-mail ou senha incorretos.";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este e-mail já está em uso.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-dark-900 border border-dark-800 rounded-2xl shadow-2xl animate-fade-in">
      <button onClick={onBack} className="text-gray-400 hover:text-gold-500 mb-6 flex items-center gap-2 text-sm transition-colors">
        <ArrowLeft size={16} /> Voltar para Início
      </button>
      
      <h2 className="text-3xl font-bold text-white mb-2">
        {role === UserRole.CLIENT ? 'Área do Cliente' : role === UserRole.PROFESSIONAL ? 'Acesso Profissional' : 'Painel do Dono'}
      </h2>
      <p className="text-gray-400 mb-8 text-sm">
        {isRegistering ? 'Preencha seus dados para criar uma conta.' : 'Entre com seu e-mail e senha.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isRegistering && (
          <>
            {/* 1. Nome Completo */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 uppercase font-bold pl-1">Nome Completo</label>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-gold-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-10 text-white focus:border-gold-500 outline-none transition-all shadow-sm"
                  placeholder="Seu nome"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 2. WhatsApp */}
            <div className="space-y-1.5">
                <label className="text-xs text-gray-500 uppercase font-bold pl-1">WhatsApp</label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-gold-500 transition-colors" size={18} />
                  <input 
                    type="tel" 
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-10 text-white focus:border-gold-500 outline-none transition-all shadow-sm"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />
                </div>
            </div>

            {/* 3. Data de Nascimento (Simplified & Robust) */}
            <div className="space-y-1.5">
                <label className="text-xs text-gray-500 uppercase font-bold pl-1">Data de Nascimento</label>
                <div className="relative group">
                  <input 
                    type="date" 
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 px-4 text-white focus:border-gold-500 outline-none transition-all shadow-sm text-base appearance-none z-10 relative bg-transparent"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    required
                    style={{ colorScheme: 'dark' }} 
                  />
                  {/* Decorative Icon - Absolute positioned behind or to the side, pointer events none */}
                  <div className="absolute right-3 top-3 text-gold-500 pointer-events-none bg-dark-950 pl-2 z-20">
                    <Calendar size={20}/>
                  </div>
                </div>
            </div>

            {/* 4. CPF */}
            <div className="space-y-1.5">
                <label className="text-xs text-gray-500 uppercase font-bold pl-1">CPF</label>
                <div className="relative group">
                  <FileText className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-gold-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-10 text-white focus:border-gold-500 outline-none transition-all shadow-sm"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                    required
                  />
                </div>
            </div>
          </>
        )}

        {/* 5. E-mail / Login */}
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 uppercase font-bold pl-1">E-mail / Login</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-gold-500 transition-colors" size={18} />
            <input 
              type="email" 
              className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-10 text-white focus:border-gold-500 outline-none transition-all shadow-sm"
              placeholder="exemplo@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* 6. Senha */}
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 uppercase font-bold pl-1">Senha</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-gold-500 transition-colors" size={18} />
            <input 
              type="password" 
              className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-10 text-white focus:border-gold-500 outline-none transition-all shadow-sm"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {(role === UserRole.PROFESSIONAL || role === UserRole.OWNER) && !isRegistering && (
           <div className="space-y-1.5">
            <label className="text-xs text-gold-500 uppercase font-bold pl-1">
              {role === UserRole.PROFESSIONAL ? 'Chave da Barbearia' : 'Chave Mestra'}
            </label>
            <div className="relative group">
              <KeyRound className="absolute left-3 top-3.5 text-gold-600" size={18} />
              <input 
                type="password" 
                className="w-full bg-dark-950 border border-gold-600/50 rounded-xl py-3 pl-10 text-white focus:border-gold-500 outline-none transition-all shadow-sm"
                placeholder="Chave de acesso"
                value={key}
                onChange={e => setKey(e.target.value)}
                required
              />
            </div>
             <p className="text-xs text-gray-500 text-right mt-1">
               Demo: {role === UserRole.PROFESSIONAL ? AUTH_KEYS.SHOP_KEY : AUTH_KEYS.MASTER_KEY}
             </p>
          </div>
        )}

        <Button type="submit" className="w-full mt-8 py-3.5 text-lg shadow-xl shadow-gold-500/10" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            isRegistering ? 'Concluir Cadastro' : (role === UserRole.CLIENT ? 'Entrar' : 'Acessar Sistema')
          )}
        </Button>
      </form>

      {role === UserRole.CLIENT && (
        <div className="mt-6 text-center border-t border-dark-800 pt-6">
          <p className="text-gray-400 text-sm">
            {isRegistering ? 'Já tem conta?' : 'Primeira vez aqui?'}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="ml-2 text-gold-500 hover:text-gold-400 font-semibold hover:underline transition-colors"
            >
              {isRegistering ? 'Fazer Login' : 'Criar conta grátis'}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
