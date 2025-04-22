import React from 'react';
import { Tour } from '@/types/tour';
import { FormErrors } from '@/types';
import { Card } from '@/components/ui/card';

interface PricingStepProps {
  tour: Partial<Tour>;
  setTour: React.Dispatch<React.SetStateAction<Partial<Tour>>>;
  errors: FormErrors;
  isLoading: boolean;
}

const PricingStep: React.FC<PricingStepProps> = ({ tour, setTour, errors, isLoading }) => {
  return (
    <Card className="p-6">
      <div className="text-center p-12">
        <h3 className="text-xl font-semibold mb-2">Tour Pricing</h3>
        <p className="text-gray-500 mb-6">
          This feature is coming soon. You will be able to set up pricing tiers, discounts, and special offers for your tours.
        </p>
        <div className="p-8 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50">
          <p className="text-gray-400">Pricing management functionality will be implemented soon</p>
        </div>
      </div>
    </Card>
  );
};

export default PricingStep; 