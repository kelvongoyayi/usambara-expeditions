import React from 'react';
import { CheckCircle, Award, Users, Globe, Heart, Target, MapPin } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Section from '../components/ui/Section';
import { useInView } from 'react-intersection-observer';

const About: React.FC = () => {
  const { ref: missionRef, inView: missionInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: teamRef, inView: teamInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-20 bg-brand-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full filter blur-[100px] opacity-60 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full filter blur-[100px] opacity-60 transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white font-display">
              About <span className="text-accent-400">Usambara Expeditions</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Your premier adventure and event management company in Tanzania, connecting you with nature, culture, and unforgettable experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1486551937199-baf066858de7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
                  alt="Usambara Mountains Landscape" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-2/3 rounded-xl overflow-hidden shadow-xl border-4 border-white">
                <div className="aspect-w-4 aspect-h-3">
                  <img 
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80" 
                    alt="Adventure Tourism" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-dark-600">
              <p>
                Founded in 2010, Usambara Expeditions was born from a passion for Tanzania's natural beauty and a desire to share it with the world. Starting as a small hiking guide service in the Usambara Mountains, we have grown into a comprehensive adventure and event management company.
              </p>
              <p>
                The name "Usambara" comes from the breathtaking mountain range in northeastern Tanzania, known for its exceptional biodiversity, scenic beauty, and rich cultural heritage. These mountains, often called the Galapagos of Africa for their unique ecology, serve as both our inspiration and our home base.
              </p>
              <p>
                Over the years, we've expanded our offerings to include a diverse range of tour experiences and professional event management services, all while maintaining our commitment to sustainable tourism practices and community engagement.
              </p>
            </div>
            
            <div className="mt-8 bg-brand-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">What Sets Us Apart</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-brand-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-dark-700">Deep local knowledge and authentic cultural connections</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-brand-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-dark-700">Commitment to sustainable and responsible tourism</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-brand-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-dark-700">Experienced guides with extensive safety training</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-brand-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-dark-700">Comprehensive services from adventure tours to corporate events</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Mission & Values */}
      <div className="bg-brand-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full filter blur-[100px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full filter blur-[100px] opacity-40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Mission & Values</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Guiding principles that shape every adventure and event we create
            </p>
          </div>
          
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            ref={missionRef}
          >
            {[
              {
                icon: <Target className="w-8 h-8 text-accent-400" />,
                title: "Our Mission",
                description: "To provide unforgettable travel experiences while promoting sustainable tourism, cultural heritage, and eco-friendly adventure in Tanzania."
              },
              {
                icon: <Globe className="w-8 h-8 text-green-400" />,
                title: "Sustainability",
                description: "We are committed to environmental conservation, minimizing our ecological footprint, and supporting local conservation initiatives in every area we operate."
              },
              {
                icon: <Users className="w-8 h-8 text-blue-400" />,
                title: "Community Impact",
                description: "We actively partner with local communities, ensuring tourism benefits reach the people who call our destinations home through fair employment and community projects."
              },
              {
                icon: <Award className="w-8 h-8 text-yellow-400" />,
                title: "Excellence",
                description: "We strive for the highest standards in every aspect of our operation, from the quality of our guides to the execution of our events and adventures."
              },
              {
                icon: <Heart className="w-8 h-8 text-red-400" />,
                title: "Passion",
                description: "Our team brings genuine enthusiasm and love for Tanzania's natural wonders and cultural heritage to every expedition and event we organize."
              },
              {
                icon: <MapPin className="w-8 h-8 text-purple-400" />,
                title: "Authenticity",
                description: "We create genuine experiences that connect travelers with the true essence of Tanzania, beyond typical tourist attractions."
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className={`bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 transform transition-all duration-500 hover:bg-white/15 hover:border-white/20 ${
                  missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-white/80">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Our Team */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-xl text-dark-500 max-w-3xl mx-auto">
            Passionate experts dedicated to creating exceptional experiences
          </p>
        </div>
        
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          ref={teamRef}
        >
          {[
            {
              name: "James Kilimba",
              role: "Founder & CEO",
              image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
              bio: "With over 20 years of experience in adventure tourism, James founded Usambara Expeditions to showcase the natural beauty of his homeland."
            },
            {
              name: "Grace Mwangi",
              role: "Head of Operations",
              image: "https://images.unsplash.com/photo-1589156288859-f0cb0d82b065?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=772&q=80",
              bio: "Grace ensures all our expeditions and events run seamlessly, bringing her extensive background in logistics and hospitality management."
            },
            {
              name: "Daniel Olorien",
              role: "Lead Adventure Guide",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
              bio: "A certified mountaineer and native of the Usambara region, Daniel's knowledge of local terrain, wildlife, and culture is unparalleled."
            },
            {
              name: "Amina Hassan",
              role: "Events Director",
              image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
              bio: "Amina brings creative vision and flawless execution to our event management services, specializing in corporate retreats and cultural celebrations."
            }
          ].map((member, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                teamInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-w-3 aspect-h-4">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark-800 mb-1">{member.name}</h3>
                <p className="text-accent-500 font-medium mb-4">{member.role}</p>
                <p className="text-dark-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-dark-500 mb-6">
            Our team includes many more dedicated guides, support staff, and local experts who make our adventures possible.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium text-lg"
          >
            Want to join our team?
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </Section>
      
      {/* Stats & Achievements */}
      <div className="bg-brand-50 py-20">
        <div className="container mx-auto px-4">
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            ref={statsRef}
          >
            {[
              { value: "15+", label: "Years of Experience" },
              { value: "10,000+", label: "Happy Travelers" },
              { value: "250+", label: "Successful Events" },
              { value: "8", label: "Conservation Projects" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-xl p-6 text-center shadow-md transform transition-all duration-500 ${
                  statsInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-brand-600 mb-2">{stat.value}</div>
                <div className="text-dark-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Our Approach</h2>
              <p className="text-dark-600 max-w-3xl mx-auto">
                At Usambara Expeditions, we believe in creating meaningful connections between travelers, nature, and local communities while ensuring sustainable practices guide everything we do.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-brand-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-dark-800 mb-3">Personalization</h3>
                <p className="text-dark-600">
                  We create customized experiences tailored to your interests, preferences, and abilities, ensuring every adventure is uniquely yours.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-brand-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-dark-800 mb-3">Safety First</h3>
                <p className="text-dark-600">
                  Our comprehensive safety protocols, expert guides, and quality equipment ensure your well-being throughout every adventure.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-brand-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-dark-800 mb-3">Local Impact</h3>
                <p className="text-dark-600">
                  We prioritize local partnerships, fair employment practices, and community-based tourism initiatives that benefit Tanzania's communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Certifications & Partnerships */}
      <Section>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Certifications & Partnerships</h2>
          <p className="text-xl text-dark-500 max-w-3xl mx-auto">
            We're proud to work with organizations that share our commitment to quality and sustainability
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            {
              name: "Tanzania Tourism Board",
              logo: "https://placehold.co/200x80/f8f9fa/343a40?text=Tanzania+Tourism"
            },
            {
              name: "Sustainable Tourism Certification",
              logo: "https://placehold.co/200x80/f8f9fa/343a40?text=Eco+Certified"
            },
            {
              name: "Adventure Travel Association",
              logo: "https://placehold.co/200x80/f8f9fa/343a40?text=Adventure+Travel"
            },
            {
              name: "Wildlife Conservation Network",
              logo: "https://placehold.co/200x80/f8f9fa/343a40?text=Wildlife+Conservation"
            }
          ].map((partner, index) => (
            <div key={index} className="flex items-center justify-center p-4">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="max-h-20 max-w-full grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </Section>
      
      {/* CTA Section */}
      <div className="bg-brand-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full filter blur-[100px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full filter blur-[100px] opacity-40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience Tanzania with Us?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Whether you're seeking adventure, cultural immersion, or a perfectly executed event, we're here to make it happen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/tours" 
                className="bg-accent-500 hover:bg-accent-600 text-white py-3 px-8 rounded-full inline-flex items-center justify-center transition-colors font-medium shadow-lg"
              >
                Explore Our Tours
              </a>
              <a 
                href="/contact" 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 px-8 rounded-full inline-flex items-center justify-center transition-colors font-medium border border-white/30"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;