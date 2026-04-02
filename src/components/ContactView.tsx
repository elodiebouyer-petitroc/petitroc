import React, { useState, useEffect, useCallback } from 'react';
import { Send, MapPin, ChevronLeft, CheckCircle, Loader2, Mail, Phone, Clock, MessageSquare } from 'lucide-react';
import { addDoc, collection, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface ContactViewProps {
  onBack: () => void;
}

export const ContactView = React.memo(({ onBack }: ContactViewProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (auth.currentUser) {
      setFormData(prev => ({
        ...prev,
        name: auth.currentUser?.displayName || '',
        email: auth.currentUser?.email || ''
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);

    try {
      const contactMessage = {
        ...formData,
        createdAt: new Date().toISOString(),
        userId: auth.currentUser?.uid || null
      };

      // 2. Add to contact_messages (always, for admin tracking)
      await addDoc(collection(db, 'contact_messages'), contactMessage);

      // 3. If user is logged in, also create/update a conversation
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const convId = `support_${userId}`;
        const convRef = doc(db, 'conversations', convId);
        
        // Check if conversation exists
        const convSnap = await getDoc(convRef);
        
        if (!convSnap.exists()) {
          await setDoc(convRef, {
            id: convId,
            participants: ['admin_support', userId],
            lastMessage: formData.message,
            lastSenderId: userId,
            lastSenderName: formData.name,
            updatedAt: new Date().toISOString(),
            unreadCount: { admin_support: 1 },
            adTitle: `Support: ${formData.subject}`,
            isSystem: true
          });
        } else {
          await updateDoc(convRef, {
            lastMessage: formData.message,
            lastSenderId: userId,
            lastSenderName: formData.name,
            updatedAt: new Date().toISOString(),
            [`unreadCount.admin_support`]: increment(1),
            adTitle: `Support: ${formData.subject}`
          });
        }

        // Add message to subcollection
        await addDoc(collection(db, 'conversations', convId, 'messages'), {
          conversationId: convId,
          senderId: userId,
          text: formData.message,
          createdAt: new Date().toISOString()
        });
      }

      // 4. Send email via backend
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // We don't block the UI if email fails, as Firestore already has the message
      }

      setSubmitted(true);
      toast.success('Message envoyé avec succès !');
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast.error(error.message || 'Une erreur est survenue lors de l\'envoi du message.');
      if (error.message?.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.CREATE, 'contact_messages');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto px-4 py-24 text-center"
      >
        <div className="w-24 h-24 bg-green-100 rounded-[2rem] flex items-center justify-center text-green-600 mx-auto mb-8 shadow-lg shadow-green-100">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">Message envoyé !</h2>
        <p className="text-lg text-gray-500 mb-12 font-bold max-w-md mx-auto">
          Merci de nous avoir contactés. Notre équipe a bien reçu votre demande et vous répondra sous 24h à 48h.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onBack}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-orange-100 active:scale-95"
          >
            Retour à l'accueil
          </button>
          {auth.currentUser && (
            <button 
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto bg-white border-2 border-gray-100 hover:border-orange-500 text-gray-700 px-10 py-4 rounded-2xl font-black transition-all active:scale-95"
            >
              Envoyer un autre message
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-12 font-bold transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Retour
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight">
              Parlons de votre <span className="text-orange-500">projet</span> ou de vos <span className="text-orange-500">questions</span>.
            </h1>
            <p className="text-xl text-gray-500 mb-12 font-bold leading-relaxed">
              Une suggestion, un problème technique ou simplement envie de nous dire bonjour ? Notre équipe est à votre écoute.
            </p>

            <div className="space-y-6">
              {[
                { icon: MapPin, title: 'Localisation', content: 'Aix-en-Provence, France', color: 'text-orange-500', bg: 'bg-orange-50' },
                { icon: Mail, title: 'Email direct', content: 'contact@petitroc.fr', color: 'text-blue-500', bg: 'bg-blue-50' },
                { icon: Clock, title: 'Temps de réponse', content: 'Moins de 24 heures', color: 'text-green-500', bg: 'bg-green-50' },
                { icon: MessageSquare, title: 'Support Chat', content: 'Disponible pour les membres', color: 'text-purple-500', bg: 'bg-purple-50' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-5 p-4 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-50 group cursor-default"
                >
                  <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 mb-0.5">{item.title}</h4>
                    <p className="text-sm text-gray-500 font-bold">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-50" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-full -ml-12 -mb-12 opacity-50" />

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nom complet</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-orange-500 outline-none font-bold text-sm transition-all"
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-orange-500 outline-none font-bold text-sm transition-all"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Sujet</label>
                <input 
                  required
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-orange-500 outline-none font-bold text-sm transition-all"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:bg-white focus:border-orange-500 outline-none font-bold text-sm resize-none transition-all"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-5 rounded-2xl font-black shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                >
                  {loading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                  <span className="text-lg">
                    {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                  </span>
                </button>
                <p className="text-[10px] text-center text-gray-400 mt-6 font-bold uppercase tracking-widest">
                  Ce site est protégé par reCAPTCHA et les <a href="#" className="underline">Conditions d'utilisation</a> de Google.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

ContactView.displayName = 'ContactView';
