import { FeaturedItem } from '../types/tours';

export const eventsData: FeaturedItem[] = [
  // Corporate Events
  {
    id: 'corporate-001',
    title: 'Corporate Team Building Retreat',
    duration: '2 days',
    price: 499,
    location: 'Lushoto Valley Resort',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    description: 'A specialized retreat designed to strengthen teamwork, boost morale, and enhance communication within your organization through a mix of structured activities and relaxation.',
    category: 'event',
    type: 'event',
    date: 'June 15-17, 2025',
    groupSize: { min: 10, max: 50 },
    highlights: [
      'Professional team-building facilitators',
      'Customized activity program',
      'Exclusive resort facilities',
      'Comprehensive event planning'
    ],
    included: [
      'Professional facilitation',
      'All team building materials',
      'Accommodation',
      'All meals and refreshments',
      'Workshop facilities',
      'Evening entertainment'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Team Building Kickoff',
        description: 'Welcome session, icebreaker activities, and introductory team challenges in a scenic environment.',
        activities: ['Opening session', 'Icebreaker activities', 'Evening networking dinner'],
        meals: ['lunch', 'dinner'],
        accommodation: 'Lushoto Valley Resort'
      },
      {
        day: 2,
        title: 'Core Team Building Activities',
        description: 'Full day of structured team building exercises, problem-solving challenges, and reflection sessions.',
        activities: ['Problem-solving challenges', 'Communication exercises', 'Leadership activities', 'Debriefing session'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Lushoto Valley Resort'
      },
      {
        day: 3,
        title: 'Strategic Planning & Departure',
        description: 'Morning strategic planning workshop, action plan development, and farewell lunch before departure.',
        activities: ['Strategic planning workshop', 'Action plan development', 'Closing ceremony'],
        meals: ['breakfast', 'lunch']
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'
    ],
    faqs: [
      {
        question: 'Can the program be customized to our company\'s needs?',
        answer: 'Yes, we work with you to customize the program to address your specific goals and challenges.'
      },
      {
        question: 'What is the ideal group size?',
        answer: 'Our corporate retreats work best with groups between 10-50 people, though we can accommodate larger groups with advance notice.'
      },
      {
        question: 'Can you help with transportation arrangements?',
        answer: 'Yes, we can arrange transportation for your team from major cities in Tanzania to the retreat location.'
      }
    ]
  },
  
  // Usambara 4x4 Expedition
  {
    id: '4x4-expedition-001',
    title: 'Usambara 4x4 Expedition Challenge',
    duration: '3 days',
    price: 349,
    location: 'Usambara Mountains',
    image: 'https://images.unsplash.com/photo-1605649464707-4d0933dbd962?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    description: 'A thrilling off-road expedition challenge through the rugged terrain of the Usambara Mountains, designed for 4x4 enthusiasts and adventure seekers.',
    category: 'event',
    type: 'event',
    date: 'July 22-24, 2025',
    groupSize: { min: 5, max: 20 },
    highlights: [
      'Challenging off-road trails',
      'Competitive navigation challenges',
      'Stunning viewpoints',
      'Evening campfire gatherings'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Registration & Orientation Stage',
        description: 'Team registration, vehicle inspection, route briefing, and orientation challenge.',
        activities: ['Registration', 'Vehicle inspection', 'Orientation challenge', 'Welcome dinner'],
        meals: ['lunch', 'dinner'],
        accommodation: 'Base Camp'
      },
      {
        day: 2,
        title: 'Main Expedition Challenge',
        description: 'Full day navigating challenging off-road trails, technical sections, and checkpoints.',
        activities: ['Navigation challenges', 'Technical driving sections', 'Checkpoint challenges', 'Evening awards'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Forest Camp'
      },
      {
        day: 3,
        title: 'Final Stage & Closing Ceremony',
        description: 'Morning final stage challenge, followed by closing ceremony and awards presentation.',
        activities: ['Final stage', 'Team challenge', 'Awards ceremony'],
        meals: ['breakfast', 'lunch']
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1605649464707-4d0933dbd962?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1542683088-abb3da334598?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1581099328238-80c82af371ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80'
    ]
  },
  
  // Usambara ADV Motocamping
  {
    id: 'adv-motocamping-001',
    title: 'Usambara ADV Motocamping Rally',
    duration: '4 days',
    price: 299,
    location: 'Usambara Circuit',
    image: 'https://images.unsplash.com/photo-1596998791485-72271feb3ee4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.7,
    description: 'An adventure motorcycling and camping event that takes participants through scenic routes of the Usambara region, combining riding challenges with wilderness camping.',
    category: 'event',
    type: 'event',
    date: 'August 5-8, 2025',
    groupSize: { min: 15, max: 40 },
    highlights: [
      'Mixed terrain adventure riding',
      'Wild camping experiences',
      'Riding skills workshops',
      'Community of adventure riders'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Registration & Welcome Ride',
        description: 'Event registration, bike check, orientation, and afternoon welcome ride.',
        activities: ['Registration', 'Bike inspection', 'Welcome ride', 'Opening ceremony'],
        meals: ['lunch', 'dinner'],
        accommodation: 'Base Camp'
      },
      {
        day: 2,
        title: 'Mountain Stage',
        description: 'Full day riding through mountain terrain with technical sections and spectacular views.',
        activities: ['Mountain riding', 'Skills challenges', 'Photography points', 'Evening presentations'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Mountain Camp'
      },
      {
        day: 3,
        title: 'Forest & Valley Stage',
        description: 'Riding through forest trails and valley routes with natural obstacles and river crossings.',
        activities: ['Forest navigation', 'River crossing challenges', 'Wilderness camping setup'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Forest Camp'
      },
      {
        day: 4,
        title: 'Final Ride & Closing Ceremony',
        description: 'Morning final ride, followed by closing ceremony, awards, and farewell lunch.',
        activities: ['Final ride', 'Closing ceremony', 'Awards presentation'],
        meals: ['breakfast', 'lunch']
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1596998791485-72271feb3ee4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1508872898907-cd18b99a4fff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80'
    ]
  },
  
  // Amani Enduro MTB XC
  {
    id: 'mtb-enduro-001',
    title: 'Amani Enduro MTB XC Challenge',
    duration: '3 days',
    price: 149,
    location: 'Amani Nature Reserve',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    description: 'A competitive mountain biking event combining enduro and cross-country elements through the spectacular Amani Nature Reserve trails.',
    category: 'event',
    type: 'event',
    date: 'September 12-14, 2025',
    groupSize: { min: 30, max: 100 },
    highlights: [
      'Competitive racing stages',
      'Technical singletrack trails',
      'Rainforest riding',
      'Rider festival atmosphere'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Registration & Practice Day',
        description: 'Event registration, course inspection, practice runs, and welcome ceremony.',
        activities: ['Registration', 'Course practice', 'Skills clinics', 'Welcome dinner'],
        meals: ['lunch', 'dinner'],
        accommodation: 'Event camping'
      },
      {
        day: 2,
        title: 'Main Race Day',
        description: 'Full competition day with timed stages through various terrains and challenges.',
        activities: ['Race briefing', 'Timed stages', 'Feed zones', 'Evening results'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Event camping'
      },
      {
        day: 3,
        title: 'Final Stage & Awards',
        description: 'Morning final stage, followed by awards ceremony and celebration.',
        activities: ['Final stage', 'Awards ceremony', 'Closing lunch'],
        meals: ['breakfast', 'lunch']
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1544985361-b420d7a77f51?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1551385738-65444d9e9df5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ]
  },
  
  // Magoroto Camping Festival
  {
    id: 'camping-festival-001',
    title: 'Magoroto Camping Festival',
    duration: '3 days',
    price: 150,
    location: 'Magoroto Forest',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    description: 'A vibrant outdoor festival celebrating nature, music, culture, and adventure activities in the beautiful Magoroto Forest setting.',
    category: 'event',
    type: 'event',
    date: 'October 10-12, 2025',
    groupSize: { min: 50, max: 500 },
    highlights: [
      'Live music performances',
      'Adventure activity workshops',
      'Cultural exhibitions',
      'Forest camping experience'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Opening',
        description: 'Arrival, camping setup, opening ceremony, and evening performances.',
        activities: ['Camp setup', 'Opening ceremony', 'Welcome activities', 'Evening concert'],
        meals: ['dinner'],
        accommodation: 'Festival camping'
      },
      {
        day: 2,
        title: 'Main Festival Day',
        description: 'Full day of activities, workshops, performances, and community events.',
        activities: ['Adventure workshops', 'Music performances', 'Cultural exhibitions', 'Campfire stories'],
        meals: ['breakfast', 'lunch', 'dinner'],
        accommodation: 'Festival camping'
      },
      {
        day: 3,
        title: 'Closing Day',
        description: 'Morning activities, closing ceremony, and departure.',
        activities: ['Morning yoga', 'Final performances', 'Closing ceremony'],
        meals: ['breakfast', 'lunch']
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1530795020898-1f77b4c0ab15?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1559762705-2123aa9b467f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ]
  }
];

export const getEventById = (id: string): FeaturedItem | undefined => {
  return eventsData.find(event => event.id === id);
};

export const getEventsByType = (eventType: string): FeaturedItem[] => {
  if (eventType === 'all') {
    return eventsData;
  }
  
  // Map URL parameters to event types
  const typeMap: Record<string, string> = {
    'corporate': 'corporate',
    '4x4': '4x4-expedition',
    'motocamping': 'adv-motocamping',
    'mtb': 'mtb-enduro',
    'camping': 'camping-festival'
  };
  
  const eventPrefix = typeMap[eventType] || eventType;
  
  return eventsData.filter(event => event.id.startsWith(eventPrefix));
};