import React, { useState } from 'react';
import { X, Calendar, MapPin, Check, Ticket, Minus, Plus, CreditCard, Video } from 'lucide-react';
import { EventData } from '../types';
import { Button } from './Button';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventData | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, event }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !event) return null;

  const handleIncrement = () => setTicketCount(prev => Math.min(prev + 1, 10)); // Max 10 tickets
  const handleDecrement = () => setTicketCount(prev => Math.max(prev - 1, 1));

  const totalPrice = event.price * ticketCount;

  const handleConfirm = () => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleCloseInternal = () => {
    setIsSuccess(false);
    setTicketCount(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       {/* Backdrop */}
       <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleCloseInternal}
      ></div>

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-0 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        
        {/* Header Image (only show if not success state) */}
        {!isSuccess && (
            <div className="h-32 bg-slate-100 relative">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
                 <button 
                    onClick={handleCloseInternal}
                    className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur text-slate-500 hover:text-slate-800 rounded-full transition-colors shadow-sm"
                    >
                    <X size={20} />
                </button>
            </div>
        )}

        <div className="p-6 sm:p-8">
            {isSuccess ? (
                <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <Check size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">
                        {event.isVirtual ? 'ثبت‌نام با موفقیت انجام شد!' : 'رزرو با موفقیت انجام شد!'}
                    </h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        {event.isVirtual 
                         ? 'لینک ورود به جلسه به شماره همراه شما پیامک شد و در پنل کاربری نیز قابل مشاهده است.'
                         : 'کد رهگیری بلیت شما به شماره همراهتان ارسال شد.'
                        }
                        <br/>
                        <span className="font-mono text-slate-400 mt-2 block text-sm">REF-{Math.floor(Math.random() * 1000000)}</span>
                    </p>
                     <Button onClick={handleCloseInternal} variant="primary" className="w-full">
                        بازگشت به سایت
                    </Button>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <span className="text-primary-600 font-bold text-xs uppercase tracking-wider mb-2 block">{event.category}</span>
                        <h2 className="text-2xl font-bold text-slate-800 leading-tight mb-4">{event.title}</h2>
                        
                        <div className="flex flex-col gap-2 text-sm text-slate-500">
                             <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-primary-500" />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {event.isVirtual ? <Video size={16} className="text-indigo-500" /> : <MapPin size={16} className="text-primary-500" />}
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-b border-slate-100 py-6 mb-6 space-y-6">
                        {/* Ticket Counter */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                <Ticket size={20} className="text-slate-400" />
                                <span>تعداد {event.isVirtual ? 'ثبت‌نام' : 'بلیت'}</span>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-1 border border-slate-100">
                                <button onClick={handleDecrement} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm hover:text-primary-600 disabled:opacity-50 transition-colors">
                                    <Minus size={16} />
                                </button>
                                <span className="w-4 text-center font-bold text-lg">{ticketCount}</span>
                                <button onClick={handleIncrement} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm hover:text-primary-600 transition-colors">
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                         {/* Price Calculation */}
                         <div className="flex items-center justify-between">
                            <span className="text-slate-500">قیمت کل</span>
                            <div className="text-right">
                                <div className="text-2xl font-black text-slate-800">
                                    {totalPrice.toLocaleString('fa-IR')}
                                    <span className="text-sm font-medium text-slate-400 mr-1">{event.currency}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleConfirm} disabled={isLoading} variant="primary" size="lg" className="w-full gap-2 text-lg h-14">
                        {isLoading ? (
                            <span>در حال پردازش...</span>
                        ) : (
                            <>
                                <CreditCard size={20} />
                                <span>پرداخت و نهایی‌سازی</span>
                            </>
                        )}
                    </Button>
                     <p className="text-center text-xs text-slate-400 mt-4">
                        با خرید بلیت، قوانین و مقررات رویداد را می‌پذیرید.
                    </p>
                </>
            )}
        </div>
      </div>
    </div>
  );
};