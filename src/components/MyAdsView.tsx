import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, Trash2, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, Ad } from '../types';
import { AdCard } from './AdCard';
import { createContext, useContext } from 'react';

// We can't import useAuth from App.tsx easily if it's not exported.
// But we can pass favorites and toggleFavorite as props.
// Let's update the props.

interface MyAdsViewProps {
  user: User | null;
  profile: UserProfile | null;
  onAdClick: (ad: Ad) => void;
  onEditAd: (ad: Ad) => void;
  favorites: string[];
  onToggleFavorite: (adId: string) => void;
}

export const MyAdsView = React.memo(({ user, profile, onAdClick, onEditAd, favorites, onToggleFavorite }: MyAdsViewProps) => {
  const [myAds, setMyAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [adToDelete, setAdToDelete] = useState<Ad | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'ads'), where('authorId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad)));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'ads'));
    return () => unsubscribe();
  }, [user]);

  const handleDelete = async () => {
    if (!adToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'ads', adToDelete.id));
      toast.success('Annonce supprimée avec succès');
      setAdToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `ads/${adToDelete.id}`);
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black text-gray-900">Mes Annonces</h1>
      </div>
      {myAds.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Tag size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Vous n'avez pas encore publié d'annonce.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myAds.map(ad => (
            <AdCard 
              key={ad.id} 
              ad={ad} 
              onClick={() => onAdClick(ad)} 
              onEdit={() => onEditAd(ad)}
              onDelete={() => setAdToDelete(ad)}
              isOwnerView={true}
              isFavorite={favorites.includes(ad.id)}
              onToggleFavorite={() => onToggleFavorite(ad.id)}
            />
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {adToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAdToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
              <button 
                onClick={() => setAdToDelete(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                  <AlertTriangle size={32} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Supprimer l'annonce ?</h2>
                <p className="text-gray-500 font-medium mb-8">
                  Êtes-vous sûr de vouloir supprimer <span className="text-gray-900 font-bold">"{adToDelete.title}"</span> ? Cette action est irréversible.
                </p>

                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setAdToDelete(null)}
                    className="flex-1 px-6 py-4 rounded-2xl font-black text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-4 rounded-2xl font-black text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Trash2 size={18} />
                        Supprimer
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

MyAdsView.displayName = 'MyAdsView';
