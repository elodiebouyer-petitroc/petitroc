import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ThumbsUp, 
  MessageSquare, 
  Phone, 
  Facebook, 
  MessageCircle, 
  Share2,
  Heart,
  Gem,
  AlertTriangle,
  Copy,
  Globe,
  Mail,
  ShieldAlert,
  Info,
  Wifi,
  Utensils,
  ShowerHead,
  Dog,
  CigaretteOff,
  Calendar,
  Tag,
  ParkingCircle,
  Bed,
  Languages,
  ShieldCheck,
  Palmtree,
  Settings,
  FileText,
  Users,
  Home,
  Sofa,
  Lamp,
  PawPrint,
  Cigarette,
  Briefcase,
  Gift,
  Baby,
  Cpu,
  Smartphone,
  Music,
  Gamepad,
  Send as SendIcon,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { db } from '../firebase';
import { Ad, UserProfile, Review } from '../types';
import { DETAIL_LABELS } from '../constants';
import { formatPhoneNumber } from '../lib/formatUtils';
import { ReportModal } from './ReportModal';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, limit, updateDoc } from 'firebase/firestore';
import { StarRating, ReviewForm, ReviewList } from './ReviewSystem';

interface AdDetailViewProps {
  ad: Ad;
  onBack: () => void;
  onContactSeller: (sellerId: string, adId: string, adTitle: string, adImage?: string) => void;
  currentUserId?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const AdDetailView = React.memo(({ 
  ad, 
  onBack, 
  onContactSeller,
  currentUserId,
  isFavorite,
  onToggleFavorite
}: AdDetailViewProps) => {
  const isOwner = currentUserId === ad.authorId;
  const [seller, setSeller] = useState<UserProfile | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const userRef = doc(db, 'users', ad.authorId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setSeller({ uid: userSnap.id, ...userSnap.data() } as UserProfile);
        }
      } catch (error) {
        console.error("Error fetching seller:", error);
      }
    };
    fetchSeller();

    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(
          reviewsRef, 
          where('targetUserId', '==', ad.authorId),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const fetchedReviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
        setReviews(fetchedReviews);

        if (currentUserId) {
          const userReview = fetchedReviews.find(r => r.reviewerId === currentUserId && r.adId === ad.id);
          if (userReview) setUserHasReviewed(true);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [ad.authorId, ad.id, currentUserId]);

  useEffect(() => {
    if (currentUserId && ad.authorId !== currentUserId) {
      const checkInteraction = async () => {
        try {
          const convRef = collection(db, 'conversations');
          const q = query(
            convRef, 
            where('adId', '==', ad.id),
            where('participants', 'array-contains', currentUserId)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setHasInteracted(true);
          }
        } catch (error) {
          console.error("Error checking interaction:", error);
        }
      };
      checkInteraction();
    }
  }, [currentUserId, ad.id, ad.authorId]);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!currentUserId || !currentUserProfile) return;

    try {
      const reviewData = {
        adId: ad.id,
        reviewerId: currentUserId,
        reviewerName: currentUserProfile.displayName,
        targetUserId: ad.authorId,
        rating,
        comment,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      
      // Update seller's profile aggregation (Note: Ideally this should be a Cloud Function)
      const sellerRef = doc(db, 'users', ad.authorId);
      const sellerSnap = await getDoc(sellerRef);
      if (sellerSnap.exists()) {
        const sellerData = sellerSnap.data() as UserProfile;
        const currentRating = sellerData.rating || 0;
        const currentCount = sellerData.reviewCount || 0;
        const newCount = currentCount + 1;
        const newRating = (currentRating * currentCount + rating) / newCount;

        await updateDoc(sellerRef, {
          rating: newRating,
          reviewCount: newCount
        });

        // Update local seller state
        setSeller(prev => prev ? { ...prev, rating: newRating, reviewCount: newCount } : null);
      }

      // Update local state
      setReviews(prev => [{ id: 'temp', ...reviewData }, ...prev]);
      setUserHasReviewed(true);
      setShowReviewForm(false);
      toast.success("Merci pour votre avis !");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Erreur lors de l'envoi de l'avis");
    }
  };

