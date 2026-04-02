import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Ad } from '../types';
import { AdCard } from './AdCard';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Search, ArrowLeft } from 'lucide-react';

interface FavoritesViewProps {
  userId: string;
  favorites: string[];
  onToggleFavorite: (adId: string) => void;
  onAdClick: (ad: Ad) => void;
  onNavigateHome: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ 
  userId, 
  favorites, 
  onToggleFavorite, 
  onAdClick,
  onNavigateHome
}) => {
  const [favoriteAds, setFavoriteAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteAds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Firestore 'in' queries are limited to 10 items, but for simplicity we'll fetch all if small
    // or fetch individually. Since this is a small app, we'll fetch them.
    // Better approach: fetch all ads and filter, but that's expensive.
    // Best approach: query ads where id in favorites.
    
    const fetchAds = async () => {
      try {
        const ads: Ad[] = [];
        // Batch requests if many favorites, but for now let's do chunks of 10
        const chunks = [];
        for (let i = 0; i < favorites.length; i += 10) {
          chunks.push(favorites.slice(i, i + 10));
        }

        for (const chunk of chunks) {
          const q = query(collection(db, 'ads'), where('id', 'in', chunk));
          const snapshot = await getDocs(q);
          snapshot.forEach(doc => ads.push(doc.data() as Ad));
        }
        
        // Sort by date (newest first)
        ads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setFavoriteAds(ads);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'ads');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-2 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Retour à l'accueil
          </button>
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Heart className="text-red-500" fill="currentColor" />
            Mes favoris
          </h2>
          <p className="text-gray-500 mt-1">Retrouvez ici toutes les annonces que vous avez aimées.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-2xl aspect-[4/5]" />
          ))}
        </div>
      ) : favoriteAds.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {favoriteAds.map((ad) => (
              <motion.div
                key={ad.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <AdCard 
                  ad={ad} 
                  onClick={() => onAdClick(ad)}
                  isFavorite={true}
                  onToggleFavorite={() => onToggleFavorite(ad.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Heart size={32} className="text-gray-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun favori pour le moment</h3>
          <p className="text-gray-500 max-w-xs mx-auto mb-8">
            Parcourez les annonces et cliquez sur le cœur pour les ajouter à votre liste.
          </p>
          <button 
            onClick={onNavigateHome}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-orange-200 flex items-center gap-2 mx-auto"
          >
            <Search size={20} />
            Découvrir les annonces
          </button>
        </div>
      )}
    </div>
  );
};
