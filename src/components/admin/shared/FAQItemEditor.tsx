import React from 'react';
import { X, Plus } from 'lucide-react';
import DetailsPanelLayout from './DetailsPanelLayout';

export interface FAQ {
  question: string;
  answer: string;
}

interface FAQItemEditorProps {
  faqs: FAQ[];
  onAddFaq: () => void;
  onRemoveFaq: (index: number) => void;
  onChangeFaq: (index: number, field: keyof FAQ, value: string) => void;
}

const FAQItemEditor: React.FC<FAQItemEditorProps> = ({
  faqs,
  onAddFaq,
  onRemoveFaq,
  onChangeFaq
}) => {
  return (
    <DetailsPanelLayout 
      title="Frequently Asked Questions"
      description="Add common questions and answers about your tour or event"
    >
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">FAQ #{index + 1}</h3>
              <button
                type="button"
                onClick={() => onRemoveFaq(index)}
                className="p-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-500"
                disabled={faqs.length <= 1}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => onChangeFaq(index, 'question', e.target.value)}
                  placeholder="e.g. What should I pack for this tour?"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer
                </label>
                <textarea
                  rows={3}
                  value={faq.answer}
                  onChange={(e) => onChangeFaq(index, 'answer', e.target.value)}
                  placeholder="Provide a helpful answer"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        ))}
        
        {faqs.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-2">No FAQs added yet</p>
            <button
              type="button"
              onClick={onAddFaq}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add First FAQ
            </button>
          </div>
        )}
        
        {faqs.length > 0 && (
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={onAddFaq}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Another FAQ
            </button>
          </div>
        )}
      </div>
    </DetailsPanelLayout>
  );
};

export default FAQItemEditor;