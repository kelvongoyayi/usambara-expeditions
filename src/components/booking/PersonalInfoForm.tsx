import React from 'react';
import { 
  Mail, Phone, User, AlertCircle, UserCircle, Lock, FileText
} from 'lucide-react';
import { 
  InputField, 
  TextareaField,
  CheckboxField,
  Alert
} from '../ui';

interface PersonalInfoFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests: string;
    agreeToTerms: boolean;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  bookingError: string | null;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  onInputChange,
  bookingError
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-dark-800 mb-2">Personal Information</h2>
      <p className="text-dark-600 mb-6">Please provide your contact details for the booking</p>
      
      {bookingError && (
        <Alert 
          variant="error" 
          title="Booking Error"
          className="mb-6"
          icon={<AlertCircle className="w-5 h-5" />}
        >
          {bookingError}
        </Alert>
      )}
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-dark-800 mb-4 flex items-center">
          <UserCircle className="w-5 h-5 mr-2 text-brand-600" />
          Contact Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            required
            icon={<User className="w-5 h-5" />}
            className="bg-gray-50 border-gray-200 focus-within:bg-white"
            placeholder="Enter your first name"
          />
          
          <InputField
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            required
            icon={<User className="w-5 h-5" />}
            className="bg-gray-50 border-gray-200 focus-within:bg-white"
            placeholder="Enter your last name"
          />
          
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            required
            icon={<Mail className="w-5 h-5" />}
            className="bg-gray-50 border-gray-200 focus-within:bg-white"
            placeholder="your.email@example.com"
            helperText="Booking confirmation will be sent to this email"
          />
          
          <InputField
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            icon={<Phone className="w-5 h-5" />}
            className="bg-gray-50 border-gray-200 focus-within:bg-white"
            placeholder="+1 (___) ___-____"
            helperText="For urgent communications only"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-dark-800 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-brand-600" />
          Additional Information
        </h3>
        
        <div>
          <TextareaField
            label="Special Requests or Requirements"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={onInputChange}
            rows={4}
            placeholder="Let us know if you have any special requirements, dietary restrictions, or specific requests..."
            className="bg-gray-50 border-gray-200 focus-within:bg-white"
          />
          <p className="text-xs text-dark-500 mt-2">
            We'll do our best to accommodate your requests, though some may be subject to availability.
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <div className="flex items-start mb-4">
          <Lock className="w-5 h-5 text-accent-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-base font-bold text-dark-800 mb-1">Privacy and Terms</h3>
            <p className="text-sm text-dark-600">
              Your privacy is important to us. Please review our terms before proceeding.
            </p>
          </div>
        </div>
        
        <div className="pl-8">
          <CheckboxField
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={onInputChange}
            label={
              <span className="text-dark-700">
                I agree to the <a href="#" className="text-brand-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>. I understand that my personal information will be processed as described in the Privacy Policy.
              </span>
            }
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;