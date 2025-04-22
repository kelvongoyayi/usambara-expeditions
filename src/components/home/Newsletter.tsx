import React from 'react';
import { Send, Mail } from 'lucide-react';
import Section from '../ui/Section';
import { useInView } from 'react-intersection-observer';

const Newsletter: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="bg-brand-900 py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div 
          className="bg-gradient-to-br from-brand-800 to-brand-900 rounded-3xl shadow-2xl overflow-hidden relative"
          ref={ref}
        >
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full filter blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-600/10 rounded-full filter blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-3 p-10 md:p-16 relative z-10">
              <div 
                className={`inline-flex items-center bg-accent-500/20 px-4 py-2 rounded-full mb-6 transform transition-all duration-500 ${
                  inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <Mail className="w-4 h-4 text-accent-400 mr-2" />
                <span className="text-accent-400 text-sm font-medium">Stay Connected</span>
              </div>
              
              <h2 
                className={`text-3xl md:text-4xl font-bold mb-4 text-white transform transition-all duration-500 delay-100 ${
                  inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                Travel Updates & Exclusive Offers
              </h2>
              
              <p 
                className={`text-brand-100 text-lg mb-8 leading-relaxed max-w-lg transform transition-all duration-500 delay-200 ${
                  inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                Join our newsletter for insider travel tips and special offers on Tanzania adventures.
              </p>
              
              <form 
                className={`transform transition-all duration-500 delay-300 ${
                  inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-400 backdrop-blur-sm"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-4 rounded-full transition-colors shadow-lg flex items-center justify-center sm:w-auto"
                  >
                    <span className="font-medium">Subscribe</span>
                    <Send className="ml-2 w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center mt-5">
                  <input
                    id="privacy"
                    type="checkbox"
                    className="w-4 h-4 accent-accent-500"
                    required
                  />
                  <label htmlFor="privacy" className="ml-2 text-sm text-brand-200">
                    I agree to receive emails and accept the <a href="#" className="underline hover:text-white">Privacy Policy</a>
                  </label>
                </div>
              </form>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Expert Travel Tips', 'New Destinations', 'Seasonal Offers'].map((item, index) => (
                  <div 
                    key={index} 
                    className={`bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center text-white/90 transform transition-all duration-500 ${
                      inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                    style={{ transitionDelay: `${0.5 + (index * 0.1)}s` }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="hidden md:block md:col-span-2 relative">
              <div className="h-full w-full">
                <img 
                  src="https://images.unsplash.com/photo-1535912268533-50a5df5730a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80" 
                  alt="Tanzania landscape" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-800/90 via-brand-800/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;