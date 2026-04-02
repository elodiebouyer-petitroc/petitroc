export const CATEGORIES = [
  { id: 'vehicles', label: 'Véhicules', icon: 'Car' },
  { id: 'real-estate', label: 'Immobilier', icon: 'Home' },
  { id: 'fashion', label: 'Mode', icon: 'Shirt' },
  { id: 'home-garden', label: 'Maison & Jardin', icon: 'Sofa' },
  { id: 'electronics', label: 'Électronique', icon: 'Smartphone' },
  { id: 'family', label: 'Famille', icon: 'Baby' },
  { id: 'loisirs', label: 'Loisirs', icon: 'Gamepad2' },
  { id: 'animals', label: 'Animaux', icon: 'Dog' },
  { id: 'vacations', label: 'Vacances', icon: 'Palmtree' },
  { id: 'jobs-services', label: 'Emploi &\nServices', icon: 'Briefcase' },
  { id: 'others-donations', label: 'Autres &\nDons', icon: 'Gift' },
];

export const FAMILY_SUB_CATEGORIES = [
  'Équipement bébé',
  'Vêtements bébé',
  'Mobilier enfant',
  'Jeux & jouets',
  'Puériculture',
  'Baby-sitting',
  'Soutien scolaire',
  'Cours & ateliers enfants'
];

export const ELECTRONICS_CATEGORIES = [
  'Ordinateurs',
  'Accessoires informatique',
  'Tablettes & liseuses',
  'Téléphones & objets connectés',
  'Accessoires téléphone',
  'Photo, audio & vidéo',
  'Télévision',
  'Enceintes',
  'Appareil photo',
  'Casque / écouteurs',
  'Vidéoprojecteur',
  'Consoles & jeux vidéo',
  'Services de réparation électronique'
];

export const HOME_GARDEN_CATEGORIES = [
  'Ameublement',
  'Électroménager',
  'Décoration',
  'Linge de maison',
  'Arts de la table',
  'Bricolage & outillage',
  'Jardinage',
  'Chauffage & climatisation',
  'Équipement piscine'
];

export const LOISIRS_SUB_CATEGORIES = [
  'Vélos (route, VTT, électrique, enfant, ville)',
  'Instruments de musique',
  'Livres, BD & mangas',
  'DVD, Blu-ray, CD',
  'Jeux de société & puzzles',
  'Jouets',
  'Sport & plein air',
  'Modélisme & collection',
  'Vins & gastronomie',
  'Billetterie & événements'
];

export const VACATIONS_SUB_CATEGORIES = [
  'Locations saisonnières',
  'Échange de maison',
  'Couchsurfing (hébergement gratuit)',
  'Guide local'
];

export const JOBS_SUB_CATEGORIES = [
  "Offres d'emploi (CDI, CDD, intérim, stage, apprentissage, bénévolat)",
  'Formations professionnelles',
  'Profil candidat',
  'Matériel professionnel (agricole, BTP, restauration, bureau, médical, commerce, industrie)',
  'Services pro (déménagement, réparation, nettoyage, jardinage, animation, événementiel)'
];

export const ANIMAL_CATEGORIES = [
  'Animaux de compagnie (chiens, chats, NAC, oiseaux, poissons)',
  'Accessoires (cage, gamelle, panier, laisse, jouets)',
  'Alimentation',
  'Animaux perdus (signalement)'
];

export const OTHER_SUB_CATEGORIES = [
  'Dons & gratuités',
  'Entraide entre voisins',
  'Covoiturage',
  'Cours particuliers',
  'Baby‑sitting',
  'Artistes & musiciens',
  'Services à la personne',
  'Autres services'
];

export const JOB_CONTRACT_TYPES = [
  'CDI', 'CDD', 'Intérim', 'Stage', 'Apprentissage', 'Bénévolat', 'Autre'
];

export const VACATION_ACCOMMODATION_TYPES = [
  'Maisons & villas', 'Appartements', 'Chalets', 'Chambres d\'hôtes', 'Campings', 'Autre'
];

export const FAMILY_SIZES = [
  '0-3 mois', '3-6 mois', '6-12 mois', '12-18 mois', '18-24 mois', '+24 mois', 'Autre'
];

export const WEDDING_SUB_CATEGORIES = [
  'Robes & accessoires',
  'Décoration & faire-part',
  'Traiteurs & pâtissiers',
  'Photographes & vidéastes',
  'Lieux de réception',
  'Organisation & animation',
  'Revente après mariage'
];

export const WEDDING_CONDITIONS = [
  'Neuf', 'Comme neuf', 'Très bon état', 'Bon état', 'Satisfaisant'
];

export const VEHICLE_SUB_CATEGORIES = [
  'Voitures',
  'Motos',
  'Caravaning',
  'Utilitaires',
  'Camions',
  'Nautisme',
  'Équipement auto',
  'Équipement moto',
  'Équipement caravaning',
  'Équipement nautisme',
  'Vélos',
  'Équipement vélo',
  'Services de réparation mécanique'
];

export const VEHICLE_BRANDS = [
  'Alfa Romeo', 'Aprilia', 'Audi', 'Aixam', 'Aston Martin', 'Bentley', 'BMW', 'Benelli', 'Bugatti', 'Cadillac', 'Chevrolet', 'Chrysler', 'Citroën', 'Cupra', 'Dacia', 'Daewoo', 'Daihatsu', 'Dodge', 'DS', 'Ducati', 'Ferrari', 'Fiat', 'Ford', 'Harley-Davidson', 'Honda', 'Hyundai', 'Indian', 'Infiniti', 'Isuzu', 'Iveco', 'Jaguar', 'Jeep', 'Kawasaki', 'Kia', 'KTM', 'Kymco', 'Lamborghini', 'Lancia', 'Land Rover', 'Lexus', 'Lotus', 'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Moto Guzzi', 'Nissan', 'Opel', 'Peugeot', 'Piaggio', 'Porsche', 'Renault', 'Rolls-Royce', 'Royal Enfield', 'Rover', 'Saab', 'Seat', 'Skoda', 'Smart', 'SsangYong', 'Subaru', 'Suzuki', 'Sym', 'Tesla', 'Toyota', 'Triumph', 'Vespa', 'Volkswagen', 'Volvo', 'Yamaha', 'Autre'
].sort();

