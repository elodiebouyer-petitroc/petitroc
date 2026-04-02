import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  CheckCircle, 
  MapPin, 
  Gauge, 
  Home, 
  Tag, 
  Briefcase, 
  Globe,
  Edit2,
  Trash2,
  Heart,
  Gem,
  Clock,
  Store,
  Users,
  ShieldCheck,
  Settings,
  FileText,
  AlertTriangle,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Ad, UserProfile } from '../types';
import { CATEGORIES } from '../constants';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AdCardProps {
  ad: Ad;
  onClick: () => void;
  onBoost?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwnerView?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export const AdCard = React.memo(({ ad, onClick, onBoost, onEdit, onDelete, isOwnerView, isFavorite, onToggleFavorite }: AdCardProps) => {
  const isExpired = ad.expiresAt ? new Date(ad.expiresAt) < new Date() : false;
  const [authorProfile, setAuthorProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRef = doc(db, 'users', ad.authorId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setAuthorProfile(userSnap.data() as UserProfile);
        }
      } catch (error) {
        console.error("Error fetching author profile for card:", error);
      }
    };
    fetchProfile();
  }, [ad.authorId]);

  const sellerRating = authorProfile ? { 
    rating: authorProfile.rating || 0, 
    count: authorProfile.reviewCount || 0 
  } : null;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-200 cursor-pointer group flex flex-col h-full ${isExpired ? 'opacity-75 grayscale-[0.5]' : ''} ${ad.isFeatured && ad.featuredActive ? 'ring-2 ring-orange-500 shadow-orange-100' : ''}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100" onClick={onClick}>
        <img 
          src={ad.images[0] || 'https://picsum.photos/seed/troc/400/300'} 
          alt={ad.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {new Date(ad.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
            <div className="bg-green-500 text-white px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest shadow-lg">
              Nouveau
            </div>
          )}
          {ad.isFeatured && ad.featuredActive && (
            <div className="bg-orange-500 text-white px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
              <Star size={8} fill="currentColor" /> Mis en avant
            </div>
          )}
          {authorProfile?.isPartner && (
            <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
              <ShieldCheck size={8} fill="currentColor" /> Partenaire
            </div>
          )}
          {ad.details.isPro && (
            <div className="bg-gray-900 text-white px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
              <Store size={8} fill="currentColor" /> PRO
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider text-gray-500">
            {CATEGORIES.find(c => c.id === ad.category)?.label}
          </div>
          {ad.type === 'seek' && (
            <div className="bg-blue-500 text-white px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest shadow-lg">
              RECHERCHE
            </div>
          )}
          {isExpired && (
            <div className="bg-red-500 text-white px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider">
              Expirée
            </div>
          )}
          {ad.category === 'real-estate' && ad.details.transactionType && (
            <div className="bg-gray-500 text-white px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider">
              {ad.details.transactionType}
            </div>
          )}
        </div>
        {onToggleFavorite && (
          <div className="absolute top-2 right-2 flex flex-col gap-1.5">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(e);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all shadow-lg ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:text-red-500'}`}
            >
              <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
        )}
        {ad.price !== undefined && (
          <div className="absolute bottom-2 right-2 bg-white text-orange-500 px-2 py-0.5 rounded-lg font-bold text-sm shadow-lg border border-orange-50">
            {ad.price} €
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <div onClick={onClick} className="flex-1">
          <div className="flex justify-between items-start mb-0.5">
            <h3 className="font-bold text-gray-900 truncate group-hover:text-orange-500 transition-colors flex items-center gap-1.5 text-sm flex-1">
              {ad.title}
              {ad.authorIsVerified && (
                <div className="flex items-center gap-0.5 bg-blue-50 text-blue-600 px-1 rounded text-[8px] font-black uppercase tracking-tighter">
                  <CheckCircle size={8} fill="currentColor" /> Vérifié
                </div>
              )}
            </h3>
            {sellerRating && sellerRating.count > 0 && (
              <div className="flex items-center gap-0.5 text-[10px] font-black text-amber-500 ml-2 flex-shrink-0">
                <Star size={10} fill="currentColor" />
                <span>{sellerRating.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
            <MapPin size={10} />
            <span>{ad.location.city} ({ad.location.zipCode})</span>
          </div>
          {ad.category === 'vehicles' && (ad.details.vehicleSubCategory || ad.details.mileage) && (
            <div className="mb-2">
              {ad.details.vehicleSubCategory && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                  {ad.details.vehicleSubCategory}
                </div>
              )}
              {ad.details.mileage && (
                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold">
                  <Gauge size={10} />
                  <span>{ad.details.mileage.toLocaleString()} km</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-1">
                {ad.details.technicalControl && (
                  <div className="flex items-center gap-1 text-[8px] text-gray-500 font-bold bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                    <ShieldCheck size={8} className="text-green-500" />
                    <span>CT: {ad.details.technicalControl}</span>
                  </div>
                )}
                {ad.details.timingBelt && (
                  <div className="flex items-center gap-1 text-[8px] text-gray-500 font-bold bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                    <Settings size={8} className="text-blue-500" />
                    <span>Distri: {ad.details.timingBelt}</span>
                  </div>
                )}
                {ad.details.registrationStatus && (
                  <div className={`flex items-center gap-1 text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                    ad.details.registrationStatus === 'OK' 
                      ? 'text-gray-500 bg-gray-50 border-gray-100' 
                      : 'text-gray-600 bg-gray-50 border-gray-200'
                  }`}>
                    <FileText size={8} />
                    <span>CG: {ad.details.registrationStatus}</span>
                    {ad.details.registrationStatus !== 'OK' && <AlertTriangle size={8} className="text-amber-500" />}
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'wedding' && ad.details.weddingSubCategory && (
            <div className="mb-2">
              <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                {ad.details.weddingSubCategory}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500 font-bold">
                <div className="flex items-center gap-1">
                  <Gem size={10} />
                  <span>{ad.details.condition}</span>
                </div>
                {ad.details.size && (
                  <div className="flex items-center gap-1">
                    <Tag size={10} />
                    <span>{ad.details.size}</span>
                  </div>
                )}
                {ad.details.eventDate && (
                  <div className="flex items-center gap-1">
                    <Calendar size={10} />
                    <span>{new Date(ad.details.eventDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  </div>
                )}
                {ad.price && ad.details.originalPrice && ad.details.originalPrice > ad.price && (
                  <div className="flex items-center gap-1 text-green-600">
                    <span>-{Math.round((1 - ad.price / ad.details.originalPrice) * 100)}%</span>
                  </div>
                )}
              </div>
              <div className="flex gap-1 mt-1">
                {ad.details.isVintage && (
                  <span className="text-[7px] font-black bg-amber-100 text-amber-700 px-1 py-0.5 rounded uppercase tracking-tighter">Vintage</span>
                )}
                {ad.details.isDesigner && (
                  <span className="text-[7px] font-black bg-pink-100 text-pink-700 px-1 py-0.5 rounded uppercase tracking-tighter">Créateur</span>
                )}
              </div>
            </div>
          )}
          {ad.category === 'real-estate' && (ad.details.surface || ad.details.rooms || ad.details.transactionType) && (
            <div className="flex flex-col gap-0.5 mb-2">
              {ad.details.transactionType && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                  {ad.details.transactionType}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.surface && (
                  <div className="flex items-center gap-1">
                    <Home size={10} />
                    <span>{ad.details.surface} m²</span>
                  </div>
                )}
                {ad.details.rooms && (
                  <div className="flex items-center gap-1">
                    <span>{ad.details.rooms} p.</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'fashion' && (ad.details.fashionCategory || ad.details.size || ad.details.condition) && (
            <div className="mb-2">
              {ad.details.fashionCategory && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                  {ad.details.fashionCategory}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.size && (
                  <div className="flex items-center gap-1">
                    <Tag size={10} />
                    <span>{ad.details.size}</span>
                  </div>
                )}
                {ad.details.condition && (
                  <div className="flex items-center gap-1">
                    <span>{ad.details.condition}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'services' && (ad.details.serviceCategory || ad.details.experience || ad.details.hospitalityType) && (
            <div className="mb-2">
              {ad.details.serviceCategory && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 truncate">
                  {ad.details.serviceCategory}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.hospitalityType && (
                  <div className="flex items-center gap-1">
                    <Home size={10} />
                    <span>{ad.details.hospitalityType}</span>
                  </div>
                )}
                {ad.details.accommodationType && (
                  <div className="flex items-center gap-1">
                    <span>{ad.details.accommodationType}</span>
                  </div>
                )}
                {ad.details.maxGuests && (
                  <div className="flex items-center gap-1">
                    <Users size={10} />
                    <span>{ad.details.maxGuests} pers.</span>
                  </div>
                )}
                {ad.details.experience && !ad.details.hospitalityType && (
                  <div className="flex items-center gap-1">
                    <Briefcase size={10} />
                    <span>{ad.details.experience}</span>
                  </div>
                )}
                {ad.details.remoteService === 'Oui' && (
                  <div className="flex items-center gap-1">
                    <Globe size={10} />
                    <span>À distance</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'events' && (ad.details.eventCategory || ad.details.eventDate) && (
            <div className="mb-2">
              {ad.details.eventCategory && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                  {ad.details.eventCategory}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.eventDate && (
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span>{new Date(ad.details.eventDate).toLocaleDateString()}</span>
                  </div>
                )}
                {ad.details.eventTime && (
                  <div className="flex items-center gap-1">
                    <span>{ad.details.eventTime}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'shops-artisans' && (ad.details.businessType || ad.details.openingHours) && (
            <div className="mb-2">
              {ad.details.businessType && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                  {ad.details.businessType}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.openingHours && (
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span>{ad.details.openingHours}</span>
                  </div>
                )}
                {ad.details.isPro && (
                  <div className="flex items-center gap-1 bg-gray-100 px-1 rounded text-[8px] uppercase">
                    PRO
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'associations' && (ad.details.associationCategory || ad.details.contactPerson) && (
            <div className="mb-2">
              {ad.details.associationCategory && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                  {ad.details.associationCategory}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.contactPerson && (
                  <div className="flex items-center gap-1">
                    <Users size={10} />
                    <span>{ad.details.contactPerson}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'family' && (ad.details.familySubCategory || ad.details.familySize) && (
            <div className="mb-2">
              {ad.details.familySubCategory && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 truncate">
                  {ad.details.familySubCategory}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.familySize && (
                  <div className="flex items-center gap-1">
                    <Tag size={10} />
                    <span>{ad.details.familySize}</span>
                  </div>
                )}
                {ad.details.condition && (
                  <div className="flex items-center gap-1">
                    <span>{ad.details.condition}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'electronics' && (ad.details.electronicsCategory || ad.details.electronicsCondition) && (
            <div className="mb-2">
              {ad.details.electronicsCategory && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 truncate">
                  {ad.details.electronicsCategory}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.electronicsBrand && (
                  <div className="flex items-center gap-1">
                    <span>{ad.details.electronicsBrand}</span>
                  </div>
                )}
                {ad.details.electronicsCondition && (
                  <div className="flex items-center gap-1">
                    <span>{ad.details.electronicsCondition}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'home-garden' && (ad.details.homeGardenCategory || ad.details.homeGardenCondition) && (
            <div className="mb-2">
              {ad.details.homeGardenCategory && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 truncate">
                  {ad.details.homeGardenCategory}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.homeGardenCondition && (
                  <div className="flex items-center gap-1">
                    <span>{ad.details.homeGardenCondition}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'loisirs' && (ad.details.loisirsSubCategory || ad.details.condition) && (
            <div className="mb-2">
              {ad.details.loisirsSubCategory && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 truncate">
                  {ad.details.loisirsSubCategory}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.condition && (
                  <div className="flex items-center gap-1">
                    <span>{ad.details.condition}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'vacations' && (ad.details.vacationsSubCategory || ad.details.accommodationType) && (
            <div className="mb-2">
              {ad.details.vacationsSubCategory && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 truncate">
                  {ad.details.vacationsSubCategory}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.accommodationType && (
                  <div className="flex items-center gap-1">
                    <Home size={10} />
                    <span>{ad.details.accommodationType}</span>
                  </div>
                )}
                {ad.details.maxGuests && (
                  <div className="flex items-center gap-1">
                    <Users size={10} />
                    <span>{ad.details.maxGuests} pers.</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'jobs-services' && (ad.details.jobsServicesSubCategory || ad.details.contractType) && (
            <div className="mb-2">
              {ad.details.jobsServicesSubCategory && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 truncate">
                  {ad.details.jobsServicesSubCategory}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.contractType && (
                  <div className="flex items-center gap-1">
                    <Briefcase size={10} />
                    <span>{ad.details.contractType}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'others-donations' && (ad.details.othersDonationsSubCategory || ad.details.condition) && (
            <div className="mb-2">
              {ad.details.othersDonationsSubCategory && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 truncate">
                  {ad.details.othersDonationsSubCategory}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.condition && (
                  <div className="flex items-center gap-1">
                    <Tag size={10} />
                    <span>{ad.details.condition}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {ad.category === 'animals' && (ad.details.animalCategory || ad.details.animalBreed) && (
            <div className="mb-2">
              {ad.details.animalCategory && (
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5 truncate">
                  {ad.details.animalCategory}
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                {ad.details.animalBreed && (
                  <div className="flex items-center gap-1">
                    <span>{ad.details.animalBreed}</span>
                  </div>
                )}
                {ad.details.animalAge && (
                  <div className="flex items-center gap-1">
                    <span>{ad.details.animalAge}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {isOwnerView && (
          <div className="mt-3 flex gap-1.5">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
            >
              <Edit2 size={12} /> Modifier
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
              className="bg-red-50 hover:bg-red-100 text-red-500 p-1.5 rounded-lg transition-colors flex items-center justify-center"
              title="Supprimer"
            >
              <Trash2 size={14} />
            </button>
            {onBoost && (
              <button 
                onClick={(e) => { e.stopPropagation(); onBoost(); }}
                className="flex-1 bg-gray-900 hover:bg-black text-white py-1.5 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <Star size={12} fill="currentColor" /> Booster
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
});

AdCard.displayName = 'AdCard';
