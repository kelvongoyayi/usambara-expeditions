import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Section from '../ui/Section';
import FeaturedTourSlider from '../tours/FeaturedTourSlider';
import CategoryFilter from '../tours/CategoryFilter';
import TourGrid from '../tours/TourGrid';
import TourDetailsModal from '../tours/TourDetailsModal';
import { TourCategory } from '../tours/CategoryFilter';
import { FeaturedItem } from '../../types/tours';

// Featured tours and events data
const featuredData: FeaturedItem[] = [
  {
    id: '1',
    title: 'Usambara Mountains Hiking Adventure',
    duration: '3 days',
    price: 299,
    location: 'Usambara Mountains',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    description: 'Explore the lush mountain forests and villages of the Usambara Mountains in this guided hiking adventure.',
    category: 'hiking',
    featured: true,
    type: 'tour'
  },
  {
    id: '2',
    title: 'Cycling Through Tea Plantations',
    duration: '1 day',
    price: 89,
    location: 'Amani Nature Reserve',
    image: 'https://images.unsplash.com/photo-1591184510259-b6f1be3d7aff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    rating: 4.7,
    description: 'Cycle through the beautiful tea plantations and enjoy the breathtaking views of the surrounding landscape.',
    category: 'cycling',
    featured: true,
    type: 'tour'
  },
  {
    id: '7',
    title: 'Corporate Team Building Retreat',
    duration: '2 days',
    price: 499,
    location: 'Lushoto Valley Resort',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    description: 'Engage your team with exciting activities and strengthen team bonds in this exclusive corporate retreat package.',
    category: 'event',
    featured: true,
    type: 'event',
    date: 'June 15-17, 2025'
  },
  {
    id: '8',
    title: 'Music & Cultural Festival',
    duration: '3 days',
    price: 150,
    location: 'Usambara Village Center',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    description: 'Experience the vibrant music and cultural traditions of Tanzania in this annual festival featuring local artists and performers.',
    category: 'event',
    featured: true,
    type: 'event',
    date: 'July 28-30, 2025'
  },
  {
    id: '3',
    title: 'Cultural Village Experience',
    duration: '2 days',
    price: 199,
    location: 'Lushoto',
    image: 'https://images.unsplash.com/photo-1567942089878-d844f4561d57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    description: 'Immerse yourself in the local culture with this guided tour of traditional villages and their customs.',
    category: 'cultural',
    type: 'tour'
  },
  {
    id: '4',
    title: 'Mountain Summit Trek',
    duration: '4 days',
    price: 349,
    location: 'Usambara Range',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    description: 'Challenge yourself with this summit trek offering panoramic views and amazing photo opportunities.',
    category: 'hiking',
    type: 'tour'
  },
  {
    id: '5',
    title: 'Countryside Cycling Tour',
    duration: '1 day',
    price: 75,
    location: 'Lushoto Valley',
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.6,
    description: 'A relaxed cycling tour through picturesque countryside with stops at local markets and viewpoints.',
    category: 'cycling',
    type: 'tour'
  },
  {
    id: '6',
    title: 'Traditional Cooking Workshop',
    duration: '1 day',
    price: 65,
    location: 'Mombo Village',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    description: 'Learn traditional Tanzanian cooking methods and recipes with local chefs in an authentic village setting.',
    category: 'cultural',
    type: 'tour'
  },
  {
    id: '9',
    title: 'Adventure Race Competition',
    duration: '1 day',
    price: 120,
    location: 'Usambara Mountains',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.7,
    description: 'Test your limits in this challenging adventure race through diverse terrains and beautiful landscapes.',
    category: 'event',
    type: 'event',
    date: 'August 12, 2025'
  },
  {
    id: '10',
    title: 'Conservation Workshop',
    duration: '2 days',
    price: 85,
    location: 'Amani Nature Reserve',
    image: 'https://images.unsplash.com/photo-1552127886-0148f04eb260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    description: 'Join conservation experts to learn about and participate in local environmental protection initiatives.',
    category: 'event',
    type: 'event',
    date: 'September 5-6, 2025'
  }
];

const FeaturedTours: React.FC = () => {
  // States
  const [activeCategory, setActiveCategory] = useState<TourCategory>('all');
  const [showGrid, setShowGrid] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  
  // Get featured items for the slider
  const featuredItems = featuredData.filter(item => item.featured);
  
  // Filter items based on selected category
  const filteredItems = featuredData.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  // Determine which items to display based on view mode
  const displayedItems = showGrid ? filteredItems : filteredItems.slice(0, visibleCount * 2);
  
  // Get the selected item object
  const selectedItemData = selectedItem 
    ? featuredData.find(item => item.id === selectedItem) 
    : null;

  // Handle category change
  const handleCategoryChange = (category: TourCategory) => {
    setActiveCategory(category);
    setShowGrid(false);
  };

  // Toggle between grid and slider views
  const toggleView = () => {
    setShowGrid(!showGrid);
  };

  // Handle item details view
  const handleViewDetails = (itemId: string) => {
    setSelectedItem(itemId);
    setIsDetailVisible(true);
  };

  // Close details modal
  const handleCloseDetails = () => {
    setIsDetailVisible(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <Section gradient className="overflow-hidden">
      {/* Featured Tours Carousel */}
      <FeaturedTourSlider 
        items={featuredItems} 
        onViewDetails={handleViewDetails} 
      />
      
      {/* Category Filter */}
      <CategoryFilter 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
      />

      {/* Tour Grid/Slider */}
      <TourGrid 
        items={displayedItems} 
        showAsGrid={showGrid} 
        onViewDetails={handleViewDetails} 
      />
      
      {/* View Toggle Button */}
      {filteredItems.length > visibleCount && (
        <div className="mt-10 sm:mt-12 text-center">
          <button 
            onClick={toggleView} 
            className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-3.5 rounded-full border-2 border-brand-600 text-brand-600 hover:bg-brand-50 font-medium transition-all duration-300 group text-sm sm:text-base shadow-sm hover:shadow-md transform hover:-translate-y-1"
            aria-expanded={showGrid}
            aria-controls="itemGrid"
          >
            {showGrid ? 'View as Slider' : 'View All Items'}
            <ChevronRight className={`ml-2 sm:ml-2.5 w-5 sm:w-5 h-5 sm:h-5 transition-transform duration-300 ${showGrid ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
          </button>
        </div>
      )}
      
      {/* Item Details Modal */}
      {selectedItemData && (
        <TourDetailsModal 
          item={selectedItemData} 
          isVisible={isDetailVisible} 
          onClose={handleCloseDetails} 
        />
      )}
    </Section>
  );
};

export default FeaturedTours;