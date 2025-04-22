import React, { useState } from 'react';
import { Check, ChevronRight, ArrowRight, Send, Calendar, Users, Sparkles } from 'lucide-react';

interface CustomEventPlannerProps {
  className?: string;
}

const CustomEventPlanner: React.FC<CustomEventPlannerProps> = ({ className = '' }) => {
  const [formState, setFormState] = useState({
    fullName: '',
    eventType: '',
    date: '',
    attendees: '',
    email: '',
    requirements: ''
  });
  
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Form submitted:', formState);
    // Reset form after submission
    setFormState({
      fullName: '',
      eventType: '',
      date: '',
      attendees: '',
      email: '',
      requirements: ''
    });
  };
  
  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };
  
  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className={`bg-gradient-to-br from-brand-900 to-brand-800 rounded-2xl overflow-hidden relative shadow-2xl ${className}`}>
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full filter blur-[100px] opacity-60 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full filter blur-[100px] opacity-60 transform -translate-x-1/3 translate-y-1/3"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border border-accent-500/10 rounded-full"></div>
      <div className="absolute top-16 left-16 w-10 h-10 border border-accent-500/20 rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 border border-brand-600/10 rounded-full"></div>
      <div className="absolute bottom-16 right-16 w-8 h-8 border border-brand-600/20 rounded-full"></div>
      
      {/* Floating particles for visual interest */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-2 h-2 rounded-full bg-accent-500/20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        ></div>
      ))}
      
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-3/5">
            <div className="inline-flex items-center mb-6 bg-accent-500/20 px-4 py-2 rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 text-accent-400 mr-2" />
              <span className="text-accent-400 font-medium text-sm">Tailored For You</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">Let Us Plan Your <span className="text-accent-400">Custom Event</span></h3>
            
            <p className="text-gray-300 mb-8 leading-relaxed">
              Whether you're planning a corporate retreat, adventure competition, or cultural celebration, 
              our expert event planners will create a personalized experience that exceeds your expectations.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {[
                { title: 'Full Planning Service', desc: 'From concept to execution' },
                { title: 'Venue Selection', desc: 'Find the perfect location' },
                { title: 'Budget Management', desc: 'Cost-effective solutions' },
                { title: 'On-site Coordination', desc: 'Expert event management' }
              ].map((feature, index) => (
                <div key={index} className="flex items-start group hover:-translate-y-1 transition-transform duration-300">
                  <div className="bg-accent-500/20 rounded-full p-2 mr-4 mt-0.5 transform transition-all group-hover:scale-110 group-hover:bg-accent-500/40 duration-300">
                    <Check className="w-4 h-4 text-accent-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-lg group-hover:text-accent-400 transition-colors duration-300">{feature.title}</h4>
                    <p className="text-sm text-gray-300">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <a href="#" className="text-white border-b-2 border-accent-500 inline-flex items-center pb-1 text-lg hover:text-accent-400 transition-colors group">
              Get a Custom Quote
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
          
          <div className="md:w-2/5 w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 shadow-2xl transform transition-all duration-500 hover:shadow-accent-500/10 hover:-translate-y-1">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold text-lg mb-1">Request Information</h4>
                  <p className="text-gray-300 text-sm">We'll contact you within 24 hours</p>
                </div>
              </div>
              
              <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                <div className={`transition-all duration-300 ${focusedField === 'fullName' ? 'transform -translate-y-1' : ''}`}>
                  <label className="block text-gray-300 text-sm mb-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your full name" 
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300" 
                    name="fullName"
                    value={formState.fullName}
                    onChange={handleChange}
                    onFocus={() => handleFocus('fullName')}
                    onBlur={handleBlur}
                  />
                </div>
                
                <div className={`transition-all duration-300 ${focusedField === 'email' ? 'transform -translate-y-1' : ''}`}>
                  <label className="block text-gray-300 text-sm mb-2">Your Email</label>
                  <input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300" 
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                  />
                </div>

                <div className={`transition-all duration-300 ${focusedField === 'eventType' ? 'transform -translate-y-1' : ''}`}>
                  <label className="block text-gray-300 text-sm mb-2">Event Type</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300"
                      name="eventType"
                      value={formState.eventType}
                      onChange={handleChange}
                      onFocus={() => handleFocus('eventType')}
                      onBlur={handleBlur}
                    >
                      <option value="" disabled selected>Select event type</option>
                      <option value="corporate" className="bg-dark-800">Corporate Event</option>
                      <option value="adventure">Adventure Event</option>
                      <option value="educational">Educational Program</option>
                      <option value="special">Special Occasion</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronRight className="w-5 h-5 text-accent-400 rotate-90" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div className={`transition-all duration-300 ${focusedField === 'date' ? 'transform -translate-y-1' : ''}`}>
                    <label className="block text-gray-300 text-sm mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-accent-400" />
                      Date
                    </label>
                    <input 
                      type="date" 
                      className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300" 
                      style={{ colorScheme: 'dark' }}
                      name="date"
                      value={formState.date}
                      onChange={handleChange}
                      onFocus={() => handleFocus('date')}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className={`transition-all duration-300 ${focusedField === 'attendees' ? 'transform -translate-y-1' : ''}`}>
                    <label className="block text-gray-300 text-sm mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-1 text-accent-400" />
                      Attendees
                    </label>
                    <input 
                      type="number" 
                      placeholder="Approx. number" 
                      className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300" 
                      name="attendees"
                      value={formState.attendees}
                      onChange={handleChange}
                      onFocus={() => handleFocus('attendees')}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
                
                <div className={`transition-all duration-300 ${focusedField === 'requirements' ? 'transform -translate-y-1' : ''}`}>
                  <label className="block text-gray-300 text-sm mb-2">Special Requirements</label>
                  <textarea 
                    placeholder="Tell us more about your event..." 
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent resize-none transition-all duration-300" 
                    name="requirements"
                    value={formState.requirements}
                    onChange={handleChange}
                    onFocus={() => handleFocus('requirements')}
                    onBlur={handleBlur}
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-accent-500 hover:bg-accent-600 text-white py-3.5 px-4 rounded-full transition-all duration-300 font-medium text-center shadow-xl hover:shadow-accent-500/20 hover:-translate-y-1 flex items-center justify-center"
                >
                  <span>Send Request</span>
                  <Send className="ml-2 w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomEventPlanner;