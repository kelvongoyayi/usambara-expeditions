import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Clock, Facebook, Instagram, 
  Twitter, Youtube, Send, MessageSquare, AlertCircle
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Section from '../components/ui/Section';
import { InputField, TextareaField, Button, Alert } from '../components/ui';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        type: 'error',
        message: 'Please fill in all required fields.'
      });
      return;
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormStatus({
        type: 'error',
        message: 'Please enter a valid email address.'
      });
      return;
    }
    
    // Simulate form submission
    setFormStatus({
      type: 'success',
      message: 'Thank you for your message. We will get back to you soon!'
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-20 bg-brand-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full filter blur-[100px] opacity-60 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full filter blur-[100px] opacity-60 transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white font-display">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions about our tours or events? We're here to help you plan your perfect adventure in Tanzania.
            </p>
          </div>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
              <p className="text-dark-600 mb-6">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
              
              {formStatus.type && (
                <Alert 
                  variant={formStatus.type}
                  title={formStatus.type === 'success' ? 'Message Sent!' : 'Error'}
                  className="mb-6"
                >
                  {formStatus.message}
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                  />
                  
                  <InputField
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone number (optional)"
                  />
                </div>
                
                <InputField
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What is your message about?"
                  required
                />
                
                <TextareaField
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your message here..."
                  rows={5}
                  required
                />
                
                <Button
                  type="submit"
                  variant="accent"
                  fullWidth
                  className="mt-8"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Office Location */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6">Visit Our Office</h2>
              
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-6">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126764.15035845928!2d38.97814535!3d-5.0699465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x183fc5831e7fb19f%3A0x32372940951c4048!2sTanga%2C%20Tanzania!5e0!3m2!1sen!2sus!4v1647872000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                ></iframe>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-brand-50 p-3 rounded-full mr-4">
                    <MapPin className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Address</h3>
                    <p className="text-dark-600">
                      Usambara Expeditions<br />
                      Tanga, Tanzania
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brand-50 p-3 rounded-full mr-4">
                    <Clock className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Office Hours</h3>
                    <p className="text-dark-600">
                      Monday - Friday<br />
                      9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Methods */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6">Contact Methods</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-brand-50 p-3 rounded-full mr-4">
                    <Phone className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <p className="text-dark-600">
                      +255 123 456 789<br />
                      +255 987 654 321
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-brand-50 p-3 rounded-full mr-4">
                    <Mail className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-dark-600">
                      info@usambaraexpeditions.com<br />
                      bookings@usambaraexpeditions.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6">Follow Us</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <a 
                  href="#" 
                  className="flex items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-colors group"
                >
                  <Facebook className="w-6 h-6 text-gray-500 group-hover:text-brand-600" />
                </a>
                
                <a 
                  href="#" 
                  className="flex items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-colors group"
                >
                  <Instagram className="w-6 h-6 text-gray-500 group-hover:text-brand-600" />
                </a>
                
                <a 
                  href="#" 
                  className="flex items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-colors group"
                >
                  <Twitter className="w-6 h-6 text-gray-500 group-hover:text-brand-600" />
                </a>
                
                <a 
                  href="#" 
                  className="flex items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-brand-500 hover:bg-brand-50 transition-colors group"
                >
                  <Youtube className="w-6 h-6 text-gray-500 group-hover:text-brand-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQs */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-dark-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our tours, events, and services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How do I book a tour?",
                answer: "You can book a tour through our website by selecting your desired tour and clicking the 'Book Now' button. Follow the simple booking process, and we'll confirm your reservation within 24 hours."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept major credit cards, PayPal, and mobile money payments. A 20% deposit is required to secure your booking, with the remaining balance due 30 days before the tour date."
              },
              {
                question: "What is your cancellation policy?",
                answer: "We offer free cancellation up to 14 days before the tour date. Cancellations made within 14 days of the tour date are subject to a fee. Please refer to our Terms & Conditions for detailed information."
              },
              {
                question: "Do you offer custom tours?",
                answer: "Yes, we specialize in creating custom tours tailored to your preferences and requirements. Contact our team to discuss your ideal itinerary, and we'll help plan your perfect adventure."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start mb-4">
                  <div className="bg-brand-50 p-2 rounded-full mr-4">
                    <MessageSquare className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-bold text-lg">{faq.question}</h3>
                </div>
                <p className="text-dark-600 ml-12">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          {/* Need More Help */}
          <div className="mt-12 bg-brand-50 rounded-xl p-8 text-center">
            <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Need More Help?</h3>
            <p className="text-dark-600 mb-6 max-w-xl mx-auto">
              Can't find the answer you're looking for? Our team is here to help you with any questions or concerns.
            </p>
            <Button 
              variant="primary"
              rightIcon={<Send className="w-4 h-4" />}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Contact;