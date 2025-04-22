import { FeaturedItem } from '../types/tours';

export const toursData: FeaturedItem[] = [
  // MTB Cycling Tours
  {
    id: 'mtb-001',
    title: 'Usambara Mountains MTB Adventure',
    duration: '3 days',
    price: 299,
    location: 'Usambara Mountains',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    description: 'Experience the thrill of mountain biking through the stunning Usambara Mountains. This 3-day adventure combines challenging trails, breathtaking views, and cultural encounters.',
    category: 'cycling',
    type: 'tour',
    difficulty: 'moderate',
    groupSize: { min: 4, max: 12 },
    startLocation: 'Lushoto',
    endLocation: 'Lushoto',
    highlights: [
      'Technical single-track trails',
      'Panoramic mountain views',
      'Local village visits',
      'Professional MTB guides'
    ],
    requirements: [
      'Intermediate mountain biking skills',
      'Good physical fitness',
      'Own or rental MTB gear'
    ],
    included: [
      'Professional MTB guide',
      'Support vehicle',
      'All meals during the tour',
      'Accommodation (2 nights)',
      'Water and snacks',
      'First aid kit'
    ],
    excluded: [
      'Mountain bike rental',
      'Personal gear and equipment',
      'Travel insurance',
      'Personal expenses'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Warm-up Ride',
        description: 'Arrive in Lushoto, bike fitting, and afternoon warm-up ride to nearby viewpoints.',
        activities: ['Bike fitting', 'Safety briefing', 'Warm-up ride'],
        meals: ['lunch', 'dinner'],
        accommodation: 'Lushoto Valley Lodge',
        distance: '15km',
        elevation: '+300m/-200m'
      },
      {
        day: 2,
        title: 'Mountain Trail Adventure',
        description: 'Full day of mountain biking through challenging trails and scenic routes.',
        activities: ['Technical trail riding', 'Village visit', 'Scenic photography'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Mountain Camp',
        distance: '35km',
        elevation: '+800m/-600m'
      },
      {
        day: 3,
        title: 'Descent & Departure',
        description: 'Morning ride with spectacular descents before returning to Lushoto.',
        activities: ['Downhill trails', 'Final ride', 'Departure'],
        meals: ['breakfast', 'lunch'],
        distance: '25km',
        elevation: '+200m/-900m'
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1544985361-b420d7a77f51?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ],
    faqs: [
      {
        question: 'What skill level is required?',
        answer: 'This tour is designed for intermediate mountain bikers with good physical fitness and basic technical skills.'
      },
      {
        question: 'Can I rent a mountain bike?',
        answer: 'Yes, we can arrange quality mountain bike rentals. Please request this when booking.'
      },
      {
        question: 'What should I bring?',
        answer: 'Personal riding gear, appropriate clothing, and any specific dietary requirements. A detailed packing list will be provided.'
      }
    ]
  },
  {
    id: 'mtb-002',
    title: 'Tea Plantations Cycling Tour',
    duration: '1 day',
    price: 89,
    location: 'Amani Nature Reserve',
    image: 'https://images.unsplash.com/photo-1591184510259-b6f1be3d7aff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    rating: 4.7,
    description: 'Cycle through the beautiful tea plantations and enjoy the breathtaking views of the surrounding landscape with expert local guides.',
    category: 'cycling',
    type: 'tour',
    difficulty: 'easy',
    groupSize: { min: 2, max: 12 },
    highlights: [
      'Scenic tea plantation routes',
      'Tea processing tour',
      'Local lunch experience',
      'Stunning valley views'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1591184510259-b6f1be3d7aff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80',
      'https://images.unsplash.com/photo-1557760265-3bd908abc6b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ]
  },
  
  // Hiking Tours
  {
    id: 'hiking-001',
    title: 'Usambara Mountains Hiking Adventure',
    duration: '3 days',
    price: 249,
    location: 'Usambara Mountains',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    description: 'Explore the lush mountain forests and villages of the Usambara Mountains in this guided hiking adventure with stunning views and cultural encounters.',
    category: 'hiking',
    type: 'tour',
    difficulty: 'moderate',
    groupSize: { min: 2, max: 14 },
    startLocation: 'Lushoto',
    endLocation: 'Mtae',
    highlights: [
      'Panoramic viewpoints',
      'Ancient rainforest trails',
      'Village homestay experience',
      'Diverse birdlife'
    ],
    included: [
      'Professional hiking guide',
      'All meals during the tour',
      'Accommodation (2 nights)',
      'Water and snacks',
      'Park and conservation fees'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Lushoto to Irente',
        description: 'Start in Lushoto and hike to Irente viewpoint offering spectacular views of the Maasai Plains.',
        activities: ['Forest trail hiking', 'Viewpoint visit', 'Cultural interactions'],
        meals: ['lunch', 'dinner'],
        accommodation: 'Local guesthouse',
        distance: '12km',
        elevation: '+400m/-200m'
      },
      {
        day: 2,
        title: 'Irente to Mambo',
        description: 'Trek through traditional villages and forests to Mambo village.',
        activities: ['Village visits', 'Forest hiking', 'Local craft demonstrations'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Village homestay',
        distance: '14km',
        elevation: '+600m/-300m'
      },
      {
        day: 3,
        title: 'Mambo to Mtae',
        description: 'Final day hike to Mtae with incredible views of the Usambara Mountains.',
        activities: ['Summit hike', 'Photography', 'Farewell lunch'],
        meals: ['breakfast', 'lunch'],
        distance: '10km',
        elevation: '+350m/-200m'
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1544900633-df4abe12c53e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1519046250022-9638c5370a28?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ]
  },
  {
    id: 'hiking-002',
    title: 'Mountain Summit Trek',
    duration: '4 days',
    price: 349,
    location: 'Usambara Range',
    image: 'https://images.unsplash.com/photo-1519046250022-9638c5370a28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    description: 'Challenge yourself with this summit trek offering panoramic views and amazing photo opportunities of the entire Usambara range.',
    category: 'hiking',
    type: 'tour',
    difficulty: 'challenging',
    groupSize: { min: 4, max: 10 },
    highlights: [
      'Summit achievement',
      'Diverse ecosystems',
      'Wildlife spotting',
      'Camping under the stars'
    ]
  },
  
  // 4x4 Expedition Tours
  {
    id: '4x4-001',
    title: 'Usambara Mountain 4x4 Expedition',
    duration: '5 days',
    price: 599,
    location: 'Usambara Mountains & Surroundings',
    image: 'https://images.unsplash.com/photo-1542902093-d55926049754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    rating: 4.8,
    description: 'Experience the thrill of off-road driving through the rugged terrain of Usambara Mountains, reaching remote locations inaccessible by regular vehicles.',
    category: 'cultural',
    type: 'tour',
    difficulty: 'moderate',
    groupSize: { min: 2, max: 8 },
    highlights: [
      'Professional 4x4 vehicles with experienced drivers',
      'Remote village access',
      'Wild camping experience',
      'Off-road river crossings'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Tanga to Northern Usambara',
        description: 'Depart from Tanga and travel by 4x4 to the northern Usambara Mountains, navigating challenging terrain.',
        activities: ['4x4 driving', 'Scenic photography', 'Welcome dinner'],
        meals: ['lunch', 'dinner'],
        accommodation: 'Safari camp',
        distance: '120km off-road'
      },
      {
        day: 2,
        title: 'Mountain Forest Exploration',
        description: 'Full day of off-road exploration through forest tracks and mountain passes.',
        activities: ['Off-road driving', 'Forest walks', 'Wildlife spotting'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Wild camping'
      },
      {
        day: 3,
        title: 'Remote Villages Tour',
        description: 'Visit remote villages accessible only by 4x4 vehicles and experience local culture.',
        activities: ['Cultural interactions', 'Local market visit', 'Traditional cooking'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Village homestay'
      },
      {
        day: 4,
        title: 'River Crossings & Valleys',
        description: 'Navigate challenging river crossings and valley roads with stunning views.',
        activities: ['Technical driving', 'River crossing', 'Valley exploration'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Luxury safari camp'
      },
      {
        day: 5,
        title: 'Mountain Descent & Return',
        description: 'Final day of off-road adventure descending through spectacular mountain passes back to Tanga.',
        activities: ['Mountain driving', 'Final lookout points', 'Farewell lunch'],
        meals: ['breakfast', 'lunch']
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1542902093-d55926049754?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1605649464707-4d0933dbd962?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ]
  },
  
  // Motocamping Tours
  {
    id: 'moto-001',
    title: 'Usambara Motocamping Adventure',
    duration: '4 days',
    price: 449,
    location: 'Usambara Circuit',
    image: 'https://images.unsplash.com/photo-1508872898907-cd18b99a4fff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.7,
    description: 'Combine the freedom of motorcycle touring with wilderness camping in this exciting motocamping adventure through scenic Usambara routes.',
    category: 'cycling',
    type: 'tour',
    difficulty: 'moderate',
    groupSize: { min: 4, max: 10 },
    highlights: [
      'Adventure motorcycle riding',
      'Wild camping under the stars',
      'Scenic mountain roads',
      'Beach and mountain combination'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Tanga to Lushoto',
        description: 'Orientation, motorcycle allocation, and ride from Tanga to Lushoto through winding mountain roads.',
        activities: ['Motorcycle orientation', 'Mountain pass riding', 'Evening campfire'],
        meals: ['lunch', 'dinner'],
        accommodation: 'Forest campsite',
        distance: '110km'
      },
      {
        day: 2,
        title: 'Lushoto to Mambo',
        description: 'Ride through the central Usambara Mountains on mixed terrain with stunning valley views.',
        activities: ['Off-road riding', 'Photography stops', 'Wild camping setup'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Wild mountain camping',
        distance: '85km'
      },
      {
        day: 3,
        title: 'Mambo to Amani',
        description: 'Navigate challenging forest routes to Amani Nature Reserve.',
        activities: ['Technical riding', 'Forest exploration', 'Wildlife spotting'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Riverside camping',
        distance: '95km'
      },
      {
        day: 4,
        title: 'Amani to Tanga',
        description: 'Final day ride through tea plantations and coastal roads back to Tanga.',
        activities: ['Tea plantation visit', 'Coastal riding', 'Farewell lunch'],
        meals: ['breakfast', 'lunch'],
        distance: '105km'
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1508872898907-cd18b99a4fff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1596998791485-72271feb3ee4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1510404280317-e508f521ffe5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ]
  },
  
  // School Tours
  {
    id: 'school-001',
    title: 'Educational Rainforest Experience',
    duration: '3 days',
    price: 199,
    location: 'Amani Nature Reserve',
    image: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    description: 'A specialized educational tour designed for school groups to learn about rainforest ecology, biodiversity, and conservation in an interactive environment.',
    category: 'cultural',
    type: 'tour',
    difficulty: 'easy',
    groupSize: { min: 10, max: 40 },
    highlights: [
      'Educational forest walks',
      'Conservation activities',
      'Wildlife observation',
      'Cultural exchanges with local schools'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Introduction to Rainforest Ecology',
        description: 'Arrival at Amani Nature Reserve, introduction to rainforest ecology through interactive workshops.',
        activities: ['Welcome orientation', 'Forest ecology workshop', 'Evening nature presentation'],
        meals: ['lunch', 'dinner'],
        accommodation: 'Educational center dormitory'
      },
      {
        day: 2,
        title: 'Biodiversity and Conservation',
        description: 'Full day of hands-on activities focused on biodiversity and conservation efforts.',
        activities: ['Guided nature walks', 'Tree planting activity', 'Wildlife identification'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Educational center dormitory'
      },
      {
        day: 3,
        title: 'Cultural Exchange and Departure',
        description: 'Morning cultural exchange with local school followed by final activities and departure.',
        activities: ['Local school visit', 'Cultural performance', 'Reflection session'],
        meals: ['breakfast', 'lunch']
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1530795020898-1f77b4c0a279?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1470107355970-2ace9f20ab15?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'
    ]
  }
];

export const getTourById = (id: string): FeaturedItem | undefined => {
  return toursData.find(tour => tour.id === id);
};

export const getToursByType = (tourType: string): FeaturedItem[] => {
  if (tourType === 'all') {
    return toursData;
  }
  
  // Map URL parameters to category/type filters
  const typeMap: Record<string, string> = {
    'mtb': 'cycling',
    'hiking': 'hiking',
    '4x4': 'cultural',
    'motocamping': 'cycling',
    'school': 'cultural'
  };
  
  const categoryToFilter = typeMap[tourType] || tourType;
  
  return toursData.filter(tour => {
    if (tourType === 'mtb') {
      return tour.category === 'cycling' && tour.id.startsWith('mtb');
    } else if (tourType === 'motocamping') {
      return tour.category === 'cycling' && tour.id.startsWith('moto');
    } else if (tourType === '4x4') {
      return tour.id.startsWith('4x4');
    } else if (tourType === 'school') {
      return tour.id.startsWith('school');
    } else {
      return tour.category === categoryToFilter;
    }
  });
};