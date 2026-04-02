import React, { lazy, Suspense } from 'react';
import { User } from 'firebase/auth';
import { User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

const AdForm = lazy(() => import('./AdForm').then(m => ({ default: m.AdForm })));

interface CreateAdViewProps {
  user: User | null;
  onSignIn: () => void;
  onSuccess: () => void;
}

export const CreateAdView = React.memo(({ user, onSignIn, onSuccess }: CreateAdViewProps) => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    <h1 className="text-4xl font-black text-gray-900 mb-4">Publier une annonce</h1>
    <p className="text-gray-500 mb-12">C'est gratuit, rapide et sans commission.</p>
    
    {!user ? (
      <div className="bg-orange-50 p-8 rounded-3xl text-center border border-orange-100">
        <UserIcon size={48} className="text-orange-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Connectez-vous pour continuer</h3>
        <p className="text-sm text-gray-600 mb-6">Vous devez avoir un compte pour publier une annonce sur PetiTroc.</p>
        <button onClick={onSignIn} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold">Connexion Google</button>
      </div>
    ) : (
      <Suspense fallback={<div className="flex justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full" /></div>}>
        <AdForm onSuccess={onSuccess} />
      </Suspense>
    )}
  </div>
));

CreateAdView.displayName = 'CreateAdView';
