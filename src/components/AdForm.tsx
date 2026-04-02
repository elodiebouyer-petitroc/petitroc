import React, { useState, useCallback, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { 
  CATEGORIES, 
  VEHICLE_SUB_CATEGORIES,
  VEHICLE_BRANDS, 
  VEHICLE_MODELS,
  FUEL_TYPES, 
  VEHICLE_TYPES, 
  REAL_ESTATE_TYPES, 
  REAL_ESTATE_TRANSACTION_TYPES,
  GEARBOX_TYPES, 
  VEHICLE_COLORS, 
  VEHICLE_CONDITION, 
  DOORS_COUNT, 
  SEATS_COUNT, 
  CRIT_AIR,
  ENERGY_CLASS,
  GHG_CLASS,
  REAL_ESTATE_CONDITION,
  HEATING_TYPES,
  KITCHEN_TYPES,
  FURNISHED,
  FASHION_GENDERS,
  FASHION_CATEGORIES,
  FASHION_SIZES,
  FASHION_CONDITIONS,
  FASHION_MATERIALS,
  FASHION_BRANDS,
  SERVICE_CATEGORIES,
  SERVICE_EXPERIENCE,
  ANIMAL_CATEGORIES,
  ANIMAL_GENDERS,
  HOME_GARDEN_CATEGORIES,
  HOME_GARDEN_CONDITIONS,
  HOME_GARDEN_MATERIALS,
  ELECTRONICS_CATEGORIES,
  ELECTRONICS_CONDITIONS,
  ELECTRONICS_BRANDS,
  ELECTRONICS_MODELS,
  EVENT_CATEGORIES,
  SHOPS_ARTISANS_CATEGORIES,
  ASSOCIATIONS_CATEGORIES,
  HOSPITALITY_TYPES,
  ACCOMMODATION_TYPES,
  HOSPITALITY_CAPACITY,
  HOSPITALITY_MAX_DURATION,
  HOSPITALITY_LANGUAGES,
  PETS_ALLOWED_OPTIONS,
  SMOKING_ALLOWED_OPTIONS,
  GUIDE_INTERESTS,
  WEDDING_SUB_CATEGORIES,
  FAMILY_SUB_CATEGORIES,
  LOISIRS_SUB_CATEGORIES,
  VACATIONS_SUB_CATEGORIES,
  JOBS_SUB_CATEGORIES,
  OTHER_SUB_CATEGORIES,
  JOB_CONTRACT_TYPES,
  VACATION_ACCOMMODATION_TYPES,
  FAMILY_SIZES
} from '../constants';
import { CategoryIcon } from './CategoryIcon';
import { Camera, X, MapPin, Loader2, ChevronDown, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, query, where, getDocs, limit, doc, updateDoc, getDoc, Timestamp, orderBy } from 'firebase/firestore';
import { compressImage, blurRegion } from '../lib/imageUtils';
import { detectLicensePlates } from '../services/visionService';
import { Ad } from '../types';
import { useAuth } from '../App';
import { toast } from 'sonner';
import { fetchAddressSuggestions, AddressSuggestion } from '../utils/addressApi';
import { containsForbiddenWords, sendAdminAlert } from '../utils/antiSpam';

const numericField = z.union([z.number(), z.nan(), z.null()]).optional().transform(v => (v === undefined || v === null || isNaN(v)) ? undefined : v);
const requiredNumericField = z.union([z.number(), z.nan(), z.null()])
  .refine(v => v !== undefined && v !== null && !isNaN(v), { message: 'Le champ Prix est obligatoire' })
  .transform(v => v as number);

const adSchema = z.object({
  title: z.string().min(1, 'Le champ Titre est obligatoire').min(5, 'Le titre doit faire au moins 5 caractères').max(100),
  description: z.string().min(1, 'Le champ Description est obligatoire').min(10, 'La description doit faire au moins 10 caractères').max(5000),
  category: z.string().min(1, 'Le champ Catégorie est obligatoire'),
  type: z.enum(['offer', 'seek']),
  price: requiredNumericField,
  city: z.string().min(1, 'Le champ Ville est obligatoire'),
  zipCode: z.string().min(1, 'Le champ Code postal est obligatoire').max(10),
  isPro: z.boolean().optional(),
  // Category specific fields
  vehicleSubCategory: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: numericField,
  fuel: z.string().optional(),
  mileage: numericField,
  gearbox: z.string().optional(),
  vehicleType: z.string().optional(),
  doors: z.string().optional(),
  seats: z.string().optional(),
  power: numericField,
  color: z.string().optional(),
  condition: z.string().optional(),
  critAir: z.string().optional(),
  firstHand: z.boolean().optional(),
  // Real estate specific fields
  transactionType: z.string().optional(),
  realEstateType: z.string().optional(),
  rooms: numericField,
  bedrooms: numericField,
  bathrooms: numericField,
  surface: numericField,
  landSurface: numericField,
  floor: numericField,
  totalFloors: numericField,
  energyClass: z.string().optional(),
  ghgClass: z.string().optional(),
  heating: z.string().optional(),
  kitchen: z.string().optional(),
  furnished: z.string().optional(),
  balcony: z.boolean().optional(),
  terrace: z.boolean().optional(),
  garden: z.boolean().optional(),
  parking: z.boolean().optional(),
  elevator: z.boolean().optional(),
  cellar: z.boolean().optional(),
  digicode: z.boolean().optional(),
  intercom: z.boolean().optional(),
  guardian: z.boolean().optional(),
  // Fashion specific fields
  size: z.string().optional(),
  gender: z.string().optional(),
  material: z.string().optional(),
  fashionBrand: z.string().optional(),
  customFashionBrand: z.string().optional(),
  fashionCategory: z.string().optional(),
  // Service specific fields
  serviceCategory: z.string().optional(),
  experience: z.string().optional(),
  toolsProvided: z.boolean().optional(),
  remoteService: z.boolean().optional(),
  // Animal specific fields
  animalCategory: z.string().optional(),
  animalBreed: z.string().optional(),
  animalAge: numericField,
  animalGender: z.string().optional(),
  isVaccinated: z.boolean().optional(),
  isIdentified: z.boolean().optional(),
  isSterilized: z.boolean().optional(),
  // Home & Garden specific fields
  homeGardenCategory: z.string().optional(),
  homeGardenCondition: z.string().optional(),
  homeGardenMaterial: z.string().optional(),
  dimensions: z.string().optional(),
  // Electronics specific fields
  electronicsCategory: z.string().optional(),
  electronicsBrand: z.string().optional(),
  electronicsModel: z.string().optional(),
  electronicsCondition: z.string().optional(),
  storageCapacity: z.string().optional(),
  ramSize: z.string().optional(),
  screenSize: z.string().optional(),
  eventCategory: z.string().optional(),
  eventDate: z.string().optional(),
  eventTime: z.string().optional(),
  // Shops & Artisans specific fields
  businessType: z.string().optional(),
  openingHours: z.string().optional(),
  website: z.string().optional(),
  associationCategory: z.string().optional(),
  mission: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  exchangeFor: z.string().optional(),
  availability: z.string().optional(),
  hospitalityType: z.string().optional(),
  hospitalityCapacity: z.string().optional(),
  hospitalityAmenities: z.array(z.string()).optional(),
  hospitalityLanguages: z.array(z.string()).optional(),
  hospitalityDuration: z.string().optional(),
  accommodationType: z.string().optional(),
  maxGuests: z.string().optional(),
  petsAllowed: z.string().optional(),
  smokingAllowed: z.string().optional(),
  preferredPeriod: z.string().optional(),
  interests: z.array(z.string()).optional(),
  technicalControl: z.string().optional(),
  timingBelt: z.string().optional(),
  registrationStatus: z.string().optional(),
  weddingSubCategory: z.string().optional(),
  originalPrice: numericField,
  isVintage: z.boolean().optional(),
  isDesigner: z.boolean().optional(),
  familySubCategory: z.string().optional(),
  loisirsSubCategory: z.string().optional(),
  vacationsSubCategory: z.string().optional(),
  jobsSubCategory: z.string().optional(),
  contractType: z.string().optional(),
  familySize: z.string().optional(),
  jobsServicesSubCategory: z.string().optional(),
  othersDonationsSubCategory: z.string().optional(),
});

type AdFormValues = z.infer<typeof adSchema>;

const FamilyFields = React.memo(({ register, watch }: { register: any, watch: any }) => {
  const subCategory = watch('familySubCategory');
  const isService = ['Baby-sitting', 'Soutien scolaire', 'Cours & ateliers enfants'].includes(subCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
      <div className="md:col-span-2">
        <label className="block text-xs font-bold text-blue-500 mb-2 uppercase">Sous-catégorie</label>
        <select {...register('familySubCategory')} className="w-full p-3 bg-white border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm">
          <option value="">Choisir...</option>
          {FAMILY_SUB_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {!isService && (
        <>
          <div>
            <label className="block text-xs font-bold text-blue-500 mb-2 uppercase">Taille / Âge</label>
            <select {...register('familySize')} className="w-full p-3 bg-white border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm">
              <option value="">Choisir...</option>
              {FAMILY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-blue-500 mb-2 uppercase">État</label>
            <select {...register('condition')} className="w-full p-3 bg-white border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm">
              <option value="">Choisir...</option>
              {FASHION_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </>
      )}
    </div>
  );
});

const LoisirsFields = React.memo(({ register }: { register: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-purple-50 rounded-2xl border border-purple-100">
    <div className="md:col-span-2">
      <label className="block text-xs font-bold text-purple-500 mb-2 uppercase">Sous-catégorie</label>
      <select {...register('loisirsSubCategory')} className="w-full p-3 bg-white border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {LOISIRS_SUB_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-purple-500 mb-2 uppercase">État</label>
      <select {...register('condition')} className="w-full p-3 bg-white border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {FASHION_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  </div>
));

const VacationsFields = React.memo(({ register }: { register: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-teal-50 rounded-2xl border border-teal-100">
    <div className="md:col-span-2">
      <label className="block text-xs font-bold text-teal-500 mb-2 uppercase">Sous-catégorie</label>
      <select {...register('vacationsSubCategory')} className="w-full p-3 bg-white border border-teal-100 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {VACATIONS_SUB_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-teal-500 mb-2 uppercase">Type d'hébergement</label>
      <select {...register('accommodationType')} className="w-full p-3 bg-white border border-teal-100 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {VACATION_ACCOMMODATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-teal-500 mb-2 uppercase">Capacité (personnes)</label>
      <input {...register('maxGuests')} type="text" placeholder="Ex: 4" className="w-full p-3 bg-white border border-teal-100 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm" />
    </div>
    <div className="md:col-span-2 space-y-3">
      <label className="block text-xs font-bold text-teal-500 uppercase">Caractéristiques</label>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" {...register('hasPool')} className="w-4 h-4 rounded border-teal-200 text-teal-500 focus:ring-teal-500" />
          <span className="text-sm text-gray-600 group-hover:text-teal-600 transition-colors">Piscine</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" {...register('hasGarden')} className="w-4 h-4 rounded border-teal-200 text-teal-500 focus:ring-teal-500" />
          <span className="text-sm text-gray-600 group-hover:text-teal-600 transition-colors">Jardin</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" {...register('petsAllowed')} className="w-4 h-4 rounded border-teal-200 text-teal-500 focus:ring-teal-500" />
          <span className="text-sm text-gray-600 group-hover:text-teal-600 transition-colors">Animaux acceptés</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" {...register('hasAC')} className="w-4 h-4 rounded border-teal-200 text-teal-500 focus:ring-teal-500" />
          <span className="text-sm text-gray-600 group-hover:text-teal-600 transition-colors">Climatisation</span>
        </label>
      </div>
    </div>
  </div>
));

const JobsServicesFields = React.memo(({ register }: { register: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
    <div className="md:col-span-2">
      <label className="block text-xs font-bold text-indigo-500 mb-2 uppercase">Sous-catégorie</label>
      <select {...register('jobsServicesSubCategory')} className="w-full p-3 bg-white border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {JOBS_SUB_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-indigo-500 mb-2 uppercase">Type de contrat / Prestation</label>
      <select {...register('contractType')} className="w-full p-3 bg-white border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {JOB_CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        <option value="Prestation ponctuelle">Prestation ponctuelle</option>
        <option value="Service régulier">Service régulier</option>
      </select>
    </div>
  </div>
));

const OthersDonationsFields = React.memo(({ register }: { register: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
    <div className="md:col-span-2">
      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Sous-catégorie</label>
      <select {...register('othersDonationsSubCategory')} className="w-full p-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {OTHER_SUB_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">État</label>
      <select {...register('condition')} className="w-full p-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {FASHION_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  </div>
));

const VehicleFields = React.memo(({ register, setValue, control }: { register: any, setValue: any, control: any }) => {
  const selectedBrand = useWatch({
    control,
    name: 'brand'
  });
  
  const subCategory = useWatch({
    control,
    name: 'vehicleSubCategory'
  });

  const isEquipment = subCategory?.startsWith('Équipement');
  const isService = subCategory === 'Services de réparation mécanique';
  const isBike = subCategory === 'Vélos' || subCategory === 'Équipement vélo';
  const isNautisme = subCategory === 'Nautisme' || subCategory === 'Équipement nautisme';
  
  const models = selectedBrand ? VEHICLE_MODELS[selectedBrand] || ['Autre'] : ['Autre'];

  useEffect(() => {
    // Reset model when brand changes
    setValue('model', '');
  }, [selectedBrand, setValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-100">
      <div className="md:col-span-2">
        <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Sous-catégorie</label>
        <select {...register('vehicleSubCategory')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
          <option value="">Choisir...</option>
          {VEHICLE_SUB_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {!isService && (
        <>
          <div>
            <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Marque</label>
            <select {...register('brand')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
              <option value="">Choisir...</option>
              {VEHICLE_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Modèle</label>
            <select {...register('model')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
              <option value="">Choisir...</option>
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </>
      )}

      {(!isEquipment && !isService) && (
        <>
          {!isBike && (
            <div>
              <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Carburant</label>
              <select {...register('fuel')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
                <option value="">Choisir...</option>
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Année</label>
            <input {...register('year', { valueAsNumber: true })} type="number" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">{isNautisme ? 'Heures moteur' : 'Kilométrage'}</label>
            <input {...register('mileage', { valueAsNumber: true })} type="number" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
          </div>
          {(!isBike && !isNautisme) && (
            <div>
              <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Boîte de vitesse</label>
              <select {...register('gearbox')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
                <option value="">Choisir...</option>
                {GEARBOX_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Type de véhicule</label>
            <select {...register('vehicleType')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
              <option value="">Choisir...</option>
              {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {(!isBike && !isNautisme && subCategory !== 'Camions') && (
            <>
              <div>
                <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Portes</label>
                <select {...register('doors')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
                  <option value="">Choisir...</option>
                  {DOORS_COUNT.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Places</label>
                <select {...register('seats')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
                  <option value="">Choisir...</option>
                  {SEATS_COUNT.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Puissance fiscale (CV)</label>
                <input {...register('power', { valueAsNumber: true })} type="number" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
              </div>
            </>
          )}
        </>
      )}

      {!isService && (
        <div>
          <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Couleur</label>
          <select {...register('color')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
            <option value="">Choisir...</option>
            {VEHICLE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">État</label>
        <select {...register('condition')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
          <option value="">Choisir...</option>
          {VEHICLE_CONDITION.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {(!isEquipment && !isService && !isBike && !isNautisme) && (
        <div>
          <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Crit'Air</label>
          <select {...register('critAir')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
            <option value="">Choisir...</option>
            {CRIT_AIR.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      {(!isEquipment && !isService) && (
        <div className="flex items-center gap-2 pt-6">
          <input {...register('firstHand')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
          <label className="text-xs font-bold text-orange-500 uppercase">Première main</label>
        </div>
      )}

      {(!isEquipment && !isService && !isBike && !isNautisme) && (
        <>
          <div className="md:col-span-2 lg:col-span-3 h-px bg-orange-100 my-2" />

          <div>
            <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Contrôle technique (Optionnel)</label>
            <input {...register('technicalControl')} type="text" placeholder="Date de validité" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Distribution (Optionnel)</label>
            <input {...register('timingBelt')} type="text" placeholder="Faite à... km ou date" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Carte grise (Optionnel)</label>
            <select {...register('registrationStatus')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
              <option value="">Choisir...</option>
              <option value="OK">OK</option>
              <option value="En cours">En cours</option>
              <option value="Vendeur non propriétaire">Vendeur non propriétaire</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
});

VehicleFields.displayName = 'VehicleFields';

const RealEstateFields = React.memo(({ register }: { register: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-100">
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Type de transaction</label>
      <select {...register('transactionType')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {REAL_ESTATE_TRANSACTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Type de bien</label>
      <select {...register('realEstateType')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {REAL_ESTATE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Surface habitable (m²)</label>
      <input {...register('surface', { valueAsNumber: true })} type="number" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Surface terrain (m²)</label>
      <input {...register('landSurface', { valueAsNumber: true })} type="number" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Nombre de pièces</label>
      <input {...register('rooms', { valueAsNumber: true })} type="number" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Nombre de chambres</label>
      <input {...register('bedrooms', { valueAsNumber: true })} type="number" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Salles de bain</label>
      <input {...register('bathrooms', { valueAsNumber: true })} type="number" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Étage</label>
      <input {...register('floor', { valueAsNumber: true })} type="number" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Nombre d'étages total</label>
      <input {...register('totalFloors', { valueAsNumber: true })} type="number" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Classe Énergie</label>
      <select {...register('energyClass')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {ENERGY_CLASS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">GES</label>
      <select {...register('ghgClass')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {GHG_CLASS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Chauffage</label>
      <select {...register('heating')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {HEATING_TYPES.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Cuisine</label>
      <select {...register('kitchen')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {KITCHEN_TYPES.map(k => <option key={k} value={k}>{k}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Meublé</label>
      <select {...register('furnished')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {FURNISHED.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
    </div>
    <div className="md:col-span-2 lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      <div className="flex items-center gap-2">
        <input {...register('balcony')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
        <label className="text-xs font-bold text-orange-500 uppercase">Balcon</label>
      </div>
      <div className="flex items-center gap-2">
        <input {...register('terrace')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
        <label className="text-xs font-bold text-orange-500 uppercase">Terrasse</label>
      </div>
      <div className="flex items-center gap-2">
        <input {...register('garden')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
        <label className="text-xs font-bold text-orange-500 uppercase">Jardin</label>
      </div>
      <div className="flex items-center gap-2">
        <input {...register('parking')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
        <label className="text-xs font-bold text-orange-500 uppercase">Parking</label>
      </div>
      <div className="flex items-center gap-2">
        <input {...register('elevator')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
        <label className="text-xs font-bold text-orange-500 uppercase">Ascenseur</label>
      </div>
      <div className="flex items-center gap-2">
        <input {...register('cellar')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
        <label className="text-xs font-bold text-orange-500 uppercase">Cave</label>
      </div>
      <div className="flex items-center gap-2">
        <input {...register('digicode')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
        <label className="text-xs font-bold text-orange-500 uppercase">Digicode</label>
      </div>
      <div className="flex items-center gap-2">
        <input {...register('intercom')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
        <label className="text-xs font-bold text-orange-500 uppercase">Interphone</label>
      </div>
      <div className="flex items-center gap-2">
        <input {...register('guardian')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
        <label className="text-xs font-bold text-orange-500 uppercase">Gardien</label>
      </div>
    </div>
  </div>
));

RealEstateFields.displayName = 'RealEstateFields';

const FashionFields = React.memo(({ register, watch }: { register: any, watch: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-100">
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Univers</label>
      <select {...register('gender')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {FASHION_GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Sous-catégorie</label>
      <select {...register('fashionCategory')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {FASHION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Marque</label>
      <select {...register('fashionBrand')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {FASHION_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
    </div>
    {watch('fashionBrand') === 'Autre' && (
      <div>
        <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Précisez la marque</label>
        <input {...register('customFashionBrand')} type="text" placeholder="Nom de la marque..." className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
      </div>
    )}
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Taille</label>
      <select {...register('size')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        <optgroup label="Vêtements">
          {FASHION_SIZES.clothing.map(s => <option key={s} value={s}>{s}</option>)}
        </optgroup>
        <optgroup label="Chaussures">
          {FASHION_SIZES.shoes.map(s => <option key={s} value={s}>{s}</option>)}
        </optgroup>
        <optgroup label="Bébé">
          {FASHION_SIZES.baby.map(s => <option key={s} value={s}>{s}</option>)}
        </optgroup>
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">État</label>
      <select {...register('condition')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {FASHION_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Matière</label>
      <select {...register('material')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {FASHION_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Couleur</label>
      <select {...register('color')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {VEHICLE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  </div>
));

FashionFields.displayName = 'FashionFields';

const ServiceFields = React.memo(({ register, watch, setValue }: { register: any, watch: any, setValue: any }) => {
  const selectedSubCategory = watch('serviceCategory');
  const isAccommodation = selectedSubCategory?.includes('Vacances & hospitalité');
  const selectedHospitalityType = watch('hospitalityType');
  const selectedLanguages = watch('hospitalityLanguages') || [];
  const selectedAmenities = watch('hospitalityAmenities') || [];
  const selectedInterests = watch('interests') || [];

  const toggleLanguage = (lang: string) => {
    const current = [...selectedLanguages];
    const index = current.indexOf(lang);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(lang);
    }
    setValue('hospitalityLanguages', current);
  };

  const toggleInterest = (interest: string) => {
    const current = [...selectedInterests];
    const index = current.indexOf(interest);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(interest);
    }
    setValue('interests', current);
  };

  const toggleAmenity = (amenity: string) => {
    const current = [...selectedAmenities];
    const index = current.indexOf(amenity);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(amenity);
    }
    setValue('hospitalityAmenities', current);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-100">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Type de service</label>
          <select {...register('serviceCategory')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
            <option value="">Choisir...</option>
            {SERVICE_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {isAccommodation && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                <CheckCircle size={12} /> L'hébergement (Couchsurfing, échange maison) reste 100% gratuit sur PetiTroc.
              </p>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-start gap-2">
                <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 font-bold leading-tight">
                  SÉCURITÉ : Rencontrez la personne avant, vérifiez les avis, ne donnez jamais d'argent à l'avance.
                </p>
              </div>
            </div>
          )}
        </div>

        {isAccommodation && (
          <>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Type d'hospitalité</label>
                <select {...register('hospitalityType')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
                  <option value="">Choisir...</option>
                  {HOSPITALITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              
              {selectedHospitalityType === 'Échange de maison' && (
                <div>
                  <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Période souhaitée</label>
                  <input 
                    {...register('preferredPeriod')} 
                    type="text" 
                    placeholder="Ex: Juillet 2026, Noël..." 
                    className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
                  />
                </div>
              )}

              {(selectedHospitalityType === 'Couchsurfing' || selectedHospitalityType === 'Chambre d\'amis' || selectedHospitalityType === 'Hospitalité ponctuelle') && (
                <div>
                  <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Type d'hébergement</label>
                  <select {...register('accommodationType')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
                    <option value="">Choisir...</option>
                    {ACCOMMODATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Nombre de voyageurs max</label>
                <select {...register('maxGuests')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
                  <option value="">Choisir...</option>
                  {HOSPITALITY_CAPACITY.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Durée max du séjour</label>
                <select {...register('hospitalityDuration')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
                  <option value="">Choisir...</option>
                  {HOSPITALITY_MAX_DURATION.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Animaux acceptés</label>
                <select {...register('petsAllowed')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
                  <option value="">Choisir...</option>
                  {PETS_ALLOWED_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Fumeur accepté</label>
                <select {...register('smokingAllowed')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
                  <option value="">Choisir...</option>
                  {SMOKING_ALLOWED_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Langues parlées</label>
              <div className="flex flex-wrap gap-2">
                {HOSPITALITY_LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedLanguages.includes(lang)
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-orange-100 text-orange-400 hover:bg-orange-50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {selectedHospitalityType === 'Guide local' && (
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Centres d'intérêt</label>
                <div className="flex flex-wrap gap-2">
                  {GUIDE_INTERESTS.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selectedInterests.includes(interest)
                          ? 'bg-orange-500 text-white'
                          : 'bg-white border border-orange-100 text-orange-400 hover:bg-orange-50'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Équipements & Services (Optionnel)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'wifi', label: 'Wifi', icon: 'Wifi' },
                  { id: 'kitchen', label: 'Cuisine', icon: 'Utensils' },
                  { id: 'shower', label: 'Douche', icon: 'ShowerHead' },
                  { id: 'parking', label: 'Parking', icon: 'ParkingCircle' },
                  { id: 'sheets', label: 'Draps fournis', icon: 'Bed' }
                ].map(amenity => (
                  <label key={amenity.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity.label)}
                      onChange={() => toggleAmenity(amenity.label)}
                      className="w-4 h-4 text-orange-500 border-orange-200 rounded focus:ring-orange-500"
                    />
                    <span className="text-xs font-bold text-gray-600 group-hover:text-orange-500 transition-colors uppercase">
                      {amenity.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {!isAccommodation && (
          <div>
            <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Niveau d'expérience</label>
            <select {...register('experience')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
              <option value="">Choisir...</option>
              {SERVICE_EXPERIENCE.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        )}
        <div className="flex flex-col justify-center gap-4">
          <div className="flex items-center gap-2">
            <input {...register('toolsProvided')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
            <label className="text-xs font-bold text-orange-500 uppercase">Matériel fourni</label>
          </div>
          <div className="flex items-center gap-2">
            <input {...register('remoteService')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
            <label className="text-xs font-bold text-orange-500 uppercase">Service à distance possible</label>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Contre quoi ? (Optionnel)</label>
          <input 
            {...register('exchangeFor')} 
            type="text" 
            placeholder="Ex: argent, cours de langue, baby-sitting, etc." 
            className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Disponibilités</label>
          <input 
            {...register('availability')} 
            type="text" 
            placeholder="Ex: lundis et mercredis, week-ends, etc." 
            className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" 
          />
        </div>
      </div>
      
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="text-amber-600 shrink-0" size={20} />
        <div className="text-xs text-amber-800 leading-relaxed">
          <p className="font-black uppercase mb-1">Avertissement de sécurité</p>
          <p>Pour votre sécurité, privilégiez les rencontres dans des lieux publics et informez un proche de votre rendez-vous. Ne partagez jamais vos coordonnées bancaires.</p>
          {isAccommodation && (
            <p className="mt-1 font-bold">Rappel hébergement : Rencontrez la personne avant, vérifiez les avis, ne donnez jamais d'argent à l'avance.</p>
          )}
        </div>
      </div>
    </div>
  );
});

ServiceFields.displayName = 'ServiceFields';

const AnimalFields = React.memo(({ register }: { register: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-100">
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Type d'animal</label>
      <select {...register('animalCategory')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {ANIMAL_CATEGORIES.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Race</label>
      <input {...register('animalBreed')} type="text" placeholder="Ex: Labrador, Siamois..." className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Âge (années)</label>
      <input {...register('animalAge', { valueAsNumber: true })} type="number" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Sexe</label>
      <select {...register('animalGender')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {ANIMAL_GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
      </select>
    </div>
    <div className="md:col-span-2 lg:col-span-2 flex flex-wrap items-center gap-6 pt-4">
      <div className="flex items-center gap-2">
        <input {...register('isVaccinated')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
        <label className="text-xs font-bold text-orange-500 uppercase">Vacciné</label>
      </div>
      <div className="flex items-center gap-2">
        <input {...register('isIdentified')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
        <label className="text-xs font-bold text-orange-500 uppercase">Identifié (Puce/Tatouage)</label>
      </div>
      <div className="flex items-center gap-2">
        <input {...register('isSterilized')} type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
        <label className="text-xs font-bold text-orange-500 uppercase">Stérilisé</label>
      </div>
    </div>
  </div>
));

AnimalFields.displayName = 'AnimalFields';

const HomeGardenFields = React.memo(({ register }: { register: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-100">
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Sous-catégorie</label>
      <select {...register('homeGardenCategory')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {HOME_GARDEN_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">État</label>
      <select {...register('homeGardenCondition')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {HOME_GARDEN_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Matière</label>
      <select {...register('homeGardenMaterial')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {HOME_GARDEN_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>
    <div className="md:col-span-2 lg:col-span-3">
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Dimensions (L x l x H)</label>
      <input {...register('dimensions')} type="text" placeholder="Ex: 120x60x75 cm" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
  </div>
));

HomeGardenFields.displayName = 'HomeGardenFields';

const ElectronicsFields = React.memo(({ register, category, brand }: { register: any, category?: string, brand?: string }) => {
  const availableBrands = category ? (ELECTRONICS_BRANDS[category] || []) : [];
  const availableModels = brand ? (ELECTRONICS_MODELS[brand] || []) : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-100">
      <div>
        <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Sous-catégorie</label>
        <select {...register('electronicsCategory')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
          <option value="">Choisir...</option>
          {ELECTRONICS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Marque</label>
        <select {...register('electronicsBrand')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
          <option value="">Choisir...</option>
          {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
          {category && !availableBrands.includes('Autre') && <option value="Autre">Autre</option>}
          {!category && <option value="Autre">Autre</option>}
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Modèle</label>
        {availableModels.length > 0 ? (
          <select {...register('electronicsModel')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
            <option value="">Choisir...</option>
            {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
            <option value="Autre">Autre</option>
          </select>
        ) : (
          <input {...register('electronicsModel')} type="text" placeholder="Ex: iPhone 13, Galaxy S21..." className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
        )}
      </div>
      <div>
        <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">État</label>
        <select {...register('electronicsCondition')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
          <option value="">Choisir...</option>
          {ELECTRONICS_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {category !== 'Services de réparation électronique' && (
        <>
          <div>
            <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Capacité (Go/To)</label>
            <input {...register('storageCapacity')} type="text" placeholder="Ex: 128 Go, 1 To" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Écran (pouces)</label>
            <input {...register('screenSize')} type="text" placeholder="Ex: 6.1, 15.6" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
          </div>
        </>
      )}
    </div>
  );
});

ElectronicsFields.displayName = 'ElectronicsFields';

const EventFields = React.memo(({ register }: { register: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-100">
    <div className="md:col-span-2">
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Type d'événement</label>
      <select {...register('eventCategory')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Date de l'événement</label>
      <input {...register('eventDate')} type="date" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Heure de l'événement</label>
      <input {...register('eventTime')} type="time" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
  </div>
));

EventFields.displayName = 'EventFields';

const ShopsArtisansFields = React.memo(({ register }: { register: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-100">
    <div className="md:col-span-2">
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Type d'activité</label>
      <select {...register('businessType')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {SHOPS_ARTISANS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Horaires d'ouverture</label>
      <input {...register('openingHours')} type="text" placeholder="Ex: Lun-Ven 9h-18h" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Site web (optionnel)</label>
      <input {...register('website')} type="url" placeholder="https://..." className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div className="md:col-span-2 flex items-center gap-2">
      <input {...register('isPro')} type="checkbox" className="w-4 h-4 rounded border-gray-200 text-orange-500 focus:ring-orange-500" />
      <label className="text-xs font-bold text-gray-700 uppercase">Je suis un professionnel</label>
    </div>
  </div>
));

ShopsArtisansFields.displayName = 'ShopsArtisansFields';

const AssociationsFields = React.memo(({ register }: { register: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-100">
    <div className="md:col-span-2">
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Type d'association</label>
      <select {...register('associationCategory')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm">
        <option value="">Choisir...</option>
        {ASSOCIATIONS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div className="md:col-span-2">
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Mission / Objectif</label>
      <textarea {...register('mission')} rows={3} placeholder="Décrivez brièvement la mission de votre association..." className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm resize-none" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Site web (optionnel)</label>
      <input {...register('website')} type="url" placeholder="https://..." className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Personne à contacter</label>
      <input {...register('contactPerson')} type="text" placeholder="Nom du responsable..." className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Email de contact</label>
      <input {...register('contactEmail')} type="email" placeholder="email@association.fr" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase">Téléphone de contact</label>
      <input {...register('contactPhone')} type="tel" placeholder="06 00 00 00 00" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" />
    </div>
  </div>
));

AssociationsFields.displayName = 'AssociationsFields';

const WeddingFields = React.memo(({ register }: { register: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-100">
    <div className="md:col-span-2">
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase tracking-widest">Type de prestation / objet</label>
      <select {...register('weddingSubCategory')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold">
        <option value="">Choisir une sous-catégorie...</option>
        {WEDDING_SUB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase tracking-widest">État</label>
      <select {...register('condition')} className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold">
        <option value="">Choisir...</option>
        <option value="Neuf">Neuf</option>
        <option value="Comme neuf">Comme neuf</option>
        <option value="Très bon état">Très bon état</option>
        <option value="Bon état">Bon état</option>
        <option value="Satisfaisant">Satisfaisant</option>
        <option value="Disponible">Disponible (Prestation)</option>
        <option value="Sur réservation">Sur réservation</option>
      </select>
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase tracking-widest">Taille (Robes/Acc.)</label>
      <input {...register('size')} type="text" placeholder="Ex: 38, M, 40..." className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase tracking-widest">Date de l'événement</label>
      <input {...register('eventDate')} type="date" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold" />
    </div>
    <div>
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase tracking-widest">Prix d'origine (€)</label>
      <input {...register('originalPrice', { valueAsNumber: true })} type="number" placeholder="Ex: 1200" className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold" />
    </div>
    <div className="md:col-span-2">
      <label className="block text-xs font-bold text-orange-500 mb-2 uppercase tracking-widest">Lieu de la prestation</label>
      <input {...register('availability')} type="text" placeholder="Ex: Toute la France, Région PACA..." className="w-full p-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold" />
    </div>
    <div className="flex gap-4 md:col-span-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input {...register('isVintage')} type="checkbox" className="w-4 h-4 text-orange-500 border-orange-100 rounded focus:ring-orange-500" />
        <span className="text-sm font-bold text-gray-700">Vintage</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input {...register('isDesigner')} type="checkbox" className="w-4 h-4 text-orange-500 border-orange-100 rounded focus:ring-orange-500" />
        <span className="text-sm font-bold text-gray-700">Créateur</span>
      </label>
    </div>
  </div>
));

WeddingFields.displayName = 'WeddingFields';

export const AdForm = React.memo(({ onSuccess, initialData }: { onSuccess: () => void, initialData?: Ad }) => {
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(
    initialData?.location?.lat && initialData?.location?.lng 
      ? { lat: initialData.location.lat, lng: initialData.location.lng } 
      : null
  );
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: initialData ? {
      ...initialData.details,
      title: initialData.title,
      description: initialData.description,
      category: initialData.category,
      type: initialData.type,
      price: initialData.price,
      city: initialData.location?.city || '',
      zipCode: initialData.location?.zipCode || '',
      isPro: initialData.details?.isPro || false,
      fashionBrand: initialData.details?.fashionBrand && !FASHION_BRANDS.includes(initialData.details.fashionBrand) ? 'Autre' : (initialData.details?.fashionBrand || ''),
      customFashionBrand: initialData.details?.fashionBrand && !FASHION_BRANDS.includes(initialData.details.fashionBrand) ? initialData.details.fashionBrand : '',
      firstHand: initialData.details?.firstHand === 'Oui',
      balcony: initialData.details?.balcony === 'Oui',
      terrace: initialData.details?.terrace === 'Oui',
      garden: initialData.details?.garden === 'Oui',
      parking: initialData.details?.parking === 'Oui',
      elevator: initialData.details?.elevator === 'Oui',
      cellar: initialData.details?.cellar === 'Oui',
      digicode: initialData.details?.digicode === 'Oui',
      intercom: initialData.details?.intercom === 'Oui',
      guardian: initialData.details?.guardian === 'Oui',
      toolsProvided: initialData.details?.toolsProvided === 'Oui',
      remoteService: initialData.details?.remoteService === 'Oui',
      isVaccinated: initialData.details?.isVaccinated === 'Oui',
      isIdentified: initialData.details?.isIdentified === 'Oui',
      isSterilized: initialData.details?.isSterilized === 'Oui',
      exchangeFor: initialData.details?.exchangeFor || '',
      availability: initialData.details?.availability || '',
      hospitalityType: initialData.details?.hospitalityType || '',
      hospitalityCapacity: initialData.details?.hospitalityCapacity || '',
      hospitalityAmenities: initialData.details?.hospitalityAmenities || [],
      hospitalityLanguages: initialData.details?.hospitalityLanguages || [],
      hospitalityDuration: initialData.details?.hospitalityDuration || '',
      accommodationType: initialData.details?.accommodationType || '',
      maxGuests: initialData.details?.maxGuests || '',
      petsAllowed: initialData.details?.petsAllowed || '',
      smokingAllowed: initialData.details?.smokingAllowed || '',
      preferredPeriod: initialData.details?.preferredPeriod || '',
      interests: initialData.details?.interests || [],
      technicalControl: initialData.details?.technicalControl || '',
      timingBelt: initialData.details?.timingBelt || '',
      registrationStatus: initialData.details?.registrationStatus || '',
      weddingSubCategory: initialData.details?.weddingSubCategory || '',
      originalPrice: initialData.details?.originalPrice || undefined,
      isVintage: initialData.details?.isVintage || false,
      isDesigner: initialData.details?.isDesigner || false,
      eventDate: initialData.details?.eventDate || '',
      size: initialData.details?.size || '',
      familySubCategory: initialData.details?.familySubCategory || '',
      loisirsSubCategory: initialData.details?.loisirsSubCategory || '',
      vacationsSubCategory: initialData.details?.vacationsSubCategory || '',
      jobsSubCategory: initialData.details?.jobsSubCategory || '',
      jobsServicesSubCategory: initialData.details?.jobsServicesSubCategory || '',
      othersDonationsSubCategory: initialData.details?.othersDonationsSubCategory || '',
      contractType: initialData.details?.contractType || '',
      familySize: initialData.details?.familySize || '',
    } : {
      title: '',
      description: '',
      category: 'family',
      type: 'offer',
      city: '',
      zipCode: '',
      price: undefined,
      isPro: false
    }
  });

  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.isProfessional && !initialData) {
      setValue('isPro', true);
    }
  }, [profile, initialData, setValue]);

  // Debug: Log errors whenever they change
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Log only the keys and messages to avoid circular references
      const errorSummary = Object.entries(errors).reduce((acc, [key, value]) => {
        acc[key] = (value as any)?.message;
        return acc;
      }, {} as any);
      console.log("Current form validation errors:", errorSummary);
    }
  }, [errors]);

  const selectedCategory = watch('category');
  const electronicsCategory = watch('electronicsCategory');
  const electronicsBrand = watch('electronicsBrand');

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSelectingSuggestion, setIsSelectingSuggestion] = useState(false);

  const cityValue = watch('city');
  const zipCodeValue = watch('zipCode');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (isSelectingSuggestion) {
        setIsSelectingSuggestion(false);
        return;
      }

      const query = cityValue || zipCodeValue;
      if (query && query.length >= 2) {
        const suggestions = await fetchAddressSuggestions(query);
        setAddressSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [cityValue, zipCodeValue, isSelectingSuggestion]);

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    setIsSelectingSuggestion(true);
    setValue('city', suggestion.city);
    setValue('zipCode', suggestion.postcode);
    setSelectedLocation({
      lat: suggestion.coordinates[1],
      lng: suggestion.coordinates[0]
    });
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  const selectedCategoryData = CATEGORIES.find(c => c.id === selectedCategory);

  const onSubmit = async (data: AdFormValues) => {
    // console.log("onSubmit called with data:", data);
    console.log("Starting onSubmit process...");
    
    if (!auth.currentUser) {
      console.log("No current user, returning");
      toast.error("Vous devez être connecté pour publier une annonce.");
      return;
    }
    
    setLoading(true);

    try {
      console.log("Preparing details...");
      const details: Record<string, any> = {};
      if (data.category === 'vehicles') {
        details.vehicleSubCategory = data.vehicleSubCategory;
        details.brand = data.brand;
        details.model = data.model;
        details.year = data.year;
        details.fuel = data.fuel;
        details.mileage = data.mileage;
        details.gearbox = data.gearbox;
        details.vehicleType = data.vehicleType;
        details.doors = data.doors;
        details.seats = data.seats;
        details.power = data.power;
        details.color = data.color;
        details.condition = data.condition;
        details.critAir = data.critAir;
        details.firstHand = data.firstHand ? 'Oui' : 'Non';
        details.technicalControl = data.technicalControl;
        details.timingBelt = data.timingBelt;
        details.registrationStatus = data.registrationStatus;
      } else if (data.category === 'real-estate') {
        details.transactionType = data.transactionType;
        details.realEstateType = data.realEstateType;
        details.rooms = data.rooms;
        details.bedrooms = data.bedrooms;
        details.bathrooms = data.bathrooms;
        details.surface = data.surface;
        details.landSurface = data.landSurface;
        details.floor = data.floor;
        details.totalFloors = data.totalFloors;
        details.energyClass = data.energyClass;
        details.ghgClass = data.ghgClass;
        details.heating = data.heating;
        details.kitchen = data.kitchen;
        details.furnished = data.furnished;
        details.balcony = data.balcony ? 'Oui' : 'Non';
        details.terrace = data.terrace ? 'Oui' : 'Non';
        details.garden = data.garden ? 'Oui' : 'Non';
        details.parking = data.parking ? 'Oui' : 'Non';
        details.elevator = data.elevator ? 'Oui' : 'Non';
        details.cellar = data.cellar ? 'Oui' : 'Non';
        details.digicode = data.digicode ? 'Oui' : 'Non';
        details.intercom = data.intercom ? 'Oui' : 'Non';
        details.guardian = data.guardian ? 'Oui' : 'Non';
      } else if (data.category === 'fashion') {
        details.size = data.size;
        details.gender = data.gender;
        details.material = data.material;
        details.fashionBrand = data.fashionBrand === 'Autre' ? data.customFashionBrand : data.fashionBrand;
        details.fashionCategory = data.fashionCategory;
        details.condition = data.condition;
        details.color = data.color;
      } else if (data.category === 'services') {
        details.serviceCategory = data.serviceCategory;
        details.experience = data.experience;
        details.toolsProvided = data.toolsProvided ? 'Oui' : 'Non';
        details.remoteService = data.remoteService ? 'Oui' : 'Non';
        details.exchangeFor = data.exchangeFor;
        details.availability = data.availability;
        if (data.serviceCategory?.includes('Vacances & hospitalité')) {
          details.hospitalityType = data.hospitalityType;
          details.hospitalityCapacity = data.hospitalityCapacity;
          details.hospitalityAmenities = data.hospitalityAmenities;
          details.hospitalityLanguages = data.hospitalityLanguages;
          details.hospitalityDuration = data.hospitalityDuration;
          details.accommodationType = data.accommodationType;
          details.maxGuests = data.maxGuests;
          details.petsAllowed = data.petsAllowed;
          details.smokingAllowed = data.smokingAllowed;
          details.preferredPeriod = data.preferredPeriod;
          details.interests = data.interests;
        }
      } else if (data.category === 'animals') {
        details.animalCategory = data.animalCategory;
        details.animalBreed = data.animalBreed;
        details.animalAge = data.animalAge;
        details.animalGender = data.animalGender;
        details.isVaccinated = data.isVaccinated ? 'Oui' : 'Non';
        details.isIdentified = data.isIdentified ? 'Oui' : 'Non';
        details.isSterilized = data.isSterilized ? 'Oui' : 'Non';
      } else if (data.category === 'home-garden') {
        details.homeGardenCategory = data.homeGardenCategory;
        details.homeGardenCondition = data.homeGardenCondition;
        details.homeGardenMaterial = data.homeGardenMaterial;
        details.dimensions = data.dimensions;
      } else if (data.category === 'electronics') {
        details.electronicsCategory = data.electronicsCategory;
        details.electronicsBrand = data.electronicsBrand;
        details.electronicsModel = data.electronicsModel;
        details.electronicsCondition = data.electronicsCondition;
        details.storageCapacity = data.storageCapacity;
        details.ramSize = data.ramSize;
        details.screenSize = data.screenSize;
      } else if (data.category === 'events') {
        details.eventCategory = data.eventCategory;
        details.eventDate = data.eventDate;
        details.eventTime = data.eventTime;
      } else if (data.category === 'shops-artisans') {
        details.businessType = data.businessType;
        details.openingHours = data.openingHours;
        details.website = data.website;
      } else if (data.category === 'associations') {
        details.associationCategory = data.associationCategory;
        details.mission = data.mission;
        details.website = data.website;
        details.contactPerson = data.contactPerson;
        details.contactEmail = data.contactEmail;
        details.contactPhone = data.contactPhone;
      } else if (data.category === 'wedding') {
        details.weddingSubCategory = data.weddingSubCategory;
        details.condition = data.condition;
        details.availability = data.availability;
      } else if (data.category === 'family') {
        details.familySubCategory = data.familySubCategory;
        details.familySize = data.familySize;
        details.condition = data.condition;
      } else if (data.category === 'loisirs') {
        details.loisirsSubCategory = data.loisirsSubCategory;
        details.condition = data.condition;
      } else if (data.category === 'vacations') {
        details.vacationsSubCategory = data.vacationsSubCategory;
        details.accommodationType = data.accommodationType;
        details.maxGuests = data.maxGuests;
      } else if (data.category === 'jobs-services') {
        details.jobsServicesSubCategory = data.jobsServicesSubCategory;
        details.contractType = data.contractType;
      } else if (data.category === 'others-donations') {
        details.othersDonationsSubCategory = data.othersDonationsSubCategory;
        details.condition = data.condition;
      }

      // Common details
      details.isPro = data.isPro;

      // Clean up empty details (undefined, null, empty string)
      Object.keys(details).forEach(key => {
        if (details[key] === undefined || details[key] === null || details[key] === '') {
          delete details[key];
        }
      });

      // Anti-spam filter
      if (containsForbiddenWords(data.title) || containsForbiddenWords(data.description)) {
        toast.error('Votre annonce contient des mots interdits. Veuillez les retirer.');
        sendAdminAlert(
          'Tentative de publication suspecte (mots interdits)',
          `L'utilisateur ${auth.currentUser?.email} (${auth.currentUser?.uid}) a tenté de publier une annonce contenant des mots interdits.\n\nTitre: ${data.title}\nDescription: ${data.description}`
        );
        setLoading(false);
        return;
      }

      // Daily limit check (5 ads per day)
      if (!initialData?.id) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const adsQuery = query(
          collection(db, 'ads'),
          where('authorId', '==', auth.currentUser?.uid),
          where('createdAt', '>=', today.toISOString())
        );
        
        const adsSnapshot = await getDocs(adsQuery);
        if (adsSnapshot.size >= 5) {
          toast.error('Vous avez atteint votre limite de publications aujourd\'hui (max 5 par jour).');
          setLoading(false);
          return;
        }
      }

      console.log("Calculating duplicateHash...");
      // Safer way to handle non-ASCII characters for btoa
      const hashInput = `${data.title.substring(0, 30)}-${data.description.substring(0, 30)}-${auth.currentUser.uid}`;
      const duplicateHash = btoa(unescape(encodeURIComponent(hashInput)));
      
      console.log("Submitting ad with hash:", duplicateHash);
      
      // Check for duplicate ads (same title, description snippet, and user)
      if (!initialData?.id) {
        console.log("Checking for duplicate ads...");
        const duplicateQuery = query(
          collection(db, 'ads'),
          where('duplicateHash', '==', duplicateHash),
          limit(1)
        );
        const duplicateSnapshot = await getDocs(duplicateQuery);
        console.log("Duplicate check finished, empty:", duplicateSnapshot.empty);
        if (!duplicateSnapshot.empty) {
          toast.warning("Vous avez déjà publié une annonce identique récemment.");
          setLoading(false);
          return;
        }
      }
      
      // Check for duplicate photos
      if (images.length > 0) {
        console.log("Checking for duplicate photos...");
        const q = query(
          collection(db, 'ads'), 
          where('images', 'array-contains-any', images),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        console.log("Photo duplicate check finished, empty:", querySnapshot.empty);
        if (!querySnapshot.empty) {
          toast.warning("Désolé, une ou plusieurs de ces photos sont déjà utilisées dans une autre annonce. Les doublons ne sont pas autorisés.");
          setLoading(false);
          return;
        }
      }

      const now = new Date();
      const expiresAt = initialData?.expiresAt || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now

      if (initialData?.id) {
        console.log("Updating existing ad:", initialData.id);
        await updateDoc(doc(db, 'ads', initialData.id), {
          title: data.title,
          description: data.description,
          category: data.category,
          type: data.type,
          price: data.price ?? 0,
          images: images.length > 0 ? images : ['https://picsum.photos/seed/troc/800/600'],
          location: {
            city: data.city,
            zipCode: data.zipCode,
            lat: selectedLocation?.lat || initialData.location?.lat || 48.8566,
            lng: selectedLocation?.lng || initialData.location?.lng || 2.3522
          },
          details,
          updatedAt: now.toISOString(),
          duplicateHash
        });
      } else {
        // Fetch user profile to get verification status
        console.log("Creating new ad, fetching user verification status...");
        let authorIsVerified = false;
        try {
          const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userSnap.exists()) {
            authorIsVerified = userSnap.data().isVerified || false;
          }
        } catch (e) {
          console.error("Error fetching user verification status:", e);
        }

        console.log("Adding document to Firestore...");
        await addDoc(collection(db, 'ads'), {
          authorId: auth.currentUser.uid,
          userName: auth.currentUser.displayName || 'Utilisateur',
          authorIsVerified,
          title: data.title,
          description: data.description,
          category: data.category,
          type: data.type,
          price: data.price ?? 0,
          images: images.length > 0 ? images : ['https://picsum.photos/seed/troc/800/600'],
          location: {
            city: data.city,
            zipCode: data.zipCode,
            lat: selectedLocation?.lat || 48.8566,
            lng: selectedLocation?.lng || 2.3522
          },
          details,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          expiresAt,
          status: 'active',
          duplicateHash
        });
        console.log("Document added successfully!");
      }

      console.log("Ad submission success, calling onSuccess...");
      onSuccess();
      toast.success(initialData?.id ? "Annonce mise à jour avec succès !" : "Annonce publiée avec succès !");
      setSubmissionError(null);
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Ad submission failure caught in onSubmit try-catch:", errorMsg);
      const displayError = error.response?.data?.message || "Une erreur est survenue lors de la publication de l'annonce.";
      setSubmissionError(displayError);
      toast.error(displayError);
      handleFirestoreError(error, initialData?.id ? OperationType.UPDATE : OperationType.CREATE, 'ads');
    } finally {
      console.log("onSubmit process finished (finally)");
      setLoading(false);
    }
  };

  const handleImageAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const remainingSlots = 6 - images.length;
    const selectedFiles = Array.from(files).slice(0, remainingSlots) as File[];
    
    // Check file sizes
    const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toast.error(`Photo trop lourde, max 5 Mo. (${oversizedFiles.length} photo(s) rejetée(s))`);
    }
    
    const filesToProcess = selectedFiles.filter(file => file.size <= MAX_FILE_SIZE);
    if (filesToProcess.length === 0) {
      e.target.value = '';
      return;
    }
    
    setLoading(true);
    try {
      const compressedImages = await Promise.all(
        filesToProcess.map(file => compressImage(file))
      );
      
      let finalImages = compressedImages;
      
      // If category is vehicles, detect and blur license plates
      const selectedCategory = watch('category');
      if (selectedCategory === 'vehicles') {
        finalImages = await Promise.all(
          compressedImages.map(async (img) => {
            const plates = await detectLicensePlates(img);
            if (plates.length > 0) {
              return await blurRegion(img, plates);
            }
            return img;
          })
        );
      }
      
      setImages(prev => [...prev, ...finalImages]);
    } catch (error) {
      console.error('Error compressing images:', error);
      toast.error('Erreur lors du traitement des images.');
    } finally {
      setLoading(false);
      e.target.value = ''; // Reset input
    }
  };

  const removeImage = React.useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <form 
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.type !== 'textarea') {
          // Prevent accidental submission on enter in inputs, but allow in textareas
          // Actually, let's just log it
          console.log("Enter key pressed in form");
        }
      }}
      onSubmit={(e) => {
        console.log('ÉTAPE 1 : bouton cliqué');
        console.log("Form onSubmit triggered");
        setSubmissionError(null);
        handleSubmit((data) => {
          console.log("Form validation success, raw data:", data);
          toast.info("Validation réussie, traitement de l'annonce...");
          onSubmit(data);
        }, (errors) => {
          const errorSummary = Object.entries(errors).reduce((acc, [key, value]) => {
            acc[key] = (value as any)?.message;
            return acc;
          }, {} as any);
          console.log("Form validation errors (in handleSubmit):", errorSummary);
          const firstError = Object.values(errors)[0] as any;
          toast.error(`Erreur de validation: ${firstError?.message || "Veuillez vérifier les champs."}`);
        })(e);
      }}
      className="space-y-8"
    >
      {submissionError && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3 text-red-700 font-bold"
        >
          <X className="w-5 h-5" />
          <p>{submissionError}</p>
        </motion.div>
      )}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
              Titre de l'annonce <span className="text-red-500">*</span>
            </label>
            <input 
              {...register('title')}
              type="text" 
              placeholder="Ex: Renault Clio 4, iPhone 13..." 
              className="w-full p-4 bg-white border border-orange-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium" 
            />
            {errors.title && <p className="text-red-500 text-xs mt-1 font-bold">{errors.title.message}</p>}
          </div>

          <div className="flex justify-end -mb-4 opacity-50 hover:opacity-100 transition-opacity gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input 
                type="checkbox"
                checked={watch('isPro')}
                onChange={(e) => setValue('isPro', e.target.checked)}
                className="w-3 h-3 rounded border-gray-200 text-orange-500 focus:ring-orange-500 cursor-pointer transition-all"
              />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                Annonce Professionnelle
              </span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input 
                type="checkbox"
                checked={watch('type') === 'seek'}
                onChange={(e) => setValue('type', e.target.checked ? 'seek' : 'offer')}
                className="w-3 h-3 rounded border-gray-200 text-orange-500 focus:ring-orange-500 cursor-pointer transition-all"
              />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                Je recherche cet objet
              </span>
            </label>
          </div>

          <div className="relative">
            <label className="block text-sm font-black text-orange-500 mb-2 uppercase tracking-wider">
              Catégorie <span className="text-red-500">*</span>
            </label>
            
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className={`w-full flex items-center justify-between p-4 bg-white border-2 rounded-2xl transition-all duration-300 ${
                isCategoryOpen ? 'border-orange-500 ring-4 ring-orange-50' : 'border-orange-100 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <CategoryIcon id={selectedCategory || 'vehicles'} className="text-orange-500 w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Sélectionné</p>
                  <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                    {selectedCategoryData?.label || 'Choisir une catégorie'}
                  </p>
                </div>
              </div>
              <ChevronDown className={`text-orange-500 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} size={20} />
            </button>

            <AnimatePresence>
              {isCategoryOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsCategoryOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 right-0 mt-2 bg-white border border-orange-100 rounded-3xl shadow-2xl shadow-orange-200/50 z-50 overflow-hidden"
                  >
                    <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setValue('category', cat.id as any);
                            setIsCategoryOpen(false);
                          }}
                          className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group ${
                            selectedCategory === cat.id 
                              ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' 
                              : 'hover:bg-orange-50 text-gray-700'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            selectedCategory === cat.id ? 'bg-white/20' : 'bg-orange-50 group-hover:bg-white'
                          }`}>
                            <CategoryIcon 
                              id={cat.id} 
                              className={`w-5 h-5 ${selectedCategory === cat.id ? 'text-white' : 'text-orange-500'}`} 
                            />
                          </div>
                          <span className={`text-xs font-black uppercase tracking-tight ${
                            selectedCategory === cat.id ? 'text-white' : 'text-gray-700'
                          }`}>
                            {cat.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            
            <input type="hidden" {...register('category')} />
            <input type="hidden" {...register('type')} />
            {errors.category && <p className="text-red-500 text-xs mt-2 font-bold">{errors.category.message}</p>}
          </div>

          {/* Category Specific Fields */}
          {selectedCategory === 'vehicles' && <VehicleFields register={register} setValue={setValue} control={control} />}
          {selectedCategory === 'real-estate' && <RealEstateFields register={register} />}
          {selectedCategory === 'fashion' && <FashionFields register={register} watch={watch} />}
          {selectedCategory === 'services' && <ServiceFields register={register} watch={watch} setValue={setValue} />}
          {selectedCategory === 'animals' && <AnimalFields register={register} />}
          {selectedCategory === 'home-garden' && <HomeGardenFields register={register} />}
          {selectedCategory === 'electronics' && (
            <ElectronicsFields 
              register={register} 
              category={electronicsCategory} 
              brand={electronicsBrand} 
            />
          )}
          {selectedCategory === 'events' && <EventFields register={register} />}
          {selectedCategory === 'shops-artisans' && <ShopsArtisansFields register={register} />}
          {selectedCategory === 'associations' && <AssociationsFields register={register} />}
          {selectedCategory === 'wedding' && <WeddingFields register={register} />}
          {selectedCategory === 'family' && <FamilyFields register={register} watch={watch} />}
          {selectedCategory === 'loisirs' && <LoisirsFields register={register} />}
          {selectedCategory === 'vacations' && <VacationsFields register={register} />}
          {selectedCategory === 'jobs-services' && <JobsServicesFields register={register} />}
          {selectedCategory === 'others-donations' && <OthersDonationsFields register={register} />}

          <div>
            <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea 
              {...register('description')}
              rows={6} 
              placeholder="Décrivez votre objet en détail..." 
              className="w-full p-4 bg-white border border-orange-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium resize-none"
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1 font-bold">{errors.description.message}</p>}
          </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                      Ville <span className="text-red-500">*</span>
                    </label>
                    <input 
                      {...register('city')}
                      type="text" 
                      placeholder="Paris..." 
                      autoComplete="off"
                      className="w-full p-4 bg-white border border-orange-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium" 
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1 font-bold">{errors.city.message}</p>}
                    
                    {showSuggestions && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowSuggestions(false)} 
                        />
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                          {addressSuggestions.map((s, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSelectSuggestion(s)}
                              className="w-full text-left p-4 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0"
                            >
                              <p className="text-sm font-black text-gray-900">{s.city}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.postcode} - {s.context}</p>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                      CP <span className="text-red-500">*</span>
                    </label>
                    <input 
                      {...register('zipCode')}
                      type="text" 
                      placeholder="75000" 
                      autoComplete="off"
                      className="w-full p-4 bg-white border border-orange-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium" 
                    />
                    {errors.zipCode && <p className="text-red-500 text-xs mt-1 font-bold">{errors.zipCode.message}</p>}
                  </div>
              </div>

          <div>
            <label className="block text-sm font-black text-gray-700 mb-4 uppercase tracking-wider flex items-center justify-between">
              Photos (Max 6)
              <span className="text-xs font-bold text-orange-500">{images.length}/6</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  <button 
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <label 
                  className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 cursor-pointer transition-all"
                >
                  <Camera size={24} />
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageAdd}
                    disabled={loading}
                  />
                </label>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-2 font-bold italic">
              Les images sont automatiquement optimisées. Pour les véhicules, les plaques d'immatriculation sont floutées par IA.
            </p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            onClick={() => console.log("Submit button clicked, loading state:", loading)}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Valider mon annonce'}
          </button>
          <p className="text-[10px] text-center text-gray-400 mt-4 font-bold uppercase tracking-widest">
            Ce site est protégé par reCAPTCHA et les <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-500 transition-colors">Règles de confidentialité</a> et <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-500 transition-colors">Conditions d'utilisation</a> de Google s'appliquent.
          </p>
        </div>
      </div>
    </form>
  );
});

AdForm.displayName = 'AdForm';