export const VEHICLE_MODELS: Record<string, string[]> = {
  'Renault': ['Clio', 'Captur', 'Megane', 'Scenic', 'Twingo', 'Zoe', 'Kadjar', 'Austral', 'Arkana', 'Espace', 'Koleos', 'Kangoo', 'Master', 'Trafic', 'Modus', 'Laguna', 'Safrane', 'R5', 'R19', 'R21', 'Fluence', 'Latitude', 'Talisman', 'Autre'],
  'Peugeot': ['208', '2008', '308', '3008', '508', '5008', '108', '207', '307', '407', 'Partner', 'Expert', 'Boxer', '106', '107', '206', '306', '406', '607', '807', 'RCZ', 'Bipper', 'Rifter', 'Traveller', 'Autre'],
  'Citroën': ['C3', 'C3 Aircross', 'C4', 'C4 Cactus', 'C5 Aircross', 'Berlingo', 'Ami', 'C1', 'C2', 'C5', 'Jumpy', 'Jumper', 'Saxo', 'Xsara', 'Xantia', 'C4 Picasso', 'C4 SpaceTourer', 'C6', 'C8', 'DS3 (Ancien)', 'DS4 (Ancien)', 'DS5 (Ancien)', 'Autre'],
  'Volkswagen': ['Golf', 'Polo', 'Tiguan', 'T-Roc', 'T-Cross', 'Passat', 'ID.3', 'ID.4', 'ID.5', 'Touran', 'Arteon', 'Transporter', 'Crafter', 'Caddy', 'Amarok', 'Touareg', 'Up!', 'Scirocco', 'Beetle', 'Sharan', 'Jetta', 'Eos', 'Fox', 'Autre'],
  'BMW': ['Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5', 'Serie 7', 'Serie 8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'i3', 'i4', 'iX', 'iX3', 'Z4', 'M2', 'M3', 'M4', 'M5', 'R 1250 GS', 'S 1000 RR', 'F 900 R', 'CE 04', 'K 1600', 'R 18', 'Autre'],
  'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8', 'TT', 'e-tron', 'RS3', 'RS4', 'RS5', 'RS6', 'R8', 'Autre'],
  'Mercedes-Benz': ['Classe A', 'Classe B', 'Classe C', 'Classe E', 'Classe S', 'Classe G', 'Classe V', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'Vito', 'Sprinter', 'AMG GT', 'CLA', 'CLS', 'Autre'],
  'Toyota': ['Yaris', 'Corolla', 'C-HR', 'RAV4', 'Aygo', 'Prius', 'Hilux', 'Land Cruiser', 'Proace', 'Supra', 'GR86', 'Camry', 'Mirai', 'Autre'],
  'Ford': ['Fiesta', 'Focus', 'Puma', 'Kuga', 'Mustang Mach-E', 'Mustang', 'Ranger', 'Transit', 'Mondeo', 'EcoSport', 'Explorer', 'S-Max', 'Galaxy', 'Autre'],
  'Dacia': ['Sandero', 'Duster', 'Jogger', 'Spring', 'Logan', 'Lodgy', 'Dokker', 'Autre'],
  'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck', 'Roadster', 'Autre'],
  'Fiat': ['500', '500X', '500L', 'Panda', 'Tipo', 'Ducato', 'Punto', 'Grande Punto', 'Bravo', 'Stilo', 'Multipla', 'Freemont', 'Ulysse', 'Doblo', 'Talento', 'Scudo', 'Fiorino', 'Qubo', '124 Spider', 'Sedici', 'Croma', 'Autre'],
  'Opel': ['Corsa', 'Mokka', 'Astra', 'Grandland', 'Crossland', 'Insignia', 'Vivaro', 'Combo', 'Zafira', 'Adam', 'Autre'],
  'Alfa Romeo': ['Giulietta', 'Giulia', 'Stelvio', 'Tonale', 'MiTo', '147', '156', '159', 'Brera', 'GT', 'Spider', '4C', 'Autre'],
  'Aixam': ['City', 'Coupe', 'Crossline', 'GTO', 'e-Aixam', 'Autre'],
  'Nissan': ['Qashqai', 'Juke', 'Leaf', 'X-Trail', 'Micra', 'Navara', 'Ariya', 'Townstar', 'Primastar', 'Interstar', '370Z', 'GT-R', 'Note', 'Pulsar', 'Murano', 'Pathfinder', 'Patrol', 'Autre'],
  'Hyundai': ['i10', 'i20', 'i30', 'Kona', 'Tucson', 'Ioniq 5', 'Ioniq 6', 'Santa Fe', 'Bayon', 'Nexo', 'Staria', 'Getz', 'Matrix', 'Coupe', 'Veloster', 'Autre'],
  'Kia': ['Picanto', 'Rio', 'Ceed', 'Sportage', 'Niro', 'EV6', 'EV9', 'Sorento', 'Stonic', 'XCeed', 'Stinger', 'Autre'],
  'Seat': ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco', 'Mii', 'Alhambra', 'Autre'],
  'Skoda': ['Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq', 'Scala', 'Citigo', 'Autre'],
  'Mini': ['Hatch', 'Countryman', 'Clubman', 'Convertible', 'Electric', 'Autre'],
  'Volvo': ['XC40', 'XC60', 'XC90', 'V40', 'V60', 'V90', 'S60', 'S90', 'C40', 'EX30', 'EX90', 'Autre'],
  'Mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-30', 'CX-5', 'CX-60', 'MX-5', 'MX-30', 'Autre'],
  'Suzuki': ['Swift', 'Vitara', 'Jimny', 'Ignis', 'S-Cross', 'Swace', 'Across', 'GSX-S', 'V-Strom', 'SV650', 'Hayabusa', 'Autre'],
  'Honda': ['Civic', 'Jazz', 'CR-V', 'HR-V', 'Honda e', 'ZR-V', 'e:Ny1', 'CB500F', 'CB650R', 'Africa Twin', 'Forza 125', 'Forza 350', 'X-ADV', 'Autre'],
  'Land Rover': ['Range Rover', 'Range Rover Evoque', 'Range Rover Velar', 'Range Rover Sport', 'Discovery', 'Discovery Sport', 'Defender', 'Autre'],
  'Jeep': ['Renegade', 'Compass', 'Wrangler', 'Grand Cherokee', 'Avenger', 'Gladiator', 'Autre'],
  'DS': ['DS 3', 'DS 4', 'DS 7', 'DS 9', 'DS 3 Crossback', 'DS 7 Crossback', 'Autre'],
  'Cupra': ['Formentor', 'Leon', 'Born', 'Ateca', 'Tavascan', 'Autre'],
  'Smart': ['Fortwo', 'Forfour', '#1', '#3', 'Autre'],
  'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', '718 Cayman', '718 Boxster', '918 Spyder', 'Autre'],
  'Yamaha': ['MT-07', 'MT-09', 'MT-10', 'MT-125', 'TMAX', 'XMAX', 'NMAX', 'Tracer 7', 'Tracer 9', 'R1', 'R6', 'R3', 'R125', 'Tenere 700', 'XSR700', 'XSR900', 'Autre'],
  'Kawasaki': ['Z650', 'Z900', 'Z1000', 'Z400', 'Ninja 650', 'Ninja 1000SX', 'Ninja ZX-10R', 'Versys', 'Vulcan S', 'Autre'],
  'Ducati': ['Monster', 'Multistrada', 'Panigale', 'Scrambler', 'Diavel', 'Streetfighter', 'Hypermotard', 'DesertX', 'Autre'],
  'Triumph': ['Street Triple', 'Speed Triple', 'Tiger', 'Bonneville', 'Trident 660', 'Rocket 3', 'Scrambler 900', 'Autre'],
  'KTM': ['Duke', 'Adventure', 'RC', 'Super Duke', 'Super Adventure', 'Autre'],
  'Harley-Davidson': ['Sportster', 'Softail', 'Touring', 'Pan America', 'Nightster', 'Fat Boy', 'Iron 883', 'Autre'],
  'Piaggio': ['MP3', 'Liberty', 'Beverly', 'Medley', 'Zip', 'Autre'],
  'Vespa': ['Primavera', 'GTS', 'Sprint', 'Elettrica', 'Autre'],
};

