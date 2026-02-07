import React, { useState } from 'react';
import { X, Smartphone, ArrowRight, Loader2 } from 'lucide-react';
import { ModalProps } from '../types';
import { Button } from './Button';

interface AuthModalProps extends ModalProps {
  onLoginSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1: Phone, 2: OTP

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if(step === 1) setStep(2);
      else {
        onLoginSuccess();
        onClose(); // Success
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transform transition-all animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4 rotate-3">
             <Smartphone size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">
            {step === 1 ? 'ورود به حساب کاربری' : 'کد تایید را وارد کنید'}
          </h2>
          <p className="text-slate-500 text-sm">
            {step === 1 
              ? 'برای استفاده از تمام امکانات، لطفا شماره موبایل خود را وارد کنید.' 
              : `کد ارسال شده به شماره ${phoneNumber} را وارد کنید.`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="relative">
            {step === 1 ? (
               <input 
               type="tel" 
               dir="ltr"
               placeholder="0912..." 
               value={phoneNumber}
               onChange={(e) => setPhoneNumber(e.target.value)}
               className="w-full text-center text-2xl font-bold tracking-widest h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none placeholder:text-slate-300 placeholder:tracking-normal"
               required
               autoFocus
             />
            ) : (
              <div className="flex gap-2 justify-center" dir="ltr">
                {[1,2,3,4].map((_, i) => (
                  <input 
                    key={i}
                    type="text" 
                    maxLength={1}
                    className="w-14 h-14 text-center text-2xl font-bold bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  />
                ))}
              </div>
            )}
           
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full shadow-xl shadow-primary-600/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              step === 1 ? 'دریافت کد تایید' : 'تایید و ورود'
            )}
          </Button>

          {step === 2 && (
             <button 
             type="button" 
             onClick={() => setStep(1)}
             className="w-full text-sm text-slate-500 hover:text-primary-600 flex items-center justify-center gap-1 transition-colors"
           >
             <ArrowRight size={14} />
             <span>ویرایش شماره موبایل</span>
           </button>
          )}

        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            با ورود به رویداد پرو، <a href="#" className="text-slate-600 underline">قوانین و مقررات</a> را می‌پذیرم.
          </p>
        </div>
      </div>
    </div>
  );
};