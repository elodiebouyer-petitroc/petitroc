import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Send, CheckCircle } from 'lucide-react';
import { collection, addDoc, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'sonner';
import { sendAdminAlert } from '../utils/antiSpam';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string;
  adTitle: string;
  currentUserId: string;
  currentUserEmail: string;
}

const REPORT_REASONS = [
  "Contenu inapproprié ou offensant",
  "Arnaque ou fraude suspectée",
  "Objet interdit ou illégal",
  "Annonce déjà vendue ou expirée",
  "Mauvaise catégorie",
  "Autre"
];

export const ReportModal = ({ isOpen, onClose, adId, adTitle, currentUserId, currentUserEmail }: ReportModalProps) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error("Veuillez sélectionner un motif de signalement.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reports'), {
        adId,
        adTitle,
        reporterId: currentUserId,
        reporterEmail: currentUserEmail,
        reason,
        details,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // Send email alert to admin
      await sendAdminAlert(
        `Nouveau signalement d'annonce: ${adTitle}`,
        `L'annonce "${adTitle}" (ID: ${adId}) a été signalée par ${currentUserEmail}.\n\nMotif: ${reason}\nDétails: ${details || 'Aucun détail supplémentaire'}`
      );

      // Check for multiple reports (3+)
      const reportsQuery = query(
        collection(db, 'reports'),
        where('adId', '==', adId)
      );
      const reportsSnapshot = await getDocs(reportsQuery);
      if (reportsSnapshot.size >= 3) {
        await sendAdminAlert(
          `ALERTE: Annonce signalée plusieurs fois (${reportsSnapshot.size})`,
          `L'annonce "${adTitle}" (ID: ${adId}) a été signalée ${reportsSnapshot.size} fois. Veuillez vérifier rapidement.`
        );
      }

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setReason('');
        setDetails('');
      }, 2000);
    } catch (error) {
      console.error("Error reporting ad:", error);
      toast.error("Une erreur est survenue lors du signalement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-orange-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Signaler l'annonce</h2>
                  <p className="text-xs text-gray-500 font-bold truncate max-w-[200px]">{adTitle}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Signalement envoyé</h3>
                  <p className="text-gray-500 font-medium">Merci de nous aider à maintenir PetiTroc sûr. Notre équipe va examiner votre signalement.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Motif du signalement</label>
                    <div className="space-y-2">
                      {REPORT_REASONS.map((r) => (
                        <label 
                          key={r}
                          className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer ${reason === r ? 'border-orange-500 bg-orange-50' : 'border-gray-50 hover:border-orange-200 bg-gray-50/50'}`}
                        >
                          <input 
                            type="radio" 
                            name="reason" 
                            value={r} 
                            checked={reason === r}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                          />
                          <span className={`text-sm font-bold ${reason === r ? 'text-orange-700' : 'text-gray-600'}`}>{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Détails supplémentaires (optionnel)</label>
                    <textarea 
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Expliquez-nous brièvement le problème..."
                      className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-orange-500 transition-all min-h-[100px] resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting || !reason}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Send size={18} />
                        Envoyer le signalement
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-gray-400 font-medium px-4">
                    Tout signalement abusif pourra entraîner la suspension de votre compte.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
