import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { EventCard } from './components/EventCard';
import { EventDetailsPage } from './components/EventDetailsPage';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { EventData, Instructor } from './types';
import { Filter, Lock, Heart, Frown, Search, Calendar, X } from 'lucide-react';
import { Button } from './components/Button';

// Mock Instructors Data
const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-1',
    name: 'استاد همایون شجریان',
    expertise: 'موسیقی و آواز سنتی',
    bio: 'همایون شجریان، فرزند محمدرضا شجریان، خواننده موسیقی سنتی ایرانی و نوازنده تنبک و کمانچه است. او فعالیت حرفه‌ای خود را از سال ۱۳۷۰ آغاز کرد و تاکنون آلبوم‌های موفق بسیاری را منتشر کرده است.',
    imageUrl: 'https://picsum.photos/id/447/200/200',
    coursesCount: 12
  },
  {
    id: 'inst-2',
    name: 'دکتر سارا ملکی',
    expertise: 'متخصص هوش مصنوعی',
    bio: 'دکترای علوم کامپیوتر از دانشگاه شریف، محقق ارشد در زمینه یادگیری ماشین و پردازش تصویر. ایشان سابقه‌ی برگزاری بیش از ۵۰ کارگاه تخصصی در حوزه تکنولوژی را دارند.',
    imageUrl: 'https://picsum.photos/id/338/200/200',
    coursesCount: 25
  },
  {
    id: 'inst-3',
    name: 'امید میرزایی',
    expertise: 'کارگردان و فیلم‌ساز',
    bio: 'برنده جایزه سیمرغ بلورین بهترین فیلم کوتاه. امید میرزایی با ۱۰ سال سابقه در سینمای مستند و داستانی، دوره‌های تخصصی کارگردانی را در سراسر کشور برگزار می‌کند.',
    imageUrl: 'https://picsum.photos/id/64/200/200',
    coursesCount: 8
  }
];

// Extended Mock Data with descriptions and organizer info
const FEATURED_EVENTS: EventData[] = [
  {
    id: '1',
    title: 'کنسرت بزرگ همایون شجریان - تور تهران',
    category: 'موسیقی',
    date: '۲۵ اردیبهشت ۱۴۰۳',
    time: '۲۱:۰۰',
    location: 'سالن وزارت کشور',
    price: 450000,
    currency: 'تومان',
    capacity: 2000,
    registered: 1950,
    imageUrl: 'https://picsum.photos/id/111/800/600',
    organizer: 'شرکت فرهنگی هنری ققنوس',
    instructorId: 'inst-1',
    isVirtual: false,
    description: `این کنسرت یکی از بزرگترین رویدادهای موسیقی سال جاری است که در آن همایون شجریان به همراه ارکستر سیاوش، قطعاتی از آلبوم‌های اخیر خود و همچنین آثار ماندگار قدیمی را اجرا خواهد کرد.
    
    تجربه‌ای بی‌نظیر از تلفیق موسیقی سنتی و مدرن که با نورپردازی و صدابرداری حرفه‌ای در تالار وزارت کشور برگزار می‌شود. این اجرا شامل قطعات محبوب "چرا رفتی"، "آرایش غلیظ" و "رگ خواب" خواهد بود.
    
    لطفاً توجه داشته باشید که درب‌های سالن یک ساعت پیش از شروع اجرا باز می‌شوند و از ورود کودکان زیر ۸ سال ممعذوریم.`
  },
  {
    id: '2',
    title: 'کارگاه آنلاین هوش مصنوعی و آینده طراحی',
    category: 'آموزشی',
    date: '۰۲ خرداد ۱۴۰۳',
    time: '۱۶:۰۰ تا ۲۰:۰۰',
    location: 'اسکای‌روم (آنلاین)',
    price: 120000,
    currency: 'تومان',
    capacity: 50,
    registered: 15,
    imageUrl: 'https://picsum.photos/id/3/800/600',
    organizer: 'آکادمی دیزاین تهران',
    instructorId: 'inst-2',
    isVirtual: true,
    meetingLink: 'https://skyroom.online/ch/design/ai-workshop',
    description: `در این کارگاه ۴ ساعته، با جدیدترین ابزارهای هوش مصنوعی مولد (Generative AI) در زمینه طراحی گرافیک و UI/UX آشنا خواهید شد. مدرسین این دوره از متخصصین برجسته شرکت‌های تکنولوژی هستند.

    سرفصل‌ها شامل:
    - معرفی Midjourney و Stable Diffusion
    - نحوه پرامپت‌نویسی حرفه‌ای
    - ادغام هوش مصنوعی در فرآیند طراحی محصول
    - بررسی آینده شغلی طراحان در عصر AI

    این دوره به صورت کاملا مجازی برگزار می‌شود و لینک ورود پس از ثبت نام برای شما پیامک خواهد شد.`
  },
  {
    id: '3',
    title: 'جشنواره فیلم کوتاه تهران - اکران ویژه',
    category: 'سینما',
    date: '۱۰ خرداد ۱۴۰۳',
    time: '۱۸:۰۰',
    location: 'پردیس سینمایی ملت',
    price: 80000,
    currency: 'تومان',
    capacity: 300,
    registered: 180,
    imageUrl: 'https://picsum.photos/id/45/800/600',
    organizer: 'انجمن سینمای جوانان',
    instructorId: 'inst-3',
    isVirtual: false,
    description: `اکران ویژه برگزیدگان جشنواره فیلم کوتاه تهران. در این رویداد ۵ فیلم کوتاه برتر سال در ژانرهای درام، مستند و تجربی به نمایش در می‌آیند.

    پس از اکران، جلسه نقد و بررسی با حضور کارگردانان و منتقدان مطرح سینما برگزار خواهد شد. فرصتی عالی برای شبکه‌سازی با اهالی سینما و علاقه‌مندان به هنر هفتم.
    
    فیلم‌های منتخب:
    ۱. سایه‌های بلند (کارگردان: امید میرزایی)
    ۲. سکوت در ظهر (کارگردان: سارا احمدی)
    ۳. انتهای خیابان هشتم
    
    پذیرایی میان‌وعده برای شرکت‌کنندگان در نظر گرفته شده است.`
  },
];