// Sort all model lists alphabetically
Object.keys(VEHICLE_MODELS).forEach(brand => {
  VEHICLE_MODELS[brand].sort((a, b) => {
    if (a === 'Autre') return 1;
    if (b === 'Autre') return -1;
    return a.localeCompare(b);
  });
});

export const FUEL_TYPES = [
  'Essence', 'Diesel', 'Électrique', 'Hybride', 'Hybride rechargeable', 'GPL', 'GNC', 'Hydrogène'
];

export const VEHICLE_TYPES = [
  'Berline', 'Citadine', 'SUV / 4x4', 'Break', 'Coupé', 'Cabriolet', 'Monospace', 'Utilitaire', 'Pick-up', 'Sans permis', 'Sportive', 'Custom', 'Roadster', 'Trail', 'Cross', 'Enduro', 'Scooter', 'Quad', 'Camping-car', 'Caravane', 'Fourgon aménagé', 'Bateau à moteur', 'Voilier', 'Jet-ski', 'Camion', 'Vélo'
];

export const GEARBOX_TYPES = [
  'Manuelle', 'Automatique', 'Semi-automatique'
];

export const VEHICLE_COLORS = [
  'Noir', 'Blanc', 'Gris', 'Argent', 'Bleu', 'Rouge', 'Vert', 'Jaune', 'Orange', 'Marron', 'Beige', 'Or', 'Bronze', 'Violet', 'Rose', 'Autre'
];

export const VEHICLE_CONDITION = [
  'Excellent', 'Très bon', 'Bon', 'Correct', 'Pour pièces'
];

export const DOORS_COUNT = [
  '2', '3', '4', '5'
];

export const SEATS_COUNT = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

export const CRIT_AIR = [
  '0 (Vert)', '1', '2', '3', '4', '5'
];

export const REAL_ESTATE_TRANSACTION_TYPES = [
  'Ventes immobilières',
  'Locations',
  'Colocations',
  'Bureaux & commerces',
  'Terrain',
  'Parking',
  'Immobilier neuf',
  'Viager',
  'Saisie immobilière'
];

export const REAL_ESTATE_TYPES = [
  'Appartement', 'Maison', 'Terrain', 'Parking', 'Local commercial', 'Bureaux', 'Château', 'Hôtel particulier', 'Immeuble', 'Loft / Atelier', 'Péniche', 'Viager'
];

export const ENERGY_CLASS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Non soumis'];
export const GHG_CLASS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Non soumis'];

export const REAL_ESTATE_CONDITION = [
  'Neuf', 'Très bon état', 'Bon état', 'À rénover', 'À construire'
];

export const HEATING_TYPES = [
  'Électrique', 'Gaz', 'Fioul', 'Bois', 'Pompe à chaleur', 'Solaire', 'Géothermie', 'Urbain', 'Aucun'
];

