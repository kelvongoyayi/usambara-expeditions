import React, { useState } from 'react';
import { Event } from '../../../../services/events.service';
import { FAQ } from '../../../../types/tours';
import {
  FormLabel,
  Input,
  Textarea,
  Button,
  Card,
  CardBody,
  FormGroup
} from '../../../../components/ui';
import { Plus, ChevronDown, ChevronUp, Trash2, HelpCircle } from 'lucide-react';

interface FAQsStepProps {
  formData: Partial<Event>;
  setFieldValue: (name: string, value: unknown) => void;
}

const FAQsStep: React.FC<FAQsStepProps> = ({ formData, setFieldValue }) => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Initialize faqs if it doesn't exist
  const faqs = formData.faqs || [];

  const handleAddFAQ = () => {
    if (currentQuestion.trim() && currentAnswer.trim()) {
      const newFaq: FAQ = {
        question: currentQuestion.trim(),
        answer: currentAnswer.trim()
      };
      
      const updatedFaqs = [...faqs, newFaq];
      setFieldValue('faqs', updatedFaqs);
      
      // Clear form
      setCurrentQuestion('');
      setCurrentAnswer('');
    }
  };

  const handleRemoveFAQ = (index: number) => {
    const updatedFaqs = [...faqs];
    updatedFaqs.splice(index, 1);
    setFieldValue('faqs', updatedFaqs);
    
    // Reset expanded state if needed
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleUpdateFAQ = (index: number, field: keyof FAQ, value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      [field]: value
    };
    setFieldValue('faqs', updatedFaqs);
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">Frequently Asked Questions</h2>
      <p className="text-gray-600 mb-6">
        Add common questions and answers about your event to help potential attendees find information quickly.
      </p>
      
      {/* Add New FAQ */}
      <Card className="border-accent-200">
        <CardBody className="p-5">
          <h3 className="font-semibold text-accent-700 mb-4">Add New FAQ</h3>
          
          <FormGroup className="mb-4">
            <FormLabel htmlFor="faq-question">Question</FormLabel>
            <Input
              id="faq-question"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="E.g., What should I bring to the event?"
            />
          </FormGroup>
          
          <FormGroup className="mb-4">
            <FormLabel htmlFor="faq-answer">Answer</FormLabel>
            <Textarea
              id="faq-answer"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Provide a clear, concise answer to the question"
              rows={3}
            />
          </FormGroup>
          
          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              disabled={!currentQuestion.trim() || !currentAnswer.trim()}
              onClick={handleAddFAQ}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add FAQ
            </Button>
          </div>
        </CardBody>
      </Card>
      
      {/* FAQs List */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Event FAQs</h3>
          <span className="text-sm text-gray-500">{faqs.length} question{faqs.length !== 1 ? 's' : ''}</span>
        </div>
        
        {faqs.length > 0 ? (
          <div className="space-y-3 bg-white rounded-lg border border-gray-200 p-1">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div 
                  className={`
                    flex justify-between items-center p-4 cursor-pointer
                    ${expandedIndex === index ? 'bg-gray-50' : 'bg-white'}
                  `}
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{faq.question}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFAQ(index);
                      }}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    {expandedIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {expandedIndex === index && (
                  <div className="p-4 pt-0 border-t border-gray-200">
                    <FormGroup className="mb-3">
                      <FormLabel htmlFor={`faq-${index}-question`} className="text-sm">
                        Question
                      </FormLabel>
                      <Input
                        id={`faq-${index}-question`}
                        value={faq.question}
                        onChange={(e) => handleUpdateFAQ(index, 'question', e.target.value)}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel htmlFor={`faq-${index}-answer`} className="text-sm">
                        Answer
                      </FormLabel>
                      <Textarea
                        id={`faq-${index}-answer`}
                        value={faq.answer}
                        onChange={(e) => handleUpdateFAQ(index, 'answer', e.target.value)}
                        rows={3}
                      />
                    </FormGroup>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <HelpCircle className="h-10 w-10 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 mb-1">No FAQs added yet</p>
            <p className="text-sm text-gray-400">
              Add questions and answers that will help attendees prepare for your event
            </p>
          </div>
        )}
      </div>
      
      {/* Tips Card */}
      <Card className="mt-6 bg-blue-50 border-blue-100">
        <CardBody>
          <h3 className="font-semibold text-blue-800 mb-2">FAQ Best Practices</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Focus on questions attendees commonly ask about your events</li>
            <li>Keep answers clear, concise, and informative</li>
            <li>Include information about logistics, requirements, and policies</li>
            <li>Address questions about refunds, cancellations, and rescheduling</li>
            <li>Update FAQs regularly based on new inquiries from attendees</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default FAQsStep; 