const App: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookingEvent, setBookingEvent] = useState<EventData | null>(null);
  const [detailsEvent, setDetailsEvent] = useState<EventData | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'my-events'>('home');

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Navigation Handlers
  const handleViewDetails = (event: EventData) => setDetailsEvent(event);
  const handleBookEvent = (event: EventData) => setBookingEvent(event);
  const handleBackToHome = () => {
    setDetailsEvent(null);
  };
  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  const handleToggleSave = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setSavedEventIds(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId) 
        : [...prev, eventId]
    );
  };

  // Filter Logic
  const filteredEvents = FEATURED_EVENTS.filter(event => {
    const matchesSearch = event.title.includes(searchTerm) || event.location.includes(searchTerm);
    const matchesCategory = categoryFilter ? event.category === categoryFilter : true;
    const matchesDate = dateFilter ? event.date.includes(dateFilter) : true;
    return matchesSearch && matchesCategory && matchesDate;
  });

  // Events to Display
  const myEvents = FEATURED_EVENTS.filter(event => savedEventIds.includes(event.id));
  const displayEvents = currentView === 'my-events' ? myEvents : filteredEvents;

  // If in Admin Mode, render the Admin Panel exclusively
  if (isAdminView) {
    return (
      <AdminPanel 
        events={FEATURED_EVENTS} 
        instructors={MOCK_INSTRUCTORS}
        onExit={() => setIsAdminView(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* Navigation */}
      <Header 
        onLoginClick={() => setIsAuthModalOpen(true)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onMyEventsClick={() => { setCurrentView('my-events'); setDetailsEvent(null); }}
        onHomeClick={() => { setCurrentView('home'); setDetailsEvent(null); }}
      />

      <main>
        {detailsEvent ? (
          /* DETAILS PAGE VIEW */
          <EventDetailsPage 
            event={detailsEvent} 
            instructor={MOCK_INSTRUCTORS.find(i => i.id === detailsEvent.instructorId)}
            onBack={handleBackToHome}
            onBook={handleBookEvent}
            isSaved={savedEventIds.includes(detailsEvent.id)}
            onToggleSave={handleToggleSave}
          />
        ) : currentView === 'my-events' ? (
           /* MY EVENTS VIEW */
           <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                    <Heart size={28} className="fill-current" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900">رویدادهای من</h1>
                    <p className="text-slate-500">لیست رویدادهایی که ذخیره کرده‌اید</p>
                </div>
             </div>

             {myEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myEvents.map(event => (
                    <EventCard 
                        key={event.id} 
                        event={event} 
                        onBook={handleBookEvent}
                        onViewDetails={handleViewDetails}
                        isSaved={true}
                        onToggleSave={handleToggleSave}
                    />
                    ))}
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                        <Frown size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">هنوز رویدادی را ذخیره نکرده‌اید!</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        با کلیک بر روی آیکون قلب در کارت رویدادها، می‌توانید آن‌ها را به این لیست اضافه کنید.
                    </p>
                    <Button onClick={() => setCurrentView('home')}>
                        مشاهده رویدادها
                    </Button>
                </div>
             )}
           </div>
        ) : (
          /* HOME PAGE VIEW */
          <>
            <Hero />
            <section id="events" className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
              <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">رویدادهای برگزیده</h2>
                  <p className="text-slate-500">محبوب‌ترین رویدادهای این هفته را از دست ندهید</p>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-10 transform -translate-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                     
                     {/* Search */}
                     <div className="md:col-span-5 relative">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="جستجو در نام رویداد یا مکان..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-12 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-200 outline-none transition-all text-slate-800"
                        />
                        {searchTerm && (
                             <button onClick={() => setSearchTerm('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500">
                                 <X size={16} />
                             </button>
                        )}
                     </div>

                     {/* Category Filter */}
                     <div className="md:col-span-3">
                        <div className="relative">
                            <select 
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full pl-4 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-100 outline-none appearance-none cursor-pointer"
                            >
                                <option value="">همه دسته‌بندی‌ها</option>
                                <option value="موسیقی">موسیقی</option>
                                <option value="آموزشی">آموزشی</option>
                                <option value="سینما">سینما</option>
                                <option value="تئاتر">تئاتر</option>
                                <option value="همایش">همایش</option>
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Filter size={18} />
                            </div>
                        </div>
                     </div>

                     {/* Date Filter */}
                     <div className="md:col-span-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="فیلتر تاریخ (مثلا: اردیبهشت)" 
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full pl-4 pr-12 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-800"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Calendar size={18} />
                            </div>
                            {dateFilter && (
                             <button onClick={() => setDateFilter('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500">
                                 <X size={16} />
                             </button>
                            )}
                        </div>
                     </div>

                  </div>
              </div>

              {displayEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayEvents.map(event => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onBook={handleBookEvent}
                        onViewDetails={handleViewDetails}
                        isSaved={savedEventIds.includes(event.id)}
                        onToggleSave={handleToggleSave}
                      />
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                          <Filter size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 mb-2">موردی یافت نشد</h3>
                      <p className="text-slate-500">لطفا فیلترهای جستجو را تغییر دهید.</p>
                      <Button 
                        variant="ghost" 
                        className="mt-4 text-primary-600"
                        onClick={() => { setSearchTerm(''); setCategoryFilter(''); setDateFilter(''); }}
                      >
                          پاک کردن فیلترها
                      </Button>
                  </div>
              )}
              
              {displayEvents.length > 0 && (
                  <div className="mt-16 text-center">
                    <button className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700 hover:underline decoration-2 underline-offset-4 transition-all">
                      مشاهده همه رویدادها
                    </button>
                  </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 font-medium text-sm">
            © ۱۴۰۳ رویداد پرو - تمامی حقوق محفوظ است.
          </p>
          
          <button 
            onClick={() => setIsAdminView(true)}
            className="flex items-center gap-2 text-slate-300 hover:text-primary-600 transition-colors text-xs font-medium"
          >
            <Lock size={12} />
            <span>ورود به پنل مدیریت</span>
          </button>
        </div>
      </footer>

      {/* Auth Modal Overlay */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Booking Modal Overlay */}
      <BookingModal 
        isOpen={!!bookingEvent} 
        onClose={() => setBookingEvent(null)}
        event={bookingEvent}
      />
    </div>
  );
};

export default App;