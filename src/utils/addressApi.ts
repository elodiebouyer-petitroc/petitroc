import axios from 'axios';

export interface AddressSuggestion {
  label: string;
  city: string;
  postcode: string;
  context: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export async function fetchAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&type=municipality&limit=5`);
    return response.data.features.map((feature: any) => ({
      label: feature.properties.label,
      city: feature.properties.city,
      postcode: feature.properties.postcode,
      context: feature.properties.context,
      coordinates: feature.geometry.coordinates,
    }));
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return [];
  }
}