export const KITCHEN_TYPES = [
  'Aménagée', 'Équipée', 'Kitchenette', 'Sans cuisine'
];

export const FURNISHED = [
  'Meublé', 'Non meublé'
];

export const FASHION_GENDERS = ['Femme', 'Homme', 'Fille', 'Garçon', 'Bébé', 'Unisexe'];

export const FASHION_CATEGORIES = [
  'Vêtements femme', 'Vêtements homme', 'Vêtements enfant', 'Chaussures', 'Sacs', 'Montres', 'Bijoux'
];

export const FASHION_SIZES = {
  clothing: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'Autre'],
  shoes: ['16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'],
  baby: ['Naissance', '1 mois', '3 mois', '6 mois', '9 mois', '12 mois', '18 mois', '24 mois', '36 mois']
};

export const FASHION_CONDITIONS = [
  'Neuf avec étiquette', 'Neuf sans étiquette', 'Très bon état', 'Bon état', 'Satisfaisant'
];

export const FASHION_MATERIALS = [
  'Coton', 'Laine', 'Soie', 'Lin', 'Cuir', 'Daim', 'Velours', 'Cachemire', 'Synthétique', 'Jean / Denim', 'Autre'
];

export const FASHION_BRANDS = [
  'Nike', 'Adidas', 'Zara', 'H&M', 'Levi\'s', 'Lacoste', 'Ralph Lauren', 'Tommy Hilfiger', 'Calvin Klein', 
  'Gucci', 'Louis Vuitton', 'Chanel', 'Prada', 'Dior', 'Hermès', 'Balenciaga', 'Saint Laurent', 'Versace', 
  'Fendi', 'Burberry', 'Moncler', 'Stone Island', 'Off-White', 'Supreme', 'The North Face', 'Patagonia', 
  'Columbia', 'Uniqlo', 'Mango', 'Bershka', 'Pull&Bear', 'Stradivarius', 'Massimo Dutti', 'ASOS', 'Shein', 
  'Primark', 'Decathlon', 'Puma', 'Reebok', 'New Balance', 'Converse', 'Vans', 'Dr. Martens', 'Birkenstock', 
  'UGG', 'Timberland', 'Autre'
];

export const SERVICE_CATEGORIES = [
  'Cours particuliers', 'Baby-sitting', 'Services à la personne', 'Bricolage', 'Coiffure'
];

export const HOSPITALITY_TYPES = [
  'Couchsurfing',
  'Échange de maison',
  'Guide local',
  'Chambre d\'amis',
  'Hospitalité ponctuelle',
  'Autre'
];

export const ACCOMMODATION_TYPES = [
  'Canapé',
  'Chambre privée',
  'Maison entière',
  'Jardin pour camper'
];

export const HOSPITALITY_CAPACITY = ['1', '2', '3', '4', '5+'];

export const HOSPITALITY_MAX_DURATION = [
  '1 nuit',
  '2 nuits',
  '1 semaine',
  '1 mois',
  'Selon accord'
];

export const PETS_ALLOWED_OPTIONS = ['Oui', 'Non', 'Selon l\'animal'];
export const SMOKING_ALLOWED_OPTIONS = ['Oui', 'Non'];

export const GUIDE_INTERESTS = [
  'Musée',
  'Randonnée',
  'Gastronomie',
  'Histoire',
  'Vie nocturne',
  'Shopping',
  'Nature',
  'Architecture',
  'Autre'
];

export const HOSPITALITY_LANGUAGES = [
  'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Portugais', 'Arabe', 'Chinois', 'Japonais', 'Russe', 'Autre'
];

export const SERVICE_EXPERIENCE = [
  'Débutant',
  'Intermédiaire',
  'Expérimenté',
  'Professionnel'
];

export const ANIMAL_GENDERS = ['Mâle', 'Femelle', 'Inconnu'];

export const HOME_GARDEN_CONDITIONS = [
  'Neuf',
  'Comme neuf',
  'Très bon état',
  'Bon état',
  'Satisfaisant',
  'Pour pièces / À réparer'
];

export const HOME_GARDEN_MATERIALS = [
  'Bois',
  'Métal',
  'Plastique',
  'Verre',
  'Pierre',
  'Tissu',
  'Cuir',
  'Rotin / Osier',
  'Autre'
];

