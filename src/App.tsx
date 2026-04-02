import React, { useState, useEffect, createContext, useContext, useMemo, Suspense, lazy, useRef } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs,
  deleteDoc,
  orderBy,
  limit,
  updateDoc
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile, Ad, Conversation, SearchAlert } from './types';
import { fetchAddressSuggestions, AddressSuggestion } from './utils/addressApi';
import { isSuspiciousEmail } from './utils/antiSpam';
import { 
  CATEGORIES, 
  DETAIL_LABELS, 
  VEHICLE_SUB_CATEGORIES, 
  VEHICLE_BRANDS, 
  VEHICLE_MODELS, 
  SERVICE_CATEGORIES, 
  ANIMAL_CATEGORIES, 
  HOME_GARDEN_CATEGORIES, 
  HOME_GARDEN_CONDITIONS,
  HOME_GARDEN_MATERIALS,
  ELECTRONICS_CATEGORIES, 
  ELECTRONICS_BRANDS,
  ELECTRONICS_CONDITIONS,
  FASHION_CATEGORIES, 
  EVENT_CATEGORIES, 
  REGIONS, 
  SHOPS_ARTISANS_CATEGORIES, 
  ASSOCIATIONS_CATEGORIES, 
  FUEL_TYPES, 
  GEARBOX_TYPES, 
  REAL_ESTATE_TYPES, 
  REAL_ESTATE_TRANSACTION_TYPES,
  FASHION_GENDERS,
  FAMILY_SUB_CATEGORIES,
  LOISIRS_SUB_CATEGORIES,
  VACATIONS_SUB_CATEGORIES,
  JOBS_SUB_CATEGORIES,
  OTHER_SUB_CATEGORIES,
  FAMILY_SIZES,
  FASHION_CONDITIONS,
  VACATION_ACCOMMODATION_TYPES,
  JOB_CONTRACT_TYPES
} from './constants';
import { CategoryIcon } from './components/CategoryIcon';
import { AdCard } from './components/AdCard';
import { 
  Share2,
  Facebook,
  MessageCircle,
  CheckCircle,
  ThumbsUp,
  Search, 
  PlusCircle, 
  MessageSquare, 
  User as UserIcon, 
  LogOut, 
  Map as MapIcon, 
  Filter,
  Car,
  Home,
  Shirt,
  Handshake,
  Dog,
  Sofa,
  Smartphone,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  X,
  Heart,
  Camera,
  MapPin,
  Clock,
  Tag,
  Send,
  Calendar,
  Gauge,
  Briefcase,
  Globe,
  Shield,
  Star,
  Layout,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';

// --- Lazy Components ---
const AdForm = lazy(() => import('./components/AdForm').then(m => ({ default: m.AdForm })));
const Chat = lazy(() => import('./components/Chat').then(m => ({ default: m.Chat })));
const LegalNotice = lazy(() => import('./components/LegalNotice').then(m => ({ default: m.LegalNotice })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const MyAdsView = lazy(() => import('./components/MyAdsView').then(m => ({ default: m.MyAdsView })));
const AdDetailView = lazy(() => import('./components/AdDetailView').then(m => ({ default: m.AdDetailView })));
const MapView = lazy(() => import('./components/MapView').then(m => ({ default: m.MapView })));
const ProfileView = lazy(() => import('./components/ProfileView').then(m => ({ default: m.ProfileView })));
const MessagesView = lazy(() => import('./components/MessagesView').then(m => ({ default: m.MessagesView })));
const CreateAdView = lazy(() => import('./components/CreateAdView').then(m => ({ default: m.CreateAdView })));
const ContactView = lazy(() => import('./components/ContactView').then(m => ({ default: m.ContactView })));
const EditAdView = lazy(() => import('./components/EditAdView').then(m => ({ default: m.EditAdView })));

const FavoritesView = lazy(() => import('./components/FavoritesView').then(m => ({ default: m.FavoritesView })));
const Partnerships = lazy(() => import('./components/Partnerships').then(m => ({ default: m.Partnerships })));
const SupportView = lazy(() => import('./components/SupportView').then(m => ({ default: m.SupportView })));
const BecomeProviderView = lazy(() => import('./components/BecomeProviderView'));
const ProSpaceView = lazy(() => import('./components/ProSpaceView'));

// --- Contexts ---
const AuthContext = createContext<{
  user: User | null;
  profile: UserProfile | null;
  unreadCount: number;
  favorites: string[];
  toggleFavorite: (adId: string) => Promise<void>;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  profile: null,
  unreadCount: 0,
  favorites: [],
  toggleFavorite: async () => {},
  loading: true,
  signIn: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// --- Components ---

const Logo = React.memo(({ variant = 'default' }: { variant?: 'default' | 'white' }) => (
  <div className="flex items-center group cursor-pointer">
    <img 
      src={variant === 'white' ? "/logo-petitroc-blanc.png" : "/logo-petitroc.png"} 
      alt="PetiTroc" 
      className="h-8 sm:h-10 w-auto transform group-hover:scale-105 transition-transform duration-300"
      referrerPolicy="no-referrer"
    />
  </div>
));

Logo.displayName = 'Logo';

const Header = React.memo(({ onNavigate }: { onNavigate: (page: string, tab?: 'mentions' | 'conditions' | 'privacy') => void }) => {
  const { user, profile, unreadCount, signIn, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="cursor-pointer" onClick={() => onNavigate('home')}>
          <Logo />
        </div>

        <div className="flex md:hidden items-center gap-2 sm:gap-4">
          <button aria-label="Aller à l'accueil" onClick={() => onNavigate('home')} className="text-gray-600 hover:text-orange-500 transition-colors p-1">
            <Home size={20} />
          </button>
          <button aria-label="Voir mes messages" onClick={() => onNavigate('messages')} className="text-gray-600 hover:text-orange-500 transition-colors relative p-1">
            <MessageSquare size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[7px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-2 mr-1 border-r border-gray-100 pr-3">
              <button 
                onClick={() => onNavigate('messages')}
                className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-700 hover:bg-orange-500 hover:text-white transition-all relative group border border-gray-100 hover:border-orange-500 shadow-sm"
                title="Mes messages"
              >
                <div className="relative">
                  <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[7px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full border-2 border-white shadow-md">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
              </button>

              <button 
                onClick={() => onNavigate('my-ads')}
                className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-700 hover:bg-orange-500 hover:text-white transition-all group border border-gray-100 hover:border-orange-500 shadow-sm"
                title="Mes annonces"
              >
                <Tag size={18} className="group-hover:scale-110 transition-transform" />
              </button>

              <button 
                onClick={() => onNavigate('favorites')}
                className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all group border border-gray-100 hover:border-red-100 shadow-sm"
                title="Mes favoris"
              >
                <Heart size={18} className="text-red-500 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}

          <button 
            aria-label="Publier une nouvelle annonce"
            onClick={() => onNavigate('create-ad')}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-10 py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-orange-200/50 hover:-translate-y-0.5 active:scale-95"
          >
            <PlusCircle size={20} />
            <span className="hidden sm:inline">Publier</span>
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full border-2 border-orange-100 overflow-hidden hover:border-orange-500 transition-all relative"
              >
                <img 
                  src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full border-2 border-white"></span>
                )}
              </button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400">Connecté en tant que</p>
                      <p className="text-sm font-bold truncate text-gray-800">{profile?.displayName}</p>
                    </div>
                    <button onClick={() => { onNavigate('profile'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2">
                      <UserIcon size={16} /> Mon profil
                    </button>
                    <button onClick={() => { onNavigate('messages'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2">
                      <div className="relative">
                        <MessageSquare size={16} />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-white"></span>
                        )}
                      </div>
                      Mes messages
                    </button>
                    <button onClick={() => { onNavigate('my-ads'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2">
                      <Tag size={16} /> Mes annonces
                    </button>
                    <button onClick={() => { onNavigate('favorites'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2">
                      <Heart size={16} className="text-red-500" fill="currentColor" /> Mes favoris
                    </button>
                    {profile?.role === 'admin' && (
                      <button onClick={() => { onNavigate('admin'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2 font-bold">
                        <Shield size={16} /> Administration
                      </button>
                    )}
                    {profile?.subscription && (
                      <button onClick={() => { onNavigate('mon-espace-pro'); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 font-bold">
                        <Briefcase size={16} /> Mon espace pro
                      </button>
                    )}
                    <button onClick={() => { logout(); setShowUserMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button 
              onClick={signIn}
              className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-orange-500 transition-colors"
            >
              <UserIcon size={20} />
              Connexion
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

interface HeroProps {
  user: User | null;
  onSearch: (
    query: string, 
    category: string | null, 
    location: string, 
    minPrice?: number, 
    maxPrice?: number, 
    subCategory?: string, 
    maxDistance?: number, 
    adType?: 'offer' | 'seek',
    sortBy?: 'newest' | 'price-asc' | 'price-desc',
    dateFilter?: 'all' | '24h' | '7j' | '30j',
    onlyWithPhotos?: boolean,
    region?: string,
    categoryFilters?: Record<string, any>,
    sellerType?: 'all' | 'pro' | 'individual'
  ) => void;
  initialValues?: {
    query: string;
    category: string;
    location: string;
    minPrice: string;
    maxPrice: string;
    subCategory: string;
    maxDistance: number | undefined;
    adType?: 'offer' | 'seek';
    sortBy: 'newest' | 'price-asc' | 'price-desc';
    dateFilter: 'all' | '24h' | '7j' | '30j';
    onlyWithPhotos: boolean;
    region: string;
    categoryFilters?: Record<string, any>;
    sellerType: 'all' | 'pro' | 'individual';
  };
}

const Hero = React.memo(({ user, onSearch, initialValues }: HeroProps) => {
  const [queryStr, setQueryStr] = useState(initialValues?.query || '');
  const [category, setCategory] = useState(initialValues?.category || '');
  const [subCategory, setSubCategory] = useState(initialValues?.subCategory || '');
  const [location, setLocation] = useState(initialValues?.location || '');
  const [minPrice, setMinPrice] = useState<string>(initialValues?.minPrice || '');
  const [maxPrice, setMaxPrice] = useState<string>(initialValues?.maxPrice || '');
  const [maxDistance, setMaxDistance] = useState<number>(initialValues?.maxDistance || 300);
  const [adType, setAdType] = useState<'offer' | 'seek' | undefined>(initialValues?.adType);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>(initialValues?.sortBy || 'newest');
  const [dateFilter, setDateFilter] = useState<'all' | '24h' | '7j' | '30j'>(initialValues?.dateFilter || 'all');
  const [region, setRegion] = useState(initialValues?.region || '');
  const [sellerType, setSellerType] = useState<'all' | 'pro' | 'individual'>(initialValues?.sellerType || 'all');
  const [onlyWithPhotos, setOnlyWithPhotos] = useState(initialValues?.onlyWithPhotos || false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleSaveSearch = async () => {
    if (!user) {
      toast.error('Connectez-vous pour enregistrer une alerte');
      return;
    }

    try {
      const alertId = `${user.uid}_${Date.now()}`;
      await setDoc(doc(db, 'search_alerts', alertId), {
        id: alertId,
        userId: user.uid,
        query: queryStr,
        category: category || null,
        subCategory: subCategory || null,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        location: location || null,
        maxDistance,
        catFilters,
        createdAt: new Date().toISOString()
      });
      toast.success('Alerte enregistrée ! Vous recevrez un email pour les nouvelles annonces.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'search_alerts');
    }
  };

  const handleCategoryClick = (catId: string) => {
    if (catId === 'real-estate') {
      setActiveSubMenu(activeSubMenu === 'real-estate' ? null : 'real-estate');
    } else {
      setActiveSubMenu(null);
      onSearch('', catId, '', undefined, undefined, '', 30, undefined, 'newest', 'all', false, '', {});
    }
  };

  const handleSubCategoryClick = (subCat: string) => {
    onSearch('', 'real-estate', '', undefined, undefined, subCat, 30, undefined, 'newest', 'all', false, '', {});
    setActiveSubMenu(null);
  };

  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSelectingSuggestion, setIsSelectingSuggestion] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (isSelectingSuggestion) {
        setIsSelectingSuggestion(false);
        return;
      }

      if (location && location.length >= 2) {
        const suggestions = await fetchAddressSuggestions(location);
        setAddressSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [location, isSelectingSuggestion]);

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    setIsSelectingSuggestion(true);
    setLocation(`${suggestion.city} (${suggestion.postcode})`);
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  // Category specific filters
  const [catFilters, setCatFilters] = useState<Record<string, any>>(initialValues?.categoryFilters || {});

  useEffect(() => {
    if (initialValues) {
      setQueryStr(initialValues.query);
      setCategory(initialValues.category);
      setSubCategory(initialValues.subCategory);
      setLocation(initialValues.location);
      setMinPrice(initialValues.minPrice);
      setMaxPrice(initialValues.maxPrice);
      setMaxDistance(initialValues.maxDistance || 300);
      setAdType(initialValues.adType);
      setSortBy(initialValues.sortBy);
      setDateFilter(initialValues.dateFilter);
      setRegion(initialValues.region || '');
      setSellerType(initialValues.sellerType || 'all');
      setOnlyWithPhotos(initialValues.onlyWithPhotos);
      setCatFilters(initialValues.categoryFilters || {});
    }
  }, [initialValues]);

  const handleCatFilterChange = (key: string, value: any) => {
    setCatFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative bg-white py-16 md:py-24 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gray-100 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gray-50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-6xl font-black text-gray-900 mb-6 whitespace-nowrap"
        >
          Qui cherche...<span className="text-orange-500 italic">Troc !</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 mb-10 font-medium"
        >
          Retour aux petites annonces simples et <span className="text-orange-500 font-bold">gratuites</span>, comme avant.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-1.5 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-full mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-1 relative z-50"
        >
          <div className="flex-1 md:min-w-[180px] lg:min-w-[280px] flex flex-col justify-center px-6 md:px-6 lg:px-8 py-3 md:py-2 border-b md:border-b-0 border-gray-50 group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-gray-900 transition-colors">Quoi ?</label>
            <div className="flex items-center">
              <Search className="text-gray-400 mr-3 shrink-0" size={18} />
              <input 
                type="text" 
                placeholder="Que recherchez-vous ?" 
                className="w-full bg-transparent text-xs md:text-sm font-bold text-gray-800 placeholder:text-gray-300 focus:outline-none"
                value={queryStr}
                onChange={(e) => setQueryStr(e.target.value)}
              />
            </div>
          </div>
          
          <div className="hidden md:block w-px h-12 bg-gray-100 mx-1" />

          <div className="flex-1 md:min-w-[180px] lg:min-w-[280px] flex flex-col justify-center px-6 md:px-6 lg:px-8 py-3 md:py-2 border-b md:border-b-0 border-gray-50 group">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-gray-900 transition-colors">Catégorie</label>
            <div className="flex items-center">
              <Layout className="text-gray-400 mr-3 shrink-0" size={18} />
              <select 
                className="w-full bg-transparent text-xs md:text-sm font-bold text-gray-800 focus:outline-none appearance-none cursor-pointer"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubCategory('');
                  setCatFilters({});
                }}
              >
                <option value="">Toutes les catégories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="hidden md:block w-px h-12 bg-gray-100 mx-1" />
          
          <div className="flex-1 md:min-w-[180px] lg:min-w-[280px] flex flex-col justify-center px-6 md:px-6 lg:px-8 py-3 md:py-2 border-b md:border-b-0 border-gray-50 group relative">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-gray-900 transition-colors">Où ?</label>
            <div className="flex items-center">
              <MapPin className="text-gray-400 mr-3 shrink-0" size={18} />
              <input 
                type="text" 
                placeholder="Ville ou code postal" 
                className="w-full bg-transparent text-xs md:text-sm font-bold text-gray-800 placeholder:text-gray-300 focus:outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                autoComplete="off"
              />
            </div>
            
            {showSuggestions && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowSuggestions(false)} 
                />
                <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                  {addressSuggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <p className="text-sm font-black text-gray-900">{s.city}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.postcode} - {s.context}</p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-100 mx-1" />

          <div className="flex items-center justify-between px-6 md:px-4 py-3 md:py-0">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${showFilters ? 'text-gray-900' : 'text-gray-400 hover:text-orange-500'}`}
            >
              <Filter size={14} />
              <span>Filtres</span>
            </button>

            <button 
              onClick={() => onSearch(queryStr, category || null, location, minPrice ? Number(minPrice) : undefined, maxPrice ? Number(maxPrice) : undefined, subCategory, maxDistance, adType, sortBy, dateFilter, onlyWithPhotos, region, catFilters, sellerType)}
              className="md:hidden bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 active:scale-95"
            >
              <Search size={18} />
              Rechercher
            </button>
          </div>

          <button 
            onClick={() => onSearch(queryStr, category || null, location, minPrice ? Number(minPrice) : undefined, maxPrice ? Number(maxPrice) : undefined, subCategory, maxDistance, adType, sortBy, dateFilter, onlyWithPhotos, region, catFilters, sellerType)}
            className="hidden md:flex bg-orange-500 hover:bg-orange-600 text-white px-8 lg:px-14 py-4 rounded-full font-black text-sm transition-all shadow-xl shadow-orange-100 items-center justify-center gap-2 active:scale-95 mr-1"
          >
            <Search size={18} />
            Rechercher
          </button>

          {user && (
            <button 
              onClick={handleSaveSearch}
              className="hidden md:flex bg-white border border-orange-100 text-orange-500 px-4 py-4 rounded-full font-black text-sm transition-all shadow-lg hover:bg-orange-50 items-center justify-center gap-2 active:scale-95 ml-1"
              title="Enregistrer cette recherche"
            >
              <Bell size={18} />
            </button>
          )}
        </motion.div>

        <div className="relative" ref={panelRef}>
          <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex flex-col items-center gap-1 group transition-all w-[60px] sm:w-[70px] ${activeSubMenu === cat.id ? 'scale-105' : ''}`}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${activeSubMenu === cat.id ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-orange-500 border border-orange-100 group-hover:text-orange-600 group-hover:scale-110 shadow-sm'}`}>
                  <CategoryIcon id={cat.id} size={16} />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-tighter transition-colors whitespace-pre-line leading-none h-[20px] flex items-center justify-center group-hover:text-orange-500 text-center ${activeSubMenu === cat.id ? 'text-orange-500' : 'text-gray-600'}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {activeSubMenu === 'real-estate' && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute left-1/2 -translate-x-1/2 mt-4 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-orange-100 p-6 z-[60]"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Sous-catégories Immobilier</h3>
                  <button onClick={() => setActiveSubMenu(null)} className="text-gray-400 hover:text-orange-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {REAL_ESTATE_TRANSACTION_TYPES.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => handleSubCategoryClick(sub)}
                      className="text-left px-4 py-2.5 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all border border-transparent hover:border-orange-100"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-center">
                  <button 
                    onClick={() => {
                      onSearch('', 'real-estate', '', undefined, undefined, '', 30, undefined, 'newest', 'all', false, '', {});
                      setActiveSubMenu(null);
                    }}
                    className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline"
                  >
                    Voir toutes les annonces immobilières
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="overflow-hidden mt-4"
            >
              <div className="bg-white/80 backdrop-blur-md border border-orange-100 rounded-2xl p-4 md:p-6 shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-start lg:items-center justify-center gap-4 md:gap-8">
                <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget (€)</span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="flex-1 sm:w-20 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span className="text-gray-300 font-bold">-</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="flex-1 sm:w-20 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 w-full sm:w-auto min-w-0 lg:min-w-[200px]">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Distance</span>
                    <span className="text-xs font-black text-orange-500">{maxDistance} km</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="300" 
                    step="10"
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                  />
                  <div className="flex justify-between w-full text-[8px] font-bold text-gray-300 uppercase">
                    <span>0 km</span>
                    <span>300 km</span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trier par</span>
                  <select 
                    className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="newest">Plus récent</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                  </select>
                </div>

                <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</span>
                  <select 
                    className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as any)}
                  >
                    <option value="all">Toutes</option>
                    <option value="24h">Dernières 24h</option>
                    <option value="7j">Derniers 7 jours</option>
                    <option value="30j">Derniers 30 jours</option>
                  </select>
                </div>

                <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Région</span>
                  <select 
                    className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  >
                    <option value="">Toute la France</option>
                    {REGIONS.map(r => (
                      <option key={r.id} value={r.id}>{r.id} - {r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type de vendeur</span>
                  <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button 
                      onClick={() => setSellerType('all')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${sellerType === 'all' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Tous
                    </button>
                    <button 
                      onClick={() => setSellerType('individual')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${sellerType === 'individual' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Particuliers
                    </button>
                    <button 
                      onClick={() => setSellerType('pro')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${sellerType === 'pro' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Pros
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Options</span>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={onlyWithPhotos}
                        onChange={(e) => setOnlyWithPhotos(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-200 text-orange-500 focus:ring-orange-500 cursor-pointer transition-all"
                      />
                      <span className="text-xs font-black text-gray-600 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                        Photos uniquement
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={adType === 'seek'}
                        onChange={(e) => setAdType(e.target.checked ? 'seek' : undefined)}
                        className="w-4 h-4 rounded border-gray-200 text-orange-500 focus:ring-orange-500 cursor-pointer transition-all"
                      />
                      <span className="text-xs font-black text-gray-600 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                        Recherches
                      </span>
                    </label>
                  </div>
                </div>

                {(category === 'vehicles' || category === 'services' || category === 'animals' || category === 'home-garden' || category === 'electronics' || category === 'fashion' || category === 'events' || category === 'real-estate' || category === 'shops-artisans' || category === 'associations' || category === 'family' || category === 'loisirs' || category === 'vacations' || category === 'jobs' || category === 'jobs-services' || category === 'others-donations') && (
                  <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sous-catégorie</span>
                    <select 
                      className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                    >
                      <option value="">Toutes</option>
                      {category === 'vehicles' && VEHICLE_SUB_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
                      {category === 'services' && SERVICE_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
                      {category === 'animals' && ANIMAL_CATEGORIES.map(a => <option key={a} value={a}>{a}</option>)}
                      {category === 'home-garden' && HOME_GARDEN_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      {category === 'electronics' && ELECTRONICS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      {category === 'fashion' && FASHION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      {category === 'events' && EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      {category === 'shops-artisans' && SHOPS_ARTISANS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      {category === 'associations' && ASSOCIATIONS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      {category === 'family' && FAMILY_SUB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      {category === 'loisirs' && LOISIRS_SUB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      {category === 'vacations' && VACATIONS_SUB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      {category === 'jobs' && JOBS_SUB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      {category === 'jobs-services' && JOBS_SUB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      {category === 'others-donations' && OTHER_SUB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}

                {/* Category-specific filters */}
                {category === 'vehicles' && (
                  <>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sous-catégorie</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.vehicleSubCategory || ''}
                        onChange={(e) => handleCatFilterChange('vehicleSubCategory', e.target.value)}
                      >
                        <option value="">Toutes</option>
                        {VEHICLE_SUB_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marque</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.brand || ''}
                        onChange={(e) => {
                          handleCatFilterChange('brand', e.target.value);
                          handleCatFilterChange('model', ''); // Reset model when brand changes
                        }}
                      >
                        <option value="">Toutes</option>
                        {VEHICLE_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modèle</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.model || ''}
                        onChange={(e) => handleCatFilterChange('model', e.target.value)}
                        disabled={!catFilters.brand}
                      >
                        <option value="">Tous</option>
                        {catFilters.brand && (VEHICLE_MODELS[catFilters.brand] || ['Autre']).map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Carburant</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.fuel || ''}
                        onChange={(e) => handleCatFilterChange('fuel', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Boîte</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.gearbox || ''}
                        onChange={(e) => handleCatFilterChange('gearbox', e.target.value)}
                      >
                        <option value="">Toutes</option>
                        {GEARBOX_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {category === 'real-estate' && (
                  <>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type de bien</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.realEstateType || ''}
                        onChange={(e) => handleCatFilterChange('realEstateType', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {REAL_ESTATE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pièces</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.rooms || ''}
                        onChange={(e) => handleCatFilterChange('rooms', e.target.value)}
                      >
                        <option value="">Toutes</option>
                        {['1', '2', '3', '4', '5+'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {category === 'fashion' && (
                  <>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Univers</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.gender || ''}
                        onChange={(e) => handleCatFilterChange('gender', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {FASHION_GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {category === 'services' && subCategory?.includes('Vacances & hospitalité') && (
                  <>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hébergement</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.accommodationType || ''}
                        onChange={(e) => handleCatFilterChange('accommodationType', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {['Canapé', 'Chambre privée', 'Maison entière', 'Jardin pour camper'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Voyageurs max</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.maxGuests || ''}
                        onChange={(e) => handleCatFilterChange('maxGuests', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {['1', '2', '3', '4', '5+'].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Animaux</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.petsAllowed || ''}
                        onChange={(e) => handleCatFilterChange('petsAllowed', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {['Oui', 'Non', 'Selon l\'animal'].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fumeur</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.smokingAllowed || ''}
                        onChange={(e) => handleCatFilterChange('smokingAllowed', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {['Oui', 'Non'].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {category === 'home-garden' && (
                  <>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">État</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.homeGardenCondition || ''}
                        onChange={(e) => handleCatFilterChange('homeGardenCondition', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {HOME_GARDEN_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Matière</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.homeGardenMaterial || ''}
                        onChange={(e) => handleCatFilterChange('homeGardenMaterial', e.target.value)}
                      >
                        <option value="">Toutes</option>
                        {HOME_GARDEN_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {category === 'electronics' && (
                  <>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marque</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.electronicsBrand || ''}
                        onChange={(e) => handleCatFilterChange('electronicsBrand', e.target.value)}
                      >
                        <option value="">Toutes</option>
                        {subCategory && ELECTRONICS_BRANDS[subCategory] ? (
                          ELECTRONICS_BRANDS[subCategory].map(b => <option key={b} value={b}>{b}</option>)
                        ) : (
                          Array.from(new Set(Object.values(ELECTRONICS_BRANDS).flat())).sort().map(b => <option key={b} value={b}>{b}</option>)
                        )}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">État</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.electronicsCondition || ''}
                        onChange={(e) => handleCatFilterChange('electronicsCondition', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {ELECTRONICS_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {category === 'family' && (
                  <>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Taille / Âge</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.familySize || ''}
                        onChange={(e) => handleCatFilterChange('familySize', e.target.value)}
                      >
                        <option value="">Toutes</option>
                        {FAMILY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">État</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.condition || ''}
                        onChange={(e) => handleCatFilterChange('condition', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {FASHION_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {category === 'loisirs' && (
                  <>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">État</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.condition || ''}
                        onChange={(e) => handleCatFilterChange('condition', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {FASHION_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {category === 'vacations' && (
                  <>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hébergement</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.accommodationType || ''}
                        onChange={(e) => handleCatFilterChange('accommodationType', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {VACATION_ACCOMMODATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Voyageurs max</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.maxGuests || ''}
                        onChange={(e) => handleCatFilterChange('maxGuests', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {['1', '2', '3', '4', '5+'].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Piscine</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.hasPool || ''}
                        onChange={(e) => handleCatFilterChange('hasPool', e.target.value)}
                      >
                        <option value="">Tous</option>
                        <option value="true">Oui</option>
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Jardin</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.hasGarden || ''}
                        onChange={(e) => handleCatFilterChange('hasGarden', e.target.value)}
                      >
                        <option value="">Tous</option>
                        <option value="true">Oui</option>
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Animaux</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.petsAllowed || ''}
                        onChange={(e) => handleCatFilterChange('petsAllowed', e.target.value)}
                      >
                        <option value="">Tous</option>
                        <option value="true">Acceptés</option>
                      </select>
                    </div>
                  </>
                )}

                {(category === 'jobs' || category === 'jobs-services') && (
                  <>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type de contrat</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.contractType || ''}
                        onChange={(e) => handleCatFilterChange('contractType', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {JOB_CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        <option value="Prestation ponctuelle">Prestation ponctuelle</option>
                        <option value="Service régulier">Service régulier</option>
                      </select>
                    </div>
                  </>
                )}

                {category === 'others-donations' && (
                  <>
                    <div className="flex flex-col items-start gap-2 w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">État</span>
                      <select 
                        className="w-full sm:w-auto bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500"
                        value={catFilters.condition || ''}
                        onChange={(e) => handleCatFilterChange('condition', e.target.value)}
                      >
                        <option value="">Tous</option>
                        {FASHION_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        </div>
      </div>
    );
});

Hero.displayName = 'Hero';

const REGION_MAPPING: Record<string, string[]> = {
  '11': ['75', '77', '78', '91', '92', '93', '94', '95'], // Île-de-France
  '24': ['18', '28', '36', '37', '41', '45'], // Centre-Val de Loire
  '27': ['21', '25', '39', '58', '70', '71', '89', '90'], // Bourgogne-Franche-Comté
  '28': ['14', '27', '50', '61', '76'], // Normandie
  '32': ['02', '59', '60', '62', '80'], // Hauts-de-France
  '44': ['08', '10', '51', '52', '54', '55', '57', '67', '68', '88'], // Grand Est
  '52': ['44', '49', '53', '72', '85'], // Pays de la Loire
  '53': ['22', '29', '35', '56'], // Bretagne
  '75': ['16', '17', '19', '23', '24', '33', '40', '47', '64', '79', '86', '87'], // Nouvelle-Aquitaine
  '76': ['09', '11', '12', '30', '31', '32', '34', '46', '48', '65', '66', '81', '82'], // Occitanie
  '84': ['01', '03', '07', '15', '26', '38', '42', '43', '63', '69', '73', '74'], // Auvergne-Rhône-Alpes
  '93': ['04', '05', '06', '13', '83', '84'], // Provence-Alpes-Côte d'Azur
  '94': ['2A', '2B'], // Corse
};

const deg2rad = (deg: number) => deg * (Math.PI / 180);

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const HomeView = React.memo(({ onAdClick, query: q, category: cat, location: loc, minPrice, maxPrice, subCategory: subCat, maxDistance, adType, sortBy, dateFilter, onlyWithPhotos, region, userLocation, categoryFilters, sellerType }: { 
  onAdClick: (ad: Ad) => void,
  query?: string,
  category?: string | null,
  location?: string,
  minPrice?: number,
  maxPrice?: number,
  subCategory?: string,
  maxDistance?: number,
  adType?: 'offer' | 'seek',
  sortBy?: 'newest' | 'price-asc' | 'price-desc',
  dateFilter?: 'all' | '24h' | '7j' | '30j',
  onlyWithPhotos?: boolean,
  region?: string,
  userLocation?: { lat: number, lng: number } | null,
  categoryFilters?: Record<string, any>,
  sellerType?: 'all' | 'pro' | 'individual'
}) => {
  const { favorites, toggleFavorite, profile } = useAuth();
  const [rawAds, setRawAds] = useState<Ad[]>([]);
  const [featuredPros, setFeaturedPros] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured professionals
    const prosQuery = query(
      collection(db, 'users'), 
      where('isFeaturedPro', '==', true), 
      where('featuredProActive', '==', true)
    );
    
    const unsubscribePros = onSnapshot(prosQuery, (snapshot) => {
      const pros = snapshot.docs.map(doc => doc.data() as UserProfile);
      // Sort in memory to avoid query issues with missing fields
      pros.sort((a, b) => (b.featuredProPriority || 0) - (a.featuredProPriority || 0));
      setFeaturedPros(pros);
    });

    let baseQuery = query(collection(db, 'ads'), where('status', '==', 'active'), orderBy('createdAt', 'desc'));
    
    if (cat) {
      baseQuery = query(collection(db, 'ads'), where('status', '==', 'active'), where('category', '==', cat), orderBy('createdAt', 'desc'));
    }

    const unsubscribeAds = onSnapshot(baseQuery, (snapshot) => {
      setRawAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'ads');
    });

    return () => {
      unsubscribeAds();
      unsubscribePros();
    };
  }, [cat]);

  const ads = useMemo(() => {
    let adsData = [...rawAds];
    
    // Client-side expiration filter
    const now = new Date().toISOString();
    adsData = adsData.filter(ad => !ad.expiresAt || ad.expiresAt > now);

    if (q) {
      const lowerQ = q.toLowerCase();
      adsData = adsData.filter(ad => 
        ad.title.toLowerCase().includes(lowerQ) || 
        ad.description.toLowerCase().includes(lowerQ)
      );
    }
    
    if (loc) {
      const lowerLoc = loc.toLowerCase().trim();
      // Handle "City (CP)" format from suggestions
      const suggestionMatch = lowerLoc.match(/^(.+)\s\((\d{5})\)$/);
      
      if (suggestionMatch) {
        const city = suggestionMatch[1].trim();
        const cp = suggestionMatch[2];
        adsData = adsData.filter(ad => 
          ad.location.city.toLowerCase() === city || 
          ad.location.zipCode === cp
        );
      } else {
        adsData = adsData.filter(ad => 
          ad.location.city.toLowerCase().includes(lowerLoc) || 
          ad.location.zipCode.toLowerCase().startsWith(lowerLoc)
        );
      }
    }

    if (region) {
      const regionDepts = REGION_MAPPING[region];
      if (regionDepts) {
        adsData = adsData.filter(ad => 
          regionDepts.some(dept => ad.location.zipCode.startsWith(dept))
        );
      }
    }

    if (minPrice !== undefined) {
      adsData = adsData.filter(ad => ad.price !== undefined && ad.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      adsData = adsData.filter(ad => ad.price !== undefined && ad.price <= maxPrice);
    }

    if (adType) {
      adsData = adsData.filter(ad => ad.type === adType);
    }

    if (sellerType && sellerType !== 'all') {
      adsData = adsData.filter(ad => {
        const isPro = ad.details.isPro === true;
        return sellerType === 'pro' ? isPro : !isPro;
      });
    }

    if (subCat) {
      adsData = adsData.filter(ad => 
        ad.details.vehicleSubCategory === subCat || 
        ad.details.serviceCategory === subCat ||
        ad.details.animalCategory === subCat ||
        ad.details.homeGardenCategory === subCat ||
        ad.details.electronicsCategory === subCat ||
        ad.details.eventCategory === subCat ||
        ad.details.businessType === subCat ||
        ad.details.associationCategory === subCat ||
        ad.details.fashionCategory === subCat ||
        ad.details.familySubCategory === subCat ||
        ad.details.loisirsSubCategory === subCat ||
        ad.details.vacationsSubCategory === subCat ||
        ad.details.jobsSubCategory === subCat ||
        ad.details.transactionType === subCat ||
        ad.details.jobsServicesSubCategory === subCat ||
        ad.details.othersDonationsSubCategory === subCat
      );
    }

    // Category specific filters
    if (categoryFilters && Object.keys(categoryFilters).length > 0) {
      adsData = adsData.filter(ad => {
        return Object.entries(categoryFilters).every(([key, value]) => {
          if (!value) return true;
          if (key === 'rooms' && value === '5+') {
            return (ad.details.rooms || 0) >= 5;
          }
          if (key === 'maxGuests') {
            const adVal = parseInt(String(ad.details.maxGuests));
            const filterVal = parseInt(String(value));
            if (isNaN(adVal) || isNaN(filterVal)) return ad.details[key] === value;
            return adVal >= filterVal;
          }
          return ad.details[key] === value;
        });
      });
    }

    if (maxDistance !== undefined && userLocation) {
      adsData = adsData.filter(ad => {
        if (!ad.location.lat || !ad.location.lng) return false;
        const dist = calculateDistance(userLocation.lat, userLocation.lng, ad.location.lat, ad.location.lng);
        return dist <= maxDistance;
      });
    }

    // Date Filter
    if (dateFilter && dateFilter !== 'all') {
      const now = new Date();
      const limitDate = new Date();
      if (dateFilter === '24h') limitDate.setHours(now.getHours() - 24);
      else if (dateFilter === '7j') limitDate.setDate(now.getDate() - 7);
      else if (dateFilter === '30j') limitDate.setDate(now.getDate() - 30);
      
      adsData = adsData.filter(ad => new Date(ad.createdAt) >= limitDate);
    }

    // Photos Only
    if (onlyWithPhotos) {
      adsData = adsData.filter(ad => ad.images && ad.images.length > 0);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      adsData.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      adsData.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      adsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Handle Featured Ads Logic
    const featuredAds = adsData.filter(ad => ad.isFeatured && ad.featuredActive);
    const standardAds = adsData.filter(ad => !ad.isFeatured || !ad.featuredActive);

    // Sort featured ads by priority
    featuredAds.sort((a, b) => (b.featuredPriority || 0) - (a.featuredPriority || 0));

    // Reconstruct list with featured ads at specific positions
    let finalAds = [...standardAds];
    
    // First, handle ads with specific positions
    const positionedFeatured = featuredAds.filter(ad => (ad.featuredPosition || 0) > 0);
    const autoFeatured = featuredAds.filter(ad => (ad.featuredPosition || 0) === 0);

    // Add auto-positioned featured ads to the top
    finalAds = [...autoFeatured, ...finalAds];

    // Insert specifically positioned ads
    positionedFeatured.forEach(ad => {
      const pos = (ad.featuredPosition || 1) - 1; // 1-based to 0-based
      finalAds.splice(pos, 0, ad);
    });

    return finalAds;
  }, [rawAds, q, loc, minPrice, maxPrice, subCat, maxDistance, adType, sortBy, dateFilter, onlyWithPhotos, userLocation, sellerType, region, categoryFilters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-gray-900">
          {cat ? CATEGORIES.find(c => c.id === cat)?.label : (q || loc ? 'Résultats de recherche' : 'Toutes les annonces')}
        </h2>
        {(q || cat || loc) && (
          <button 
            onClick={() => { window.location.reload(); }} // Simple way to reset for now or I can pass setters
            className="text-gray-600 font-bold text-sm hover:text-orange-500 hover:underline"
          >
            Effacer les filtres
          </button>
        )}
      </div>

      {/* Featured Professionals Section */}
      {(featuredPros.length > 0 || profile?.role === 'admin') && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star className="text-orange-500" size={24} fill="currentColor" />
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Prestataires à la une</h2>
            </div>
            {profile?.role === 'admin' && (
              <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-full uppercase tracking-widest border border-orange-100">Admin View</span>
            )}
          </div>
          
          {featuredPros.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPros.map(pro => (
                <motion.div 
                  key={pro.uid}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm hover:shadow-xl transition-all flex items-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-orange-50 shrink-0">
                    <img src={pro.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pro.uid}`} alt={pro.displayName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <h3 className="font-bold text-gray-900 truncate group-hover:text-orange-500 transition-colors">{pro.displayName}</h3>
                      <Shield size={14} className="text-blue-500" fill="currentColor" />
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-2">Professionnel vérifié</p>
                    <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline">Voir le profil</button>
                  </div>
                  <div className="bg-orange-50 p-2 rounded-xl text-orange-500">
                    <Layout size={20} />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center bg-gray-50/50">
              <Star className="text-gray-200 mx-auto mb-4" size={48} />
              <p className="text-gray-400 font-bold">Section "Prestataires à la une" (Vide)</p>
              <p className="text-xs text-gray-400 mt-2">Activez "isFeaturedPro" et "featuredProActive" sur un profil utilisateur pour le voir ici.</p>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/5] animate-pulse" />
          ))}
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-20">
          <Search size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-bold">Aucune annonce ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Section À la une */}
          {ads.some(ad => ad.isFeatured && ad.featuredActive) && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-8">
                <Star size={24} className="text-orange-500" fill="currentColor" />
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">À la une</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                {ads.filter(ad => ad.isFeatured && ad.featuredActive).slice(0, 4).map(ad => (
                  <AdCard 
                    key={ad.id} 
                    ad={ad} 
                    onClick={() => onAdClick(ad)} 
                    isFavorite={favorites.includes(ad.id)}
                    onToggleFavorite={() => toggleFavorite(ad.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Toutes les annonces */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                {cat ? CATEGORIES.find(c => c.id === cat)?.label : (q || loc ? 'Résultats' : 'Annonces récentes')}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-8">
              {ads.filter(ad => !(ad.isFeatured && ad.featuredActive)).map(ad => (
                <AdCard 
                  key={ad.id} 
                  ad={ad} 
                  onClick={() => onAdClick(ad)} 
                  isFavorite={favorites.includes(ad.id)}
                  onToggleFavorite={() => toggleFavorite(ad.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

HomeView.displayName = 'HomeView';

// --- Main App Component ---

const Footer = React.memo(({ onNavigate, profile }: { onNavigate: (page: string, tab?: 'mentions' | 'conditions' | 'privacy') => void, profile: UserProfile | null }) => (
  <footer className="bg-gray-900 text-white py-16 mt-24">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <Logo variant="white" />
        </div>
        <p className="text-gray-400 max-w-sm leading-relaxed mb-8">
          Retour aux petites annonces simples et gratuites, comme avant. La plateforme de troc 100% gratuite et solidaire.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
              <MapPin size={14} className="text-gray-400 group-hover:text-white" />
            </div>
            <span className="text-sm font-bold">Aix-en-Provence, France</span>
          </div>
        </div>
      </div>
      <div>
        <h5 className="font-bold mb-6 text-orange-500 uppercase tracking-widest text-xs">Navigation</h5>
        <ul className="space-y-4 text-sm text-gray-400">
          <li><button aria-label="Accueil" onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Accueil</button></li>
          <li><button aria-label="Publier une annonce" onClick={() => onNavigate('create-ad')} className="hover:text-white transition-colors">Publier une annonce</button></li>
          <li><button aria-label="Toutes les catégories" onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Toutes les catégories</button></li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold mb-6 text-orange-500 uppercase tracking-widest text-xs">Informations</h5>
        <ul className="space-y-4 text-sm text-gray-400">
          <li><button aria-label="Mentions Légales" onClick={() => onNavigate('legal-notice', 'mentions')} className="hover:text-white transition-colors">Mentions Légales</button></li>
          <li><button aria-label="Conditions d'utilisation" onClick={() => onNavigate('legal-notice', 'conditions')} className="hover:text-white transition-colors">Conditions d'utilisation</button></li>
          <li><button aria-label="Politique de confidentialité" onClick={() => onNavigate('legal-notice', 'privacy')} className="hover:text-white transition-colors">Politique de confidentialité</button></li>
          <li><button aria-label="Devenir prestataire" onClick={() => onNavigate('devenir-prestataire')} className="hover:text-white transition-colors font-bold text-orange-500">Devenir prestataire</button></li>
          {profile?.subscription && (
            <li><button aria-label="Mon espace pro" onClick={() => onNavigate('mon-espace-pro')} className="hover:text-white transition-colors font-bold text-blue-500">Mon espace pro</button></li>
          )}
          <li><button aria-label="Partenariats" onClick={() => onNavigate('partnerships')} className="hover:text-white transition-colors">Partenariats</button></li>
          <li><button aria-label="Soutenir PetiTroc" onClick={() => onNavigate('support')} className="hover:text-white transition-colors font-bold text-orange-500">Soutenir PetiTroc</button></li>
          <li><button aria-label="Contactez-nous" onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contactez-nous</button></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 pt-16 mt-16 border-t border-gray-800 text-center text-xs text-gray-500">
      &copy; {new Date().getFullYear()} petitroc. Tous droits réservés. Qui cherche...Troc !
    </div>
  </footer>
));

Footer.displayName = 'Footer';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<SearchAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [legalTab, setLegalTab] = useState<'mentions' | 'conditions' | 'privacy'>('mentions');
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [selectedAdForEdit, setSelectedAdForEdit] = useState<Ad | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>(undefined);
  const [selectedAdType, setSelectedAdType] = useState<'offer' | 'seek' | undefined>(undefined);
  const [maxDistance, setMaxDistance] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [dateFilter, setDateFilter] = useState<'all' | '24h' | '7j' | '30j'>('all');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSellerType, setSelectedSellerType] = useState<'all' | 'pro' | 'individual'>('all');
  const [onlyWithPhotos, setOnlyWithPhotos] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState<Record<string, any>>({});
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const appStartTime = useRef(new Date().toISOString());

  const handleSearch = React.useCallback((
    query: string, 
    category: string | null, 
    location: string, 
    minP?: number, 
    maxP?: number, 
    subCat?: string, 
    maxDist?: number, 
    adType?: 'offer' | 'seek',
    sort?: 'newest' | 'price-asc' | 'price-desc',
    date?: 'all' | '24h' | '7j' | '30j',
    photos?: boolean,
    region?: string,
    catFilters?: Record<string, any>,
    sellerType?: 'all' | 'pro' | 'individual'
  ) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setSelectedLocation(location);
    setMinPrice(minP);
    setMaxPrice(maxP);
    setSelectedSubCategory(subCat);
    setMaxDistance(maxDist);
    setSelectedAdType(adType);
    setSortBy(sort || 'newest');
    setDateFilter(date || 'all');
    setOnlyWithPhotos(!!photos);
    setSelectedRegion(region || '');
    setCategoryFilters(catFilters || {});
    setSelectedSellerType(sellerType || 'all');

    if (maxDist !== undefined && !userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            toast.error("Impossible de récupérer votre position pour le filtre de distance.");
          }
        );
      }
    }

    setCurrentPage('home');
  }, [userLocation]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email && isSuspiciousEmail(firebaseUser.email)) {
        toast.error("Les adresses email temporaires ne sont pas autorisées.");
        await signOut(auth);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        
        // Default admin for specific email
        const isAdminEmail = firebaseUser.email === 'elodie.bouyer@laposte.net';
        
        if (docSnap.exists()) {
          const existingProfile = docSnap.data() as UserProfile;
          const updatedProfile = { 
            ...existingProfile, 
            lastSeenAt: new Date().toISOString() 
          };
          
          // Ensure admin role if email matches
          if (isAdminEmail && existingProfile.role !== 'admin') {
            updatedProfile.role = 'admin';
          }
          
          await updateDoc(docRef, { lastSeenAt: updatedProfile.lastSeenAt, role: updatedProfile.role || 'user' });
          setProfile(updatedProfile);
        } else {
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Utilisateur',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            createdAt: new Date().toISOString(),
            lastSeenAt: new Date().toISOString(),
            role: isAdminEmail ? 'admin' : 'user',
            pushNotificationsEnabled: true
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const unreadConversationsCount = snapshot.docs.filter(doc => {
        const data = doc.data() as Conversation;
        return data.unreadCount && data.unreadCount[user.uid] > 0;
      }).length;
      setUnreadCount(unreadConversationsCount);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'conversations');
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map(doc => doc.data().adId as string);
      setFavorites(favs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'favorites');
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setAlerts([]);
      return;
    }

    const q = query(
      collection(db, 'search_alerts'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAlerts = snapshot.docs.map(doc => doc.data() as SearchAlert);
      setAlerts(fetchedAlerts);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'search_alerts');
    });

    return () => unsubscribe();
  }, [user]);

  const handleNavigate = React.useCallback((page: string, tab?: 'mentions' | 'conditions' | 'privacy') => {
    setCurrentPage(page);
    if (tab) setLegalTab(tab);
    if (page === 'home') {
      setSelectedCategory(null);
      setSearchQuery('');
      setSelectedLocation('');
      setMinPrice(undefined);
      setMaxPrice(undefined);
      setSelectedSubCategory(undefined);
      setSelectedAdType(undefined);
      setMaxDistance(undefined);
      setSortBy('newest');
      setDateFilter('all');
      setSelectedRegion('');
      setOnlyWithPhotos(false);
      setCategoryFilters({});
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSubscribe = async (plan: 'bronze' | 'argent' | 'or' | 'premium') => {
    if (!user || !profile) return;
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          userId: user.uid,
          userEmail: user.email
        })
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Erreur lors de la création de la session de paiement.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Une erreur est survenue.");
    }
  };

  const handleManageSubscription = async () => {
    if (!profile?.subscription?.stripeCustomerId) return;
    
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: profile.subscription.stripeCustomerId
        })
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Erreur lors de l'accès au portail.");
      }
    } catch (error) {
      console.error("Portal error:", error);
      toast.error("Une erreur est survenue.");
    }
  };

  useEffect(() => {
    if (user && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [user]);

  useEffect(() => {
    if (!user || !profile?.pushNotificationsEnabled || currentPage === 'messages') return;

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified' || change.type === 'added') {
          const data = change.doc.data() as Conversation;
          if (
            data.updatedAt > appStartTime.current && 
            data.lastSenderId !== user.uid &&
            currentPage !== 'messages'
          ) {
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              const notification = new Notification("Nouveau message", {
                body: `${data.lastSenderName || 'Quelqu\'un'} vous a envoyé un message`,
                icon: data.adImage || '/favicon.ico'
              });
              notification.onclick = () => {
                window.focus();
                handleNavigate('messages');
                notification.close();
              };
            }
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user, profile?.pushNotificationsEnabled, currentPage, handleNavigate]);

  const signIn = React.useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await signOut(auth);
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await deleteDoc(doc(db, 'search_alerts', alertId));
      toast.success('Alerte supprimée');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'search_alerts');
    }
  };

  const toggleFavorite = React.useCallback(async (adId: string) => {
    if (!user) {
      signIn();
      return;
    }

    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', user.uid),
      where('adId', '==', adId)
    );

    try {
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        // Remove from favorites
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
      } else {
        // Add to favorites
        const favRef = doc(collection(db, 'favorites'));
        await setDoc(favRef, {
          id: favRef.id,
          userId: user.uid,
          adId,
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'favorites');
    }
  }, [user, signIn]);

  const handleUpdatePushPreference = React.useCallback(async (enabled: boolean) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { pushNotificationsEnabled: enabled });
      setProfile(prev => prev ? { ...prev, pushNotificationsEnabled: enabled } : null);
      if (enabled && typeof Notification !== 'undefined' && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  }, [user]);

  const handleVerifyPhone = React.useCallback(async () => {
    if (!user || !profile) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { isPhoneVerified: true });
      setProfile(prev => prev ? { ...prev, isPhoneVerified: true } : null);
      alert("Votre téléphone a été vérifié avec succès !");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  }, [user, profile]);

  const handleAdClick = React.useCallback((ad: Ad) => {
    setSelectedAd(ad);
    setCurrentPage('ad-detail');
  }, []);

  const handleContactSeller = React.useCallback(async (sellerId: string, adId: string, adTitle: string, adImage?: string) => {
    if (!user) {
      signIn();
      return;
    }

    if (user.uid === sellerId) {
      toast.warning("Vous ne pouvez pas vous envoyer de message à vous-même.");
      return;
    }

    const conversationId = [user.uid, sellerId].sort().join('_');
    const conversationRef = doc(db, 'conversations', conversationId);

    try {
      await setDoc(conversationRef, {
        id: conversationId,
        participants: [user.uid, sellerId],
        lastMessage: `Intéressé par : ${adTitle}`,
        lastSenderId: user.uid,
        lastSenderName: user.displayName || 'Utilisateur',
        updatedAt: new Date().toISOString(),
        adId: adId,
        adTitle: adTitle,
        adImage: adImage || '',
        unreadCount: {
          [sellerId]: 1,
          [user.uid]: 0
        }
      }, { merge: true });

      handleNavigate('messages');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'conversations');
    }
  }, [user, signIn, handleNavigate]);

  const seedTestAds = React.useCallback(async () => {
    // Only allow for admins OR in development mode
    if (!user || !profile || (profile.role !== 'admin' && process.env.NODE_ENV !== 'development')) return;
    
    const mockAuthors = [
      { id: 'user_1', name: 'Jean Dupont' },
      { id: 'user_2', name: 'Marie Curie' },
      { id: 'user_3', name: 'Pierre Martin' },
      { id: 'user_4', name: 'Sophie Bernard' },
      { id: 'user_5', name: 'Lucas Petit' }
    ];

    const testAds: Partial<Ad>[] = [
      {
        title: "Renault Clio 5 - État Neuf",
        description: "Magnifique Clio 5, peu de kilomètres, toutes options. Idéal pour la ville et les longs trajets.",
        category: "vehicles",
        type: "offer",
        price: 15500,
        images: ["https://picsum.photos/seed/clio/800/600"],
        location: { city: "Paris", address: "Champs-Élysées", lat: 48.8667, lng: 2.3333, zipCode: "75008" },
        details: { brand: "Renault", model: "Clio 5", year: 2022, fuel: "Essence", mileage: 12000, gearbox: "Manuelle" }
      },
      {
        title: "Appartement T3 Lumineux",
        description: "Bel appartement de 65m2 avec balcon, proche de toutes commodités. Cuisine équipée.",
        category: "real-estate",
        type: "offer",
        price: 1200,
        images: ["https://picsum.photos/seed/apt/800/600"],
        location: { city: "Lyon", address: "Place Bellecour", lat: 45.75, lng: 4.85, zipCode: "69002" },
        details: { realEstateType: "Appartement", transactionType: "Location", surface: 65, rooms: 3, energyClass: "B" }
      },
      {
        title: "Veste en cuir vintage",
        description: "Veste en cuir véritable, style rétro, taille M. Très bon état.",
        category: "fashion",
        type: "offer",
        price: 45,
        images: ["https://picsum.photos/seed/jacket/800/600"],
        location: { city: "Bordeaux", address: "Rue Sainte-Catherine", lat: 44.83, lng: -0.57, zipCode: "33000" },
        details: { gender: "Homme", size: "M", material: "Cuir", condition: "Très bon état" }
      },
      {
        title: "Cours de guitare débutant",
        description: "Je propose des cours de guitare pour débutants. Tous styles, ambiance décontractée.",
        category: "services",
        type: "offer",
        price: 25,
        images: ["https://picsum.photos/seed/guitar/800/600"],
        location: { city: "Nantes", address: "Centre-ville", lat: 47.21, lng: -1.55, zipCode: "44000" },
        details: {}
      },
      {
        title: "Chiot Golden Retriever",
        description: "Adorables chiots Golden Retriever à adopter. Vaccinés et pucés.",
        category: "animals",
        type: "offer",
        price: 800,
        images: ["https://picsum.photos/seed/puppy/800/600"],
        location: { city: "Marseille", address: "Le Vieux Port", lat: 43.29, lng: 5.37, zipCode: "13001" },
        details: {}
      },
      {
        title: "Canapé d'angle gris",
        description: "Canapé d'angle confortable, tissu gris, 4 places. Très peu servi.",
        category: "home-garden",
        type: "offer",
        price: 350,
        images: ["https://picsum.photos/seed/sofa/800/600"],
        location: { city: "Lille", address: "Grand Place", lat: 50.63, lng: 3.06, zipCode: "59000" },
        details: { condition: "Bon état" }
      },
      {
        title: "iPhone 13 Pro 128Go",
        description: "iPhone 13 Pro en parfait état, batterie 95%. Vendu avec boîte et chargeur.",
        category: "electronics",
        type: "offer",
        price: 650,
        images: ["https://picsum.photos/seed/iphone/800/600"],
        location: { city: "Strasbourg", address: "Petite France", lat: 48.58, lng: 7.75, zipCode: "67000" },
        details: { condition: "Excellent" }
      },
      {
        title: "Collection de timbres anciens",
        description: "Rare collection de timbres du monde entier, début XXème siècle.",
        category: "other",
        type: "offer",
        price: 150,
        images: ["https://picsum.photos/seed/stamps/800/600"],
        location: { city: "Toulouse", address: "Place du Capitole", lat: 43.60, lng: 1.44, zipCode: "31000" },
        details: {}
      }
    ];

    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

      for (let i = 0; i < testAds.length; i++) {
        const adData = testAds[i];
        const adId = Math.random().toString(36).substring(2, 15);
        
        // Randomly assign an author from mockAuthors or the current user
        const useMockAuthor = Math.random() > 0.3;
        const author = useMockAuthor 
          ? mockAuthors[Math.floor(Math.random() * mockAuthors.length)]
          : { id: user.uid, name: profile.displayName };

        const ad: Ad = {
          ...adData as any,
          id: adId,
          authorId: author.id,
          userName: author.name,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          expiresAt,
          status: 'active',
          duplicateHash: Math.random().toString(36)
        };
        await setDoc(doc(db, 'ads', adId), ad);
      }
      toast.success("Annonces de test générées avec succès !");
      setCurrentPage('home');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'ads');
    }
  }, [user, profile]);

  const seedSingleMockAd = React.useCallback(async () => {
    if (!user || !profile) return;

    const mockAuthors = [
      { id: 'user_1', name: 'Jean Dupont' },
      { id: 'user_2', name: 'Marie Curie' },
      { id: 'user_3', name: 'Pierre Martin' },
      { id: 'user_4', name: 'Sophie Bernard' },
      { id: 'user_5', name: 'Lucas Petit' }
    ];

    const randomAdTemplates = [
      { title: "Velo de ville", category: "vehicles", price: 120, city: "Paris" },
      { title: "Table basse bois", category: "home-garden", price: 45, city: "Lyon" },
      { title: "Pull en laine", category: "fashion", price: 20, city: "Bordeaux" },
      { title: "Clavier mecanique", category: "electronics", price: 80, city: "Nantes" },
      { title: "Plante verte", category: "home-garden", price: 15, city: "Lille" }
    ];

    const template = randomAdTemplates[Math.floor(Math.random() * randomAdTemplates.length)];
    const author = mockAuthors[Math.floor(Math.random() * mockAuthors.length)];
    const adId = Math.random().toString(36).substring(2, 15);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const ad: Ad = {
      id: adId,
      authorId: author.id,
      userName: author.name,
      title: template.title,
      description: `Ceci est une annonce de test pour ${template.title}. En excellent état.`,
      category: template.category,
      type: 'offer',
      price: template.price,
      images: [`https://picsum.photos/seed/${adId}/800/600`],
      location: { city: template.city, address: "Adresse de test", lat: 48.85, lng: 2.35, zipCode: "75000" },
      details: {},
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt,
      status: 'active',
      duplicateHash: Math.random().toString(36)
    };

    try {
      await setDoc(doc(db, 'ads', adId), ad);
      toast.success(`Annonce fictive de ${author.name} générée !`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'ads');
    }
  }, [user, profile]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-orange-50">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Logo />
        </motion.div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, unreadCount, favorites, toggleFavorite, loading, signIn, logout }}>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Toaster position="top-center" richColors />
        <Header onNavigate={handleNavigate} />
        
        <main>
          {currentPage === 'home' && (
            <>
              <Hero 
                user={user}
                onSearch={handleSearch} 
                initialValues={{
                  query: searchQuery,
                  category: selectedCategory || '',
                  location: selectedLocation,
                  minPrice: minPrice?.toString() || '',
                  maxPrice: maxPrice?.toString() || '',
                  subCategory: selectedSubCategory || '',
                  maxDistance: maxDistance,
                  adType: selectedAdType,
                  sortBy: sortBy,
                  dateFilter: dateFilter,
                  onlyWithPhotos: onlyWithPhotos,
                  region: selectedRegion,
                  categoryFilters: categoryFilters,
                  sellerType: selectedSellerType
                }}
              />
              <HomeView 
                onAdClick={handleAdClick} 
                query={searchQuery} 
                category={selectedCategory} 
                location={selectedLocation} 
                minPrice={minPrice}
                maxPrice={maxPrice}
                subCategory={selectedSubCategory}
                maxDistance={maxDistance}
                adType={selectedAdType}
                sortBy={sortBy}
                dateFilter={dateFilter}
                onlyWithPhotos={onlyWithPhotos}
                region={selectedRegion}
                userLocation={userLocation}
                categoryFilters={categoryFilters}
                sellerType={selectedSellerType}
              />
            </>
          )}

          {currentPage === 'ad-detail' && selectedAd && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <AdDetailView 
                ad={selectedAd} 
                onBack={() => handleNavigate('home')} 
                onContactSeller={handleContactSeller} 
                currentUserId={user?.uid}
                isFavorite={favorites.includes(selectedAd.id)}
                onToggleFavorite={() => toggleFavorite(selectedAd.id)}
              />
            </Suspense>
          )}

          {currentPage === 'my-ads' && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <MyAdsView 
                user={user} 
                profile={profile} 
                onAdClick={handleAdClick} 
                onEditAd={(ad) => {
                  setSelectedAdForEdit(ad);
                  handleNavigate('edit-ad');
                }}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            </Suspense>
          )}

          {currentPage === 'favorites' && user && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <FavoritesView 
                userId={user.uid}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onAdClick={handleAdClick}
                onNavigateHome={() => handleNavigate('home')}
              />
            </Suspense>
          )}

          {currentPage === 'edit-ad' && selectedAdForEdit && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <EditAdView 
                ad={selectedAdForEdit} 
                onBack={() => handleNavigate('my-ads')} 
                onSuccess={() => {
                  setSelectedAd(selectedAdForEdit);
                  handleNavigate('ad-detail');
                }} 
              />
            </Suspense>
          )}

          {currentPage === 'map' && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <MapView 
                onBack={() => handleNavigate('home')} 
                onSelectAd={(ad) => {
                  setSelectedAd(ad);
                  handleNavigate('ad-detail');
                }}
              />
            </Suspense>
          )}

          {currentPage === 'create-ad' && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <CreateAdView 
                user={user} 
                onSignIn={signIn} 
                onSuccess={() => handleNavigate('home')} 
              />
            </Suspense>
          )}

          {currentPage === 'messages' && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <MessagesView 
                user={user} 
                onSignIn={signIn} 
              />
            </Suspense>
          )}

          {currentPage === 'devenir-prestataire' && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <BecomeProviderView 
                isLoggedIn={!!user}
                onLogin={signIn}
                onSubscribe={handleSubscribe}
              />
            </Suspense>
          )}

          {currentPage === 'mon-espace-pro' && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <ProSpaceView 
                userProfile={profile}
                onManageSubscription={handleManageSubscription}
                onCancelSubscription={handleManageSubscription}
                onUpgradeSubscription={() => handleNavigate('devenir-prestataire')}
              />
            </Suspense>
          )}

          {currentPage === 'profile' && profile && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <ProfileView 
                profile={profile} 
                onLogout={logout} 
                onSeedTestAds={seedTestAds}
                onSeedSingleMockAd={seedSingleMockAd}
                onUpdatePushPreference={handleUpdatePushPreference}
                onVerifyPhone={handleVerifyPhone}
                alerts={alerts}
                onDeleteAlert={handleDeleteAlert}
              />
            </Suspense>
          )}

          {currentPage === 'legal-notice' && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <LegalNotice onBack={() => handleNavigate('home')} initialTab={legalTab} />
            </Suspense>
          )}

          {currentPage === 'admin' && profile?.role === 'admin' && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <AdminDashboard onBack={() => handleNavigate('home')} onAdClick={handleAdClick} onSeedTestAds={seedTestAds} onSeedSingleMockAd={seedSingleMockAd} />
            </Suspense>
          )}

          {currentPage === 'contact' && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <ContactView onBack={() => handleNavigate('home')} />
            </Suspense>
          )}

          {currentPage === 'partnerships' && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <Partnerships onBack={() => handleNavigate('home')} onContact={() => handleNavigate('contact')} />
            </Suspense>
          )}
          
          {currentPage === 'support' && (
            <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
              <SupportView onBack={() => handleNavigate('home')} />
            </Suspense>
          )}
        </main>

        <Footer onNavigate={handleNavigate} profile={profile} />
      </div>
    </AuthContext.Provider>
  );
}
