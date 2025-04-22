import { Destination } from '../types';

export const destinationsData: Destination[] = [
  {
    id: 'usambara-mountains',
    name: 'Usambara Mountains',
    image: 'https://images.unsplash.com/photo-1489493512598-d08130f49bea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    description: 'Known as the "Galapagos of Africa", the Usambara Mountains offer ancient rainforests, panoramic views, and a cool climate. Perfect for hiking, mountain biking, and cultural tours, with rich biodiversity and traditional villages.',
    latitude: -4.7,
    longitude: 38.3,
    tourTypes: ['hiking', 'cycling', 'cultural'],
    highlights: [
      'Ancient rainforest trails',
      'Panoramic viewpoints',
      'Traditional village visits',
      'Unique flora and fauna',
      'Tea plantations'
    ]
  },
  {
    id: 'serengeti',
    name: 'Serengeti National Park',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Home to the spectacular Great Migration, Serengeti National Park is one of Africa\'s most famous wildlife destinations. Vast plains, incredible biodiversity, and stunning sunsets make it an unforgettable safari experience.',
    latitude: -2.3333333,
    longitude: 34.8333333,
    tourTypes: ['wildlife', '4x4'],
    highlights: [
      'Great Migration',
      'Big Five wildlife',
      'Balloon safaris',
      'Savanna landscapes',
      'Maasai culture'
    ]
  },
  {
    id: 'zanzibar',
    name: 'Zanzibar Island',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    description: 'This tropical paradise features crystal clear waters, white sand beaches, and the historic Stone Town. Zanzibar blends Arabic, African, Indian, and European influences in its architecture, cuisine, and culture.',
    latitude: -6.1359,
    longitude: 39.3621,
    tourTypes: ['cultural', 'beach'],
    highlights: [
      'Stone Town UNESCO site',
      'Pristine beaches',
      'Spice tours',
      'Snorkeling & diving',
      'Seafood cuisine'
    ]
  },
  {
    id: 'kilimanjaro',
    name: 'Mount Kilimanjaro',
    image: 'https://images.unsplash.com/photo-1521150932951-303a95503ed3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    description: 'Africa\'s highest peak and the world\'s tallest free-standing mountain offers a challenging yet accessible climb through five distinct ecological zones. A bucket-list adventure for trekkers and mountaineers.',
    latitude: -3.0674,
    longitude: 37.3556,
    tourTypes: ['hiking', 'mountaineering'],
    highlights: [
      'Summit at Uhuru Peak',
      'Five distinct climate zones',
      'Stunning glaciers',
      'Diverse ecosystems',
      'Incredible sunrise views'
    ]
  },
  {
    id: 'lushoto',
    name: 'Lushoto Valley',
    image: 'https://images.unsplash.com/photo-1535912268533-50a5df5730a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80',
    description: 'Located in the heart of the Usambara Mountains, Lushoto Valley features lush forests, picturesque villages, and a perfect climate. Its German colonial history adds a unique architectural touch to this scenic retreat.',
    latitude: -4.7839,
    longitude: 38.2931,
    tourTypes: ['hiking', 'cultural', 'cycling'],
    highlights: [
      'Irente viewpoint',
      'German colonial architecture',
      'Lush valleys and forests',
      'Local markets',
      'Mountain biking trails'
    ]
  },
  {
    id: 'amani-nature-reserve',
    name: 'Amani Nature Reserve',
    image: 'https://images.unsplash.com/photo-1552057426-9f23e61fa7b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    description: 'A biodiversity hotspot within the East Usambara Mountains, Amani Nature Reserve protects rare and endemic species. Dense rainforests, crystal-clear streams, and butterfly farms make it a nature lover\'s paradise.',
    latitude: -5.1061,
    longitude: 38.6363,
    tourTypes: ['hiking', 'wildlife', 'cycling'],
    highlights: [
      'Biodiversity hotspot',
      'Butterfly farms',
      'Tea plantations',
      'Research center',
      'Bird watching'
    ]
  },
  {
    id: 'tanga-beaches',
    name: 'Tanga Coastal Area',
    image: 'https://images.unsplash.com/photo-1562768565-af6f60892f99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    description: 'The coastline near Tanga offers pristine beaches, historic sites, and mangrove forests. Less crowded than other coastal areas, it\'s perfect for those seeking an authentic experience away from mass tourism.',
    latitude: -5.0699,
    longitude: 39.1027,
    tourTypes: ['beach', 'cultural', '4x4'],
    highlights: [
      'Pristine beaches',
      'Mangrove forests',
      'Historical sites',
      'Fresh seafood',
      'Local fishing villages'
    ]
  },
  {
    id: 'magoroto-forest',
    name: 'Magoroto Forest',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'A hidden gem in the East Usambara Mountains, Magoroto Forest offers pristine rainforest experiences, hiking trails, and spectacular views. The area features a beautiful crater lake and diverse wildlife.',
    latitude: -5.1164,
    longitude: 38.7554,
    tourTypes: ['hiking', 'camping', 'event'],
    highlights: [
      'Crater lake',
      'Rainforest trails',
      'Camping opportunities',
      'Festival venue',
      'Bird watching'
    ]
  }
];

export const getDestinationById = (id: string): Destination | undefined => {
  return destinationsData.find(destination => destination.id === id);
};