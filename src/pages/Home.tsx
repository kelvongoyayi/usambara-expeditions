import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import FeaturedTours from '../components/home/FeaturedTours';
import EventsSection from '../components/home/EventsSection';
import Testimonials from '../components/home/Testimonials';
import DestinationHighlights from '../components/home/DestinationHighlights';
import Newsletter from '../components/home/Newsletter';

const Home: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedTours />
      <EventsSection />
      <DestinationHighlights />
      <Testimonials />
      <Newsletter />
    </Layout>
  );
};

export default Home;