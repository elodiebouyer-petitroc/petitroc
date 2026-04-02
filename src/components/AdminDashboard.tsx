import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Star, 
  StarOff, 
  Shield, 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  Layout, 
  User as UserIcon,
  Tag,
  CheckCircle,
  XCircle,
  Settings,
  ExternalLink,
  Trash2,
  Users,
  BarChart3,
  RefreshCw,
  PlusCircle,
  AlertTriangle,
  Mail,
  Reply,
  Send,
  Loader2,
  MessageSquare,
  X,
  Briefcase
} from 'lucide-react';
import { 
  collection, 
  query, 
  getDocs, 
  updateDoc, 
  doc, 
  deleteDoc,
  addDoc,
  setDoc,
  getDoc,
  orderBy, 
  where,
  limit,
  Timestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Ad, UserProfile, Report, ContactMessage, Banner } from '../types';
import { toast } from 'sonner';

interface AdminDashboardProps {
  onBack: () => void;
  onAdClick: (ad: Ad) => void;
  onSeedTestAds: () => void;
  onSeedSingleMockAd: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = React.memo(({ onBack, onAdClick, onSeedTestAds, onSeedSingleMockAd }) => {
  const [activeTab, setActiveTab] = useState<'ads' | 'users' | 'reports' | 'messages' | 'partners' | 'banners'>('ads');
  const [ads, setAds] = useState<Ad[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [supportConversations, setSupportConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [loadingConvMessages, setLoadingConvMessages] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<boolean | null | 'pros' | 'partners'>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, type: 'ad' | 'user' | 'report' | 'contact_message' | 'banner' } | null>(null);
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Banner creation state
  const [newBanner, setNewBanner] = useState<Partial<Banner>>({
    imageUrl: '',
    linkUrl: '',
    isActive: true,
    userName: ''
  });
  const [isCreatingBanner, setIsCreatingBanner] = useState(false);

  const stats = React.useMemo(() => ({
    totalAds: ads.length,
    featuredAds: ads.filter(a => a.isFeatured && a.featuredActive).length,
    totalUsers: users.length,
    pros: users.filter(u => u.isProfessional).length,
    partners: users.filter(u => u.isPartner).length,
    featuredPros: users.filter(u => u.isFeaturedPro && u.featuredProActive).length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    totalMessages: contactMessages.length,
    activeBanners: banners.filter(b => b.isActive).length
  }), [ads, users, reports, contactMessages, banners]);

  useEffect(() => {
    fetchData(true); // Fetch all on mount
  }, []);

  useEffect(() => {
    fetchData();
    // Reset specific filters when switching tabs
    if (activeTab !== 'users' && filterFeatured === 'pros') {
      setFilterFeatured(null);
    }
  }, [activeTab]);

  const fetchData = async (forceAll = false) => {
    setLoading(true);
    try {
      // Fetch everything on mount or when forced to have accurate stats
      if (forceAll) {
        const [adsSnap, usersSnap, reportsSnap, messagesSnap, supportSnap, bannersSnap] = await Promise.all([
          getDocs(query(collection(db, 'ads'), orderBy('createdAt', 'desc'), limit(100))),
          getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(100))),
          getDocs(query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(100))),
          getDocs(query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'), limit(100))),
          getDocs(query(collection(db, 'conversations'), where('participants', 'array-contains', 'admin_support'), orderBy('updatedAt', 'desc'), limit(100))),
          getDocs(query(collection(db, 'banners'), orderBy('createdAt', 'desc')))
        ]);
        
        setAds(adsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad)));
        setUsers(usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
        setReports(reportsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report)));
        setContactMessages(messagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage)));
        setSupportConversations(supportSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setBanners(bannersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner)));
      } else {
        // Just fetch the active tab
        if (activeTab === 'ads') {
          const adsRef = collection(db, 'ads');
          const q = query(adsRef, orderBy('createdAt', 'desc'), limit(100));
          const snapshot = await getDocs(q);
          const adsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ad));
          setAds(adsData);
        } else if (activeTab === 'users') {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, orderBy('createdAt', 'desc'), limit(100));
          const snapshot = await getDocs(q);
          const usersData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
          setUsers(usersData);
        } else if (activeTab === 'partners') {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('isPartner', '==', true), orderBy('createdAt', 'desc'), limit(100));
          const snapshot = await getDocs(q);
          const usersData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
          setUsers(usersData);
        } else if (activeTab === 'reports') {
          const reportsRef = collection(db, 'reports');
          const q = query(reportsRef, orderBy('createdAt', 'desc'), limit(100));
          const snapshot = await getDocs(q);
          const reportsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
          setReports(reportsData);
        } else if (activeTab === 'messages') {
          const [messagesSnap, supportSnap] = await Promise.all([
            getDocs(query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'), limit(100))),
            getDocs(query(collection(db, 'conversations'), where('participants', 'array-contains', 'admin_support'), orderBy('updatedAt', 'desc'), limit(100)))
          ]);
          setContactMessages(messagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage)));
          setSupportConversations(supportSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else if (activeTab === 'banners') {
          const bannersRef = collection(db, 'banners');
          const q = query(bannersRef, orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          const bannersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
          setBanners(bannersData);
        }
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Erreur lors de la récupération des données");
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationMessages = async (convId: string) => {
    setLoadingConvMessages(true);
    try {
      const q = query(collection(db, 'conversations', convId, 'messages'), orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      setConversationMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
      toast.error("Erreur lors de la récupération des messages");
    } finally {
      setLoadingConvMessages(false);
    }
  };

  const handleSendConvMessage = async (convId: string, text: string) => {
    if (!text.trim()) return;
    try {
      const adminId = auth.currentUser?.uid;
      const adminName = auth.currentUser?.displayName || 'Admin';
      const conv = supportConversations.find(c => c.id === convId);
      const userId = conv.participants.find((p: string) => p !== 'admin_support');

      await addDoc(collection(db, 'conversations', convId, 'messages'), {
        conversationId: convId,
        senderId: adminId,
        text,
        createdAt: new Date().toISOString()
      });

      await updateDoc(doc(db, 'conversations', convId), {
        lastMessage: text,
        lastSenderId: adminId,
        lastSenderName: adminName,
        updatedAt: new Date().toISOString(),
        [`unreadCount.${userId}`]: increment(1)
      });

      fetchConversationMessages(convId);
      setReplyText('');
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  const toggleAdFeatured = async (ad: Ad) => {
    try {
      const adRef = doc(db, 'ads', ad.id);
      const newStatus = !ad.isFeatured;
      await updateDoc(adRef, {
        isFeatured: newStatus,
        featuredActive: newStatus,
        featuredPriority: ad.featuredPriority || 0,
        featuredPosition: ad.featuredPosition || 0,
        updatedAt: new Date().toISOString()
      });
      setAds(prev => prev.map(a => a.id === ad.id ? { ...a, isFeatured: newStatus, featuredActive: newStatus } : a));
    } catch (error) {
      console.error("Error toggling ad featured status:", error);
    }
  };

  const updateAdFeaturedParams = async (adId: string, params: Partial<Ad>) => {
    try {
      const adRef = doc(db, 'ads', adId);
      await updateDoc(adRef, {
        ...params,
        updatedAt: new Date().toISOString()
      });
      setAds(prev => prev.map(a => a.id === adId ? { ...a, ...params } : a));
    } catch (error) {
      console.error("Error updating ad featured params:", error);
    }
  };

  const toggleUserPro = async (user: UserProfile) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const newStatus = !user.isProfessional;
      await updateDoc(userRef, {
        isProfessional: newStatus,
        updatedAt: new Date().toISOString()
      });
      setUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, isProfessional: newStatus } : u));
    } catch (error) {
      console.error("Error toggling user pro status:", error);
    }
  };

  const toggleUserRole = async (user: UserProfile) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      setUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error toggling user role:", error);
    }
  };

  const toggleProFeatured = async (pro: UserProfile) => {
    try {
      const proRef = doc(db, 'users', pro.uid);
      const newStatus = !pro.isFeaturedPro;
      await updateDoc(proRef, {
        isFeaturedPro: newStatus,
        featuredProActive: newStatus,
        featuredProPriority: pro.featuredProPriority || 0,
        featuredProPosition: pro.featuredProPosition || 'between-ads'
      });
      setUsers(prev => prev.map(p => p.uid === pro.uid ? { ...p, isFeaturedPro: newStatus, featuredProActive: newStatus } : p));
    } catch (error) {
      console.error("Error toggling pro featured status:", error);
    }
  };

  const updateProFeaturedParams = async (proId: string, params: Partial<UserProfile>) => {
    try {
      const proRef = doc(db, 'users', proId);
      await updateDoc(proRef, params);
      setUsers(prev => prev.map(p => p.uid === proId ? { ...p, ...params } : p));
    } catch (error) {
      console.error("Error updating pro featured params:", error);
    }
  };

  const deleteItem = async () => {
    if (!confirmDelete) return;
    try {
      if (confirmDelete.type === 'ad') {
        await deleteDoc(doc(db, 'ads', confirmDelete.id));
        setAds(prev => prev.filter(a => a.id !== confirmDelete.id));
        toast.success("Annonce supprimée avec succès");
      } else if (confirmDelete.type === 'user') {
        await deleteDoc(doc(db, 'users', confirmDelete.id));
        setUsers(prev => prev.filter(u => u.uid !== confirmDelete.id));
        toast.success("Utilisateur supprimé avec succès");
      } else if (confirmDelete.type === 'report') {
        await deleteDoc(doc(db, 'reports', confirmDelete.id));
        setReports(prev => prev.filter(r => r.id !== confirmDelete.id));
        toast.success("Signalement supprimé");
      } else if (confirmDelete.type === 'contact_message') {
        await deleteDoc(doc(db, 'contact_messages', confirmDelete.id));
        setContactMessages(prev => prev.filter(m => m.id !== confirmDelete.id));
        toast.success("Message supprimé");
      } else if (confirmDelete.type === 'banner') {
        await deleteDoc(doc(db, 'banners', confirmDelete.id));
        setBanners(prev => prev.filter(b => b.id !== confirmDelete.id));
        toast.success("Bannière supprimée");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleCreateBanner = async () => {
    if (!newBanner.imageUrl || !newBanner.linkUrl) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setIsCreatingBanner(true);
    try {
      const bannerData = {
        ...newBanner,
        createdAt: new Date().toISOString(),
        isActive: true,
        userId: auth.currentUser?.uid || 'admin'
      };
      const docRef = await addDoc(collection(db, 'banners'), bannerData);
      setBanners(prev => [{ id: docRef.id, ...bannerData } as Banner, ...prev]);
      setNewBanner({ imageUrl: '', linkUrl: '', isActive: true, userName: '' });
      toast.success("Bannière créée avec succès");
    } catch (error) {
      console.error("Error creating banner:", error);
      toast.error("Erreur lors de la création de la bannière");
    } finally {
      setIsCreatingBanner(false);
    }
  };

  const toggleBannerStatus = async (banner: Banner) => {
    try {
      const bannerRef = doc(db, 'banners', banner.id);
      const newStatus = !banner.isActive;
      await updateDoc(bannerRef, { isActive: newStatus });
      setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, isActive: newStatus } : b));
      toast.success(`Bannière ${newStatus ? 'activée' : 'désactivée'}`);
    } catch (error) {
      console.error("Error toggling banner status:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const resetAllFeatured = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir désactiver TOUTES les mises en avant ?")) return;
    setIsResetting(true);
    try {
      const batch = writeBatch(db);
      if (activeTab === 'ads') {
        const featuredAds = ads.filter(a => a.isFeatured);
        featuredAds.forEach(ad => {
          batch.update(doc(db, 'ads', ad.id), { 
            isFeatured: false, 
            featuredActive: false,
            updatedAt: new Date().toISOString()
          });
        });
        await batch.commit();
        setAds(prev => prev.map(a => ({ ...a, isFeatured: false, featuredActive: false })));
      } else {
        const featuredUsers = users.filter(u => u.isFeaturedPro);
        featuredUsers.forEach(user => {
          batch.update(doc(db, 'users', user.uid), { 
            isFeaturedPro: false, 
            featuredProActive: false,
            updatedAt: new Date().toISOString()
          });
        });
        await batch.commit();
        setUsers(prev => prev.map(u => ({ ...u, isFeaturedPro: false, featuredProActive: false })));
      }
      toast.success("Mises en avant réinitialisées");
    } catch (error) {
      console.error("Error resetting featured:", error);
      toast.error("Erreur lors de la réinitialisation");
    } finally {
      setIsResetting(false);
    }
  };

  const updateReportStatus = async (reportId: string, status: 'reviewed' | 'resolved') => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, { status });
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
      toast.success("Statut du signalement mis à jour");
    } catch (error) {
      console.error("Error updating report status:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleSendReply = async () => {
    if (!replyingTo || !replyText.trim()) return;
    setIsSendingReply(true);
    try {
      const adminId = auth.currentUser?.uid;
      const adminName = auth.currentUser?.displayName || 'Admin';

      // 1. Update the contact message document
      const messageRef = doc(db, 'contact_messages', replyingTo.id);
      await updateDoc(messageRef, {
        reply: replyText,
        repliedAt: new Date().toISOString(),
        repliedBy: adminName
      });

      // 2. If the user is a member, also send an internal message
      if (replyingTo.userId) {
        // Find or create conversation
        const userId = replyingTo.userId;
        const convId = `support_${userId}`;
        const convRef = doc(db, 'conversations', convId);
        
        // Check if conversation exists
        const convSnap = await getDoc(convRef);
        
        if (!convSnap.exists()) {
          await setDoc(convRef, {
            id: convId,
            participants: ['admin_support', userId],
            lastMessage: replyText,
            lastSenderId: adminId,
            lastSenderName: adminName,
            updatedAt: new Date().toISOString(),
            unreadCount: { [userId]: 1 },
            adTitle: `Support: ${replyingTo.subject}`,
            isSystem: true
          });
        } else {
          await updateDoc(convRef, {
            lastMessage: replyText,
            lastSenderId: adminId,
            lastSenderName: adminName,
            updatedAt: new Date().toISOString(),
            [`unreadCount.${userId}`]: increment(1),
            adTitle: `Support: ${replyingTo.subject}`
          });
        }

        await addDoc(collection(db, 'conversations', convId, 'messages'), {
          conversationId: convId,
          senderId: adminId,
          text: `Bonjour ${replyingTo.name},\n\nVoici une réponse à votre message "${replyingTo.subject}":\n\n${replyText}`,
          createdAt: new Date().toISOString()
        });
      }

      setContactMessages(prev => prev.map(m => m.id === replyingTo.id ? { 
        ...m, 
        reply: replyText, 
        repliedAt: new Date().toISOString(), 
        repliedBy: adminName 
      } : m));

      toast.success("Réponse envoyée avec succès");
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Erreur lors de l'envoi de la réponse");
    } finally {
      setIsSendingReply(false);
    }
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ad.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFeatured = filterFeatured === null || 
                          (typeof filterFeatured === 'boolean' && ad.isFeatured === filterFeatured);
    
    // Correction: if 'pros' is selected in ads tab, it's irrelevant
    const finalFeaturedMatch = filterFeatured === 'pros' ? true : matchesFeatured;
    
    return matchesSearch && finalFeaturedMatch;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'partners') {
      return matchesSearch && !!user.isPartner;
    }

    if (filterFeatured === 'pros') {
      return matchesSearch && !!user.isProfessional;
    }
    
    const matchesFeatured = filterFeatured === null || user.isFeaturedPro === filterFeatured;
    return matchesSearch && matchesFeatured;
  });

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.adTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.reporterEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredMessages = contactMessages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          banner.linkUrl.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <Shield className="text-orange-500" size={32} />
              Administration
            </h1>
            <p className="text-gray-500 font-bold">Gérez les mises en avant et les professionnels</p>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('ads')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'ads' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'}`}
          >
            Annonces
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'users' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'}`}
          >
            Utilisateurs
          </button>
          <button 
            onClick={() => setActiveTab('partners')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'partners' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'}`}
          >
            Partenaires
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'reports' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'}`}
          >
            Signalements
            {stats.pendingReports > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                {stats.pendingReports}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'messages' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'}`}
          >
            Messages
          </button>
          <button 
            onClick={() => setActiveTab('banners')}
            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'banners' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'}`}
          >
            Bannières
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
              <Tag size={20} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Annonces</p>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-black text-gray-900">{stats.totalAds}</p>
            <p className="text-xs font-bold text-orange-500 mb-1">{stats.featuredAds} à la une</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
              <Users size={20} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Utilisateurs</p>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-black text-gray-900">{stats.totalUsers}</p>
            <p className="text-xs font-bold text-blue-500 mb-1">{stats.partners} Partenaires</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl">
              <Star size={20} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Pros à la une</p>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-black text-gray-900">{stats.featuredPros}</p>
            <p className="text-xs font-bold text-purple-500 mb-1">Actifs</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
              <Layout size={20} />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Bannières</p>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-black text-gray-900">{banners.length}</p>
            <p className="text-xs font-bold text-green-500 mb-1">{stats.activeBanners} actives</p>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mb-6">
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-2 text-orange-500 font-black text-xs uppercase tracking-widest hover:text-orange-600 transition-colors"
        >
          <Settings size={16} />
          {showHelp ? 'Masquer l\'aide' : 'Comment utiliser l\'administration ?'}
        </button>
        
        <AnimatePresence>
          {showHelp && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-6 bg-orange-50 rounded-3xl border border-orange-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-black text-orange-900 mb-4 flex items-center gap-2">
                    <Star size={18} fill="currentColor" /> Mettre une annonce en avant
                  </h3>
                  <ul className="space-y-2 text-sm text-orange-800 font-bold">
                    <li>1. Recherchez l'annonce dans l'onglet "Annonces".</li>
                    <li>2. Cliquez sur l'étoile <Star size={14} className="inline" /> pour l'activer.</li>
                    <li>3. Définissez une <span className="underline">Priorité</span> (plus c'est haut, plus elle apparaît en premier).</li>
                    <li>4. Définissez une <span className="underline">Position</span> (0 = automatique, ou un numéro de slot précis).</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-black text-orange-900 mb-4 flex items-center gap-2">
                    <UserIcon size={18} /> Gérer les professionnels
                  </h3>
                  <ul className="space-y-2 text-sm text-orange-800 font-bold">
                    <li>1. Allez dans l'onglet "Utilisateurs".</li>
                    <li>2. Activez le badge "PRO" pour un utilisateur.</li>
                    <li>3. Vous pouvez ensuite le "Vérifier" (badge bleu) ou le "Mettre en avant" (étoile orange).</li>
                    <li>4. Choisissez sa position d'affichage (Sidebar, etc.).</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => fetchData(true)}
              className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-2xl transition-all"
              title="Rafraîchir les données"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={resetAllFeatured}
              disabled={isResetting}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-100 transition-all mr-2"
              title="Réinitialiser toutes les mises en avant"
            >
              <RefreshCw size={14} className={isResetting ? 'animate-spin' : ''} />
              Reset
            </button>
            <button 
              onClick={() => setFilterFeatured(null)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filterFeatured === null ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              Tous
            </button>
            <button 
              onClick={() => setFilterFeatured(true)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filterFeatured === true ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              En avant
            </button>
            <button 
              onClick={() => setFilterFeatured(false)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filterFeatured === false ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              Standard
            </button>
            {activeTab === 'users' && (
              <button 
                onClick={() => setFilterFeatured('pros')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filterFeatured === 'pros' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}
              >
                Pros
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Chargement...</p>
            </div>
          ) : activeTab === 'reports' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Annonce Signalée</th>
                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Raison</th>
                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Signalé par</th>
                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Statut</th>
                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredReports.map(report => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            <Tag size={20} />
                          </div>
                          <div>
                            <h4 className="font-black text-gray-900 line-clamp-1">{report.adTitle}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {report.adId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-black text-gray-900">{report.reason}</p>
                          {report.details && <p className="text-xs text-gray-500 line-clamp-2">{report.details}</p>}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold text-gray-700">{report.reporterEmail}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(report.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                          report.status === 'reviewed' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {report.status === 'pending' ? 'En attente' :
                           report.status === 'reviewed' ? 'Examiné' : 'Résolu'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={async () => {
                              try {
                                const adSnap = await getDocs(query(collection(db, 'ads'), where('id', '==', report.adId)));
                                if (!adSnap.empty) {
                                  const adData = { id: adSnap.docs[0].id, ...adSnap.docs[0].data() } as Ad;
                                  onAdClick(adData);
                                } else {
                                  toast.error("Annonce introuvable (peut-être déjà supprimée)");
                                }
                              } catch (error) {
                                console.error("Error fetching ad for report:", error);
                                toast.error("Erreur lors de la récupération de l'annonce");
                              }
                            }}
                            className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-xl transition-all"
                            title="Voir l'annonce"
                          >
                            <ExternalLink size={18} />
                          </button>
                          {report.status === 'pending' && (
                            <button 
                              onClick={() => updateReportStatus(report.id, 'reviewed')}
                              className="p-2 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-xl transition-all"
                              title="Marquer comme examiné"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          {report.status !== 'resolved' && (
                            <button 
                              onClick={() => updateReportStatus(report.id, 'resolved')}
                              className="p-2 bg-green-50 text-green-500 hover:bg-green-100 rounded-xl transition-all"
                              title="Marquer comme résolu"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => setConfirmDelete({ id: report.adId, type: 'ad' })}
                            className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl transition-all"
                            title="Supprimer l'annonce signalée"
                          >
                            <AlertTriangle size={18} />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete({ id: report.id, type: 'report' })}
                            className="p-2 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all"
                            title="Supprimer le signalement"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeTab === 'messages' ? (
              <div className="space-y-8">
                {/* Conversations Section */}
                <div>
                  <h3 className="px-4 mb-4 text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={18} className="text-orange-500" />
                    Conversations Support ({supportConversations.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
                    {supportConversations.map(conv => (
                      <div 
                        key={conv.id} 
                        onClick={() => {
                          setSelectedConversation(conv);
                          fetchConversationMessages(conv.id);
                        }}
                        className="p-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-orange-500 transition-all cursor-pointer group relative"
                      >
                        {conv.unreadCount?.admin_support > 0 && (
                          <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            {conv.unreadCount.admin_support}
                          </span>
                        )}
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-gray-900 line-clamp-1">{conv.adTitle || 'Support'}</h4>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {new Date(conv.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-bold mb-1">{conv.lastSenderName}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 italic">"{conv.lastMessage}"</p>
                      </div>
                    ))}
                    {supportConversations.length === 0 && (
                      <div className="col-span-full p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Aucune conversation active</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Messages Section */}
                <div>
                  <h3 className="px-4 mb-4 text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={18} className="text-blue-500" />
                    Messages Directs ({filteredMessages.length})
                  </h3>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Expéditeur</th>
                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Sujet</th>
                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Message</th>
                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredMessages.map(msg => (
                        <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                <UserIcon size={20} />
                              </div>
                              <div>
                                <h4 className="font-black text-gray-900 line-clamp-1">{msg.name}</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{msg.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-sm font-black text-gray-900">{msg.subject}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-xs text-gray-500 line-clamp-2 max-w-xs">{msg.message}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(msg.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {msg.userId ? (
                                <button 
                                  onClick={() => {
                                    const convId = `support_${msg.userId}`;
                                    const conv = supportConversations.find(c => c.id === convId);
                                    if (conv) {
                                      setSelectedConversation(conv);
                                      fetchConversationMessages(convId);
                                    } else {
                                      setReplyingTo(msg);
                                    }
                                  }}
                                  className="p-2 bg-orange-50 text-orange-500 hover:bg-orange-100 rounded-xl transition-all"
                                  title="Voir la conversation"
                                >
                                  <MessageSquare size={18} />
                                </button>
                              ) : msg.reply ? (
                                <span className="p-2 bg-green-50 text-green-500 rounded-xl" title={`Répondu par ${msg.repliedBy} le ${new Date(msg.repliedAt!).toLocaleDateString()}`}>
                                  <CheckCircle size={18} />
                                </span>
                              ) : (
                                <button 
                                  onClick={() => setReplyingTo(msg)}
                                  className="p-2 bg-orange-50 text-orange-500 hover:bg-orange-100 rounded-xl transition-all"
                                  title="Répondre directement"
                                >
                                  <Reply size={18} />
                                </button>
                              )}
                              <a 
                                href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                className="p-2 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-xl transition-all"
                                title="Répondre par email"
                              >
                                <Mail size={18} />
                              </a>
                              <button 
                                onClick={() => setConfirmDelete({ id: msg.id, type: 'contact_message' })}
                                className="p-2 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all"
                                title="Supprimer le message"
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
            ) : activeTab === 'banners' ? (
              <div className="space-y-8">
                <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100">
                  <h3 className="text-lg font-black text-orange-900 mb-4 flex items-center gap-2">
                    <PlusCircle size={20} /> Créer une nouvelle bannière
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1 ml-1">Nom du client</label>
                      <input 
                        type="text"
                        value={newBanner.userName}
                        onChange={(e) => setNewBanner({ ...newBanner, userName: e.target.value })}
                        placeholder="Ex: BioMarché"
                        className="w-full px-4 py-3 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1 ml-1">URL de l'image</label>
                      <input 
                        type="text"
                        value={newBanner.imageUrl}
                        onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1 ml-1">Lien de redirection</label>
                      <input 
                        type="text"
                        value={newBanner.linkUrl}
                        onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                      />
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={handleCreateBanner}
                        disabled={isCreatingBanner}
                        className="w-full h-[44px] bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                      >
                        {isCreatingBanner ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
                        Créer la bannière
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Aperçu</th>
                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Client / Lien</th>
                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Statut</th>
                        <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredBanners.map(banner => (
                        <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <img 
                              src={banner.imageUrl} 
                              alt="" 
                              className="h-12 w-32 object-cover rounded-xl border border-gray-100"
                              referrerPolicy="no-referrer"
                            />
                          </td>
                          <td className="p-4">
                            <h4 className="font-black text-gray-900">{banner.userName || 'Sans nom'}</h4>
                            <p className="text-xs text-gray-500 font-bold truncate max-w-[200px]">{banner.linkUrl}</p>
                          </td>
                          <td className="p-4">
                            <button 
                              onClick={() => toggleBannerStatus(banner)}
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${banner.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                            >
                              {banner.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <a 
                                href={banner.linkUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-100 text-gray-400 hover:bg-gray-200 rounded-xl transition-all"
                              >
                                <ExternalLink size={18} />
                              </a>
                              <button 
                                onClick={() => setConfirmDelete({ id: banner.id, type: 'banner' })}
                                className="p-2 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all"
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
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Élément</th>
                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                      {activeTab === 'partners' ? 'Plan / Statut' : 'Statut / Rôles'}
                    </th>
                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Priorité</th>
                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Position / Slot</th>
                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activeTab === 'ads' ? (
                    filteredAds.map(ad => (
                      <tr key={ad.id} className={`hover:bg-gray-50 transition-colors ${ad.isFeatured ? 'bg-orange-50/30' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={ad.images[0] || 'https://picsum.photos/seed/placeholder/100/100'} 
                              alt="" 
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <h4 className="font-black text-gray-900 line-clamp-1 flex items-center gap-2">
                                {ad.title}
                                {ad.type === 'seek' && (
                                  <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[8px] rounded font-black uppercase tracking-widest">RECHERCHE</span>
                                )}
                              </h4>
                              <p className="text-xs text-gray-500 font-bold">{ad.userName} • {ad.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {ad.isFeatured ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-black uppercase tracking-wider">
                              <Star size={12} fill="currentColor" /> Mis en avant
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-xs font-black uppercase tracking-wider">
                              Standard
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              value={ad.featuredPriority || 0}
                              onChange={(e) => updateAdFeaturedParams(ad.id, { featuredPriority: parseInt(e.target.value) })}
                              className="w-16 px-2 py-1 bg-gray-100 border-none rounded-lg text-sm font-bold"
                              disabled={!ad.isFeatured}
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              placeholder="Position"
                              value={ad.featuredPosition || 0}
                              onChange={(e) => updateAdFeaturedParams(ad.id, { featuredPosition: parseInt(e.target.value) })}
                              className="w-16 px-2 py-1 bg-gray-100 border-none rounded-lg text-sm font-bold"
                              disabled={!ad.isFeatured}
                            />
                            <span className="text-xs text-gray-400 font-bold">(0 = auto)</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => toggleAdFeatured(ad)}
                              className={`p-2 rounded-xl transition-all ${ad.isFeatured ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                              title={ad.isFeatured ? "Désactiver la mise en avant" : "Mettre en avant"}
                            >
                              {ad.isFeatured ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                            </button>
                            <button 
                              onClick={() => onAdClick(ad)}
                              className="p-2 bg-gray-100 text-gray-400 hover:bg-gray-200 rounded-xl transition-all"
                              title="Voir l'annonce"
                            >
                              <ExternalLink size={18} />
                            </button>
                            <button 
                              onClick={() => setConfirmDelete({ id: ad.id, type: 'ad' })}
                              className="p-2 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all"
                              title="Supprimer l'annonce"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.uid} className={`hover:bg-gray-50 transition-colors ${user.isFeaturedPro ? 'bg-purple-50/30' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.uid} 
                              alt="" 
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <h4 className="font-black text-gray-900 line-clamp-1">{user.displayName}</h4>
                              <p className="text-xs text-gray-500 font-bold">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {activeTab === 'partners' ? (
                            <div className="flex flex-col gap-1">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-center ${
                                user.subscription?.plan === 'premium' ? 'bg-purple-600 text-white' :
                                user.subscription?.plan === 'or' ? 'bg-yellow-400 text-black' :
                                user.subscription?.plan === 'argent' ? 'bg-gray-300 text-black' :
                                'bg-orange-200 text-orange-800'
                              }`}>
                                {user.subscription?.plan || 'Aucun'}
                              </span>
                              <span className={`text-[9px] font-bold uppercase text-center ${user.subscription?.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                                {user.subscription?.status === 'active' ? 'Actif' : 'Inactif'}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              <button 
                                onClick={() => toggleUserPro(user)}
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${user.isProfessional ? 'bg-purple-100 text-purple-600 border border-purple-200' : 'bg-gray-100 text-gray-400 border border-transparent'}`}
                              >
                                PRO
                              </button>
                              <button 
                                onClick={() => toggleUserRole(user)}
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${user.role === 'admin' ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-400 border border-transparent'}`}
                              >
                                ADMIN
                              </button>
                              {user.isFeaturedPro && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                  <Star size={10} fill="currentColor" /> Mis en avant
                                </span>
                              )}
                              {user.isVerified && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                  <CheckCircle size={10} fill="currentColor" /> Vérifié
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={async () => {
                                try {
                                  const userRef = doc(db, 'users', user.uid);
                                  const newStatus = !user.isVerified;
                                  await updateDoc(userRef, { isVerified: newStatus });
                                  setUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, isVerified: newStatus } : u));
                                } catch (error) {
                                  console.error("Error toggling verification:", error);
                                }
                              }}
                              className={`p-2 rounded-xl transition-all ${user.isVerified ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                              title={user.isVerified ? "Retirer la vérification" : "Vérifier l'utilisateur"}
                            >
                              <CheckCircle size={18} />
                            </button>
                            <input 
                              type="number"
                              value={user.featuredProPriority || 0}
                              onChange={(e) => updateProFeaturedParams(user.uid, { featuredProPriority: parseInt(e.target.value) })}
                              className="w-16 px-2 py-1 bg-gray-100 border-none rounded-lg text-sm font-bold"
                              disabled={!user.isFeaturedPro}
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <select 
                            value={user.featuredProPosition || 'between-ads'}
                            onChange={(e) => updateProFeaturedParams(user.uid, { featuredProPosition: e.target.value })}
                            className="px-2 py-1 bg-gray-100 border-none rounded-lg text-sm font-bold"
                            disabled={!user.isFeaturedPro}
                          >
                            <option value="sidebar">Barre latérale</option>
                            <option value="between-ads">Entre les annonces</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => toggleProFeatured(user)}
                              className={`p-2 rounded-xl transition-all ${user.isFeaturedPro ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                              title={user.isFeaturedPro ? "Désactiver la mise en avant" : "Mettre en avant"}
                              disabled={!user.isProfessional}
                            >
                              {user.isFeaturedPro ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                            </button>
                            <button 
                              onClick={() => {
                                setSearchTerm(user.displayName);
                                setActiveTab('ads');
                              }}
                              className="p-2 bg-gray-100 text-gray-400 hover:bg-gray-200 rounded-xl transition-all"
                              title="Voir ses annonces"
                            >
                              <Tag size={18} />
                            </button>
                            <button 
                              onClick={() => setConfirmDelete({ id: user.uid, type: 'user' })}
                              className="p-2 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all"
                              title="Supprimer l'utilisateur"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
        </div>

        {!loading && (
          (activeTab === 'ads' && filteredAds.length === 0) ||
          (activeTab === 'users' && filteredUsers.length === 0) ||
          (activeTab === 'reports' && filteredReports.length === 0)
        ) && (
          <div className="p-20 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center">
              <Search size={40} />
            </div>
            <div>
              <p className="font-black text-gray-900 text-lg mb-1">Aucun résultat trouvé</p>
              <p className="text-sm text-gray-400 font-bold">Essayez de modifier vos filtres ou de rafraîchir la page.</p>
            </div>
            {activeTab === 'ads' && ads.length === 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onSeedTestAds}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
                >
                  <PlusCircle size={18} />
                  Générer des annonces de test
                </button>
                <button 
                  onClick={onSeedSingleMockAd}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-orange-500 border-2 border-orange-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-50 transition-all"
                >
                  <UserIcon size={18} />
                  Générer 1 annonce fictive
                </button>
              </div>
            )}
            <button 
              onClick={() => fetchData(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
            >
              <RefreshCw size={18} />
              Rafraîchir les données
            </button>
          </div>
        )}
      </div>

      {/* Conversation Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                  {selectedConversation.adTitle || 'Conversation Support'}
                </h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  Avec {selectedConversation.lastSenderName}
                </p>
              </div>
              <button 
                onClick={() => setSelectedConversation(null)}
                className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {loadingConvMessages ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-orange-500" size={32} />
                </div>
              ) : (
                conversationMessages.map((m, idx) => {
                  const isAdmin = m.senderId === auth.currentUser?.uid;
                  return (
                    <div key={m.id || idx} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                        isAdmin ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
                        <p className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${isAdmin ? 'text-orange-100' : 'text-gray-400'}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-white">
              <div className="flex gap-4">
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Votre réponse..."
                  className="flex-1 p-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl text-sm font-bold resize-none transition-all outline-none"
                  rows={2}
                />
                <button 
                  onClick={() => handleSendConvMessage(selectedConversation.id, replyText)}
                  disabled={!replyText.trim() || isSendingReply}
                  className="px-6 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-orange-200"
                >
                  <Send size={18} />
                  Envoyer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reply Modal (for direct messages) */}
      <AnimatePresence>
        {replyingTo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 max-w-2xl w-full shadow-2xl border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">Répondre à {replyingTo.name}</h2>
                <button 
                  onClick={() => setReplyingTo(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Message original :</p>
                <p className="text-sm font-bold text-gray-700 italic">"{replyingTo.message}"</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Votre réponse</label>
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tapez votre réponse ici..."
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-bold text-sm min-h-[200px] resize-none"
                  />
                </div>

                {replyingTo.userId && (
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                    <div className="p-2 bg-blue-500 text-white rounded-xl">
                      <Users size={16} />
                    </div>
                    <p className="text-xs font-bold text-blue-700">
                      Cet utilisateur est membre. La réponse sera également envoyée dans sa messagerie interne.
                    </p>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setReplyingTo(null)}
                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleSendReply}
                    disabled={isSendingReply || !replyText.trim()}
                    className="flex-[2] px-6 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSendingReply ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    {isSendingReply ? 'Envoi...' : 'Envoyer la réponse'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                  <AlertTriangle size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Confirmation de suppression</h2>
                <p className="text-gray-500 font-bold mb-8">
                  Êtes-vous sûr de vouloir supprimer cet {
                    confirmDelete.type === 'ad' ? 'annonce' : 
                    confirmDelete.type === 'user' ? 'utilisateur' : 
                    'signalement'
                  } ? 
                  Cette action est irréversible.
                </p>
                <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={deleteItem}
                    className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

AdminDashboard.displayName = 'AdminDashboard';