  useEffect(() => {
    if (currentUserId) {
      const fetchCurrentUser = async () => {
        const userRef = doc(db, 'users', currentUserId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setCurrentUserProfile({ uid: userSnap.id, ...userSnap.data() } as UserProfile);
        }
      };
      fetchCurrentUser();
    }
  }, [currentUserId]);

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = ad.title;
    const text = `Regarde cette annonce sur PetiTroc : ${ad.title}`;

    if (!platform && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        console.log("Share API failed, falling back to menu");
      }
    }

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success("Lien copié !");
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        adId={ad.id}
        adTitle={ad.title}
        currentUserId={currentUserId || ''}
        currentUserEmail={currentUserProfile?.email || ''}
      />
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-8 font-bold transition-colors"
      >
        <ChevronLeft size={20} /> Retour aux annonces
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-100 rounded-3xl aspect-video overflow-hidden relative group">
            <img 
              src={ad.images[0] || 'https://picsum.photos/seed/troc/800/600'} 
              alt={ad.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            {ad.images.length > 1 && (
              <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold">
                1 / {ad.images.length} photos
              </div>
            )}
          </div>
          
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-gray-900">{ad.title}</h1>
                  {onToggleFavorite && (
                    <button 
                      onClick={onToggleFavorite}
                      className={`p-2 rounded-xl transition-all ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500'}`}
                      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400 font-bold">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {ad.location.city}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {new Date(ad.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full mb-8" />

            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-lg font-black text-gray-900">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{ad.description}</p>
                
                {ad.category === 'services' && (
                  <div className="space-y-4 mt-6">
                    {ad.details.serviceCategory === 'Vacances & hospitalité (Couchsurfing, échange maison, guide local)' && (
                      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
                        <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700 font-medium">
                          L'hébergement (Couchsurfing, échange maison) sur PetiTroc est 100% gratuit et basé sur l'entraide.
                        </p>
                      </div>
                    )}

                    {ad.details.hospitalityAmenities && Array.isArray(ad.details.hospitalityAmenities) && ad.details.hospitalityAmenities.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2">
                          <Info size={16} className="text-gray-400" /> Équipements & Services
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {ad.details.hospitalityAmenities.map((amenity: string) => {
                            const getIcon = (name: string) => {
                              switch (name) {
                                case 'Wifi': return <Wifi size={14} />;
                                case 'Cuisine': return <Utensils size={14} />;
                                case 'Douche': return <ShowerHead size={14} />;
                                case 'Animaux acceptés': return <Dog size={14} />;
                                case 'Non-fumeur': return <CigaretteOff size={14} />;
                                case 'Parking': return <ParkingCircle size={14} />;
                                case 'Draps fournis': return <Bed size={14} />;
                                default: return <CheckCircle size={14} />;
                              }
                            };
                            return (
                              <div key={amenity} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                <span className="text-gray-400">{getIcon(amenity)}</span>
                                {amenity}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {ad.details.hospitalityLanguages && Array.isArray(ad.details.hospitalityLanguages) && ad.details.hospitalityLanguages.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                        <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2">
                          <Languages size={16} className="text-gray-400" /> Langues parlées
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {ad.details.hospitalityLanguages.map((lang: string) => (
                            <span key={lang} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-black text-gray-600 uppercase">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                      <ShieldAlert size={20} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700 font-medium">
                        {ad.details.serviceCategory === 'Vacances & hospitalité (Couchsurfing, échange maison, guide local)' 
                          ? "Sécurité : Rencontrez la personne avant, vérifiez les avis, ne donnez jamais d'argent à l'avance."
                          : "Sécurité : Pour les rencontres physiques, privilégiez les lieux publics et prévenez un proche."}
                      </p>
                    </div>
                  </div>
                )}

                {ad.category === 'vehicles' && ad.details.registrationStatus && ad.details.registrationStatus !== 'OK' && (
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3 mt-6">
                    <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700 font-medium">
                      Attention : La carte grise de ce véhicule est "{ad.details.registrationStatus}". Assurez-vous d'avoir tous les documents nécessaires avant la vente.
                    </p>
                  </div>
                )}

                <div className="pt-12 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-gray-900">Avis sur le vendeur</h3>
                    {hasInteracted && !userHasReviewed && !isOwner && !showReviewForm && (
                      <button 
                        onClick={() => setShowReviewForm(true)}
                        className="text-sm font-black text-gray-600 hover:text-orange-500 flex items-center gap-2"
                      >
                        <Star size={16} /> Laisser un avis
                      </button>
                    )}
                  </div>

                  {showReviewForm && (
                    <div className="mb-12">
                      <ReviewForm 
                        adId={ad.id} 
                        targetUserId={ad.authorId} 
                        onSubmit={handleReviewSubmit} 
                        onCancel={() => setShowReviewForm(false)} 
                      />
                    </div>
                  )}

                  <ReviewList reviews={reviews} />
                </div>
              </div>

              {Object.keys(ad.details || {}).length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h3 className="text-lg font-black text-gray-900 mb-6">Critères</h3>
                  <div className="space-y-4">
                    {Object.entries(ad.details).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                          {DETAIL_LABELS[key] || key}
                        </p>
                        <p className="text-sm font-black text-gray-700">
                          {key === 'website' && value ? (
                            <a href={String(value)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                              <Globe size={12} /> Visiter le site
                            </a>
                          ) : key === 'contactEmail' && value ? (
                            <a href={`mailto:${value}`} className="text-blue-500 hover:underline flex items-center gap-1">
                              <Mail size={12} /> {String(value)}
                            </a>
                          ) : key === 'contactPhone' && value ? (
                            <a href={`tel:${value}`} className="text-blue-500 hover:underline flex items-center gap-1">
                              <Phone size={12} /> {String(value)}
                            </a>
                          ) : key === 'technicalControl' ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <ShieldCheck size={14} /> {String(value)}
                            </span>
                          ) : key === 'timingBelt' ? (
                            <span className="flex items-center gap-1 text-blue-600">
                              <Settings size={14} /> {String(value)}
                            </span>
                          ) : key === 'registrationStatus' ? (
                            <span className={`flex items-center gap-1 ${value === 'OK' ? 'text-gray-700' : 'text-amber-600'}`}>
                              <FileText size={14} /> {String(value)}
                            </span>
                          ) : key === 'transactionType' ? (
                            <span className="flex items-center gap-1 text-orange-600">
                              <Home size={14} /> {String(value)}
                            </span>
                          ) : key === 'condition' ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle size={14} /> {String(value)}
                            </span>
                          ) : key === 'weddingSubCategory' ? (
                            <span className="flex items-center gap-1 text-pink-600">
                              <Gem size={14} /> {String(value)}
                            </span>
                          ) : key === 'jobsServicesSubCategory' ? (
                            <span className="flex items-center gap-1 text-blue-600">
                              <Briefcase size={14} /> {String(value)}
                            </span>
                          ) : key === 'contractType' ? (
                            <span className="flex items-center gap-1 text-blue-600">
                              <FileText size={14} /> {String(value)}
                            </span>
                          ) : key === 'othersDonationsSubCategory' ? (
                            <span className="flex items-center gap-1 text-purple-600">
                              <Gift size={14} /> {String(value)}
                            </span>
                          ) : key === 'familySubCategory' ? (
                            <span className="flex items-center gap-1 text-blue-600">
                              <Baby size={14} /> {String(value)}
                            </span>
                          ) : key === 'familySize' ? (
                            <span className="flex items-center gap-1 text-blue-600">
                              <Users size={14} /> {String(value)}
                            </span>
                          ) : key === 'electronicsCategory' ? (
                            <span className="flex items-center gap-1 text-orange-600">
                              <Cpu size={14} /> {String(value)}
                            </span>
                          ) : key === 'electronicsBrand' ? (
                            <span className="flex items-center gap-1 text-orange-600">
                              <Smartphone size={14} /> {String(value)}
                            </span>
                          ) : key === 'homeGardenCategory' ? (
                            <span className="flex items-center gap-1 text-orange-600">
                              <Sofa size={14} /> {String(value)}
                            </span>
                          ) : key === 'homeGardenCondition' ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle size={14} /> {String(value)}
                            </span>
                          ) : key === 'loisirsSubCategory' ? (
                            <span className="flex items-center gap-1 text-purple-600">
                              <Music size={14} /> {String(value)}
                            </span>
                          ) : key === 'vacationsSubCategory' || key === 'accommodationType' ? (
                            <span className="flex items-center gap-1 text-teal-600">
                              <Palmtree size={14} /> {String(value)}
                            </span>
                          ) : key === 'maxGuests' ? (
                            <span className="flex items-center gap-1 text-teal-600">
                              <Users size={14} /> {String(value)} voyageurs
                            </span>
                          ) : key === 'hasPool' || key === 'hasGarden' || key === 'petsAllowed' || key === 'hasAC' ? (
                            value ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle size={14} /> Oui
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-600">
                                <AlertTriangle size={14} /> Non
                              </span>
                            )
                          ) : key === 'originalPrice' ? (
                            <div className="flex flex-col">
                              <span className="line-through text-gray-400 text-xs">{value} €</span>
                              {ad.price && (
                                <span className="text-green-600 text-xs font-bold">
                                  Économie: {Math.round(Number(value) - ad.price)} € (-{Math.round((1 - ad.price / Number(value)) * 100)}%)
                                </span>
                              )}
                            </div>
                          ) : key === 'isVintage' || key === 'isDesigner' ? (
                            value ? (
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                key === 'isVintage' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-pink-100 text-pink-700 border border-pink-200'
                              }`}>
                                {key === 'isVintage' ? 'Vintage' : 'Créateur'}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs italic">Non</span>
                            )
                          ) : key === 'eventDate' ? (
                            <span className="flex items-center gap-1 text-gray-600">
                              <Calendar size={14} /> {new Date(String(value)).toLocaleDateString('fr-FR')}
                            </span>
                          ) : key === 'size' ? (
                            <span className="flex items-center gap-1 text-gray-700">
                              <Tag size={14} /> {String(value)}
                            </span>
                          ) : key === 'maxGuests' ? (
                            <span className="flex items-center gap-1 text-gray-700">
                              <Users size={14} /> {String(value)} voyageurs max
                            </span>
                          ) : key === 'accommodationType' ? (
                            <span className="flex items-center gap-1 text-gray-700">
                              <Home size={14} /> {String(value)}
                            </span>
                          ) : key === 'petsAllowed' ? (
                            <span className="flex items-center gap-1 text-gray-700">
                              <PawPrint size={14} /> {String(value)}
                            </span>
                          ) : key === 'smokingAllowed' ? (
                            <span className="flex items-center gap-1 text-gray-700">
                              {value === 'Oui' ? <Cigarette size={14} /> : <CigaretteOff size={14} />} {String(value)}
                            </span>
                          ) : key === 'preferredPeriod' ? (
                            <span className="flex items-center gap-1 text-gray-600">
                              <Calendar size={14} /> {String(value)}
                            </span>
                          ) : key === 'interests' ? (
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(value) && value.map((v, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase">
                                  {v}
                                </span>
                              ))}
                            </div>
                          ) : key === 'hospitalityLanguages' ? (
                            <span className="flex items-center gap-1 text-gray-700">
                              <Languages size={14} /> {Array.isArray(value) ? value.join(', ') : String(value)}
                            </span>
                          ) : key === 'hospitalityDuration' ? (
                            <span className="flex items-center gap-1 text-gray-700">
                              <Clock size={14} /> {String(value)}
                            </span>
                          ) : Array.isArray(value) ? (
                            value.join(', ')
                          ) : (
                            <>
                              {String(value)}
                              {key === 'mileage' && ' km'}
                              {key === 'power' && ' CV'}
                              {key === 'surface' && ' m²'}
                              {key === 'landSurface' && ' m²'}
                              {key === 'floor' && value !== 0 && 'e étage'}
                              {key === 'floor' && value === 0 && ' (RDC)'}
                            </>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl sticky top-24">
              <div className="mb-8">
                <div className="text-[40px] font-black text-gray-900 leading-none mb-2">
                  {ad.category === 'services' && ad.details.serviceCategory === 'Vacances & hospitalité (Couchsurfing, échange maison, guide local)' ? (
                    "Gratuit"
                  ) : (
                    <>
                      {ad.price} €
                      {ad.category === 'real-estate' && ad.details.transactionType === 'Location' && <span className="text-lg font-bold text-gray-400 ml-1">/ mois</span>}
                    </>
                  )}
                </div>
                <div className="h-1 w-12 bg-gray-900 rounded-full" />
              </div>

              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 font-black text-xl relative">
                  {ad.userName.charAt(0)}
                  {/* Trust indicator on avatar */}
                  {seller?.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle size={16} className="text-blue-500" fill="currentColor" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Vendeur</p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-gray-900">{ad.userName}</h3>
                    {seller?.isVerified && (
                      <CheckCircle size={16} className="text-blue-500" fill="currentColor" />
                    )}
                  </div>
                  
                  {/* Trust Badges & Info */}
                  <div className="space-y-1 mt-2">
                    {seller?.isPhoneVerified && (
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full w-fit">
                        <Phone size={10} fill="currentColor" />
                        Téléphone vérifié
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Clock size={10} />
                      {seller?.lastSeenAt ? (
                        <>En ligne {new Date(seller.lastSeenAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</>
                      ) : (
                        <>Dernière connexion inconnue</>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <MessageSquare size={10} />
                      {seller?.responseRate || "Répond généralement dans la journée"}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-xs text-orange-500 font-bold">
                      <Star size={12} fill="currentColor" />
                      <span>{seller?.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-bold">
                      <MessageSquare size={12} />
                      <span>{seller?.reviewCount || 0} avis</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {isOwner ? (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
                    <p className="text-sm font-bold text-gray-500">C'est votre annonce</p>
                    <p className="text-xs text-gray-400 mt-1">Vous ne pouvez pas vous envoyer de message à vous-même.</p>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => onContactSeller(ad.authorId, ad.id, ad.title, ad.images[0])}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-gray-100 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={20} /> Envoyer un message
                    </button>
                    <button 
                      onClick={() => setShowPhone(!showPhone)}
                      className="w-full bg-white border-2 border-gray-900 text-gray-900 py-4 rounded-2xl font-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Phone size={20} /> {showPhone ? formatPhoneNumber(seller?.phoneNumber) : 'Voir le numéro'}
                    </button>
                  </>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Partager l'annonce</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleShare('facebook')}
                    className="bg-[#1877F2] text-white p-3 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm font-bold"
                  >
                    <Facebook size={18} /> Facebook
                  </button>
                  <button 
                    onClick={() => handleShare('whatsapp')}
                    className="bg-[#25D366] text-white p-3 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm font-bold"
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </button>
                  <button 
                    onClick={() => handleShare('copy')}
                    className="bg-gray-100 text-gray-600 p-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all text-sm font-bold"
                  >
                    <Copy size={18} /> Copier le lien
                  </button>
                </div>
                {navigator.share && (
                  <button 
                    onClick={() => handleShare()}
                    className="w-full mt-3 bg-gray-50 text-gray-600 p-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all text-sm font-bold border border-gray-100"
                  >
                    <Share2 size={18} /> Autres options de partage
                  </button>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-gray-400 font-bold">Vues</span>
                  <span className="text-gray-900 font-black">124</span>
                </div>
                
                {!isOwner && currentUserId && (
                  <button 
                    onClick={() => setIsReportModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors py-2"
                  >
                    <AlertTriangle size={14} /> Signaler cette annonce
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
});

AdDetailView.displayName = 'AdDetailView';