export const ELECTRONICS_CONDITIONS = [
  'Neuf',
  'Comme neuf',
  'Très bon état',
  'Bon état',
  'Satisfaisant',
  'Pour pièces / À réparer'
];

export const ELECTRONICS_BRANDS: Record<string, string[]> = {
  'Téléphones & objets connectés': ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Google', 'Oppo', 'OnePlus', 'Sony', 'Nokia', 'Motorola', 'Honor', 'Vivo', 'Realme', 'Nothing', 'Autre'],
  'Ordinateurs': ['Apple', 'HP', 'Dell', 'Asus', 'Acer', 'Lenovo', 'MSI', 'Microsoft', 'Razer', 'Gigabyte', 'Toshiba', 'Fujitsu', 'Autre'],
  'Consoles & jeux vidéo': ['Sony', 'Microsoft', 'Nintendo', 'Sega', 'Valve (Steam Deck)', 'Asus (ROG Ally)', 'Autre'],
  'Photo, audio & vidéo': ['Sony', 'Samsung', 'LG', 'Bose', 'JBL', 'Sennheiser', 'Sonos', 'Philips', 'Yamaha', 'Marshall', 'Beats', 'Audio-Technica', 'Denon', 'Canon', 'Nikon', 'Fujifilm', 'Panasonic', 'GoPro', 'Leica', 'Olympus', 'DJI', 'Autre'],
  'Télévision': ['Sony', 'Samsung', 'LG', 'Philips', 'Panasonic', 'Hisense', 'TCL', 'Xiaomi', 'Autre'],
  'Vidéoprojecteur': ['Sony', 'Samsung', 'LG', 'Philips', 'Panasonic', 'Hisense', 'TCL', 'Xiaomi', 'Autre'],
  'Accessoires téléphone': ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Withings', 'Xiaomi', 'Huawei', 'Amazfit', 'Polar', 'Autre'],
  'Tablettes & liseuses': ['Apple', 'Samsung', 'Amazon (Kindle)', 'Kobo', 'Lenovo', 'Huawei', 'Remarkable', 'Autre'],
  'Accessoires informatique': ['Logitech', 'Razer', 'Corsair', 'SteelSeries', 'Microsoft', 'Apple', 'HP', 'Dell', 'Asus', 'Acer', 'Lenovo', 'Autre'],
  'Enceintes': ['Bose', 'JBL', 'Sonos', 'Sony', 'Marshall', 'Philips', 'Yamaha', 'Denon', 'Autre'],
  'Appareil photo': ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Panasonic', 'Olympus', 'Leica', 'Autre'],
  'Casque / écouteurs': ['Sony', 'Bose', 'Sennheiser', 'JBL', 'Apple', 'Beats', 'Audio-Technica', 'Marshall', 'Autre'],
  'Services de réparation électronique': ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Sony', 'Microsoft', 'Nintendo', 'HP', 'Dell', 'Asus', 'Autre']
};

