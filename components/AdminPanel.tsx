import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Calendar,
  Users, 
  Settings, 
  LogOut, 
  TrendingUp, 
  DollarSign, 
  Ticket, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  ClipboardCheck,
  ScanLine,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Shield,
  User,
  CreditCard,
  MessageSquare,
  Globe,
  Save,
  Server,
  Palette,
  Type,
  Sun,
  Moon,
  X,
  Image as ImageIcon,
  FileText,
  Download,
  PieChart,
  Activity,
  ArrowUpRight,
  MapPin,
  Clock,
  GraduationCap,
  Video,
  Link,
  Filter
} from 'lucide-react';
import { EventData, Instructor } from '../types';
import { Button } from './Button';

interface AdminPanelProps {
  events: EventData[];
  instructors: Instructor[];
  onExit: () => void;
}

// Mock Types
interface Attendee {
  id: string;
  name: string;
  ticketId: string;
  status: 'present' | 'pending';
  purchaseDate: string;
  paymentStatus: 'paid' | 'unpaid';
  amount: number;
}

interface UserData {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'user';
  joinDate: string;
  status: 'active' | 'blocked';
}

// Theme Configs
const THEME_COLORS = [
  { name: 'نیلی (پیش‌فرض)', id: 'indigo', colors: { 50: '#eef2ff', 100: '#e0e7ff', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' } },
  { name: 'زمردی', id: 'emerald', colors: { 50: '#ecfdf5', 100: '#d1fae5', 500: '#10b981', 600: '#059669', 700: '#047857' } },
  { name: 'رز', id: 'rose', colors: { 50: '#fff1f2', 100: '#ffe4e6', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c' } },
  { name: 'کهربایی', id: 'amber', colors: { 50: '#fffbeb', 100: '#fef3c7', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' } },
  { name: 'آبی آسمانی', id: 'blue', colors: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' } },
];

const FONTS = [
  { name: 'وزیرمتن (گرد)', id: 'Vazirmatn RD' },
  { name: 'وزیرمتن (اصلی)', id: 'Vazirmatn' },
  { name: 'توهاما (سیستمی)', id: 'Tahoma' },
];

const EMPTY_EVENT: EventData = {
  id: '',
  title: '',
  category: '',
  date: '',
  time: '',
  location: '',
  price: 0,
  currency: 'تومان',
  capacity: 100,
  registered: 0,
  imageUrl: 'https://picsum.photos/800/600',
  description: '',
  organizer: 'رویداد پرو',
  isVirtual: false,
  meetingLink: '',
  instructorId: ''
};

const EMPTY_INSTRUCTOR: Instructor = {
  id: '',
  name: '',
  expertise: '',
  bio: '',
  imageUrl: 'https://picsum.photos/200/200',
  coursesCount: 0
};

// --- Missing Components Definitions ---

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className="font-medium">{label}</span>
    {isActive && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-white/50"></div>}
  </button>
);

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
        trendUp 
          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
          : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
      }`}>
        {trend}
      </span>
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-black text-slate-800 dark:text-white">{value}</p>
  </div>
);

export const AdminPanel: React.FC<AdminPanelProps> = ({ events: initialEvents, instructors: initialInstructors, onExit }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'instructors' | 'users' | 'attendance' | 'settings'>('dashboard');
  
  // Data States
  const [events, setEvents] = useState<EventData[]>(initialEvents);
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
  const [users, setUsers] = useState<UserData[]>([
    { id: '1', name: 'امیرحسین عباسی', phone: '09121112233', role: 'admin', joinDate: '1402/10/01', status: 'active' },
    { id: '2', name: 'زهرا کاظمی', phone: '09355556677', role: 'user', joinDate: '1403/02/12', status: 'active' },
    { id: '3', name: 'محمد محمدی', phone: '09198889900', role: 'user', joinDate: '1403/02/15', status: 'blocked' },
    { id: '4', name: 'نیلوفر رحیمی', phone: '09023334455', role: 'user', joinDate: '1403/02/18', status: 'active' },
  ]);

  // Event Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [eventFormData, setEventFormData] = useState<EventData>(EMPTY_EVENT);

  // Instructor Modal State
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [instructorFormData, setInstructorFormData] = useState<Instructor>(EMPTY_INSTRUCTOR);

  // Settings State
  const [settings, setSettings] = useState({
    siteName: 'رویداد پرو',
    supportPhone: '021-88776655',
    paymentProvider: 'zarinpal',
    merchantId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    smsProvider: 'kavenegar',
    smsApiKey: '564A736...321',
    smsLineNumber: '100020003000',
    themeColor: 'indigo',
    themeFont: 'Vazirmatn RD',
    themeMode: 'light'
  });
  
  // Attendance State
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<Record<string, Attendee[]>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Event Filter States (Admin)
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('');
  const [eventDateFilter, setEventDateFilter] = useState('');

  // Calculate Dashboard Stats
  const totalRevenue = events.reduce((acc, curr) => acc + (curr.price * curr.registered), 0);
  const totalCapacity = events.reduce((acc, curr) => acc + curr.capacity, 0);
  const totalRegistered = events.reduce((acc, curr) => acc + curr.registered, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalRegistered / totalCapacity) * 100) : 0;

  // Handlers
  const handleDeleteEvent = (id: string) => {
    if (window.confirm('آیا از حذف این رویداد اطمینان دارید؟')) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleDeleteInstructor = (id: string) => {
    if (window.confirm('آیا از حذف این استاد اطمینان دارید؟')) {
      setInstructors(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
  };

  const handleSaveSettings = () => {
    alert('تنظیمات با موفقیت ذخیره شد.');
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleThemeColorChange = (colorId: string) => {
    const selected = THEME_COLORS.find(c => c.id === colorId);
    if (selected) {
        const root = document.documentElement;
        Object.entries(selected.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-primary-${key}`, value);
        });
        setSettings(prev => ({ ...prev, themeColor: colorId }));
    }
  };

  const handleFontChange = (fontName: string) => {
    document.documentElement.style.setProperty('--font-family', fontName);
    setSettings(prev => ({ ...prev, themeFont: fontName }));
  };

  const handleThemeModeChange = (mode: 'light' | 'dark') => {
    if (mode === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    setSettings(prev => ({ ...prev, themeMode: mode }));
  };

  // Event CRUD Handlers
  const handleOpenCreateEvent = () => {
    setEditingEvent(null);
    setEventFormData({ ...EMPTY_EVENT, id: Date.now().toString() });
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (event: EventData) => {
    setEditingEvent(event);
    setEventFormData({ ...event });
    setIsEventModalOpen(true);
  };

  const handleViewEventDetails = (id: string) => {
    setSelectedEventId(id);
    setActiveTab('attendance');
  };

  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    const name = e.target.name;
    
    // Special handling for boolean checkbox/select
    if (name === 'isVirtual') {
         setEventFormData({ ...eventFormData, isVirtual: e.target.value === 'true' });
    } else {
         setEventFormData({ ...eventFormData, [name]: value });
    }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
        // Edit existing
        setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? eventFormData : ev));
    } else {
        // Create new
        setEvents(prev => [...prev, eventFormData]);
    }
    setIsEventModalOpen(false);
  };

  // Instructor CRUD Handlers
  const handleOpenCreateInstructor = () => {
    setEditingInstructor(null);
    setInstructorFormData({ ...EMPTY_INSTRUCTOR, id: `inst-${Date.now()}` });
    setIsInstructorModalOpen(true);
  };

  const handleOpenEditInstructor = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setInstructorFormData({ ...instructor });
    setIsInstructorModalOpen(true);
  };

  const handleInstructorFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInstructorFormData({ ...instructorFormData, [e.target.name]: e.target.value });
  };

  const handleSaveInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInstructor) {
        setInstructors(prev => prev.map(inst => inst.id === editingInstructor.id ? instructorFormData : inst));
    } else {
        setInstructors(prev => [...prev, instructorFormData]);
    }
    setIsInstructorModalOpen(false);
  };

  // Helper to generate mock attendees if they don't exist
  const getAttendeesForEvent = (event: EventData) => {
    if (!attendees[event.id]) {
        // Generate mock data on first load
        const mockData: Attendee[] = Array.from({ length: 20 }).map((_, i) => ({
            id: `usr-${event.id}-${i}`,
            name: `شرکت‌کننده شماره ${i + 1}`,
            ticketId: `TKT-${event.id.slice(0,2)}-${1000 + i}`,
            status: Math.random() > 0.8 ? 'present' : 'pending',
            purchaseDate: '۱۴۰۳/۰۲/۱۵',
            paymentStatus: 'paid',
            amount: event.price
        }));
        setAttendees(prev => ({ ...prev, [event.id]: mockData }));
        return mockData;
    }
    return attendees[event.id];
  };

  const handleCheckIn = (userId: string) => {
    if (!selectedEventId) return;
    setAttendees(prev => ({
        ...prev,
        [selectedEventId]: prev[selectedEventId].map(a => 
            a.id === userId 
                ? { ...a, status: a.status === 'pending' ? 'present' : 'pending' } 
                : a
        )
    }));
  };

  const currentEvent = events.find(e => e.id === selectedEventId);
  const currentAttendees = currentEvent ? getAttendeesForEvent(currentEvent) : [];
  
  const filteredAttendees = currentAttendees.filter(a => 
    a.name.includes(searchQuery) || a.ticketId.includes(searchQuery)
  );

  // Filter Logic for Admin Events Table
  const filteredAdminEvents = events.filter(event => {
    const matchesSearch = event.title.includes(eventSearchQuery) || event.organizer.includes(eventSearchQuery);
    const matchesCategory = eventCategoryFilter ? event.category === eventCategoryFilter : true;
    const matchesDate = eventDateFilter ? event.date.includes(eventDateFilter) : true;
    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* Sidebar (RTL) */}
      <aside className="w-64 bg-slate-900 border-l border-transparent dark:border-slate-800 text-slate-300 flex flex-col fixed inset-y-0 right-0 z-50 shadow-2xl">
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800 dark:border-slate-800">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
            R
          </div>
          <span className="text-lg font-bold text-white tracking-tight">پنل مدیریت</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="داشبورد" 
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          />
          <SidebarItem 
            icon={<CalendarDays size={20} />} 
            label="مدیریت رویدادها" 
            isActive={activeTab === 'events'} 
            onClick={() => setActiveTab('events')}
          />
          <SidebarItem 
            icon={<GraduationCap size={20} />} 
            label="مدیریت اساتید" 
            isActive={activeTab === 'instructors'} 
            onClick={() => setActiveTab('instructors')}
          />
           <SidebarItem 
            icon={<ClipboardCheck size={20} />} 
            label="حضور و غیاب" 
            isActive={activeTab === 'attendance'} 
            onClick={() => setActiveTab('attendance')}
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="کاربران" 
            isActive={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="تنظیمات" 
            isActive={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
          />
        </nav>

        <div className="p-4 border-t border-slate-800 dark:border-slate-800">
          <button 
            onClick={onExit}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">خروج از پنل</span>
          </button>
        </div>
      </aside>

      {/* Main Content (Shifted Left because of RTL Sidebar) */}
      <main className="flex-1 mr-64 transition-all duration-300 p-8">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white transition-colors">
                    {activeTab === 'dashboard' && 'خلاصه وضعیت'}
                    {activeTab === 'events' && 'لیست رویدادها'}
                    {activeTab === 'instructors' && 'مدیریت اساتید و سخنرانان'}
                    {activeTab === 'attendance' && (selectedEventId ? 'جزئیات و مدیریت رویداد' : 'انتخاب رویداد')}
                    {activeTab === 'users' && 'مدیریت کاربران'}
                    {activeTab === 'settings' && 'تنظیمات سیستم'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {selectedEventId && activeTab === 'attendance' 
                        ? `مدیریت کامل: ${currentEvent?.title}` 
                        : 'خوش آمدید، مدیر سیستم'}
                </p>
            </div>
            <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                    <span className="font-bold text-primary-600">AD</span>
                 </div>
            </div>
        </header>

        {/* DASHBOARD CONTENT */}
        {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="درآمد کل" 
                        value={`${totalRevenue.toLocaleString('fa-IR')} تومان`} 
                        icon={<DollarSign size={24} className="text-emerald-500" />}
                        trend="+۱۲٪"
                        trendUp={true}
                    />
                    <StatCard 
                        title="بلیت‌های فروخته شده" 
                        value={totalRegistered.toLocaleString('fa-IR')} 
                        icon={<Ticket size={24} className="text-primary-500" />}
                        trend="+۵٪"
                        trendUp={true}
                    />
                    <StatCard 
                        title="رویدادهای فعال" 
                        value={events.length.toLocaleString('fa-IR')} 
                        icon={<CalendarDays size={24} className="text-purple-500" />}
                        trend="بدون تغییر"
                        trendUp={true}
                    />
                    <StatCard 
                        title="اساتید فعال" 
                        value={instructors.length.toLocaleString('fa-IR')} 
                        icon={<GraduationCap size={24} className="text-amber-500" />}
                        trend="+۱"
                        trendUp={true}
                    />
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">تراکنش‌های اخیر</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-sm">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-4 py-3 font-medium">شناسه</th>
                                    <th className="px-4 py-3 font-medium">کاربر</th>
                                    <th className="px-4 py-3 font-medium">رویداد</th>
                                    <th className="px-4 py-3 font-medium">مبلغ</th>
                                    <th className="px-4 py-3 font-medium">وضعیت</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {[1,2,3,4].map((i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 text-slate-500 font-mono">#TRX-{2030 + i}</td>
                                        <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">کاربر مهمان {i}</td>
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">کنسرت بزرگ همایون...</td>
                                        <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">۴۵۰,۰۰۰</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">موفق</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* INSTRUCTORS CONTENT */}
        {activeTab === 'instructors' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-end">
                    <Button onClick={handleOpenCreateInstructor} className="gap-2">
                        <Plus size={18} />
                        <span>افزودن استاد جدید</span>
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {instructors.map(inst => (
                        <div key={inst.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center hover:shadow-lg transition-all group relative">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenEditInstructor(inst)} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDeleteInstructor(inst.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <img src={inst.imageUrl} alt={inst.name} className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-slate-50 dark:ring-slate-800" />
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">{inst.name}</h3>
                            <span className="text-primary-600 text-sm font-medium mb-4">{inst.expertise}</span>
                            <p className="text-slate-500 text-sm line-clamp-3 mb-4 leading-relaxed">{inst.bio}</p>
                            <div className="mt-auto w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm">
                                <span className="text-slate-400">تعداد دوره‌ها:</span>
                                <span className="font-bold text-slate-800 dark:text-white">{inst.coursesCount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* EVENTS CONTENT */}
        {activeTab === 'events' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                
                {/* Actions Toolbar with Filter */}
                <div className="flex flex-col xl:flex-row justify-between gap-4">
                    <div className="flex flex-1 flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-[2]">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="جستجو در رویدادها..." 
                                value={eventSearchQuery}
                                onChange={(e) => setEventSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
                            />
                        </div>
                        {/* Category */}
                        <div className="relative flex-1">
                             <select 
                                value={eventCategoryFilter}
                                onChange={(e) => setEventCategoryFilter(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white appearance-none cursor-pointer"
                            >
                                <option value="">همه دسته‌ها</option>
                                <option value="موسیقی">موسیقی</option>
                                <option value="آموزشی">آموزشی</option>
                                <option value="سینما">سینما</option>
                                <option value="تئاتر">تئاتر</option>
                                <option value="همایش">همایش</option>
                            </select>
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Filter size={16} />
                            </div>
                        </div>
                         {/* Date */}
                        <div className="relative flex-1">
                             <input 
                                type="text" 
                                placeholder="تاریخ..." 
                                value={eventDateFilter}
                                onChange={(e) => setEventDateFilter(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                            />
                        </div>
                    </div>
                    <Button onClick={handleOpenCreateEvent} className="gap-2 shrink-0">
                        <Plus size={18} />
                        <span>ایجاد رویداد جدید</span>
                    </Button>
                </div>

                {/* Events Table */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">رویداد</th>
                                <th className="px-6 py-4">برگزارکننده/استاد</th>
                                <th className="px-6 py-4">نوع</th>
                                <th className="px-6 py-4">تاریخ و زمان</th>
                                <th className="px-6 py-4 text-center">وضعیت فروش</th>
                                <th className="px-6 py-4 text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredAdminEvents.length > 0 ? (
                                filteredAdminEvents.map((event) => {
                                    const percent = Math.round((event.registered / event.capacity) * 100);
                                    const instructor = instructors.find(i => i.id === event.instructorId);
                                    return (
                                        <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={event.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                                                    <div>
                                                        <div className="font-bold text-slate-800 dark:text-white line-clamp-1">{event.title}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{event.location}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{event.organizer}</span>
                                                     {instructor && (
                                                         <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                             <GraduationCap size={12} />
                                                             {instructor.name}
                                                         </span>
                                                     )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {event.isVirtual ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                                                        <Video size={12} />
                                                        مجازی
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                                                        <Users size={12} />
                                                        حضوری
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{event.date}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">{event.time}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-full max-w-[120px] mx-auto">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-slate-500 dark:text-slate-400">{event.registered}/{event.capacity}</span>
                                                        <span className="font-bold text-primary-600 dark:text-primary-400">{percent}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${percent}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleViewEventDetails(event.id)}
                                                        className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors" 
                                                        title="مشاهده"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleOpenEditEvent(event)}
                                                        className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors" 
                                                        title="ویرایش"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteEvent(event.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors" 
                                                        title="حذف"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search size={32} className="opacity-50" />
                                            <span>هیچ رویدادی با این مشخصات یافت نشد.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* ATTENDANCE CONTENT (Also acts as Event Detail View) */}
        {activeTab === 'attendance' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                {!selectedEventId ? (
                   /* View 1: Event Selection */
                   <>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">لطفا برای مشاهده جزئیات و مدیریت شرکت‌کنندگان، یک رویداد را انتخاب کنید:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                             <div 
                                key={event.id} 
                                onClick={() => setSelectedEventId(event.id)}
                                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10 transition-all group"
                             >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                                        <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                                        {event.isVirtual && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                                                <Video size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">{event.title}</h3>
                                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                            <CalendarDays size={12} />
                                            {event.date}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <span className="text-slate-500 dark:text-slate-400">شرکت کنندگان:</span>
                                    <span className="font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                        {event.registered.toLocaleString('fa-IR')} نفر
                                    </span>
                                </div>
                                <Button className="w-full mt-4 bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 dark:hover:bg-slate-600 shadow-none border-none group-hover:bg-primary-600">
                                    مدیریت و جزئیات
                                </Button>
                             </div>
                        ))}
                    </div>
                   </>
                ) : (
                    /* View 2: Detailed Event Dashboard & Check-in List */
                    <div className="space-y-6">
                        
                        {/* 1. Navigation & Actions */}
                        <div className="flex items-center justify-between">
                             <button 
                                onClick={() => { setSelectedEventId(null); setSearchQuery(''); }}
                                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                             >
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                     <ChevronLeft size={20} />
                                </div>
                                <span className="font-bold text-sm">بازگشت به لیست رویدادها</span>
                             </button>
                             
                             <div className="flex items-center gap-3">
                                <Button 
                                    onClick={() => currentEvent && handleOpenEditEvent(currentEvent)}
                                    variant="outline" 
                                    className="gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                    <Edit size={18} />
                                    <span>ویرایش اطلاعات</span>
                                </Button>
                                <Button variant="secondary" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 border-none">
                                    <Download size={18} />
                                    <span>خروجی اکسل</span>
                                </Button>
                             </div>
                        </div>

                        {/* 2. Event Overview Card */}
                        {currentEvent && (
                            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col xl:flex-row gap-8 transition-colors">
                                {/* Left: Info */}
                                <div className="flex items-start gap-5 flex-1 border-b xl:border-b-0 xl:border-l border-slate-100 dark:border-slate-800 pb-6 xl:pb-0 xl:pl-8">
                                    <img src={currentEvent.imageUrl} alt="" className="w-28 h-28 rounded-2xl object-cover shadow-md" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs font-bold">
                                                {currentEvent.category}
                                            </span>
                                            <span className="text-xs text-slate-400 font-mono">ID: {currentEvent.id}</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-4 line-clamp-1">{currentEvent.title}</h2>

                                        {currentEvent.isVirtual && (
                                            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 mb-4">
                                                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold mb-2">
                                                    <Video size={18} />
                                                    <span>اطلاعات جلسه مجازی</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-indigo-100 dark:border-indigo-800 text-sm font-mono text-slate-600 dark:text-slate-300">
                                                    <Link size={14} className="text-slate-400" />
                                                    <a href={currentEvent.meetingLink} target="_blank" rel="noreferrer" className="truncate hover:text-indigo-600 hover:underline">{currentEvent.meetingLink || 'لینک هنوز تعریف نشده است'}</a>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-primary-500" />
                                                <span>{currentEvent.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-primary-500" />
                                                <span>{currentEvent.time}</span>
                                            </div>
                                            {!currentEvent.isVirtual && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} className="text-primary-500" />
                                                    <span>{currentEvent.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-[1.5]">
                                    {/* Revenue Card */}
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex flex-col justify-between group hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">درآمد کل</span>
                                            <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg text-emerald-500 shadow-sm">
                                                <DollarSign size={16} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xl font-black text-slate-800 dark:text-white">
                                                {(currentEvent.price * currentEvent.registered).toLocaleString('fa-IR')}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1">تومان</div>
                                        </div>
                                    </div>

                                    {/* Sales Card */}
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex flex-col justify-between group hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">وضعیت فروش</span>
                                            <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg text-primary-500 shadow-sm">
                                                <Ticket size={16} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-end gap-1 mb-2">
                                                <span className="text-xl font-black text-slate-800 dark:text-white">{currentEvent.registered}</span>
                                                <span className="text-xs text-slate-400 mb-1">/ {currentEvent.capacity}</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary-500 rounded-full transition-all" 
                                                    style={{ width: `${(currentEvent.registered / currentEvent.capacity) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attendance Card */}
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex flex-col justify-between group hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">نرخ حضور</span>
                                            <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg text-amber-500 shadow-sm">
                                                <PieChart size={16} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-end gap-1 mb-1">
                                                <span className="text-xl font-black text-slate-800 dark:text-white">
                                                    {currentAttendees.filter(a => a.status === 'present').length}
                                                </span>
                                                <span className="text-xs text-slate-400 mb-1">نفر حاضر</span>
                                            </div>
                                            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                                                <ArrowUpRight size={12} />
                                                <span>فعال</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Attendees List Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
                             {/* Header */}
                             <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Users size={20} className="text-primary-500" />
                                    لیست شرکت‌کنندگان
                                </h3>
                                <div className="relative w-full sm:w-72">
                                    <ScanLine className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="جستجو نام یا شماره بلیت..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm dark:text-white"
                                    />
                                </div>
                             </div>

                             {filteredAttendees.length > 0 ? (
                                 <div className="overflow-x-auto">
                                    <table className="w-full text-right">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-medium">
                                            <tr>
                                                <th className="px-6 py-4">نام شرکت کننده</th>
                                                <th className="px-6 py-4">شماره بلیت</th>
                                                <th className="px-6 py-4">تاریخ خرید</th>
                                                <th className="px-6 py-4 text-center">مبلغ پرداختی</th>
                                                <th className="px-6 py-4 text-center">وضعیت</th>
                                                <th className="px-6 py-4 text-center">عملیات</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {filteredAttendees.map((attendee) => (
                                                <tr key={attendee.id} className={`transition-colors ${attendee.status === 'present' ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-800 dark:text-white">{attendee.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-mono text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 inline-block px-2 py-1 rounded">
                                                            {attendee.ticketId}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                        {attendee.purchaseDate}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-bold text-slate-700 dark:text-slate-300">{attendee.amount.toLocaleString('fa-IR')}</span>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 ${attendee.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700'}`}>
                                                                {attendee.paymentStatus === 'paid' ? 'پرداخت شده' : 'ناموفق'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {attendee.status === 'present' ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                                                                <CheckCircle2 size={14} />
                                                                حاضر
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold">
                                                                <XCircle size={14} />
                                                                غایب
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button 
                                                            onClick={() => handleCheckIn(attendee.id)}
                                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                                                attendee.status === 'present' 
                                                                ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200' 
                                                                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/30'
                                                            }`}
                                                        >
                                                            {attendee.status === 'present' ? 'لغو حضور' : 'ثبت ورود'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                 </div>
                             ) : (
                                 <div className="p-12 text-center text-slate-400">
                                     <Search size={48} className="mx-auto mb-4 opacity-50" />
                                     <p>هیچ شرکت کننده‌ای با این مشخصات یافت نشد.</p>
                                 </div>
                             )}
                        </div>
                   </div>
                )}
             </div>
        )}

        {/* USERS CONTENT */}
        {activeTab === 'users' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                 {/* Users Toolbar */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="جستجو در کاربران..." 
                            className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">نام کاربر</th>
                                <th className="px-6 py-4">شماره تماس</th>
                                <th className="px-6 py-4">نقش</th>
                                <th className="px-6 py-4 text-center">تاریخ عضویت</th>
                                <th className="px-6 py-4 text-center">وضعیت</th>
                                <th className="px-6 py-4 text-center">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                                <User size={20} />
                                            </div>
                                            <span className="font-bold text-slate-800 dark:text-white">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-mono">{user.phone}</td>
                                    <td className="px-6 py-4">
                                        {user.role === 'admin' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold">
                                                <Shield size={12} />
                                                مدیر
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
                                                کاربر
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400">{user.joinDate}</td>
                                    <td className="px-6 py-4 text-center">
                                         <button 
                                            onClick={() => handleToggleUserStatus(user.id)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                                user.status === 'active'
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200'
                                                : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 hover:bg-rose-200'
                                            }`}
                                         >
                                            {user.status === 'active' ? 'فعال' : 'مسدود'}
                                         </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors" title="ویرایش">
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors" 
                                                title="حذف"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        )}

        {/* SETTINGS CONTENT */}
        {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-12">
                
                {/* Theme & Appearance */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
                            <Palette size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">ظاهر و قالب</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">شخصی‌سازی رنگ، فونت و تم پنل</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Theme Mode Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">حالت نمایش (Theme)</label>
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl w-fit border border-slate-200 dark:border-slate-700">
                                <button 
                                    onClick={() => handleThemeModeChange('light')} 
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        settings.themeMode === 'light' 
                                        ? 'bg-white text-slate-800 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <Sun size={18} />
                                    <span>روز (Light)</span>
                                </button>
                                <button 
                                    onClick={() => handleThemeModeChange('dark')} 
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        settings.themeMode === 'dark' 
                                        ? 'bg-slate-700 text-white shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <Moon size={18} />
                                    <span>شب (Dark)</span>
                                </button>
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">رنگ اصلی سیستم</label>
                             <div className="flex flex-wrap gap-3">
                                {THEME_COLORS.map(color => (
                                    <button
                                        key={color.id}
                                        onClick={() => handleThemeColorChange(color.id)}
                                        className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                                            settings.themeColor === color.id 
                                            ? 'border-slate-800 dark:border-slate-400 bg-slate-50 dark:bg-slate-800' 
                                            : 'border-transparent bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <div 
                                            className="w-6 h-6 rounded-full shadow-sm" 
                                            style={{ backgroundColor: color.colors[500] }}
                                        ></div>
                                        <span className={`text-sm font-medium ${settings.themeColor === color.id ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                                            {color.name}
                                        </span>
                                        {settings.themeColor === color.id && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-slate-800 dark:bg-slate-400 rounded-full border-2 border-white dark:border-slate-900"></div>
                                        )}
                                    </button>
                                ))}
                             </div>
                        </div>

                        {/* Font Picker */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                <Type size={16} />
                                فونت نمایشی
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {FONTS.map(font => (
                                    <button
                                        key={font.id}
                                        onClick={() => handleFontChange(font.id)}
                                        className={`px-4 py-3 rounded-xl border text-right transition-all ${
                                            settings.themeFont === font.id
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 ring-1 ring-primary-500'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400 dark:bg-slate-800'
                                        }`}
                                        style={{ fontFamily: font.id === 'Tahoma' ? 'Tahoma, sans-serif' : `${font.id}, sans-serif` }}
                                    >
                                        <span className="block text-lg font-bold">نمونه متن فارسی</span>
                                        <span className="text-xs opacity-70">{font.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400">
                            <Globe size={24} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">تنظیمات عمومی</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">نام وب‌سایت</label>
                            <input 
                                type="text" 
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleSettingsChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">شماره تلفن پشتیبانی</label>
                            <input 
                                type="text" 
                                name="supportPhone"
                                dir="ltr"
                                value={settings.supportPhone}
                                onChange={handleSettingsChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-left font-mono dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Gateway Settings */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">اتصال درگاه بانکی</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">تنظیمات مربوط به درگاه پرداخت آنلاین</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">انتخاب درگاه</label>
                            <div className="relative">
                                <select 
                                    name="paymentProvider"
                                    value={settings.paymentProvider}
                                    onChange={handleSettingsChange}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none dark:text-white"
                                >
                                    <option value="zarinpal">زرین‌پال (ZarinPal)</option>
                                    <option value="nextpay">نکست‌پی (NextPay)</option>
                                    <option value="idpay">آیدی‌پی (IDPay)</option>
                                    <option value="behpardakht">به‌پرداخت ملت</option>
                                </select>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <Server size={16} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">کد مرچنت (Merchant ID)</label>
                            <input 
                                type="text" 
                                name="merchantId"
                                dir="ltr"
                                value={settings.merchantId}
                                onChange={handleSettingsChange}
                                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-mono text-sm dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* SMS Panel Settings */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">پنل پیامک (SMS)</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">برای ارسال کد تایید و اطلاع‌رسانی بلیت</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">انتخاب سرویس‌دهنده</label>
                            <select 
                                name="smsProvider"
                                value={settings.smsProvider}
                                onChange={handleSettingsChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all dark:text-white"
                            >
                                <option value="kavenegar">کاوه نگار (KavehNegar)</option>
                                <option value="melipayamak">ملی پیامک (MeliPayamak)</option>
                                <option value="smsir">SMS.ir</option>
                                <option value="farazsms">فراز اس‌ام‌اس</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">کلید دسترسی (API Key)</label>
                                <input 
                                    type="password" 
                                    name="smsApiKey"
                                    dir="ltr"
                                    value={settings.smsApiKey}
                                    onChange={handleSettingsChange}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all font-mono dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">شماره خط ارسال کننده</label>
                                <input 
                                    type="text" 
                                    name="smsLineNumber"
                                    dir="ltr"
                                    value={settings.smsLineNumber}
                                    onChange={handleSettingsChange}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all font-mono dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="fixed bottom-6 left-6 z-40">
                    <Button 
                        onClick={handleSaveSettings}
                        size="lg"
                        className="shadow-2xl shadow-primary-600/40 gap-2 pl-6 pr-8 animate-bounce"
                    >
                        <Save size={20} />
                        <span>ذخیره تغییرات</span>
                    </Button>
                </div>
            </div>
        )}

      </main>

      {/* ... Modals (Instructor, Event) ... */}
      {/* Instructor Modal */}
      {isInstructorModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsInstructorModalOpen(false)}></div>
             <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">
                        {editingInstructor ? 'ویرایش استاد' : 'افزودن استاد جدید'}
                    </h2>
                    <button onClick={() => setIsInstructorModalOpen(false)}><X size={24} className="text-slate-400" /></button>
                </div>
                <form onSubmit={handleSaveInstructor} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">نام و نام خانوادگی</label>
                        <input name="name" value={instructorFormData.name} onChange={handleInstructorFormChange} className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">تخصص / عنوان</label>
                        <input name="expertise" value={instructorFormData.expertise} onChange={handleInstructorFormChange} className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">لینک تصویر</label>
                        <input name="imageUrl" value={instructorFormData.imageUrl} onChange={handleInstructorFormChange} className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white dir-ltr text-left" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">بیوگرافی و رزومه</label>
                        <textarea name="bio" value={instructorFormData.bio} onChange={handleInstructorFormChange} rows={4} className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white" required />
                    </div>
                    <Button type="submit" className="w-full">{editingInstructor ? 'ذخیره تغییرات' : 'افزودن استاد'}</Button>
                </form>
             </div>
        </div>
      )}

      {/* Event Modal Overlay */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsEventModalOpen(false)}
             ></div>
             
             <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[90vh] animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">
                        {editingEvent ? 'ویرایش رویداد' : 'ایجاد رویداد جدید'}
                    </h2>
                    <button 
                        onClick={() => setIsEventModalOpen(false)}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSaveEvent} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">عنوان رویداد</label>
                             <input 
                                type="text" 
                                name="title"
                                value={eventFormData.title}
                                onChange={handleEventFormChange}
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                             />
                        </div>

                         {/* Instructor Selection */}
                         <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">مدرس / سخنران</label>
                             <div className="relative">
                                <select 
                                    name="instructorId"
                                    value={eventFormData.instructorId || ''}
                                    onChange={handleEventFormChange}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white appearance-none"
                                >
                                    <option value="">-- انتخاب کنید (اختیاری) --</option>
                                    {instructors.map(inst => (
                                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                                    ))}
                                </select>
                                <GraduationCap className="absolute left-3 top-3 text-slate-400 pointer-events-none" size={20} />
                             </div>
                        </div>
                        
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">دسته‌بندی</label>
                             <select 
                                name="category"
                                value={eventFormData.category}
                                onChange={handleEventFormChange}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                             >
                                <option value="">انتخاب کنید</option>
                                <option value="موسیقی">موسیقی</option>
                                <option value="آموزشی">آموزشی</option>
                                <option value="سینما">سینما</option>
                                <option value="تئاتر">تئاتر</option>
                                <option value="همایش">همایش</option>
                             </select>
                        </div>

                        {/* Virtual Toggle */}
                        <div className="col-span-1 md:col-span-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                             <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">نحوه برگزاری</label>
                                <select 
                                    name="isVirtual"
                                    value={eventFormData.isVirtual ? 'true' : 'false'}
                                    onChange={handleEventFormChange}
                                    className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
                                >
                                    <option value="false">حضوری</option>
                                    <option value="true">مجازی (آنلاین)</option>
                                </select>
                             </div>
                             
                             {eventFormData.isVirtual ? (
                                 <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">لینک جلسه / وبینار</label>
                                    <input 
                                        type="text" 
                                        name="meetingLink"
                                        value={eventFormData.meetingLink || ''}
                                        onChange={handleEventFormChange}
                                        placeholder="https://meet.google.com/..."
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dir-ltr text-left"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">این لینک پس از ثبت‌نام برای کاربران ارسال می‌شود.</p>
                                 </div>
                             ) : (
                                <div>
                                     <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">مکان برگزاری</label>
                                     <input 
                                        type="text" 
                                        name="location"
                                        value={eventFormData.location}
                                        onChange={handleEventFormChange}
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
                                     />
                                </div>
                             )}
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">تاریخ برگزاری</label>
                             <input 
                                type="text" 
                                name="date"
                                placeholder="۱۴۰۳/۰۲/۲۵"
                                value={eventFormData.date}
                                onChange={handleEventFormChange}
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                             />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">ساعت</label>
                             <input 
                                type="text" 
                                name="time"
                                placeholder="۲۱:۰۰"
                                value={eventFormData.time}
                                onChange={handleEventFormChange}
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                             />
                        </div>
                    </div>

                    {/* Pricing & Capacity */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">قیمت بلیت (تومان)</label>
                             <input 
                                type="number" 
                                name="price"
                                value={eventFormData.price}
                                onChange={handleEventFormChange}
                                required
                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
                             />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">ظرفیت کل</label>
                             <input 
                                type="number" 
                                name="capacity"
                                value={eventFormData.capacity}
                                onChange={handleEventFormChange}
                                required
                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white font-bold text-primary-600"
                             />
                        </div>
                    </div>

                     {/* Image URL */}
                     <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">لینک تصویر</label>
                             <div className="relative">
                                <ImageIcon className="absolute right-3 top-3 text-slate-400" size={20} />
                                <input 
                                    type="text" 
                                    name="imageUrl"
                                    value={eventFormData.imageUrl}
                                    onChange={handleEventFormChange}
                                    placeholder="https://..."
                                    className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white dir-ltr text-left"
                                />
                             </div>
                        </div>

                    {/* Description */}
                    <div>
                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">توضیحات تکمیلی</label>
                         <textarea 
                            name="description"
                            value={eventFormData.description}
                            onChange={handleEventFormChange}
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white resize-none"
                         ></textarea>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="ghost" onClick={() => setIsEventModalOpen(false)} className="flex-1">
                            انصراف
                        </Button>
                        <Button type="submit" variant="primary" className="flex-[2]">
                            {editingEvent ? 'ذخیره تغییرات' : 'ایجاد رویداد'}
                        </Button>
                    </div>

                </form>
             </div>
        </div>
      )}
    </div>
  );
};