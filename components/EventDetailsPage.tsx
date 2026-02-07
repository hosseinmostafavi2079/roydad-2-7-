import React, { useEffect } from 'react';
import { ArrowRight, Calendar, MapPin, Clock, Share2, Heart, ShieldCheck, User, Info, GraduationCap, Video, CheckCircle2 } from 'lucide-react';
import { EventData, Instructor } from '../types';
import { Button } from './Button';

interface EventDetailsPageProps {
  event: EventData;
  instructor?: Instructor;
  onBack: () => void;
  onBook: (event: EventData) => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, eventId: string) => void;
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ 
    event, 
    instructor,
    onBack, 
    onBook, 
    isSaved, 
    onToggleSave 
}) => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: `رویداد فوق‌العاده ${event.title} را از دست ندهید!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('لینک رویداد با موفقیت کپی شد!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const capacityPercent = Math.round((event.registered / event.capacity) * 100);
  const spotsLeft = event.capacity - event.registered;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Navigation Bar Placeholder (Back Button) */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="container mx-auto max-w-6xl">
           <Button variant="ghost" onClick={onBack} className="gap-2 hover:bg-slate-100 text-slate-600">
             <ArrowRight size={20} />
             <span>بازگشت به لیست</span>
           </Button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden">
        <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 container mx-auto max-w-6xl">
            <div className="flex gap-2 mb-4">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600 text-white text-sm font-bold shadow-lg shadow-primary-900/30">
                    {event.category}
                </span>
                {event.isVirtual && (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-500/80 backdrop-blur-md text-white text-sm font-bold shadow-lg">
                        <Video size={16} />
                        آنلاین (مجازی)
                    </span>
                )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-md">
                {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-200 text-sm md:text-base font-medium">
                <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-primary-400" />
                    <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={18} className="text-primary-400" />
                    <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-primary-400" />
                    <span>{event.location}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content (Right Column) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Description Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Info className="text-primary-600" />
                        درباره رویداد
                    </h2>
                    <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed text-justify">
                        {event.description.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4">{paragraph}</p>
                        ))}
                    </div>
                </div>
                
                {/* Instructor Profile Card */}
                {instructor && (
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-primary-100 rounded-br-full -z-0 opacity-50"></div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                            <GraduationCap className="text-primary-600" />
                            درباره مدرس / سخنران
                        </h2>
                        
                        <div className="flex flex-col md:flex-row gap-6 relative z-10">
                            <img src={instructor.imageUrl} alt={instructor.name} className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-slate-50 shadow-md" />
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{instructor.name}</h3>
                                <p className="text-primary-600 font-medium text-sm mb-4">{instructor.expertise}</p>
                                <p className="text-slate-500 leading-relaxed mb-4 text-justify">
                                    {instructor.bio}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <span className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-lg">
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                        {instructor.coursesCount} دوره برگزار شده
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Organizer Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <User size={32} />
                    </div>
                    <div>
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">برگزارکننده</span>
                        <h3 className="text-lg font-bold text-slate-800">{event.organizer}</h3>
                        <a href="#" className="text-primary-600 text-sm hover:underline">مشاهده پروفایل</a>
                    </div>
                </div>

                {/* Map Placeholder (Only show if not virtual) */}
                {!event.isVirtual && (
                    <div className="bg-slate-200 rounded-3xl h-64 w-full flex items-center justify-center text-slate-400 border border-slate-300 relative overflow-hidden group">
                        <MapPin size={48} className="z-10" />
                        <span className="mt-20 absolute z-10 font-bold text-slate-500">موقعیت روی نقشه</span>
                        <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Tehran&zoom=12&size=600x300&key=YOUR_API_KEY')] opacity-10 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>
                    </div>
                )}

            </div>

            {/* Sidebar (Left Column) */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    
                    {/* Booking Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-slate-500">قیمت بلیت</span>
                            <div className="text-2xl font-black text-slate-800">
                                {event.price.toLocaleString('fa-IR')} 
                                <span className="text-sm font-medium text-slate-400 mr-1">{event.currency}</span>
                            </div>
                        </div>

                        {/* Capacity Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-slate-500 font-medium">ظرفیت باقیمانده</span>
                                <span className={`${spotsLeft < 20 ? 'text-rose-500' : 'text-primary-600'} font-bold`}>
                                    {spotsLeft.toLocaleString('fa-IR')} صندلی
                                </span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${spotsLeft < 20 ? 'bg-rose-500' : 'bg-primary-500'}`}
                                    style={{ width: `${capacityPercent}%` }}
                                ></div>
                            </div>
                        </div>

                        <Button 
                            onClick={() => onBook(event)} 
                            className="w-full text-lg py-4 mb-4 shadow-primary-500/20"
                        >
                            {event.isVirtual ? 'ثبت‌نام و دریافت لینک' : 'خرید بلیت و رزرو'}
                        </Button>

                        <div className="flex items-center justify-center gap-4">
                            <button className="p-3 rounded-xl bg-slate-50 text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                                <Heart size={20} />
                            </button>
                            <button 
                                onClick={handleShare}
                                className="p-3 rounded-xl bg-slate-50 text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                title="اشتراک‌گذاری"
                            >
                                <Share2 size={20} />
                            </button>
                            <button 
                                onClick={(e) => onToggleSave(e, event.id)}
                                className={`p-3 rounded-xl transition-colors ${
                                    isSaved 
                                    ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' 
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-rose-500'
                                }`}
                                title={isSaved ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                            >
                                <Heart size={20} className={isSaved ? "fill-current" : ""} />
                            </button>
                        </div>
                    </div>

                    {/* Virtual Info Box */}
                    {event.isVirtual && (
                         <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 flex items-start gap-3">
                            <Video className="text-indigo-500 shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-indigo-800 text-sm">برگزاری آنلاین</h4>
                                <p className="text-xs text-indigo-600/80 mt-1 leading-relaxed">
                                    لینک ورود به جلسه پس از تکمیل ثبت‌نام برای شما پیامک خواهد شد و در پنل کاربری قابل مشاهده است.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Guarantee Box */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
                        <ShieldCheck className="text-green-500 shrink-0" size={24} />
                        <div>
                            <h4 className="font-bold text-slate-700 text-sm">ضمانت بازگشت وجه</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                در صورت لغو رویداد، مبلغ پرداختی شما به صورت کامل و بدون کسر کارمزد عودت داده خواهد شد.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
      </div>
    </div>
  );
};