export const ELECTRONICS_MODELS: Record<string, string[]> = {
  'Apple': ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11', 'iPhone SE', 'MacBook Pro M3', 'MacBook Pro M2', 'MacBook Air M3', 'MacBook Air M2', 'iPad Pro', 'iPad Air', 'iPad mini', 'iPad', 'Apple Watch Ultra', 'Apple Watch Series 9', 'Apple Watch SE', 'AirPods Pro', 'AirPods Max', 'AirPods'],
  'Samsung': ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23', 'Galaxy S22', 'Galaxy A54', 'Galaxy A34', 'Galaxy A14', 'Galaxy Z Fold 5', 'Galaxy Z Flip 5', 'Galaxy Tab S9', 'Galaxy Tab A9', 'Galaxy Watch 6', 'Galaxy Buds 2 Pro'],
  'Sony': ['PlayStation 5', 'PlayStation 5 Digital', 'PlayStation 4 Pro', 'PlayStation 4', 'WH-1000XM5', 'WH-1000XM4', 'WF-1000XM5', 'Alpha 7 IV', 'Alpha 7 III', 'Alpha 6400', 'ZV-E10', 'Bravia XR', 'Xperia 1 V', 'Xperia 5 V'],
  'Microsoft': ['Xbox Series X', 'Xbox Series S', 'Xbox One X', 'Xbox One S', 'Surface Pro 9', 'Surface Laptop 5', 'Surface Go 3', 'Surface Book 3'],
  'Nintendo': ['Switch OLED', 'Switch', 'Switch Lite', 'Wii U', 'Wii', '3DS XL', '2DS XL', 'NES Classic', 'SNES Classic'],
  'Xiaomi': ['Xiaomi 14 Ultra', 'Xiaomi 14', 'Xiaomi 13T Pro', 'Redmi Note 13 Pro', 'Redmi Note 12', 'Poco F5 Pro', 'Poco X6', 'Mi Band 8', 'Xiaomi Pad 6'],
  'Google': ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7a', 'Pixel 6 Pro', 'Pixel Fold', 'Pixel Tablet', 'Pixel Watch 2', 'Pixel Buds Pro'],
  'HP': ['Spectre x360', 'Envy', 'Pavilion', 'Omen', 'Victus', 'EliteBook', 'ProBook', 'ZBook'],
  'Dell': ['XPS 13', 'XPS 15', 'XPS 17', 'Inspiron', 'Latitude', 'Vostro', 'Alienware m16', 'Precision'],
  'Asus': ['Zenbook S 13', 'Vivobook Pro', 'ROG Zephyrus', 'ROG Strix', 'TUF Gaming', 'ROG Ally', 'Zenfone 10'],
  'Lenovo': ['ThinkPad X1 Carbon', 'Yoga Slim', 'IdeaPad', 'Legion 5', 'Legion Go', 'Tab P11'],
  'GoPro': ['Hero 12 Black', 'Hero 11 Black', 'Hero 10 Black', 'Hero 9 Black', 'MAX'],
  'DJI': ['Mavic 3', 'Mini 4 Pro', 'Air 3', 'Osmo Action 4', 'Osmo Pocket 3', 'Ronin'],
  'Garmin': ['Fenix 7', 'Forerunner 965', 'Venu 3', 'Epix Gen 2', 'Instinct 2'],
  'Amazon (Kindle)': ['Kindle Paperwhite', 'Kindle Oasis', 'Kindle Scribe', 'Kindle (Standard)'],
  'Kobo': ['Libra 2', 'Clara 2E', 'Elipsa 2E', 'Sage'],
  'Bose': ['QuietComfort Ultra', 'QC45', 'QC35 II', 'SoundLink Revolve'],
  'JBL': ['Flip 6', 'Charge 5', 'Boombox 3', 'Live 660NC', 'Tune 510BT'],
  'Marshall': ['Major IV', 'Monitor II', 'Emberton II', 'Stanmore III'],
  'Beats': ['Studio Pro', 'Solo 3', 'Fit Pro', 'Powerbeats Pro'],
};

export const EVENT_CATEGORIES = [
  'Concerts & Festivals',
  'Spectacles & Théâtre',
  'Expositions & Musées',
  'Sport',
  'Conférences & Ateliers',
  'Fêtes & Soirées',
  'Vide-greniers & Marchés',
  'Loisirs & Détente',
  'Autre'
];

export const SHOPS_ARTISANS_CATEGORIES = [
  'Alimentation',
  'Restauration',
  'Beauté & Bien-être',
  'Mode & Accessoires',
  'Maison & Déco',
  'Services de proximité',
  'Santé',
  'Loisirs & Culture',
  'Autre'
];

export const ASSOCIATIONS_CATEGORIES = [
  'Solidarité & Humanitaire',
  'Culture & Patrimoine',
  'Sport & Loisirs',
  'Environnement & Écologie',
  'Éducation & Jeunesse',
  'Santé & Handicap',
  'Défense des droits',
  'Autre'
];

export const REGIONS = [
  { id: '11', label: 'Île-de-France' },
  { id: '24', label: 'Centre-Val de Loire' },
  { id: '27', label: 'Bourgogne-Franche-Comté' },
  { id: '28', label: 'Normandie' },
  { id: '32', label: 'Hauts-de-France' },
  { id: '44', label: 'Grand Est' },
  { id: '52', label: 'Pays de la Loire' },
  { id: '53', label: 'Bretagne' },
  { id: '75', label: 'Nouvelle-Aquitaine' },
  { id: '76', label: 'Occitanie' },
  { id: '84', label: 'Auvergne-Rhône-Alpes' },
  { id: '93', label: "Provence-Alpes-Côte d'Azur" },
  { id: '94', label: 'Corse' },
];

