import React, { useEffect, useState } from 'react';
import { ChevronLeft, MapPin, Loader2, Info } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Ad } from '../types';

// Fix for default marker icon in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  onBack: () => void;
  onSelectAd?: (ad: Ad) => void;
}

export const MapView = React.memo(({ onBack, onSelectAd }: MapViewProps) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const adsRef = collection(db, 'ads');
        const q = query(
          adsRef, 
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedAds = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Ad[];
        
        // Filter ads that have valid lat/lng
        const validAds = fetchedAds.filter(ad => 
          ad.location && 
          typeof ad.location.lat === 'number' && 
          typeof ad.location.lng === 'number'
        );
        
        setAds(validAds);
      } catch (err) {
        console.error('Error fetching ads for map:', err);
        setError('Impossible de charger les annonces sur la carte.');
        try {
          handleFirestoreError(err, OperationType.LIST, 'ads');
        } catch (e) {
          // Error already logged
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Default center (France)
  const center: [number, number] = [46.2276, 2.2137];
  const zoom = 6;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-500 font-bold transition-colors"
        >
          <ChevronLeft size={20} /> Retour à l'accueil
        </button>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Info size={16} />
          <span>{ads.length} annonces trouvées sur la carte</span>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 z-[1001] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Chargement de la carte...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-[1001] bg-white flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
              <Info size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Oups !</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        <MapContainer 
          center={center} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {ads.map((ad) => (
            <Marker 
              key={ad.id} 
              position={[ad.location.lat, ad.location.lng]}
            >
              <Popup className="ad-popup">
                <div className="w-48">
                  {ad.images && ad.images.length > 0 && (
                    <img 
                      src={ad.images[0]} 
                      alt={ad.title} 
                      className="w-full h-24 object-cover rounded-lg mb-2"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <h3 className="font-bold text-gray-900 line-clamp-1">{ad.title}</h3>
                  <p className="text-orange-500 font-bold mb-2">
                    {ad.price ? `${ad.price} €` : 'Don'}
                  </p>
                  <button 
                    onClick={() => onSelectAd?.(ad)}
                    className="w-full py-1.5 bg-gray-100 hover:bg-orange-100 hover:text-orange-600 text-gray-600 rounded-lg text-xs font-bold transition-colors"
                  >
                    Voir l'annonce
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
});

MapView.displayName = 'MapView';
