import React from 'react';
import { Plus, Minus, HelpCircle, AlertCircle, Info } from 'lucide-react';
import DetailsPanelLayout from '../../shared/DetailsPanelLayout';

// Define the FAQ type inline
interface FAQ {
  question: string;
  answer: string;
}

// Define Tour type inline to avoid circular imports
interface Tour {
  id?: string;
  title: string;
  description: string;
  faqs?: FAQ[];
  [key: string]: any;
}

interface FAQsStepProps {
  tour: Partial<Tour>;
  setTour: React.Dispatch<React.SetStateAction<Partial<Tour>>>;
  errors: Record<string, string>;
  isLoading: boolean;
}

const FAQsStep: React.FC<FAQsStepProps> = ({ tour, setTour, errors, isLoading }) => {
  // Initialize faqs array if it doesn't exist
  React.useEffect(() => {
    if (!Array.isArray(tour.faqs)) {
      setTour(prev => ({ ...prev, faqs: [] }));
    }
  }, []);

  // Helper function to add a new FAQ
  const addFAQ = () => {
    setTour(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: '', answer: '' }]
    }));
  };

  // Helper function to remove a FAQ
  const removeFAQ = (index: number) => {
    setTour(prev => {
      const faqs = [...(prev.faqs || [])];
      faqs.splice(index, 1);
      return { ...prev, faqs };
    });
  };

  // Helper function to update a FAQ
  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    setTour(prev => {
      const faqs = [...(prev.faqs || [])];
      faqs[index] = { ...faqs[index], [field]: value };
      return { ...prev, faqs };
    });
  };

  // Common FAQ questions for different tour types
  const commonFAQs = {
    hiking: [
      { question: "What is the difficulty level of this hike?", answer: "Details about the difficulty level..." },
      { question: "What should I bring for the hike?", answer: "A detailed packing list..." },
      { question: "Is this hike suitable for beginners?", answer: "Information about skill level requirements..." }
    ],
    cultural: [
      { question: "What cultural sites will we visit?", answer: "List of cultural attractions..." },
      { question: "Are there any cultural customs I should be aware of?", answer: "Important cultural considerations..." },
      { question: "Is there free time for personal exploration?", answer: "Schedule flexibility information..." }
    ],
    general: [
      { question: "What is your cancellation policy?", answer: "Our cancellation policy allows for full refunds up to 7 days before the tour date. Cancellations within 3-7 days receive a 50% refund. Cancellations less than 3 days before the tour are non-refundable." },
      { question: "Do you offer pickup services?", answer: "Yes, we offer pickup services from major hotels and designated meeting points in [Location]. Please let us know your accommodation details when booking." },
      { question: "Is travel insurance required?", answer: "While not mandatory, we strongly recommend purchasing travel insurance that covers adventure activities for your protection." }
    ]
  };

  // Helper function to add predefined FAQs based on category
  const addPredefinedFAQs = (type: 'hiking' | 'cultural' | 'general') => {
    const faqsToAdd = commonFAQs[type].filter(newFaq => 
      !(tour.faqs || []).some(existingFaq => 
        existingFaq.question.toLowerCase() === newFaq.question.toLowerCase()
      )
    );

    if (faqsToAdd.length > 0) {
      setTour(prev => ({
        ...prev,
        faqs: [...(prev.faqs || []), ...faqsToAdd]
      }));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start text-sm text-blue-800">
        <Info className="w-5 h-5 text-blue-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium mb-1">Why FAQs Matter</h4>
          <p className="text-blue-700">
            Frequently Asked Questions help potential customers make informed decisions about your tour.
            Good FAQs can reduce customer service inquiries and increase bookings.
          </p>
        </div>
      </div>

      <DetailsPanelLayout title="Frequently Asked Questions">
        <p className="text-gray-600 text-sm mb-4">
          Add common questions and answers that travelers might have about your tour.
        </p>

        {/* Quick Add Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => addPredefinedFAQs('general')}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            General FAQs
          </button>
          
          <button
            type="button"
            onClick={() => addPredefinedFAQs('hiking')}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Hiking FAQs
          </button>
          
          <button
            type="button"
            onClick={() => addPredefinedFAQs('cultural')}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Cultural FAQs
          </button>
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {(tour.faqs || []).map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="mb-4 flex justify-between">
                <div className="flex items-center">
                  <HelpCircle className="w-5 h-5 text-brand-600 mr-2" />
                  <h3 className="font-medium text-gray-700">FAQ #{index + 1}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => removeFAQ(index)}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="e.g. What should I bring for this tour?"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer
                  </label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="Provide a clear, helpful answer..."
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add FAQ Button */}
          <button
            type="button"
            onClick={addFAQ}
            disabled={isLoading}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-brand-600 hover:border-brand-500 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New FAQ
          </button>
        </div>

        {/* Empty State */}
        {(!tour.faqs || tour.faqs.length === 0) && (
          <div className="text-center py-6 text-gray-500">
            <HelpCircle className="w-10 h-10 mx-auto mb-3 text-gray-400" />
            <p className="mb-2">No FAQs added yet</p>
            <p className="text-sm">Add frequently asked questions to help travelers understand your tour better.</p>
          </div>
        )}

        {/* Warning if FAQs have no questions/answers */}
        {(tour.faqs || []).some(faq => !faq.question.trim() || !faq.answer.trim()) && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center text-amber-800 text-sm">
            <AlertCircle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
            <p>Some FAQs have empty questions or answers. Please complete them before submitting.</p>
          </div>
        )}
      </DetailsPanelLayout>
    </div>
  );
};

export default FAQsStep; 