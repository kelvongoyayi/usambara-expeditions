import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import UsambaraLogo from '../ui/UsambaraLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#042309] text-white">
      <div className="container mx-auto px-4">
        {/* Pre-Footer Content Area */}
        <div className="py-16 border-b border-dark-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-6">
                <UsambaraLogo width={60} height={60} simplified={true} />
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Experience unforgettable journeys across Tanzania's breathtaking landscapes. We specialize in curated safari tours and premier event planning.
              </p>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 group">
                  <Facebook className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 group">
                  <Instagram className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 group">
                  <Twitter className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 group">
                  <Youtube className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Explore Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <span className="w-8 h-1 bg-accent-500 inline-block mr-3"></span>Explore
              </h3>
              <div className="grid gap-4">
                <a href="#" className="text-gray-400 hover:text-accent-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Safari Tours
                </a>
                <a href="#" className="text-gray-400 hover:text-accent-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Event Management
                </a>
                <a href="#" className="text-gray-400 hover:text-accent-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Popular Destinations
                </a>
                <a href="#" className="text-gray-400 hover:text-accent-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  About Tanzania
                </a>
                <a href="#" className="text-gray-400 hover:text-accent-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Travel Blog
                </a>
                <a href="#" className="text-gray-400 hover:text-accent-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Gallery
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <span className="w-8 h-1 bg-accent-500 inline-block mr-3"></span>Contact
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-accent-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Our Office</p>
                    <p className="text-gray-400">Tanga, Tanzania</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Phone className="w-5 h-5 text-accent-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <p className="text-gray-400">+255 123 456 789</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Mail className="w-5 h-5 text-accent-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-400">info@usambaraexpeditions.com</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-6 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-xl p-4 flex items-center transition-all duration-300 group">
                <div className="w-10 h-10 bg-accent-500/20 rounded-full flex items-center justify-center mr-3 transition-all duration-300 group-hover:scale-110">
                  <Clock className="w-5 h-5 text-accent-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-white/90 group-hover:text-white text-sm font-medium transition-colors">Office Hours</p>
                  <p className="text-white/70 group-hover:text-white/80 text-xs transition-colors">Mon-Fri: 9am - 5pm</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <span className="w-8 h-1 bg-accent-500 inline-block mr-3"></span>Newsletter
              </h3>
              <p className="text-gray-400 mb-4">Subscribe to receive our latest updates and offers.</p>
              <form className="space-y-3">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400 border border-white/10 hover:border-white/20 pr-12 transition-all duration-300 placeholder-white/60"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent-500 hover:bg-accent-600 text-white p-1.5 rounded-lg transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-start mt-3">
                  <input type="checkbox" id="terms" className="mt-1 mr-3" />
                  <label htmlFor="terms" className="text-gray-400 text-sm">
                    I agree to receive marketing emails and accept the <a href="#" className="text-accent-400 hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </form>
              
              <div className="mt-6 p-4 border border-accent-500/30 rounded-xl">
                <p className="text-white font-medium mb-1">Special Offer!</p>
                <p className="text-gray-400 text-sm">Get 10% off your first booking when you subscribe.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Bottom Links */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <UsambaraLogo width={45} height={45} simplified={true} className="mr-3" />
            <p className="text-gray-500 text-sm ml-2">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Cookies</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;