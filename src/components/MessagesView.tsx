import React, { lazy, Suspense } from 'react';
import { User } from 'firebase/auth';
import { MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

const Chat = lazy(() => import('./Chat').then(m => ({ default: m.Chat })));

interface MessagesViewProps {
  user: User | null;
  onSignIn: () => void;
}

export const MessagesView = React.memo(({ user, onSignIn }: MessagesViewProps) => (
  <div className="max-w-6xl mx-auto px-4 py-12">
    <h1 className="text-4xl font-black text-gray-900 mb-8">Messages</h1>
    {!user ? (
      <div className="bg-orange-50 p-8 rounded-3xl text-center border border-orange-100">
        <MessageSquare size={48} className="text-orange-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Connectez-vous pour voir vos messages</h3>
        <button onClick={onSignIn} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold">Connexion Google</button>
      </div>
    ) : (
      <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
        <Chat />
      </Suspense>
    )}
  </div>
));

MessagesView.displayName = 'MessagesView';
