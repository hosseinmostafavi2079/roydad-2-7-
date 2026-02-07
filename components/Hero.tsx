import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from './Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-bounce delay-700">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
          <span className="text-sm font-medium text-slate-600">بیش از ۵۰۰ رویداد فعال</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight mb-6">
          کشف رویدادهای <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-rose-500">
            بی‌نظیــر و خــاص
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          جایی برای یادگیری، شبکه سازی و سرگرمی. بهترین کنسرت‌ها، کارگاه‌ها و کنفرانس‌ها را در شهر خود پیدا کنید.
        </p>

        {/* Modern Search Bar */}
        <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-2">
          
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="جستجوی رویداد (مثلا: کنسرت، وبینار...)" 
              className="w-full h-12 pr-10 pl-4 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-200 transition-all text-slate-800 placeholder:text-slate-400 outline-none"
            />
          </div>

          <div className="flex-1 relative group md:border-r md:border-slate-100 md:pr-2">
            <div className="absolute inset-y-0 right-3 md:right-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
              <MapPin size={20} />
            </div>
            <input 
              type="text" 
              placeholder="همه شهرها" 
              className="w-full h-12 pr-10 pl-4 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-200 transition-all text-slate-800 placeholder:text-slate-400 outline-none"
            />
          </div>

          <Button size="lg" className="w-full md:w-auto px-8 rounded-xl">
            جستجو
          </Button>
        </div>

        {/* Quick Tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
          <span>پیشنهادهای محبوب:</span>
          {['کنسرت پاپ', 'کارگاه طراحی', 'استارتاپ ویکند', 'تئاتر شهر'].map(tag => (
            <span key={tag} className="cursor-pointer hover:text-primary-600 hover:underline decoration-wavy decoration-primary-300">
              #{tag.replace(' ', '_')}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
};