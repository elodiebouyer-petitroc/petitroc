import React from 'react';
import { LogOut, PlusCircle, Mail, Phone, Bell, Star, MessageSquare, Trash2, Search } from 'lucide-react';
import { UserProfile, SearchAlert } from '../types';
import { formatPhoneNumber } from '../lib/formatUtils';

interface ProfileViewProps {
  profile: UserProfile;
  onLogout: () => void;
  onSeedTestAds: () => void;
  onSeedSingleMockAd: () => void;
  onUpdatePushPreference: (enabled: boolean) => void;
  onVerifyPhone: () => void;
  alerts: SearchAlert[];
  onDeleteAlert: (alertId: string) => void;
}

export const ProfileView = React.memo(({ profile, onLogout, onSeedTestAds, onSeedSingleMockAd, onUpdatePushPreference, onVerifyPhone, alerts, onDeleteAlert }: ProfileViewProps) => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-4xl font-black text-gray-900 mb-12">Mon Profil</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl text-center">
          <div className="w-32 h-32 rounded-3xl border-4 border-orange-100 mx-auto mb-6 overflow-hidden">
            <img 
              src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.uid}`} 
              alt="Profile" 
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-1">{profile.displayName}</h2>
          <p className="text-sm text-gray-400 mb-2">Membre depuis {new Date(profile.createdAt).getFullYear()}</p>
          
          {/* Trust Info */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="flex items-center gap-1 text-sm text-orange-500 font-black">
                <Star size={14} fill="currentColor" />
                <span>{profile.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400 font-bold">
                <MessageSquare size={14} />
                <span>{profile.reviewCount || 0} avis</span>
              </div>
            </div>

            {profile.isPhoneVerified && (
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full mx-auto w-fit">
                <Phone size={10} fill="currentColor" />
                Téléphone vérifié
              </div>
            )}
            
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Dernière connexion : {profile.lastSeenAt ? new Date(profile.lastSeenAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Inconnue'}
            </div>

            <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
              {profile.responseRate || "Répond généralement dans la journée"}
            </div>
          </div>
          
          <div className="space-y-3">
            {profile.role === 'admin' && (
              <>
                <button onClick={onSeedTestAds} className="w-full flex items-center justify-center gap-2 text-orange-500 font-bold text-sm bg-orange-50 hover:bg-orange-100 py-3 rounded-xl transition-all">
                  <PlusCircle size={18} /> Générer annonces test
                </button>
                <button onClick={onSeedSingleMockAd} className="w-full flex items-center justify-center gap-2 text-orange-500 font-bold text-sm bg-white border border-orange-100 hover:bg-orange-50 py-3 rounded-xl transition-all">
                  <PlusCircle size={18} /> 1 annonce fictive
                </button>
              </>
            )}
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold text-sm hover:bg-red-50 py-3 rounded-xl transition-all">
              <LogOut size={18} /> Déconnexion
            </button>
          </div>
        </div>
      </div>
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6">Informations personnelles</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <Mail className="text-orange-500" size={20} />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                <p className="text-sm font-bold text-gray-700">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <Phone className="text-orange-500" size={20} />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Téléphone</p>
                <p className="text-sm font-bold text-gray-700">{formatPhoneNumber(profile.phoneNumber)}</p>
              </div>
              {!profile.isPhoneVerified && profile.phoneNumber && (
                <button 
                  onClick={onVerifyPhone}
                  className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline"
                >
                  Vérifier
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6">Préférences</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-4">
              <Bell className="text-orange-500" size={20} />
              <div>
                <p className="text-sm font-bold text-gray-700">Notifications Push</p>
                <p className="text-xs text-gray-400">Recevoir une notification lors d'un nouveau message</p>
              </div>
            </div>
            <button 
              onClick={() => onUpdatePushPreference(!profile.pushNotificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-all relative ${profile.pushNotificationsEnabled ? 'bg-orange-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.pushNotificationsEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-gray-900">Mes alertes de recherche</h3>
            <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-full uppercase tracking-widest border border-orange-100">
              {alerts.length} active{alerts.length > 1 ? 's' : ''}
            </span>
          </div>
          
          {alerts.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
              <Bell className="text-gray-200 mx-auto mb-3" size={32} />
              <p className="text-sm text-gray-400 font-bold">Aucune alerte enregistrée</p>
              <p className="text-[10px] text-gray-400 mt-1">Enregistrez vos recherches pour être prévenu des nouveautés</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-orange-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                      <Search size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {alert.query || 'Toutes les annonces'}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                        {alert.category && (
                          <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">
                            {alert.category}
                          </span>
                        )}
                        {alert.location && (
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            {alert.location}
                          </span>
                        )}
                        {(alert.minPrice || alert.maxPrice) && (
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            {alert.minPrice || 0}€ - {alert.maxPrice || '∞'}€
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeleteAlert(alert.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Supprimer l'alerte"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
));

ProfileView.displayName = 'ProfileView';