export const DETAIL_LABELS: Record<string, string> = {
  brand: 'Marque',
  model: 'Modèle',
  year: 'Année',
  fuel: 'Carburant',
  mileage: 'Kilométrage',
  gearbox: 'Boîte de vitesse',
  vehicleType: 'Type de véhicule',
  doors: 'Portes',
  seats: 'Places',
  power: 'Puissance fiscale',
  color: 'Couleur',
  condition: 'État',
  critAir: "Crit'Air",
  firstHand: 'Première main',
  rooms: 'Pièces',
  bedrooms: 'Chambres',
  bathrooms: 'Salles de bain',
  surface: 'Surface habitable',
  landSurface: 'Surface terrain',
  floor: 'Étage',
  totalFloors: "Nombre d'étages",
  energyClass: 'Classe énergie',
  ghgClass: 'GES',
  heating: 'Chauffage',
  kitchen: 'Cuisine',
  furnished: 'Meublé',
  balcony: 'Balcon',
  terrace: 'Terrasse',
  garden: 'Jardin',
  parking: 'Parking / Garage',
  elevator: 'Ascenseur',
  cellar: 'Cave',
  digicode: 'Digicode',
  intercom: 'Interphone',
  guardian: 'Gardien',
  realEstateType: 'Type de bien',
  transactionType: 'Type de transaction',
  size: 'Taille',
  gender: 'Univers',
  material: 'Matière',
  fashionBrand: 'Marque',
  fashionCategory: 'Sous-catégorie',
  vehicleSubCategory: 'Sous-catégorie',
  serviceCategory: 'Type de service',
  experience: 'Niveau d\'expérience',
  toolsProvided: 'Matériel fourni',
  remoteService: 'Service à distance',
  animalCategory: 'Type d\'animal',
  animalBreed: 'Race',
  animalAge: 'Âge',
  animalGender: 'Sexe',
  isVaccinated: 'Vacciné',
  isIdentified: 'Identifié (Puce/Tatouage)',
  isSterilized: 'Stérilisé',
  homeGardenCategory: 'Sous-catégorie',
  homeGardenCondition: 'État',
  homeGardenMaterial: 'Matière',
  dimensions: 'Dimensions',
  electronicsCategory: 'Sous-catégorie',
  electronicsBrand: 'Marque',
  electronicsModel: 'Modèle',
  electronicsCondition: 'État',
  storageCapacity: 'Capacité de stockage',
  ramSize: 'Mémoire vive (RAM)',
  screenSize: 'Taille d\'écran',
  eventCategory: 'Type d\'événement',
  eventDate: 'Date de l\'événement',
  eventTime: 'Heure de l\'événement',
  businessType: 'Type d\'activité',
  openingHours: 'Horaires d\'ouverture',
  website: 'Site web',
  isPro: 'Professionnel',
  associationCategory: 'Type d\'association',
  mission: 'Mission / Objectif',
  contactPerson: 'Personne à contacter',
  contactEmail: 'Email de contact',
  contactPhone: 'Téléphone de contact',
  exchangeFor: 'Contre quoi ?',
  availability: 'Disponibilités',
  hospitalityType: 'Type d\'hospitalité',
  hospitalityCapacity: 'Capacité d\'accueil',
  hospitalityAmenities: 'Équipements',
  hospitalityLanguages: 'Langues parlées',
  hospitalityDuration: 'Durée max du séjour',
  smokingAllowed: 'Fumeur accepté',
  preferredPeriod: 'Période souhaitée',
  interests: 'Centres d\'intérêt',
  technicalControl: 'Contrôle technique',
  timingBelt: 'Distribution',
  registrationStatus: 'Carte grise',
  weddingSubCategory: 'Type de prestation',
  originalPrice: 'Prix d\'origine',
  isVintage: 'Vintage',
  isDesigner: 'Créateur',
  familySubCategory: 'Sous-catégorie',
  familySize: 'Taille / Âge',
  loisirsSubCategory: 'Sous-catégorie',
  vacationsSubCategory: 'Sous-catégorie',
  accommodationType: 'Type d\'hébergement',
  maxGuests: 'Capacité',
  hasPool: 'Piscine',
  hasGarden: 'Jardin',
  petsAllowed: 'Animaux acceptés',
  hasAC: 'Climatisation',
  jobsSubCategory: 'Sous-catégorie',
  contractType: 'Type de contrat',
  jobsServicesSubCategory: 'Sous-catégorie',
  othersDonationsSubCategory: 'Sous-catégorie',
};
