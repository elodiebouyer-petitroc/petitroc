import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { AdForm } from './AdForm';
import { Ad } from '../types';

interface EditAdViewProps {
  ad: Ad;
  onBack: () => void;
  onSuccess: () => void;
}

export const EditAdView = React.memo(({ ad, onBack, onSuccess }: EditAdViewProps) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-orange-500 font-bold mb-8 transition-colors group"
      >
        <div className="bg-white p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all">
          <ArrowLeft size={20} />
        </div>
        Retour
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Modifier l'annonce</h1>
        <p className="text-gray-500 font-medium">Mettez à jour les informations de votre annonce.</p>
      </div>

      <AdForm initialData={ad} onSuccess={onSuccess} />
    </div>
  );
});

EditAdView.displayName = 'EditAdView';
