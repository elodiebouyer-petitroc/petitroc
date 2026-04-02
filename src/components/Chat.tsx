import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  orderBy, 
  doc, 
  updateDoc,
  getDocs,
  limit
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { Conversation, Message, UserProfile } from '../types';
import { 
  Send, 
  ChevronRight, 
  MessageSquare, 
  Clock,
  Mic,
  Smile,
  Play,
  Square,
  Trash2,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { toast } from 'sonner';
import { 
  containsForbiddenWords, 
  containsSuspiciousLinks, 
  containsForeignPhoneNumbers,
  sendAdminAlert
} from '../utils/antiSpam';
import { ReportModal } from './ReportModal';

const ConversationItem = React.memo(({ 
  conv, 
  isSelected, 
  onClick, 
  currentUserId 
}: { 
  conv: Conversation, 
  isSelected: boolean, 
  onClick: () => void,
  currentUserId: string | undefined
}) => {
  const otherParticipantId = conv.participants.find(p => p !== currentUserId);
  const unreadCount = currentUserId ? (conv.unreadCount?.[currentUserId] || 0) : 0;
  
  return (
    <div 
      onClick={onClick}
      className={`p-4 border-b border-gray-50 hover:bg-orange-50 cursor-pointer transition-all relative ${isSelected ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''}`}
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="relative">
          {conv.adImage ? (
            <img 
              src={conv.adImage} 
              alt={conv.adTitle} 
              className="w-12 h-12 rounded-xl object-cover border border-gray-100"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
              {otherParticipantId?.substring(0, 2).toUpperCase()}
            </div>
          )}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {unreadCount}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-gray-800 truncate">{conv.adTitle || 'Discussion'}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">
            {otherParticipantId === 'admin_support' ? 'Support Petitroc' : (otherParticipantId ? `Avec ${otherParticipantId.substring(0, 8)}...` : 'Utilisateur')}
          </p>
        </div>
        <div className="text-[9px] text-gray-400 font-bold">
          {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      <p className={`text-xs truncate font-medium ${unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
        {conv.lastMessage || 'Démarrer la discussion...'}
      </p>
    </div>
  );
});

ConversationItem.displayName = 'ConversationItem';

const MessageItem = React.memo(({ 
  msg, 
  isOwn,
  onReport
}: { 
  msg: Message, 
  isOwn: boolean,
  onReport: (msg: Message) => void
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-4 rounded-2xl max-w-[75%] shadow-sm ${isOwn ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-white text-gray-700 rounded-tl-none'}`}>
        {msg.audioUrl ? (
          <div className="flex items-center gap-3 min-w-[150px]">
            <button 
              onClick={togglePlay}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOwn ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-orange-100 hover:bg-orange-200 text-orange-600'}`}
            >
              {isPlaying ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
            </button>
            <div className="flex-1">
              <div className={`h-1 rounded-full w-full ${isOwn ? 'bg-white/30' : 'bg-gray-100'}`}>
                <div className={`h-full rounded-full ${isOwn ? 'bg-white' : 'bg-orange-500'}`} style={{ width: isPlaying ? '100%' : '0%', transition: 'width 2s linear' }} />
              </div>
              <p className={`text-[10px] mt-1 font-bold ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>Message vocal</p>
            </div>
            <audio 
              ref={audioRef} 
              src={msg.audioUrl} 
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>
        ) : (
          <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
        )}
        <p className={`text-[9px] mt-2 text-right font-bold ${isOwn ? 'text-orange-100' : 'text-gray-400'}`}>
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {!isOwn && (
        <button 
          onClick={() => onReport(msg)}
          className="self-center ml-2 p-1.5 text-gray-300 hover:text-red-500 transition-colors"
          title="Signaler ce message"
        >
          <AlertTriangle size={14} />
        </button>
      )}
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

export const Chat = React.memo(() => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportingMessage, setReportingMessage] = useState<Message | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedConv = React.useMemo(() => 
    conversations.find(c => c.id === selectedConvId) || null, 
    [conversations, selectedConvId]
  );

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation));
      setConversations(convs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'conversations');
    });

    return () => unsubscribe();
  }, []);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!selectedConvId || !auth.currentUser) return;

    const q = query(
      collection(db, 'conversations', selectedConvId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      scrollToBottom();
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `conversations/${selectedConvId}/messages`);
    });

    return () => unsubscribe();
  }, [selectedConvId, scrollToBottom]);

  // Mark selected conversation as read
  useEffect(() => {
    if (!selectedConv || !auth.currentUser) return;

    const currentUserId = auth.currentUser.uid;
    const unreadCount = selectedConv.unreadCount?.[currentUserId] || 0;

    if (unreadCount > 0) {
      const markAsRead = async () => {
        try {
          const convRef = doc(db, 'conversations', selectedConv.id);
          await updateDoc(convRef, {
            [`unreadCount.${currentUserId}`]: 0
          });
        } catch (error) {
          console.error("Error marking conversation as read:", error);
        }
      };
      markAsRead();
    }
  }, [selectedConv, auth.currentUser?.uid]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        setAudioBlob(blob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Impossible d'accéder au micro.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
  };

  const sendMessage = React.useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!newMessage.trim() && !audioBlob) || !selectedConv || !auth.currentUser) return;

    const text = newMessage;
    const currentAudio = audioBlob;

    // Spam checks
    if (text) {
      if (containsForbiddenWords(text)) {
        toast.error("Votre message contient des mots interdits.");
        await sendAdminAlert(
          "Mot interdit détecté dans un message",
          `Utilisateur: ${auth.currentUser.email}\nMessage: ${text}`
        );
        return;
      }

      if (containsSuspiciousLinks(text)) {
        toast.error("Les liens externes ne sont pas autorisés pour votre sécurité.");
        await sendAdminAlert(
          "Lien suspect détecté dans un message",
          `Utilisateur: ${auth.currentUser.email}\nMessage: ${text}`
        );
        return;
      }

      if (containsForeignPhoneNumbers(text)) {
        toast.error("Les numéros de téléphone étrangers sont bloqués par sécurité.");
        await sendAdminAlert(
          "Numéro étranger détecté dans un message",
          `Utilisateur: ${auth.currentUser.email}\nMessage: ${text}`
        );
        return;
      }
    }

    setNewMessage('');
    setAudioBlob(null);
    setShowEmojiPicker(false);

    try {
      let audioUrl = '';
      if (currentAudio) {
        // In a real app, upload to Firebase Storage. Here we use a data URL for demo.
        const reader = new FileReader();
        audioUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(currentAudio);
        });
      }

      const otherParticipantId = selectedConv.participants.find(p => p !== auth.currentUser?.uid);

      await addDoc(collection(db, 'conversations', selectedConv.id, 'messages'), {
        conversationId: selectedConv.id,
        senderId: auth.currentUser.uid,
        text: audioUrl ? '' : text,
        audioUrl,
        createdAt: new Date().toISOString()
      });

      const updateData: any = {
        lastMessage: audioUrl ? '🎤 Message vocal' : text,
        lastSenderId: auth.currentUser.uid,
        lastSenderName: auth.currentUser.displayName || 'Utilisateur',
        updatedAt: new Date().toISOString()
      };

      if (otherParticipantId) {
        updateData[`unreadCount.${otherParticipantId}`] = (selectedConv.unreadCount?.[otherParticipantId] || 0) + 1;
      }

      await updateDoc(doc(db, 'conversations', selectedConv.id), updateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `conversations/${selectedConv.id}/messages`);
    }
  }, [newMessage, selectedConv, audioBlob]);

  const onEmojiClick = (emojiData: any) => {
    setNewMessage(prev => prev + emojiData.emoji);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 md:rounded-[2.5rem] shadow-2xl overflow-hidden flex h-[calc(100vh-12rem)] md:h-[700px]">
      {/* Sidebar */}
      <div className={`${isMobileView && selectedConvId ? 'hidden' : 'flex'} w-full md:w-80 border-r border-gray-100 overflow-y-auto bg-gray-50/30 flex-col`}>
        <div className="p-6 border-b border-gray-50 bg-white sticky top-0 z-10">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
            <MessageSquare size={24} className="text-orange-500" />
            Messages
          </h3>
        </div>
        <div className="flex-1">
          {conversations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={24} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 font-bold italic">Aucune discussion.</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <ConversationItem 
                key={conv.id} 
                conv={conv} 
                isSelected={selectedConvId === conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                currentUserId={auth.currentUser?.uid}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${isMobileView && !selectedConvId ? 'hidden' : 'flex'} flex-1 flex-col bg-white relative`}>
        {selectedConv ? (
          <>
            <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3 md:gap-4">
                {isMobileView && (
                  <button 
                    onClick={() => setSelectedConvId(null)}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                  >
                    <ChevronRight size={24} className="rotate-180" />
                  </button>
                )}
                <div className="relative">
                  {selectedConv.adImage ? (
                    <img 
                      src={selectedConv.adImage} 
                      alt={selectedConv.adTitle} 
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl object-cover border border-gray-100 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-black text-base md:text-lg">
                      {selectedConv.participants.find(p => p !== auth.currentUser?.uid)?.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm md:text-base font-black text-gray-900 leading-tight truncate">{selectedConv.adTitle}</h4>
                  <p className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1 mt-0.5">
                    {selectedConv.participants.includes('admin_support') ? 'Support Petitroc' : 'Discussion en cours'}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/30">
              {messages.map((msg) => (
                <MessageItem 
                  key={msg.id} 
                  msg={msg} 
                  isOwn={msg.senderId === auth.currentUser?.uid} 
                  onReport={(m) => {
                    setReportingMessage(m);
                    setIsReportModalOpen(true);
                  }}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-gray-100 relative">
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="absolute bottom-full right-6 mb-4 z-50 shadow-2xl rounded-3xl overflow-hidden border border-gray-100"
                  >
                    <EmojiPicker 
                      onEmojiClick={onEmojiClick} 
                      theme={Theme.LIGHT}
                      lazyLoadEmojis={true}
                      width={350}
                      height={400}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-50 rounded-[2rem] p-1.5 flex items-center gap-2 border border-gray-100 focus-within:border-orange-200 focus-within:bg-white transition-all">
                  <button 
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-3 rounded-full transition-colors ${showEmojiPicker ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'}`}
                  >
                    <Smile size={22} />
                  </button>

                  {isRecording ? (
                    <div className="flex-1 flex items-center gap-3 px-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-black text-red-500 uppercase tracking-widest">Enregistrement...</span>
                      </div>
                      <button 
                        onClick={cancelRecording}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button 
                        onClick={stopRecording}
                        className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-all"
                      >
                        <Square size={18} fill="currentColor" />
                      </button>
                    </div>
                  ) : audioBlob ? (
                    <div className="flex-1 flex items-center gap-3 px-2">
                      <div className="flex-1 flex items-center gap-2">
                        <Play size={16} className="text-orange-500" />
                        <span className="text-xs font-bold text-gray-700">Message vocal prêt</span>
                      </div>
                      <button 
                        onClick={() => setAudioBlob(null)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Écrivez votre message..." 
                      className="flex-1 bg-transparent border-none outline-none font-bold text-sm px-2 placeholder:text-gray-300" 
                    />
                  )}

                  {!isRecording && !audioBlob && (
                    <button 
                      type="button"
                      onClick={startRecording}
                      className="p-3 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all"
                    >
                      <Mic size={22} />
                    </button>
                  )}
                </div>

                <button 
                  onClick={() => sendMessage()}
                  disabled={!newMessage.trim() && !audioBlob}
                  className="bg-orange-500 text-white p-4 rounded-full hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 disabled:opacity-50 disabled:shadow-none active:scale-95"
                >
                  <Send size={22} className={newMessage.trim() || audioBlob ? 'translate-x-0.5 -translate-y-0.5' : ''} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50/20">
            <div className="w-32 h-32 bg-orange-50 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-3 shadow-inner">
              <MessageSquare size={56} className="text-orange-500 -rotate-3" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">Vos discussions</h3>
            <p className="text-gray-400 max-w-xs font-bold leading-relaxed">
              Sélectionnez une conversation pour échanger avec un autre troqueur en toute sécurité.
            </p>
          </div>
        )}
      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportingMessage(null);
        }}
        adId={selectedConv?.adId || 'chat_message'}
        adTitle={reportingMessage ? `Message: ${reportingMessage.text?.substring(0, 30)}...` : (selectedConv?.adTitle || 'Message')}
        currentUserId={auth.currentUser?.uid || ''}
        currentUserEmail={auth.currentUser?.email || ''}
      />
    </div>
  </div>
);
});

Chat.displayName = 'Chat';
