import React from 'react';
import { 
  Car, 
  Home, 
  Shirt, 
  Handshake, 
  Dog, 
  Sofa, 
  Smartphone, 
  MoreHorizontal,
  Calendar,
  Store,
  Users,
  Gem,
  Baby,
  Gamepad2,
  Palmtree,
  Briefcase,
  Gift
} from 'lucide-react';

export const CategoryIcon = React.memo(({ id, className, size = 24 }: { id: string, className?: string, size?: number }) => {
  switch (id) {
    case 'vehicles': return <Car className={className} size={size} />;
    case 'real-estate': return <Home className={className} size={size} />;
    case 'fashion': return <Shirt className={className} size={size} />;
    case 'services': return <Handshake className={className} size={size} />;
    case 'animals': return <Dog className={className} size={size} />;
    case 'home-garden': return <Sofa className={className} size={size} />;
    case 'electronics': return <Smartphone className={className} size={size} />;
    case 'shops-artisans': return <Store className={className} size={size} />;
    case 'associations': return <Users className={className} size={size} />;
    case 'events': return <Calendar className={className} size={size} />;
    case 'wedding': return <Gem className={className} size={size} />;
    case 'family': return <Baby className={className} size={size} />;
    case 'loisirs': return <Gamepad2 className={className} size={size} />;
    case 'vacations': return <Palmtree className={className} size={size} />;
    case 'jobs-services': return <Briefcase className={className} size={size} />;
    case 'others-donations': return <Gift className={className} size={size} />;
    default: return <MoreHorizontal className={className} size={size} />;
  }
});

CategoryIcon.displayName = 'CategoryIcon';
